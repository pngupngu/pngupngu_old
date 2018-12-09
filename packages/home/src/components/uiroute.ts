import { button } from '@thi.ng/hdom-components/button';

import { panel } from '@pngu/ui/panel';
import { create as createSelect } from '@pngu/ui/select';
import { create as createSlider } from '@pngu/ui/slider';
import { create as createCheckbox } from '@pngu/ui/checkbox';

import { AppContext } from '../api';
import { ev } from '../events';

export const uiRoute = ({ ui, bus, views }: AppContext) => {
  const btn = button({ attribs: ui.button });
  const ibtn = button({ attribs: ui.inlineButton });
  const cbtn = button({ attribs: ui.cbutton });

  const setValue = n => bus.dispatch([ev.SET_VALUE, n]);
  const setChecked = n => bus.dispatch([ev.SET_CHECKED, n]);

  const options = [[1, 'fuck growth'], [2, 'hello 100 you']];
  const iselect = createSelect(ui.inlineSelect);
  const cselect = createSelect(ui.cselect);
  const slider1 = createSlider(ui.inlineSlider);
  const slider2 = createSlider(ui.cslider);

  const chk1 = createCheckbox('chk1', ui.inlineCheckbox);
  const chk2 = createCheckbox('chk2', ui.checkbox);

  return () =>
    ['div', ui.root,
      ['div', 'Lorem ipsum dolor sit amet,'],
      ['div', 'Lorem ipsum dolor sit amet,'],
      ['div',
        'a button',
        [ibtn, { onclick: console.log }, 'hello 100 you'],

        'select growth', [iselect, {}, options, 1],

        'slider',
        [slider1, { min: 0, max: 100, step: 2, onchange: setValue }, views.value.deref()],
      ],
      ['div',
        'another button',
        [ibtn, { onclick: console.log }, 'hello 100 you'],

        'select you', [iselect, {}, options, 2],

        'checked',
        [chk1, setChecked, views.checked.deref()]
      ],

      [panel, ui.panel,
        ['param1', ['div', ui.container2, [cbtn, {}, 'fuck'], [cbtn, {}, 'You']]],
        ['param2', [cbtn, {}, 'Fuck']],
        ['param3', ['div', ui.container2, [cbtn, {}, 'cao'], [btn, {}, 'B']]],
        ['growth', [cselect, {}, options, 1]],
        ['param3', [cbtn, {}, 'caoB']],
        ['param5', [slider2, { min: 0, max: 100, step: 2, onchange: setValue }, views.value.deref()]],
        ['checked', [chk2, setChecked, views.checked.deref()]],
        ['param3', [cbtn, {}, 'caoB']],
      ],
    ];
};