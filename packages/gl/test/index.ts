import * as assert from "assert";
import { partition } from '@thi.ng/transducers/xform/partition';

import { Cube } from '@pngu/gl/geometry';

describe("foo", () => {
  assert.equal(1, 1);

  const cube = new Cube(2);
  console.log([...partition(3, cube.attributes.position)]);
});