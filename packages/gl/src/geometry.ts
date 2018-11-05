import * as twgl from 'twgl.js';
import { IObjectOf } from "@thi.ng/api/api";

interface GeomAttrib {
  numComponents: number;
  data: number[]
}
type GeomAttribs = IObjectOf<number[] | GeomAttrib>;

export class Geometry {
  attributes: GeomAttribs;

  constructor(attribs: GeomAttribs) {
    this.attributes = attribs;
  }
}

export class Cube extends Geometry {
  constructor(size) {
    super(twgl.primitives.createCubeVertices(size));
  }
}

export class Plane extends Geometry {
  constructor(width, depth, subdivWidth = 1, subdivDepth = 1, matrix?) {
    super(twgl.primitives.createPlaneVertices(width, depth, subdivWidth, subdivDepth, matrix));
  }
}