import { primitives } from 'twgl.js';

export class Geometry {
  attributes: any;
}

export class Cube extends Geometry {
  constructor(size) {
    super();
    this.attributes = primitives.createCubeVertices(size);
  }
}

export class Plane extends Geometry {
  constructor(width, depth, subdivWidth = 1, subdivDepth = 1) {
    super();
    this.attributes = primitives.createPlaneVertices(width, depth, subdivWidth, subdivDepth);
  }
}