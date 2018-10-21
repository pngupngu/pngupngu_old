import { gestureStream, GestureType, GestureInfo } from '@thi.ng/rstream-gestures';
import { merge } from '@thi.ng/rstream/stream-merge';
import { filter } from '@thi.ng/transducers/xform/filter';
import { map } from '@thi.ng/transducers/xform/map';
import { button } from '@thi.ng/hdom-components/button';
// import { fit } from '@thi.ng/math/fit';

import { AppContext } from '../api';
import { select } from './select';
import { takeUntil } from '../rstream/take-until';

const btn = button();

interface SliderArgs {
  min: number;
  max: number;
}

const slider = () => {
  let sub;
  return {
    init(el: HTMLElement) {
      const drag = gestureStream(el).transform(
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

      sub = merge({ src: [drag] }).subscribe({
        next(x) {
          console.log(x);
        }
      });
    },
    render({ ui }: any, _: SliderArgs, value: number) {
      return ['div', ui.sliderContainer,
        ['div', {
          // style: {
          //   width: '50px'
          // },
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
  return ({ ui }: AppContext) => ['div', ui.root,
    'fuck you',
    [btn, { attribs: ui.button, onclick: console.log }, 'hello 100 you'],
    'select',
    [select,
      { onchange: e => console.log(e.target.value) },
      [[1, 'fuck'], [2, 'hello 100 you']], 2],
    'slider',
    [s, { min: 0, max: 100 }, 50]
  ];
};