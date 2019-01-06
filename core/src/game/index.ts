import Clock from "@gamestdio/clock";
import { Engine, World, Body } from "matter-js";

import Stadium from "./stadium";
import { PlayerPawnAction } from "../payloads";
import { PlayerPawn, Ball, createBallBody, pawnMovementForce, createPawnBody } from "./entities";

export interface GameOptions {
  /** Goals limit. */
  maxGoals: number;
  /** Time limit, in seconds. */
  maxTime: number;
}

export interface GameState {
  running: boolean;
  elapsed: number;
  options: GameOptions;
  stadium: Stadium;
  pawns: PlayerPawn[];
  ball: Ball;
}

export class GameSimulation {
  protected _state: GameState = {
    running: false,
    elapsed: 0,
    options: {
      maxGoals: 3,
      maxTime: 60 * 5,
    },
    stadium: {
      name: "Test",
      width: 420,
      height: 200,
    },
    pawns: [],
    ball: {
      body: createBallBody(300, 300, 15),
    },
  };
  protected _physicsEngine = Engine.create();
  protected _runningTimeClock = new Clock();

  get physicsEngine(): Engine { return this._physicsEngine; }

  constructor() {
    this._physicsEngine.world.gravity = {
      scale: 0,
      x: 0,
      y: 0,
    };
    World.add(this._physicsEngine.world, this._state.ball.body);
  }

  public start() {
    this._runningTimeClock.start();
    this._state.running = true;
    console.log('GameSimulation started');
  }

  get running(): boolean {
    return this._state.running;
  }
  public pause() {
    this._state.running = false;
  }
  public resume() {
    this._state.running = true;
  }

  public reset() {
    // TODO
  }

  public update() {
    this._runningTimeClock.tick();
    this._state.elapsed = this._runningTimeClock.elapsedTime;
    if (!this._state.running) { return; }
    Engine.update(this._physicsEngine, this._runningTimeClock.deltaTime);
  }

  public handlePlayerAction(input: PlayerPawnAction) {
    if (!this._state.running) { return; }
    const pawn = this._state.pawns.find(p => p.clientId === input.clientId);
    if (!pawn) {
      throw new Error(`GameSimulation.handlePlayerAction: no pawn with client ID "${input.clientId}".`);
    }
    if (input.kicking) {
      pawn.kicking = input.kicking;
    }
    if (input.moving) {
      Body.applyForce(pawn.body, {
        x: pawn.body.position.x,
        y: pawn.body.position.y,
      }, pawnMovementForce(input.moving));
    }
  }

  public addPlayer(clientId: string, team: number) {
    const pawn = this._state.pawns.find(p => p.clientId === clientId);
    if (pawn) {
      throw new Error(`GameSimulation.addPlayer: pawn with client ID "${clientId}" already exists.`);
    }
    const body = createPawnBody(100, 100, 25);
    World.add(this._physicsEngine.world, body);
    this._state.pawns.push({
      clientId,
      kicking: false,
      team,
      body: createPawnBody(100, 100, 25),
    });
  }

  public removePlayer(clientId: string) {
    const pawn = this._state.pawns.find(p => p.clientId === clientId);
    if (!pawn) {
      throw new Error(`GameSimulation.removePlayer: no pawn with client ID "${clientId}".`);
    }
    this._state.pawns = this._state.pawns.filter(p => p.clientId !== clientId);
  }
}
