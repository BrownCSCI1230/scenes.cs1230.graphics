import { Euler, Matrix4, Vector3 } from "three";

export const eulerToLookUp = (euler: Euler): [number[], number[]] => {
  const matrix = new Matrix4();
  matrix.makeRotationFromEuler(euler);

  const lookVector = new Vector3(0, 0, -1); // Default look direction
  const upVector = new Vector3(0, 1, 0); // Default up direction

  lookVector.applyMatrix4(matrix);
  upVector.applyMatrix4(matrix);

  return [
    [lookVector.x, lookVector.y, lookVector.z],
    [upVector.x, upVector.y, upVector.z],
  ];
};

export const lookUpToEuler = (look: number[], up: number[]): Euler => {
  const matrix = new Matrix4();
  matrix.lookAt(new Vector3(0, 0, 0), new Vector3(...look), new Vector3(...up));

  const euler = new Euler();
  euler.setFromRotationMatrix(matrix);

  return euler;
};

export const focusToLook = (focus: number[], position: number[]): number[] => {
  return [
    focus[0] - position[0],
    focus[1] - position[1],
    focus[2] - position[2],
  ];
};
