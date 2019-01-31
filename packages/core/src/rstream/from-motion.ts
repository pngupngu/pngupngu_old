import { fromEvent } from '@thi.ng/rstream';
import { dedupe } from '@thi.ng/transducers';
import { EPS, eqDelta } from '@thi.ng/math';

export const fromMotion = (epsAccel = EPS, epsRot = EPS) =>
  fromEvent(window, 'devicemotion').transform(dedupe(
    (p: DeviceMotionEvent, c: DeviceMotionEvent) =>
      p.acceleration && p.rotationRate &&
      eqDelta(p.acceleration.x, c.acceleration.x, epsAccel) &&
      eqDelta(p.acceleration.y, c.acceleration.y, epsAccel) &&
      eqDelta(p.acceleration.z, c.acceleration.z, epsAccel) &&
      eqDelta(p.rotationRate.alpha, c.rotationRate.alpha, epsRot) &&
      eqDelta(p.rotationRate.beta, c.rotationRate.beta, epsRot) &&
      eqDelta(p.rotationRate.gamma, c.rotationRate.gamma, epsRot)));