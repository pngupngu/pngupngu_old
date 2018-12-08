import { fromEvent } from '@thi.ng/rstream/from/event';
import { dedupe } from '@thi.ng/transducers/xform/dedupe';
import { eqDelta } from '@thi.ng/math/eqdelta';

export const fromOrientation = (eps = 1e-1) =>
  fromEvent(window, 'deviceorientation').transform(dedupe(
    (p: DeviceOrientationEvent, c: DeviceOrientationEvent) =>
      eqDelta(p.alpha, c.alpha, eps) &&
      eqDelta(p.beta, c.beta, eps) &&
      eqDelta(p.gamma, c.gamma, eps)));