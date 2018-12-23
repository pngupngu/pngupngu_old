import { IVec } from '@thi.ng/vectors/api';

export interface UIAttrib {
  class: string;
}

export type ComponentAttrib<T extends string> = Record<T, Partial<UIAttrib>>;

export type PanelAttribs = ComponentAttrib<'container' | 'label' | 'content'>;

export type SelectAttribs = ComponentAttrib<'container' | 'triangle' | 'dropdown'>;
export interface SelectArgs {
  attribs: SelectAttribs;
  onchange?: (e: string | number) => void;
}

export type SliderAttribs = ComponentAttrib<'container' | 'handle' | 'value'>;
export interface SliderArgs {
  min: number;
  max: number;
  step: number;
  onchange?: (e: number) => void;
  precision?: number;
  attribs: SliderAttribs;
}

export interface MultiSliderAttribs extends ComponentAttrib<'container'> {
  slider: SliderAttribs;
}

export interface MultiSliderArgs {
  min: number;
  max: number;
  step: number;
  precision?: number;
  onchange?(v: IVec): void;
  attribs: MultiSliderAttribs;
}

export type CheckBoxAttribs = ComponentAttrib<'container' | 'input' | 'label'>;
export interface CheckBoxArgs {
  id: string;
  onchange(e: boolean): void;
  attribs: CheckBoxAttribs;
}