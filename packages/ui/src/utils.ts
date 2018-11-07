import { gestureStream, GestureType, GestureInfo } from '@thi.ng/rstream-gestures';
import { merge } from '@thi.ng/rstream/stream-merge';
import { fromEvent } from '@thi.ng/rstream/from/event';
import { filter } from '@thi.ng/transducers/xform/filter';
import { map } from '@thi.ng/transducers/xform/map';
import { dedupe } from '@thi.ng/transducers/xform/dedupe';
import { EPS } from '@thi.ng/math/api';
import { eqDelta } from '@thi.ng/math/eqdelta';

import { takeUntil } from '@pngu/core/rstream/take-until';

export const streamDrag = (el: HTMLElement) => {
  const drag = gestureStream(el)
    .transform(
      filter(g => g[0] == GestureType.START),
      map(d => {
        const gesture = gestureStream(document.body);
        const move = gesture.transform(filter(g => g[0] == GestureType.MOVE), 'move');
        const end = gesture.transform(filter(g => g[0] == GestureType.END), 'end');
        return move.subscribe(takeUntil(end))
          .transform(map(m => {
            const pos = d[1].pos;
            const delta = [m[1].pos[0] - pos[0], m[1].pos[1] - pos[1]];
            return <GestureInfo>{ pos, zoom: d[1].zoom, click: pos, delta };
          }));
      }));
  return merge({ src: [drag] });
};

export const streamOrientation = (eps = EPS) =>
  fromEvent(window, 'deviceorientation')
    .transform(dedupe(
      (p: DeviceOrientationEvent, c: DeviceOrientationEvent) =>
        eqDelta(p.alpha, c.alpha, eps) &&
        eqDelta(p.beta, c.beta, eps) &&
        eqDelta(p.gamma, c.gamma, eps)));

export const streamMotion = (epsAccel = EPS, epsRot = EPS) =>
  fromEvent(window, 'devicemotion')
    .transform(dedupe(
      (p: DeviceMotionEvent, c: DeviceMotionEvent) =>
        p.acceleration && p.rotationRate &&
        eqDelta(p.acceleration.x, c.acceleration.x, epsAccel) &&
        eqDelta(p.acceleration.y, c.acceleration.y, epsAccel) &&
        eqDelta(p.acceleration.z, c.acceleration.z, epsAccel) &&
        eqDelta(p.rotationRate.alpha, c.rotationRate.alpha, epsRot) &&
        eqDelta(p.rotationRate.beta, c.rotationRate.beta, epsRot) &&
        eqDelta(p.rotationRate.gamma, c.rotationRate.gamma, epsRot)
        ));