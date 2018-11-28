import * as twgl from 'twgl.js';
import { IObjectOf } from "@thi.ng/api/api";
import { Vec3 } from '@thi.ng/vectors/vec3';
import {
  Attribs,
  IToPolygon,
  IVertices,
  SamplingOpts,
  ITessellateable,
  Tessellator
} from '@thi.ng/geom/api';
import { tessellate } from "@thi.ng/geom/tessellate";
import { PointContainer3 } from '@thi.ng/geom/container3';
import { IVector } from '@thi.ng/vectors/api';
import { mapcat } from '@thi.ng/transducers/xform/mapcat';

type GeomAttribs = IObjectOf<any>;

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

export const tessellate3 = <T extends IVector<T>>(pts: ReadonlyArray<T>): T[][] => {
  if (pts.length == 3) {
    return [[pts[0], pts[1], pts[2]]];
  } else if (pts.length == 4) {
    return [[pts[0], pts[1], pts[2]], [pts[0], pts[2], pts[3]]];
  }
}

export class Polygon3 extends PointContainer3 implements
  ITessellateable<Vec3> {

  faces: Vec3[][];

  constructor(pts: Vec3[], faces: Vec3[][], attribs?: Attribs) {
    super(pts, attribs);
    this.faces = faces;
  }

  tessellate(tessel: Tessellator<Vec3>, iter?: number): Vec3[][];
  tessellate(tessel: Iterable<Tessellator<Vec3>>): Vec3[][];
  tessellate(...args: any[]) {
    return [...mapcat(pts => tessellate.apply(null, [pts, ...args]), this.faces)];
  }
}

export class AABB implements
  IToPolygon<number | Partial<SamplingOpts>>,
  IVertices<Vec3, number | Partial<SamplingOpts>> {

  position: Vec3;
  size: Vec3;

  constructor(position: Vec3 = Vec3.ZERO.copy(), size: Vec3 = Vec3.ONE.copy()) {
    this.position = position;
    this.size = size;
  }

  vertices(_?: number | Partial<SamplingOpts>) {
    const a = this.position;
    const g = a.addNew(this.size);
    const b = new Vec3([a.x, a.y, g.z]);
    const c = new Vec3([g.x, a.y, g.z]);
    const d = new Vec3([g.x, a.y, a.z]);
    const e = new Vec3([a.x, g.y, a.z]);
    const f = new Vec3([a.x, g.y, g.z]);
    const h = new Vec3([g.x, g.y, a.z]);
    return [a, b, c, d, e, f, g, h];
  }

  toPolygon(opts?: number | Partial<SamplingOpts>) {
    const pts = this.vertices(opts);
    const faces = [
      [pts[2], pts[3], pts[7], pts[6]], // right
      [pts[0], pts[1], pts[5], pts[4]], // left
      [pts[4], pts[5], pts[6], pts[7]], // top
      [pts[0], pts[3], pts[2], pts[1]], // bottom
      [pts[1], pts[2], pts[6], pts[5]], // back
      [pts[0], pts[4], pts[7], pts[3]] // front
    ];
    return new Polygon3(pts, faces);
  }
}