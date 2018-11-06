import cx from 'classnames';
import { updateIn, toPath } from '@thi.ng/paths';

import {
  UIAttrib, ComponentAttrib, SelectAttribs,
  SliderAttribs, PanelAttribs, CheckBoxAttribs
} from './api';

export const addClass = (attribs, klass, path?: string) =>
  updateIn(attribs, path ? toPath(path).concat(['class']) : 'class', cls => cx(cls, klass));

export const inline = (attribs: UIAttrib | ComponentAttrib, path?: string) =>
  addClass(attribs, 'mh1 dib', path);

export const root = { class: 'vw-100 vh-100 pa0 sans-serif f6 fw2 barlow bg-white98 relative' };

export const panel: PanelAttribs = {
  container: { class: 'bg-black-80 code f7 dg gtc-af pa-1' },
  label: { class: 'no-select nowrap white pa0 ph1 ma-1' },
  content: { class: 'pa0 pv0 ma-1' },
};

export const select: SelectAttribs = {
  container: { class: 'relative bg-gray f6 hover-bg-mid-gray' },
  triangle: { class: 'absolute select-triangle' },
  dropdown: { class: 'outline-0 input-reset pointer br0 bn code f7 white bg-transparent pl1 pr3 w-100 tc tlc lh-title va-1' }
};

export const button: UIAttrib = {
  class: 'input-reset f7 code button-reset outline-0 tc pointer no-select ' +
    'ph1 bn white bg-gray hover-bg-mid-gray v-top btn'
};

export const slider: SliderAttribs = {
  container: { class: 'f6 bg-black relative ew-resize v-btm' },
  handle: { class: 'bg-gray tr' },
  value: { class: 'f7 code absolute--fill no-select ph1 white' },
};

export const checkbox: CheckBoxAttribs = {
  container: { class: 'dib relative w1 h1' },
  input: { class: 'hidden input-reset pointer checkbox' },
  label: { class: 'absolute left-0 dib v-top pointer border-box w1 h1 bg-black' }
}

export const inlineButton: UIAttrib = inline(button);
export const inlineSelect: UIAttrib = inline(select, 'container');
export const inlineCheckbox: UIAttrib = inline(checkbox, 'container');
export const inlineSlider: UIAttrib = addClass(inline(slider, 'container'), 'w4', 'container');