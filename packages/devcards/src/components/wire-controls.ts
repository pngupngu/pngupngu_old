import { partial } from '@thi.ng/compose/partial';

import { PanelAttribs, SliderAttribs, CheckBoxAttribs, MultiSliderAttribs } from '@pngu/ui/api';
import { panel } from '@pngu/ui/panel';
import { create as createCheckbox } from '@pngu/ui/checkbox';
import { create as createSlider, multiSlider } from '@pngu/ui/slider';

import { Params } from '@pngu/sketches/wire';

export interface UIAttribs {
  panel: PanelAttribs;
  slider: SliderAttribs;
  checkbox: CheckBoxAttribs;
  multislider3: MultiSliderAttribs;
  multislider4: MultiSliderAttribs;
}

export const controls = (ui: UIAttribs, onchange: (name: string, v: any) => void) => {
  const sliderOpts = (min, max, step, name, attribs) =>
    ({ min, max, step, onchange: partial(onchange, name), attribs });

  const cbRemoveEdge = createCheckbox({
    id: 'removeEdge', onchange: partial(onchange, 'removeEdge'),
    attribs: ui.checkbox
  });

  const sWidth = createSlider(sliderOpts(0, 10, 0.01, 'width', ui.slider));
  const sFeather = createSlider(sliderOpts(0, 1, 0.01, 'feather', ui.slider));
  const sSqueezeMin = createSlider(sliderOpts(0, 1, 0.01, 'squeezeMin', ui.slider));
  const sSqueezeMax = createSlider(sliderOpts(0, 1, 0.01, 'squeezeMax', ui.slider));
  const sDashOffset = createSlider(sliderOpts(0, 1, 0.01, 'dashOffset', ui.slider));
  const sDashRepeat = createSlider(sliderOpts(0, 10, 1, 'dashRepeat', ui.slider));
  const sDashLength = createSlider(sliderOpts(0, 1, 0.01, 'dashLength', ui.slider));
  const msColorEdge = multiSlider(4, sliderOpts(0, 1, 0.01, 'ambColor', ui.multislider4));
  const msColorFill = multiSlider(4, sliderOpts(0, 1, 0.01, 'lightColor', ui.multislider4));
  const msCameraUp = multiSlider(3, sliderOpts(-10, 10, 0.01, 'cameraUp', ui.multislider3));
  const msCameraPos = multiSlider(3, sliderOpts(-20, 20, 0.01, 'cameraPos', ui.multislider3));

  return (_: any, params: Params) =>
    [panel, ui.panel,
      ['width', [sWidth, {}, params.width]],
      ['feather', [sFeather, {}, params.feather]],
      ['removeEdge', [cbRemoveEdge, {}, params.removeEdge]],
      ['squeezeMin', [sSqueezeMin, {}, params.squeezeMin]],
      ['squeezeMax', [sSqueezeMax, {}, params.squeezeMax]],
      ['dashOffset', [sDashOffset, {}, params.dashOffset]],
      ['dashRepeat', [sDashRepeat, {}, params.dashRepeat]],
      ['dashLength', [sDashLength, {}, params.dashLength]],
      ['colorEdge', [msColorEdge, {}, params.colorEdge]],
      ['colorFill', [msColorFill, {}, params.colorFill]],
      ['cameraUp', [msCameraUp, {}, params.cameraUp]],
      ['cameraPos', [msCameraPos, {}, params.cameraPos]],
    ];
}