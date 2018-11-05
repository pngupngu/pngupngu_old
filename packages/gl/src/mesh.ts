import { Node } from './node';
import { Geometry } from './geometry';
import { Material } from './material';

export class Mesh extends Node {
  constructor(readonly geometry: Geometry, readonly material: Material) {
    super();
  }
}