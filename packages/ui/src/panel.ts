import { map } from "@thi.ng/transducers/xform/map";

import { PanelAttribs } from './api';

export const panel = (_: any, attribs: PanelAttribs, ...controls: any[]) =>
  ['table', attribs.container,
    ['tbody', map(([label, ...children]) =>
      ['tr',
        ['td', attribs.label, label],
        ['td', attribs.content, ...children]], controls)]];