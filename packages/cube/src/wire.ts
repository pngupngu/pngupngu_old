import { DEG2RAD } from '@thi.ng/math/api';
import { Vec3 } from '@thi.ng/vectors/vec3';
import { Mat44 } from '@thi.ng/vectors/mat44';

import { canvas } from '@pngu/ui/canvas-webgl';
import { getContext } from '@pngu/gl/application';
import { CameraUI } from '@pngu/gl/camera-ui';
// import { panel } from '@pngu/ui/panel';
// import { create as createCheckbox } from '@pngu/ui/checkbox';
// import { create as createSlider, multiSlider } from '@pngu/ui/slider';
import { fromOrientation } from '@pngu/core/rstream/from-orientation';

import { AppContext } from "./api";
import { ev } from "./events";
import { App } from './scenes/wire';

const makeCanvas = app => {
  let camUI: CameraUI;
  return canvas({
    init(el: HTMLCanvasElement, gl: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, true]);
      app.init(gl);

      camUI = new CameraUI(el, app.camera);
      camUI.speed = 3;
    },
    update(_: HTMLCanvasElement, __: WebGLRenderbuffer, { views }: AppContext, time: number, ____: number) {
      app.params = views.params.deref();
      app.render(time);
    },
    release(_: HTMLCanvasElement, __: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, false]);
      camUI.release();
    }
  }, getContext());
};

function mat44FromEulerYXZ(mat: Mat44, alpha: number, beta: number, gamma: number) {
  let x = alpha * DEG2RAD, y = beta * DEG2RAD, z = gamma * DEG2RAD;
  let a = Math.cos(x), b = Math.sin(x);
  let c = Math.cos(y), d = Math.sin(y);
  let e = Math.cos(z), f = Math.sin(z);
  let ce = c * e, cf = c * f, de = d * e, df = d * f;

  mat[0] = ce + df * b;
  mat[4] = de * b - cf;
  mat[8] = a * d;

  mat[1] = a * f;
  mat[5] = a * e;
  mat[9] = - b;

  mat[2] = cf * b - de;
  mat[6] = df + ce * b;
  mat[10] = a * c;

  return mat;
}

export const wire = ({ ui, views, bus }: AppContext) => {
  const canvas_ = makeCanvas(new App());
  // const onchange = name => v => bus.dispatch([ev.SET_PARAM, [name, v]]);

  fromOrientation(1e-1).subscribe({
    next(e) {
      const mat = Mat44.identity();
      mat44FromEulerYXZ(mat, e.beta, e.alpha, -e.gamma);
      const v = mat
        .mul(Mat44.rotationX(-90 * DEG2RAD))
        .mulV3(new Vec3([0, 1, 0]));

      // bus.dispatch([ev.SET_ORIENTATION, [e.alpha, e.beta, e.gamma]]);
      bus.dispatch([ev.SET_ORIENTATION, [v.x, v.y, v.z]]);
    }
  });

  // const sWidth = createSlider(ui.cslider);
  // const sFeather = createSlider(ui.cslider);
  // const cbRemoveEdge = createCheckbox('removeEdge', ui.checkbox);
  // const sSqueezeMin = createSlider(ui.cslider);
  // const sSqueezeMax = createSlider(ui.cslider);
  // const sDashOffset = createSlider(ui.cslider);
  // const sDashRepeat = createSlider(ui.cslider);
  // const sDashLength = createSlider(ui.cslider);
  // const msColorEdge = multiSlider(4, ui.multiSlider4, { min: 0, max: 1, step: 0.01, onchange: onchange('ambColor') });
  // const msColorFill = multiSlider(4, ui.multiSlider4, { min: 0, max: 1, step: 0.01, onchange: onchange('lightColor') });

  return () => {
    // const params = views.params.deref();
    const orientation = views.orientation.deref();
    return ['div', ui.root,
      [canvas_, ui.ca],
      // [panel, ui.panel,
      //   ['width', [sWidth, { min: 0, max: 10, step: 0.01, onchange: onchange('width') }, params.width]],
      //   ['feather', [sFeather, { min: 0, max: 1, step: 0.01, onchange: onchange('feather') }, params.feather]],
      //   ['removeEdge', [cbRemoveEdge, onchange('removeEdge'), params.removeEdge]],
      //   ['squeezeMin', [sSqueezeMin, { min: 0, max: 1, step: 0.01, onchange: onchange('squeezeMin') }, params.squeezeMin]],
      //   ['squeezeMax', [sSqueezeMax, { min: 0, max: 1, step: 0.01, onchange: onchange('squeezeMax') }, params.squeezeMax]],
      //   ['dashOffset', [sDashOffset, { min: 0, max: 1, step: 0.01, onchange: onchange('dashOffset') }, params.dashOffset]],
      //   ['dashRepeat', [sDashRepeat, { min: 0, max: 10, step: 1, onchange: onchange('dashRepeat') }, params.dashRepeat]],
      //   ['dashLength', [sDashLength, { min: 0, max: 1, step: 0.01, onchange: onchange('dashLength') }, params.dashLength]],
      //   ['colorEdge', [msColorEdge, params.colorEdge]],
      //   ['colorFill', [msColorFill, params.colorFill]],
      // ],
      ['div', ui.orient,
        `${orientation[0].toFixed(2)}, ${orientation[1].toFixed(2)}, ${orientation[2].toFixed(2)}`],
    ];
  };
}