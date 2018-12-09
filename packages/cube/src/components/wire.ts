import { addExtensionsToContext } from 'twgl.js';
import { canvasWebGL, CanvasHandlers } from "@thi.ng/hdom-components/canvas";
import fit from 'canvas-fit';

import { CameraUI } from '@pngu/gl/camera-ui';
import { PanelAttribs, SliderAttribs, CheckBoxAttribs, MultiSliderAttribs } from '@pngu/ui/api';
import { panel } from '@pngu/ui/panel';
import { create as createCheckbox } from '@pngu/ui/checkbox';
import { create as createSlider, multiSlider } from '@pngu/ui/slider';

import { App, Params } from '../scenes/wire';

export const canvas = (app: App, { init, update, release }: Partial<CanvasHandlers<WebGLRenderingContext>>) => {
  let camUI: CameraUI, resize;
  return canvasWebGL({
    init(el: HTMLCanvasElement, gl: WebGLRenderingContext, _: any) {
      addExtensionsToContext(gl);
      resize = fit(el);
      resize();

      app.init(gl);
      camUI = new CameraUI(el, app.camera);
      camUI.speed = 3;

      init && init(el, gl);
    },
    update(el: HTMLCanvasElement, gl: WebGLRenderingContext, _: any, time: number, __: number, ___: any, params: Params) {
      app.params = params;
      app.render(time);

      update && update(el, gl);
    },
    release(el: HTMLCanvasElement, gl: WebGLRenderingContext, _: any) {
      camUI.release();

      release && release(el, gl);
    }
  });
};

export interface controlAttribs {
  panel: PanelAttribs;
  slider: SliderAttribs;
  checkbox: CheckBoxAttribs;
  multislider: MultiSliderAttribs;
}

export const controls = (attribs: controlAttribs) => {
  const sWidth = createSlider(attribs.slider);
  const sFeather = createSlider(attribs.slider);
  const cbRemoveEdge = createCheckbox('removeEdge', attribs.checkbox);
  const sSqueezeMin = createSlider(attribs.slider);
  const sSqueezeMax = createSlider(attribs.slider);
  const sDashOffset = createSlider(attribs.slider);
  const sDashRepeat = createSlider(attribs.slider);
  const sDashLength = createSlider(attribs.slider);
  const msColorEdge = multiSlider(4, attribs.multislider);
  const msColorFill = multiSlider(4, attribs.multislider);

  return (_: any, onchange: (name: string) => (v: any) => void, params: Params) => {
    return [panel, attribs.panel,
      ['width', [sWidth, { min: 0, max: 10, step: 0.01, onchange: onchange('width') }, params.width]],
      ['feather', [sFeather, { min: 0, max: 1, step: 0.01, onchange: onchange('feather') }, params.feather]],
      ['removeEdge', [cbRemoveEdge, onchange('removeEdge'), params.removeEdge]],
      ['squeezeMin', [sSqueezeMin, { min: 0, max: 1, step: 0.01, onchange: onchange('squeezeMin') }, params.squeezeMin]],
      ['squeezeMax', [sSqueezeMax, { min: 0, max: 1, step: 0.01, onchange: onchange('squeezeMax') }, params.squeezeMax]],
      ['dashOffset', [sDashOffset, { min: 0, max: 1, step: 0.01, onchange: onchange('dashOffset') }, params.dashOffset]],
      ['dashRepeat', [sDashRepeat, { min: 0, max: 10, step: 1, onchange: onchange('dashRepeat') }, params.dashRepeat]],
      ['dashLength', [sDashLength, { min: 0, max: 1, step: 0.01, onchange: onchange('dashLength') }, params.dashLength]],
      ['colorEdge', [msColorEdge, { min: 0, max: 1, step: 0.01, onchange: onchange('ambColor') }, params.colorEdge]],
      ['colorFill', [msColorFill, { min: 0, max: 1, step: 0.01, onchange: onchange('lightColor') }, params.colorFill]],
    ];
  }
}