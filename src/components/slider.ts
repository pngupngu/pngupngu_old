import { IObjectOf } from '@thi.ng/api';
import { gestureStream, GestureType, GestureInfo } from '@thi.ng/rstream-gestures';
import { merge } from '@thi.ng/rstream/stream-merge';
import { filter } from '@thi.ng/transducers/xform/filter';
import { map } from '@thi.ng/transducers/xform/map';
import { clamp } from '@thi.ng/math/interval';
import { fit } from '@thi.ng/math/fit';
import { takeUntil } from '../rstream/take-until';

interface SliderArgs {
  min: number;
  max: number;
  step: number;
  onchange?: (e: number) => void;
  attribs: {
    container: IObjectOf<any>;
    handle: IObjectOf<any>;
    value: IObjectOf<any>;
  }
}

const streamDrag = (el: HTMLElement) => {
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

export const slider = () => {
  let sub, left = 0, width = 0;
  return {
    init(el: HTMLElement, _: any, { max, min, step, onchange = _ => { } }: SliderArgs, value: number) {
      const steps = Math.floor((max - min) / step);
      sub = streamDrag(el).subscribe({
        next({ pos, delta }) {
          const b = el.getBoundingClientRect();
          left = b.left;
          width = b.width;
          const pct = clamp(fit(pos[0] + delta[0] - left, 0, width, 0, steps), 0, steps);
          const val = min + Math.floor(pct + 0.5) * step;
          onchange(val);
        }
      });

      const b = el.getBoundingClientRect();
      left = b.left;
      width = b.width;
      onchange(value);
    },
    render(_: any, { max, min, attribs }: SliderArgs, value: number) {
      const w = fit(value, min, max, 0, width);
      return ['div', attribs.container,
        ['div', { style: { width: `${w}px` }, ...attribs.handle },
          ['span', attribs.value, value]]];
    },
    release() {
      sub.done();
    }
  }
};