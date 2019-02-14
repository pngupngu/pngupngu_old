import { add, Vec, copyVectors } from '@thi.ng/vectors';
import { mapcat } from '@thi.ng/transducers';
import { APC, vertices, AABB, tessellate } from '@thi.ng/geom';
import { tessellate as _tessellate } from "@thi.ng/geom-tessellate";
import { Type, SamplingOpts, IShape, Attribs, IHiccupShape } from '@thi.ng/geom-api';
import { defmulti, MultiFn1O } from "@thi.ng/defmulti";

export const tessellate3 = (pts: Vec[]): Vec[][] => {
  if (pts.length == 3) {
    return [[pts[0], pts[1], pts[2]]];
  } else if (pts.length == 4) {
    return [[pts[0], pts[1], pts[2]], [pts[0], pts[2], pts[3]]];
  }
}

export class Polygon3 extends APC implements IHiccupShape {

  faces: Vec[][];

  constructor(points: Vec[], faces: Vec[][], attribs?: Attribs) {
    super(points, attribs);
    this.faces = faces;
  }

  get type() {
    return Type.POLYGON3;
  }

  copy() {
    // TODO: copy faces
    return new Polygon3(copyVectors(this.points), this.faces, { ...this.attribs });
  }

  toHiccup() {
    return ["polygon3", this.attribs, this.points];
  }
}

export class Quad3 extends APC implements
  IHiccupShape {

  get type() {
    return Type.QUAD3;
  }

  copy() {
    return new Quad3(copyVectors(this.points), { ...this.attribs });
  }

  toHiccup() {
    return ["polygon", this.attribs, this.points];
  }
}

export const faces: MultiFn1O<IShape, number | Partial<SamplingOpts>, Vec[][]> = defmulti((x: IShape) => x.type);

faces.addAll(
  {
    [Type.AABB]: ($: AABB, opts?: Partial<SamplingOpts>) => {
      const pts = vertices($, opts);
      const faces = [
        [pts[2], pts[3], pts[7], pts[6]], // right
        [pts[0], pts[1], pts[5], pts[4]], // left
        [pts[4], pts[5], pts[6], pts[7]], // top
        [pts[0], pts[3], pts[2], pts[1]], // bottom
        [pts[1], pts[2], pts[6], pts[5]], // back
        [pts[0], pts[4], pts[7], pts[3]] // front
      ];
      return faces;
    },
    [Type.QUAD3]: ($: Quad3, _?: Partial<SamplingOpts>) => [$.points]
  });

vertices.addAll(
  {
    [Type.AABB]: ($: AABB, _: Partial<SamplingOpts>) => {
      const a = $.pos;
      const g = add([], a, $.size);
      const b = [a[0], a[1], g[2]];
      const c = [g[0], a[1], g[2]];
      const d = [g[0], a[1], a[2]];
      const e = [a[0], g[1], a[2]];
      const f = [a[0], g[1], g[2]];
      const h = [g[0], g[1], a[2]];
      return [a, b, c, d, e, f, g, h];
    },
    [Type.QUAD3]: ($: Quad3, _: Partial<SamplingOpts>) => $.points
  });

export const asPolygon3: MultiFn1O<IShape, number | Partial<SamplingOpts>, Polygon3> = defmulti((x: IShape) => x.type);

asPolygon3.add(Type.POINTS3, ($, opts) => new Polygon3(vertices($, opts), faces($, opts), { ...$.attribs }));
asPolygon3.isa(Type.AABB, Type.POINTS3);
asPolygon3.isa(Type.QUAD3, Type.POINTS3);

tessellate.add(Type.POLYGON3, ($: Polygon3, fns) => [...mapcat(face => _tessellate(face, fns), $.faces)]);