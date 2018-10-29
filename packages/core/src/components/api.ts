import cx from 'classnames';

export interface UIAttrib {
  class: string;
}

export type ComponentAttrib = Record<string, Partial<UIAttrib>>;

export const addClass = (attr: UIAttrib, klass: string) =>
  ({ ...attr, class: cx(attr.class, klass) });

export const mergeClass = (attr1: UIAttrib, attr2: UIAttrib) =>
  ({ ...attr1, ...attr2, class: cx(attr1.class, attr2.class) });