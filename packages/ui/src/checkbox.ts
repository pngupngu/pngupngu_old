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

export const create = (id: string, attribs: any) =>
  (_: any, onchange: (e: boolean) => void, value: boolean) =>
    [checkbox, { id, attribs, onchange }, value];