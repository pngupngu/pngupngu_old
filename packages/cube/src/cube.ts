import { indexed } from '@thi.ng/transducers/xform/indexed';

import { panel } from '@pngu/ui/panel';
import { getContext } from '@pngu/gl/application';
import { CameraUI } from '@pngu/gl/camera-ui';
import { canvas } from '@pngu/ui/canvas-webgl';
import { create as createSelect } from '@pngu/ui/select';
import { create as createSlider, multiSlider } from '@pngu/ui/slider';
import { create as createCheckbox } from '@pngu/ui/checkbox';

import { AppContext } from "./api";
import { ev } from "./events";
import { App } from './scenes/pbr';

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

export const cube = ({ ui, views, bus }: AppContext) => {
  const params = views.params.deref();
  const app = new App(params);
  const canvas_ = makeCanvas(app);

  const onchange = name => v => bus.dispatch([ev.SET_PARAM, [name, v]])

  const msF0 = multiSlider(3, ui.multiSlider, { min: 0, max: 1, step: 0.01, onchange: onchange('f0') });
  const msAlbedo = multiSlider(3, ui.multiSlider, { min: 0, max: 1, step: 0.01, onchange: onchange('albedo') });
  const msLightPos = multiSlider(3, ui.multiSlider, { min: -2, max: 2, step: 0.01, onchange: onchange('lightPos') });
  const msAmbColor = multiSlider(3, ui.multiSlider, { min: 0, max: 1, step: 0.01, onchange: onchange('ambColor') });
  const msLightColor = multiSlider(3, ui.multiSlider, { min: 0, max: 1, step: 0.01, onchange: onchange('lightColor') });
  const sMetalic = createSlider(ui.cslider);
  const cbRoughness = createSlider(ui.cslider);
  const cbTexNormal = createCheckbox('texNormal', ui.checkbox);
  const cbTexDiffuse = createCheckbox('texDiffuse', ui.checkbox);
  const cbGamma = createCheckbox('gamma', ui.checkbox);
  const cbNormal = createCheckbox('normal', ui.checkbox);

  const distSelect = createSelect(ui.cselect);
  const distTypes = [...indexed(['blinn phong', 'ggx', 'beckmann'])];

  const geomSelect = createSelect(ui.cselect);
  const geomTypes = [...indexed(['implicit', 'schlick', 'ggx', 'cook torrance'])];

  const diffuseSelect = createSelect(ui.cselect);
  const diffuseTypes = [...indexed(['default', 'disney', 'normalized disney', 'oren nayar'])];

  return () =>
    ['div', ui.root,
      [canvas_, ui.ca],
      [panel, ui.panel,
        ['f0', [msF0, params.f0]],
        ['albedo', [msAlbedo, params.albedo]],
        ['lightPos', [msLightPos, params.lightPos]],
        ['metalic', [sMetalic, { min: 0, max: 1, step: 0.01, onchange: onchange('metalic') }, params.metalic]],
        ['roughness', [cbRoughness, { min: 0, max: 1, step: 0.01, onchange: onchange('roughness') }, params.roughness]],
        ['ambColor', [msAmbColor, params.ambColor]],
        ['lightColor', [msLightColor, params.lightColor]],
        ['texNormal', [cbTexNormal, onchange('useTexNormal'), params.useTexNormal]],
        ['texDiffuse', [cbTexDiffuse, onchange('useTexDiff'), params.useTexDiff]],
        ['gamma', [cbGamma, onchange('useGamma'), params.useGamma]],
        ['distType', [distSelect, { onchange: onchange('distributionType') }, distTypes, params.distributionType]],
        ['geomType', [geomSelect, { onchange: onchange('geomTypes') }, geomTypes, params.geometryType]],
        ['diffuseType', [diffuseSelect, { onchange: onchange('diffuseType') }, diffuseTypes, params.diffuseType]],
        ['normal', [cbNormal, onchange('showNormal'), params.showNormal]],
      ]];
};