import { button } from '@thi.ng/hdom-components/button';

import { SliderArgs } from '@pngu/ui/api';
import { panel } from '@pngu/ui/panel';
import { select } from '@pngu/ui/select';
import { slider } from '@pngu/ui/slider';

import { AppContext } from '../api';
import { ev } from '../events';

const makeSelect = attribs => (_: any, ...args: any[]) =>
  [select, { attribs }, ...args];

const makeSlider = attribs => {
  const slider_ = slider();
  return (_: any, args: SliderArgs, value: number) =>
    [slider_, { attribs, ...args }, value];
};

export const uiRoute = ({ ui, bus, views }: AppContext) => {
  const btn = button({ attribs: ui.button });
  const tbtn = button({ attribs: ui.tbutton });
  const cbtn = button({ attribs: ui.cbutton });

  const setValue = n => bus.dispatch([ev.SET_VALUE, n]);

  const options = [[1, 'fuck'], [2, 'hello 100 you']];
  const tselect = makeSelect(ui.tselect);
  const cselect = makeSelect(ui.cselect);
  const slider1 = makeSlider(ui.tslider);
  const slider2 = makeSlider(ui.cslider);

  return () =>
    ['div', ui.root,
      ['div', 'Lorem ipsum dolor sit amet,'],
      ['div', 'Lorem ipsum dolor sit amet,'],
      ['div',
        'a button',
        [tbtn, { onclick: console.log }, 'hello 100 you'],

        'select', [tselect, options, 1],

        'slider',
        [slider1, { min: 0, max: 100, step: 2, onchange: setValue }, views.value.deref()],
      ],
      ['div',
        'another button',
        [tbtn, { onclick: console.log }, 'hello 100 you'],

        'select you', [tselect, options, 2],
      ],

      [panel, ui.panel,
        ['param1', [cbtn, {}, 'fuck'], [cbtn, {}, 'You']],
        ['param2', [cbtn, {}, 'Fuck']],
        ['param3', [cbtn, {}, 'cao'], [btn, {}, 'B']],
        ['param4', [cselect, options, 1]],
        ['param3', [cbtn, {}, 'caoB']],
        ['param5', [slider2, { min: 0, max: 100, step: 2, onchange: setValue }, views.value.deref()]],
        ['param3', [cbtn, {}, 'caoB']]]
    ];
};