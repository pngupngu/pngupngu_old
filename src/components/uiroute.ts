import cx from 'classnames';
import { button, Button, ButtonArgs } from '@thi.ng/hdom-components/button';

import { AppContext } from '../api';
import { ev } from '../events';
import { select } from './select';
import { slider } from './slider';
import { panel } from './panel';

const makeBtn = (btn: Button, klass) => ({ ui }: AppContext, args: ButtonArgs, label: string) => {
  const attribs = { ...ui.button, class: cx(ui.button.class, klass) };
  return [btn, { attribs, ...args }, label];
}

const makeSelect = klass => ({ ui }: AppContext, ...args: any[]) => {
  const attribs = {
    ...ui.select,
    container: {
      class: cx(ui.select.container.class, klass)
    }
  };
  return [select, { attribs }, ...args];
};

const makeSlider = klass => {
  const slider_ = slider();
  console.log('hi');
  return ({ ui }: AppContext, args: any, value: number) => {
    const attribs = {
      ...ui.slider,
      container: { class: cx(ui.slider.container.class, klass) },
    };
    return [slider_, { attribs, ...args }, value];
  }
}

export const uiRoute = ({ ui, bus, views }: AppContext) => {
  const btn = button({ attribs: ui.button });

  const tbtn = makeBtn(btn, ui.textControl.class);
  const cbtn = makeBtn(btn, ui.control.class);

  const tslider = makeSlider(ui.textControl.class);
  const cslider = makeSlider(ui.control.class);

  const setValue = n => bus.dispatch([ev.SET_VALUE, n]);

  const tselect = makeSelect(ui.textControl.class);
  const cselect = makeSelect('siht');

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