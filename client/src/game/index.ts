import "phaser";

import { GameSimulation } from "../../../core/src/game";
import { PawnMoveDirection } from "../../../core/src/payloads";

export * from "./client";

export default class Game extends Phaser.Game {
  public static readonly WIDTH = 800;
  public static readonly HEIGHT = 600;

  public gameScene: GameScene;

  constructor(canvas: HTMLCanvasElement, clientId: string) {
    const scene = new GameScene(clientId);
    super({
      width: Game.WIDTH,
      height: Game.HEIGHT,
      canvas,
      type: Phaser.AUTO,
      input: {
        keyboard: true,
        mouse: false,
        touch: false,
        gamepad: false,
      },
      scene,
      backgroundColor: "#718c5a",
    });
    this.gameScene = scene;
  }

  get simulation(): GameSimulation {
    return this.gameScene.simulation;
  }
}

class GameScene extends Phaser.Scene {
  public static readonly KEY = "GameScene";
  public simulation: GameSimulation;
  protected _cursors!: Phaser.Input.Keyboard.CursorKeys;

  constructor(public clientId: string) {
    super({
      key: GameScene.KEY,
      active: true,
    });
    this.simulation = new GameSimulation();
  }

  public create() {
    this._cursors = this.input.keyboard.createCursorKeys();
  }

  public update(time: number, delta: number) {
    this.handleInput();
    this.simulation.update();
  }

  protected handleInput() {
    if (!this.simulation.running) { return; }
    if (this._cursors.left && this._cursors.left.isDown) {
      this.simulation.handlePlayerAction({
        clientId: this.clientId,
        moving: PawnMoveDirection.Left,
      });
    } else if (this._cursors.right && this._cursors.right.isDown) {
      this.simulation.handlePlayerAction({
        clientId: this.clientId,
        moving: PawnMoveDirection.Right,
      });
    }
    if (this._cursors.up && this._cursors.up.isDown) {
      this.simulation.handlePlayerAction({
        clientId: this.clientId,
        moving: PawnMoveDirection.Up,
      });
    } else if (this._cursors.down && this._cursors.down.isDown) {
      this.simulation.handlePlayerAction({
        clientId: this.clientId,
        moving: PawnMoveDirection.Down,
      });
    }
  }
}
