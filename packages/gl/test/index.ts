import * as assert from "assert";
import { AABB, tessellate } from '@thi.ng/geom';

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
})