import { IObjectOf } from '@thi.ng/api';
import { FullArraySpec } from 'twgl.js';

import { Node } from './node';
import { Material } from './material';

export class Mesh extends Node {
  type: number; // gl.TRIANGLES;

  constructor(readonly attribs: IObjectOf<FullArraySpec>, readonly material: Material, type: number = 4) {
    super();
    this.type = type;
  }
}