import { Node } from './node';
import { Geometry } from './geometry';
import { Material } from './material';

export class Mesh extends Node {
  type: number; // gl.TRIANGLES;

  constructor(readonly geometry: Geometry, readonly material: Material, type: number = 4) {
    super();
    this.type = type;
  }
}