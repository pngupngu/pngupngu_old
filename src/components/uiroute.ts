import { button } from '@thi.ng/hdom-components/button';

import { AppContext } from '../api';
import { ev } from '../events';
import { select } from './select';
import { slider } from './slider';
import { panel } from './panel';

const sel = ({ ui }: AppContext) =>
  [select, {
    ...ui.select,
    dropdown: {
      ...ui.select.dropdown,
      onchange: e => console.log(e.target.value)
    }
  }, [[1, 'fuck'], [2, 'hello 100 you']], 2];

export const uiRoute = ({ ui }: AppContext) => {
  const s = slider();
  const s1 = slider();
  const btn = button({ attribs: ui.button });
  const slc = {
    class: ui.slider.container.class + ' fg-1'
  };

  return ({ ui, bus, views }: AppContext) =>
    ['div', ui.root,
      ['div', 'fuck you Lorem ipsum dolor sit amet,'],
      ['div', 'fuck you Lorem ipsum dolor sit amet,'],
      ['div',
        'fuck you',
        [btn, { onclick: console.log }, 'hello 100 you'],

        'select', sel,

        'slider',
        [s, {
          min: 0, max: 100, step: 2,
          attribs: ui.slider,
          onchange: n => bus.dispatch([ev.SET_VALUE, n])
        }, views.value.deref()],
      ],
      ['div',
        'fuck me',
        [btn, { onclick: console.log }, 'hello 100 you'],

        'select you', sel,
      ],

      [panel, ui.panel,
        ['param1', [btn, {}, 'fuck'], [btn, {}, 'You']],
        ['param2', [btn, {}, 'fuck']],
        ['param3', [btn, {}, 'caoB']],
        ['param4', sel],
        ['param3', [btn, {}, 'caoB']],
        ['param5', [s1, {
          min: 0, max: 100, step: 2,
          attribs: {
            ...ui.slider,
            container: slc,
          },
          onchange: n => bus.dispatch([ev.SET_VALUE, n])
        }, views.value.deref()]],
        ['param3', [btn, {}, 'caoB']]]
    ];
};