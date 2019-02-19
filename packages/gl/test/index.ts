import * as assert from "assert";
import { AABB, tessellate } from '@thi.ng/geom';
import { identity44,
  lookAt,
  perspective
} from '@thi.ng/matrices';

import { tessellate3, asPolygon3, Quad3 } from '@pngu/gl/geometry';

describe('aabb', () => {
  const aabb = new AABB();
  const faces = tessellate(asPolygon3(aabb), [tessellate3]);
  assert.equal(12, faces.length);
});

describe('quad3', () => {
  const quad = new Quad3([
    [-0.5, -0.5, 0],
    [-0.5, 0.5, 0],
    [0.5, 0.5, 0],
    [0.5, -0.5, 0]
  ]);
  const faces = tessellate(asPolygon3(quad), [tessellate3]);
  assert.equal(2, faces.length);
});

describe('matrices', () => {
  const m1 = [];
  const m2 = [];
  identity44(m1);
  identity44(m2)

  lookAt(m1, [0, 0, 3], [0, 0, 0], [0, 1, 0]);
  perspective(m2, 30, 1.2, 0.01, 1000);

  console.log(m1);
  console.log(m2);
})