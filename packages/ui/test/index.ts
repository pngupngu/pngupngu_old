import * as assert from "assert";
import { mapcat } from '@thi.ng/transducers/xform/mapcat';

import { foo } from '@pngu/ui';

describe("foo", () => {
  assert.equal(foo(), 'bar');

  console.log([...mapcat(
    ([a, ...b]) =>
      [
        ['div', a],
        ['div', ...b]
      ],
    [['a', 'a1', 'a2'], ['b', 'b1', 'b2']])]);
});