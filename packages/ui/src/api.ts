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
  attribs: SliderAttribs;
}