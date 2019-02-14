import { IObjectOf } from '@thi.ng/api';
import { AttribPool } from '@thi.ng/vector-pools';
import { pairs, transduce, map, assocObj, flatten } from "@thi.ng/transducers";
import { FullArraySpec } from 'twgl.js';

import { Node } from './node';
import { Material } from './material';

export class Mesh extends Node {
  type: number; // gl.TRIANGLES;
  attribs: IObjectOf<FullArraySpec>

  constructor(readonly attribPool: AttribPool, readonly material: Material, type: number = 4) {
    super();

    this.type = type;
    this.attribs = transduce(
      map(([name, { size }]) => [name, {
        numComponents: size,
        data: [...flatten(attribPool.attribValues(name))]
      }]),
      assocObj(),
      pairs(attribPool.specs)
    );
  }
}