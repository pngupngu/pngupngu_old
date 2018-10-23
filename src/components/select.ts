import { dropdown, DropDownOption } from "@thi.ng/hdom-components/dropdown";

import { UIAttrib } from './api';

type Keys = 'container' | 'triangle' | 'dropdown';
export type SelectAttribs = Record<Keys, Partial<UIAttrib>>;

export const select = (_: any, attribs: SelectAttribs, options: DropDownOption[], sel?: string | number) =>
  ['div', attribs.container,
    ['span', attribs.triangle],
    [dropdown, attribs.dropdown, options, sel]];