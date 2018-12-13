import { CheckBoxArgs } from './api';

export const checkbox = (_: any, { id, onchange, attribs }: CheckBoxArgs, value: boolean) =>
  ['div', attribs.container,
    ['input', {
      id: id,
      type: 'checkbox',
      onchange: e => onchange(e.target.checked),
      checked: value,
      ...attribs.input
    }],
    ['label', { for: id, ...attribs.label }]];

export const create = (args0?: Partial<CheckBoxArgs>) =>
  (_: any, args1: Partial<CheckBoxArgs>, value: boolean) =>
    [checkbox, {
      id: args1.id || args0.id,
      attribs: args1.attribs || args0.attribs,
      onchange: args1.onchange || args0.onchange
    }, value];