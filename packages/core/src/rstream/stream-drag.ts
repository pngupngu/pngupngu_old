import { gestureStream, GestureType, GestureInfo } from '@thi.ng/rstream-gestures';
import { merge } from '@thi.ng/rstream/stream-merge';
import { filter } from '@thi.ng/transducers/xform/filter';
import { map } from '@thi.ng/transducers/xform/map';

import { takeUntil } from './take-until';

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