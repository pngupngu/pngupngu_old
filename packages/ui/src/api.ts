import { IVec } from '@thi.ng/vectors/api';

export interface UIAttrib {
  class: string;
}

export type ComponentAttrib = Record<string, Partial<UIAttrib>>;

export type PanelAttribs = Record<'container' | 'label' | 'content', Partial<UIAttrib>>;

export type SelectAttribs = Record<'container' | 'triangle' | 'dropdown', Partial<UIAttrib>>;
export interface SelectArgs {
  attribs: SelectAttribs;
  onchange?: (e: string | number) => void;
}

export type SliderAttribs = Record<'container' | 'handle' | 'value', Partial<UIAttrib>>;
export interface SliderArgs {
  min: number;
  max: number;
  step: number;
  onchange?: (e: number) => void;
  precision?: number;
  attribs: SliderAttribs;
}

export type MultiSliderAttribs = Record<'container' | 'slider', Partial<UIAttrib>>;
export interface MultiSliderArgs {
  min: number;
  max: number;
  step: number;
  precision?: number;
  onchange?(v: IVec): void;
}

export type CheckBoxAttribs = Record<'container' | 'input' | 'label', Partial<UIAttrib>>;
export interface CheckBoxArgs {
  id: string;
  onchange(e: boolean): void;
  attribs: CheckBoxAttribs;
}