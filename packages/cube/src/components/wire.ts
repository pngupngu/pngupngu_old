import { addExtensionsToContext } from 'twgl.js';
import { canvasWebGL, CanvasHandlers } from "@thi.ng/hdom-components/canvas";
import fit from 'canvas-fit';

import { CameraUI } from '@pngu/gl/camera-ui';
import { PanelAttribs, SliderAttribs, CheckBoxAttribs, MultiSliderAttribs } from '@pngu/ui/api';
import { panel } from '@pngu/ui/panel';
import { checkbox } from '@pngu/ui/checkbox';
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

export interface ControlAttribs {
  panel: PanelAttribs;
  slider: SliderAttribs;
  checkbox: CheckBoxAttribs;
  multislider: MultiSliderAttribs;
}

export const controls = (attribs: ControlAttribs, onchange: (name: string) => (v: any) => void) => {
  const sWidth = createSlider({ min: 0, max: 10, step: 0.01, onchange: onchange('width'), attribs: attribs.slider });
  const sFeather = createSlider({ min: 0, max: 1, step: 0.01, onchange: onchange('feather'), attribs: attribs.slider });
  const sSqueezeMin = createSlider({ min: 0, max: 1, step: 0.01, onchange: onchange('squeezeMin'), attribs: attribs.slider });
  const sSqueezeMax = createSlider({ min: 0, max: 1, step: 0.01, onchange: onchange('squeezeMax'), attribs: attribs.slider });
  const sDashOffset = createSlider({ min: 0, max: 1, step: 0.01, onchange: onchange('dashOffset'), attribs: attribs.slider });
  const sDashRepeat = createSlider({ min: 0, max: 10, step: 1, onchange: onchange('dashRepeat'), attribs: attribs.slider });
  const sDashLength = createSlider({ min: 0, max: 1, step: 0.01, onchange: onchange('dashLength'), attribs: attribs.slider });
  const msColorEdge = multiSlider(4, { min: 0, max: 1, step: 0.01, onchange: onchange('ambColor'), attribs: attribs.multislider });
  const msColorFill = multiSlider(4, { min: 0, max: 1, step: 0.01, onchange: onchange('lightColor'), attribs: attribs.multislider });

  return (_: any, params: Params) => {
    return [panel, attribs.panel,
      ['width', [sWidth, {}, params.width]],
      ['feather', [sFeather, {}, params.feather]],
      ['removeEdge', [checkbox, {id: 'removeEdge', onchange: onchange('removeEdge'), attribs: attribs.checkbox}, params.removeEdge]],
      ['squeezeMin', [sSqueezeMin, {}, params.squeezeMin]],
      ['squeezeMax', [sSqueezeMax, {}, params.squeezeMax]],
      ['dashOffset', [sDashOffset, {}, params.dashOffset]],
      ['dashRepeat', [sDashRepeat, {}, params.dashRepeat]],
      ['dashLength', [sDashLength, {}, params.dashLength]],
      ['colorEdge', [msColorEdge, {}, params.colorEdge]],
      ['colorFill', [msColorFill, {}, params.colorFill]],
    ];
  }
}