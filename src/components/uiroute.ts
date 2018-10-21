import { button } from '@thi.ng/hdom-components/button';

import { AppContext } from '../api';
import { ev } from '../events';
import { select } from './select';
import { slider } from './slider';

const btn = button();

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
        attribs: {
          container: ui.sliderContainer, handle: ui.sliderHandle, value: ui.sliderValue
        },
        onchange: n => bus.dispatch([ev.SET_VALUE, n])
      }, views.value.deref()]
    ];
};