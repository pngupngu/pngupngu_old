import { dropdown, DropDownOption } from "@thi.ng/hdom-components/dropdown";

import { SelectArgs } from './api';

const NOOP = _ => { };

export const select = (_: any, { attribs, onchange = NOOP }: SelectArgs, options: DropDownOption[], sel?: string | number) =>
  ['div', attribs.container,
    [dropdown, { onchange: e => onchange(e.target.value), ...attribs.dropdown }, options, sel],
    ['span', attribs.triangle]];

export const create = (args0: SelectArgs) =>
  (_: any, args1: SelectArgs, ...args: any[]) =>
    [select, {
      attribs: args1.attribs || args0.attribs,
      onchange: args1.onchange || args0.onchange
    }, ...args];