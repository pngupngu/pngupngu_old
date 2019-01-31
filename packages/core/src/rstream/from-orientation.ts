import { fromEvent } from '@thi.ng/rstream';
import { dedupe } from '@thi.ng/transducers';
import { eqDelta } from '@thi.ng/math';

export const fromOrientation = (eps = 1e-1) =>
  fromEvent(window, 'deviceorientation').transform(dedupe(
    (p: DeviceOrientationEvent, c: DeviceOrientationEvent) =>
      eqDelta(p.alpha, c.alpha, eps) &&
      eqDelta(p.beta, c.beta, eps) &&
      eqDelta(p.gamma, c.gamma, eps)));