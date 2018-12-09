import { addExtensionsToContext } from 'twgl.js';
import { canvasWebGL } from "@thi.ng/hdom-components/canvas";
import fit from 'canvas-fit';

// import { canvas } from '@pngu/ui/canvas-webgl';
// import { getContext } from '@pngu/gl/application';
import { CameraUI } from '@pngu/gl/camera-ui';
import { panel } from '@pngu/ui/panel';
import { create as createCheckbox } from '@pngu/ui/checkbox';
import { create as createSlider, multiSlider } from '@pngu/ui/slider';

import { AppContext, UIAttribs } from "./api";
import { ev } from "./events";
import { App, Params } from './scenes/wire';

const makeCanvas = app => {
  let camUI: CameraUI, resize;
  return canvasWebGL({
    init(el: HTMLCanvasElement, gl: WebGLRenderingContext, { bus }: AppContext) {
      addExtensionsToContext(gl);
      resize = fit(el);
      resize();

      bus.dispatch([ev.SET_RAF, true]);
      app.init(gl);

      camUI = new CameraUI(el, app.camera);
      camUI.speed = 3;
    },
    update(_: HTMLCanvasElement, __: WebGLRenderbuffer, ___: AppContext, time: number, ____: number, _____: any, params: Params) {
      app.params = params;
      app.render(time);
    },
    release(_: HTMLCanvasElement, __: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, false]);
      camUI.release();
    }
  });
};

const makePanel = (ui: UIAttribs) => {
  const sWidth = createSlider(ui.cslider);
  const sFeather = createSlider(ui.cslider);
  const cbRemoveEdge = createCheckbox('removeEdge', ui.checkbox);
  const sSqueezeMin = createSlider(ui.cslider);
  const sSqueezeMax = createSlider(ui.cslider);
  const sDashOffset = createSlider(ui.cslider);
  const sDashRepeat = createSlider(ui.cslider);
  const sDashLength = createSlider(ui.cslider);
  const msColorEdge = multiSlider(4, ui.multiSlider4);
  const msColorFill = multiSlider(4, ui.multiSlider4);

  return (_: any, onchange: (name: string) => (v: any) => void, params: Params) => {
    return [panel, ui.panel,
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

export const wire = ({ ui, views, bus }: AppContext) => {
  const canvas_ = makeCanvas(new App());
  const onchange = name => value => bus.dispatch([ev.SET_PARAM, [name, value]]);
  const panel_ = makePanel(ui);

  return () => {
    const params = views.params.deref();
    const orientation = views.orientation.deref();
    return ['div', ui.root,
      [canvas_, ui.ca, params],
      [panel_, onchange, params],
      ['div', ui.orient,
        `${orientation[0].toFixed(2)}, ${orientation[1].toFixed(2)}, ${orientation[2].toFixed(2)}`],
    ];
  };
}