import { Bodies, Body, Vector } from "matter-js";
import { PawnMoveDirection } from "../payloads";

export interface PlayerPawn {
  clientId: string;
  body: Body;
  kicking: boolean;
  team: number;
}

export const createPawnBody = (x: number, y: number, radius: number): Body =>
  Bodies.circle(x, y, radius, {
    density: 1.0,
    friction: 0.1,
    frictionAir: 0,
    restitution: 0.2,
    render: {
      fillStyle: "#0000ff",
      strokeStyle: "black",
      lineWidth: 1.0,
    },
  });

const pawnMoveForceFactor = 0.01;
const pawnMoveForceUp: Vector = {
  x: 0,
  y: pawnMoveForceFactor,
};
const pawnMoveForceDown: Vector = {
  x: 0,
  y: -pawnMoveForceFactor,
};
const pawnMoveForceLeft: Vector = {
  x: -pawnMoveForceFactor,
  y: 0,
};
const pawnMoveForceRight: Vector = {
  x: pawnMoveForceFactor,
  y: 0,
};

export const pawnMovementForce = (direction: PawnMoveDirection): Vector => {
  switch (direction) {
    case PawnMoveDirection.Up: return pawnMoveForceUp;
    case PawnMoveDirection.Down: return pawnMoveForceDown;
    case PawnMoveDirection.Left: return pawnMoveForceLeft;
    case PawnMoveDirection.Right: return pawnMoveForceRight;
  }
};

export interface Ball {
  body: Body;
}

export const createBallBody = (x: number, y: number, radius: number): Body =>
  Bodies.circle(x, y, radius, {
    density: 0.5,
    friction: 0.1,
    frictionAir: 0,
    restitution: 0.8,
    render: {
      fillStyle: "#ff0000",
      strokeStyle: "black",
      lineWidth: 1.0,
    },
  });
