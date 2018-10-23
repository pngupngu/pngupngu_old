import { dropdown, DropDownOption } from "@thi.ng/hdom-components/dropdown";

import { UIAttrib } from './api';

type Keys = 'container' | 'triangle' | 'dropdown';
export type SelectAttribs = Record<Keys, Partial<UIAttrib>>;

export interface SelectArgs {
  attribs: SelectAttribs;
  onchange?: (e: string | number) => void;
}

export const select = (_: any, { attribs, onchange = _ => {} }: SelectArgs, options: DropDownOption[], sel?: string | number) =>
  ['div', attribs.container,
    [dropdown, { onchange, ...attribs.dropdown }, options, sel],
    ['span', attribs.triangle]];