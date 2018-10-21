import { gestureStream, GestureType, GestureInfo } from '@thi.ng/rstream-gestures';
import { merge } from '@thi.ng/rstream/stream-merge';
import { filter } from '@thi.ng/transducers/xform/filter';
import { map } from '@thi.ng/transducers/xform/map';
import { button } from '@thi.ng/hdom-components/button';
import { clamp } from '@thi.ng/math/interval';
import { fit } from '@thi.ng/math/fit';

import { AppContext } from '../api';
import { select } from './select';
import { takeUntil } from '../rstream/take-until';
import { ev } from '../events';

const btn = button();

interface SliderArgs {
  min: number;
  max: number;
  step: number;
  onchange?: (e: number) => void;
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

const slider = () => {
  let sub, left = 0, width = 0;
  return {
    init(el: HTMLElement, _: any, { max, min, step, onchange = _ => { } }: SliderArgs) {
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
    },
    render({ ui }: any, { max, min }: SliderArgs, value: number) {
      const w = fit(value, min, max, 0, width);
      return ['div', ui.sliderContainer,
        ['div', {
          style: {
            width: `${w}px`
          },
          ...ui.sliderHandle
        },
          ['span', ui.sliderValue, value]]];
    },
    release() {
      sub.done();
    }
  }
};

export const uiRoute = () => {
  const s = slider();
  return ({ ui, bus, views }: AppContext) =>
    ['div', ui.root,
      'fuck you',
      [btn, { attribs: ui.button, onclick: console.log }, 'hello 100 you'],
      'select',
      [select,
        { onchange: e => console.log(e.target.value) },
        [[1, 'fuck'], [2, 'hello 100 you']], 2],
      'slider',
      [s, {
        min: 0, max: 100, step: 2,
        onchange: n => bus.dispatch([ev.SET_VALUE, n])
      }, views.value.deref() || 0]
    ];
};