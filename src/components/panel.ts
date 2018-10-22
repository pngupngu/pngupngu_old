import { IObjectOf } from "@thi.ng/api";

export const control = (_: any, attribs: IObjectOf<any>, label: string, ...children: any[]) =>
  ['tr',
    ['td', attribs.label, label],
    ['td', attribs.control, ...children]];

export const panel = (_: any, attribs: IObjectOf<any>, ...controls: any[]) =>
  ['table', attribs, ['tbody', ...controls]];