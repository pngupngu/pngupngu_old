// import { gestureStream, GestureType } from '@thi.ng/rstream-gestures';
// import { filter } from '@thi.ng/transducers/xform/filter';
import { button } from '@thi.ng/hdom-components/button';
// import { fit } from '@thi.ng/math/fit';

import { AppContext } from '../api';
import { select } from './select';
// import { takeUntil } from '../rstream/take-until';

const btn = button();

interface SliderArgs {
  min: number;
  max: number;
}

const slider = () => {
  // let sub;
  return {
    init(_: HTMLElement) {
      // const gesture = gestureStream(document.body);
      // const down = gestureStream(el).transform(filter(g => g[0] == GestureType.START));
      // const move = gesture.transform(filter(g => g[0] == GestureType.MOVE));
      // const end = gesture.transform(filter(g => g[0] == GestureType.END));
      // move.subscribe(takeUntil(down)).subscribe({
      //   next(x) {
      //     console.log('next', x);
      //   },
      //   done() {
      //     console.log('bye')
      //   }
      // });

      // sub = gestureStream(el)
      //   .transform(filter(g => g[0] == GestureType.DRAG))
      //   .subscribe({
      //     next({ 1: { pos, delta } }) {
      //       console.log(pos, delta);
      //       // const br = el.getBoundingClientRect();

      //     }
      //   })
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
      // sub.done();
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