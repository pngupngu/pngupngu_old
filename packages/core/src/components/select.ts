import { dropdown, DropDownOption } from "@thi.ng/hdom-components/dropdown";

import { UIAttrib } from './api';

type Keys = 'container' | 'triangle' | 'dropdown';
export type SelectAttribs = Record<Keys, Partial<UIAttrib>>;

export interface SelectArgs {
  attribs: SelectAttribs;
  onchange?: (e: string | number) => void;
}

const NOOP = _ => { };

export const select = (_: any, { attribs, onchange = NOOP }: SelectArgs, options: DropDownOption[], sel?: string | number) =>
  ['div', attribs.container,
    [dropdown, { onchange: e => onchange(e.target.value), ...attribs.dropdown }, options, sel],
    ['span', attribs.triangle]];