import { Mat44 } from '@thi.ng/vectors/mat44';
import { DEG2RAD } from '@thi.ng/math/api';
import { FX_STATE } from "@thi.ng/interceptors/api";
import { valueSetter } from "@thi.ng/interceptors/interceptors";
import { setIn } from '@thi.ng/paths';

import { Handlers } from './api';

export enum ev {
  SET_RAF,
  SET_PARAM,
  SET_ORIENTATION,
};

export enum fx {
};

function mat44FromEulerYXZ(mat: Mat44, alpha: number, beta: number, gamma: number) {
  let x = alpha * DEG2RAD, y = beta * DEG2RAD, z = gamma * DEG2RAD;
  let a = Math.cos(x), b = Math.sin(x);
  let c = Math.cos(y), d = Math.sin(y);
  let e = Math.cos(z), f = Math.sin(z);
  let ce = c * e, cf = c * f, de = d * e, df = d * f;

  mat[0] = ce + df * b;
  mat[4] = de * b - cf;
  mat[8] = a * d;

  mat[1] = a * f;
  mat[5] = a * e;
  mat[9] = - b;

  mat[2] = cf * b - de;
  mat[6] = df + ce * b;
  mat[10] = a * c;

  return mat;
}

export const handlers: Handlers = {
  events: {
    [ev.SET_RAF]: valueSetter('raf'),
    // [ev.SET_ORIENTATION]: valueSetter('orientation'),
    [ev.SET_ORIENTATION]: (state, [_, [alpha, beta, gamma]]) => ({
      [FX_STATE]: setIn(
        setIn(state, 'orientation', [alpha, beta, gamma]),
        ['params', 'rotate'],
        mat44FromEulerYXZ(Mat44.identity(), beta, alpha, -gamma).mul(Mat44.rotationX(-90 * DEG2RAD))
      )
    }),
    [ev.SET_PARAM]: (state, [_, [name, v]]) => ({
      [FX_STATE]: setIn(state, ['params', name], v)
    })
  },

  effects: {
  }
};