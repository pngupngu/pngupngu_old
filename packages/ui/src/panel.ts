import { mapcat } from '@thi.ng/transducers/xform/mapcat';

import { PanelAttribs } from './api';

export const panel = (_: any, attribs: PanelAttribs, ...controls: any[]) =>
  ['div', attribs.container, ...mapcat(([label, ...children]) =>
    [
      ['div', attribs.label, label],
      ['div', attribs.content, ...children]
    ], controls)
  ];