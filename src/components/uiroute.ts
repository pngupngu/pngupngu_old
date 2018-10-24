import cx from 'classnames';
import { button, Button, ButtonArgs } from '@thi.ng/hdom-components/button';

import { AppContext } from '../api';
import { UIAttrib } from './api';
import { ev } from '../events';
import { select } from './select';
import { slider } from './slider';
import { panel } from './panel';

const mergeClass = (attr1: UIAttrib, attr2: UIAttrib) => {
  return { ...attr1, attr2, class: cx(attr1.class, attr2.class) };
}

const makeBtn = (btn: Button, klass) => ({ ui }: AppContext, args: ButtonArgs, label: string) => {
  const attribs = mergeClass(<UIAttrib>ui.button, klass);
  return [btn, { attribs, ...args }, label];
}

const makeSelect = klass => ({ ui }: AppContext, ...args: any[]) => {
  const attribs = {
    ...ui.select,
    container: mergeClass(<UIAttrib>ui.select.container, klass)
  };
  return [select, { attribs }, ...args];
};

const makeSlider = klass => {
  const slider_ = slider();
  return ({ ui }: AppContext, args: any, value: number) => {
    const attribs = { ...ui.slider, container: mergeClass(<UIAttrib>ui.slider.container, klass) };
    return [slider_, { attribs, ...args }, value];
  }
}

export const uiRoute = ({ ui, bus, views }: AppContext) => {
  const btn = button({ attribs: ui.button });

  const tbtn = makeBtn(btn, ui.textControl);
  const cbtn = makeBtn(btn, ui.control);

  const tslider = makeSlider(ui.textControl);
  const cslider = makeSlider(ui.control);

  const setValue = n => bus.dispatch([ev.SET_VALUE, n]);

  const tselect = makeSelect(ui.textControl);
  const cselect = makeSelect(ui.control);

  const options = [[1, 'fuck'], [2, 'hello 100 you']];

  return () =>
    ['div', ui.root,
      ['div', 'fuck you Lorem ipsum dolor sit amet,'],
      ['div', 'fuck you Lorem ipsum dolor sit amet,'],
      ['div',
        'fuck you',
        [tbtn, { onclick: console.log }, 'hello 100 you'],

        'select', [tselect, options, 1],

        'slider',
        [tslider, { min: 0, max: 100, step: 2, onchange: setValue }, views.value.deref()],
      ],
      ['div',
        'fuck me',
        [tbtn, { onclick: console.log }, 'hello 100 you'],

        'select you', [tselect, options, 2],
      ],

      [panel, ui.panel,
        ['param1', [cbtn, {}, 'fuck'], [cbtn, {}, 'You']],
        ['param2', [cbtn, {}, 'Fuck']],
        ['param3', [cbtn, {}, 'cao'], [btn, {}, 'B']],
        ['param4', [cselect, options, 1]],
        ['param3', [cbtn, {}, 'caoB']],
        ['param5', [cslider, { min: 0, max: 100, step: 2, onchange: setValue }, views.value.deref()]],
        ['param3', [cbtn, {}, 'caoB']]]
    ];
};