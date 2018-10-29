export interface UIAttrib {
  class: string;
}

export type ComponentAttrib = Record<string, Partial<UIAttrib>>;