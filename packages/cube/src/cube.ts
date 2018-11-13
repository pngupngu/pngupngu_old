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
  const app = new App(views.params.deref());
  const canvas_ = makeCanvas(app);

  const onchange = name => v => bus.dispatch([ev.SET_PARAM, [name, v]])

  const msF0 = multiSlider(3, ui.multiSlider, { min: 0, max: 1, step: 0.01, onchange: onchange('f0') });
  const msAlbedo = multiSlider(3, ui.multiSlider, { min: 0, max: 1, step: 0.01, onchange: onchange('albedo') });
  const msLightPos = multiSlider(3, ui.multiSlider, { min: -2, max: 2, step: 0.01, onchange: onchange('lightPos') });
  const msAmbColor = multiSlider(3, ui.multiSlider, { min: 0, max: 1, step: 0.01, onchange: onchange('ambColor') });
  const msLightColor = multiSlider(3, ui.multiSlider, { min: 0, max: 1, step: 0.01, onchange: onchange('lightColor') });
  const metalicCtrl = createSlider(ui.cslider);
  const roughnessCtrl = createSlider(ui.cslider);
  const chkbTexNormal = createCheckbox('texNormal', ui.checkbox);
  const chkbTexDiffuse = createCheckbox('texDiffuse', ui.checkbox);
  const chkbGamma = createCheckbox('gamma', ui.checkbox);
  const chkbNormal = createCheckbox('normal', ui.checkbox);

  const distSelect = createSelect(ui.cselect);
  const distTypes = [[0, 'blinn phong'], [1, 'ggx'], [2, 'beckmann']]

  const geomSelect = createSelect(ui.cselect);
  const geomTypes = [[0, 'implicit'], [1, 'schlick'], [2, 'ggx'], [3, 'cook torrance']];

  const diffuseSelect = createSelect(ui.cselect);
  const diffuseTypes = [[0, 'default'], [1, 'disney'], [2, 'normalized disney'], [3, 'oren nayar']];

  return () =>
    ['div', ui.root,
      [canvas_, ui.ca],
      [panel, ui.panel,
        ['f0', [msF0, views.params.deref().f0]],
        ['albedo', [msAlbedo, views.params.deref().albedo]],
        ['lightPos', [msLightPos, views.params.deref().lightPos]],
        ['metalic', [metalicCtrl,
          { min: 0, max: 1, step: 0.01, onchange: v => bus.dispatch([ev.SET_PARAM, ['metalic', v]]) },
          views.params.deref().metalic]],
        ['roughness', [roughnessCtrl,
          { min: 0, max: 1, step: 0.01, onchange: v => bus.dispatch([ev.SET_PARAM, ['roughness', v]]) },
          views.params.deref().roughness]],
        ['ambColor', [msAmbColor, views.params.deref().ambColor]],
        ['lightColor', [msLightColor, views.params.deref().lightColor]],
        ['texNormal', [chkbTexNormal, v => bus.dispatch([ev.SET_PARAM, ['useTexNormal', v]]), views.params.deref().useTexNormal]],
        ['texDiffuse', [chkbTexDiffuse, v => bus.dispatch([ev.SET_PARAM, ['useTexDiff', v]]), views.params.deref().useTexDiff]],
        ['gamma', [chkbGamma, v => bus.dispatch([ev.SET_PARAM, ['useGamma', v]]), views.params.deref().useGamma]],
        ['distType', [distSelect, { onchange: v => bus.dispatch([ev.SET_PARAM, ['distributionType', v]]) }, distTypes, views.params.deref().distributionType]],
        ['geomType', [geomSelect, { onchange: v => bus.dispatch([ev.SET_PARAM, ['geomTypes', v]]) }, geomTypes, views.params.deref().geometryType]],
        ['diffuseType', [diffuseSelect, { onchange: v => bus.dispatch([ev.SET_PARAM, ['diffuseType', v]]) }, diffuseTypes, views.params.deref().diffuseType]],
        ['normal', [chkbNormal, v => bus.dispatch([ev.SET_PARAM, ['showNormal', v]]), views.params.deref().showNormal]],
      ]];
};