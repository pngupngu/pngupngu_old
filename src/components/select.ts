import { IObjectOf } from "@thi.ng/api/api";
import { dropdown, DropDownOption } from "@thi.ng/hdom-components/dropdown";

import { AppContext } from '../api';

export const select = ({ ui }: AppContext, attribs: IObjectOf<any>, options: DropDownOption[], sel?: string | number) =>
  ['div', ui.select,
    ['span', ui.selectTriangle],
    [dropdown, { ...attribs, ...ui.dropdown }, options, sel]];