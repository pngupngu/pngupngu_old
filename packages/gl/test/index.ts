import * as assert from "assert";
import { Vec3 } from '@thi.ng/vectors/vec3';
// import { repeat } from '@thi.ng/transducers/iter/repeat';
import { mapcat } from "@thi.ng/transducers/xform/mapcat";
// import { flatten } from "@thi.ng/transducers/xform/flatten";
// import { map } from "@thi.ng/transducers/xform/map";
// import { push } from '@thi.ng/transducers/rfn/push';
// import { comp } from "@thi.ng/transducers/func/comp";
// import { transduce } from '@thi.ng/transducers/transduce';
import { range } from '@thi.ng/transducers/iter/range';

import {
  // AABB,
  Quad3,
  tessellate3
} from '@pngu/gl/geometry';

describe("foo", () => {
  assert.equal(1, 1);

  // const faces = new AABB().toPolygon().tessellate(tessellate3);
  // const points = transduce(
  //   comp(mapcat((f: Vec3[]) => f), map(v => v.subNewN(0.5))),
  //   push(),
  //   faces);
  // const position = Vec3.intoBuffer(new Float32Array(faces.length * 3 * 3), points);

  // const faceNormals = [
  //   [+1, 0, 0],
  //   [-1, 0, 0],
  //   [0, +1, 0],
  //   [0, -1, 0],
  //   [0, 0, +1],
  //   [0, 0, -1],
  // ];

  // const attribs = {
  //   position,
  //   texcoord: [...flatten(repeat([[1, 0], [0, 0], [0, 1], [1, 0], [0, 1], [1, 1]], 6))],
  //   normal: [...flatten(mapcat(n => repeat(n, 6), faceNormals))]
  // };
  // console.log(attribs.position);
});

describe('bar', () => {
  const pts = [
    new Vec3([-0.5, -0.5, 0]),
    new Vec3([-0.5, 0.5, 0]),
    new Vec3([0.5, 0.5, 0]),
    new Vec3([0.5, -0.5, 0])
  ];
  const quad = new Quad3(pts);
  const faces = quad.tessellate(tessellate3);
  const points = mapcat((f: Vec3[]) => f, faces);
  const position = Vec3.intoBuffer(new Float32Array(faces.length * 3 * 3), points);
  console.log(position);
  console.log([...range(6)])

  // const vs = [new Vec3([1, 0, 0]), new Vec3([1, 0, 1])];
  // console.log([...map(v => v.subN(0.5), vs)]);
})