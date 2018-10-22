import { button } from '@thi.ng/hdom-components/button';

import { AppContext } from '../api';
import { ev } from '../events';
import { select } from './select';
import { slider } from './slider';
import { panel, control } from './panel';

const btn = button();

export const uiRoute = () => {
  const s = slider();

  return ({ ui, bus, views }: AppContext) =>
    ['div', ui.root,
      ['div', 'fuck you Lorem ipsum dolor sit amet,'],
      ['div', 'fuck you Lorem ipsum dolor sit amet,'],
      ['div',
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
            container: ui.sliderContainer,
            handle: ui.sliderHandle,
            value: ui.sliderValue
          },
          onchange: n => bus.dispatch([ev.SET_VALUE, n])
        }, views.value.deref()],
      ],
      ['div',
        'fuck me',
        [btn, { attribs: ui.button, onclick: console.log }, 'hello 100 you'],

        'select you',
        [select,
          { onchange: e => console.log(e.target.value) },
          [[1, 'fuck'], [2, 'hello 100 you']], 2],

        'slider',
        [s, {
          min: 0, max: 100, step: 2,
          attribs: {
            container: ui.sliderContainer,
            handle: ui.sliderHandle,
            value: ui.sliderValue
          },
          onchange: n => bus.dispatch([ev.SET_VALUE, n])
        }, views.value.deref()],
      ],

      [panel, ui.panel,
        [control, { label: ui.panelLabel, control: ui.panelControl },
          'param1', [btn, { attribs: ui.button }, 'fuck']],
        [control, { label: ui.panelLabel, control: ui.panelControl },
          'param2', [btn, { attribs: ui.button }, 'fuck']],
        [control, { label: ui.panelLabel, control: ui.panelControl },
          'param3', [btn, { attribs: ui.button }, 'caoB']],

        [control, { label: ui.panelLabel, control: ui.panelControl },
          'param4',
          [select,
            { onchange: e => console.log(e.target.value) },
            [[1, 'fuck'], [2, 'hello 100 you']], 2]],
        [control, { label: ui.panelLabel, control: ui.panelControl },
          'param3', [btn, { attribs: ui.button }, 'caoB']],
        [control, { label: ui.panelLabel, control: ui.panelControl },
          'param5',
          [s, {
            min: 0, max: 100, step: 2,
            attribs: {
              container: ui.sliderContainer,
              handle: ui.sliderHandle,
              value: ui.sliderValue
            },
            onchange: n => bus.dispatch([ev.SET_VALUE, n])
          }, views.value.deref()]],
        [control, { label: ui.panelLabel, control: ui.panelControl },
          'param3', [btn, { attribs: ui.button }, 'caoB']],
      ],
    ];
};