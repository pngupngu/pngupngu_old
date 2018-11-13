import { Vec3 } from '@thi.ng/vectors/vec3';

import {
  root, panel, select, button, slider, checkbox,
  multiSlider,
  addClass
} from '@pngu/ui/styles';

import { AppConfig } from './api';
import { handlers } from './events';
import { cube } from './cube';
import { DistTypes, GeometryTypes, DiffuseTypes } from './scenes/pbr'

export const CONFIG: AppConfig = {

  events: handlers.events,
  effects: handlers.effects,

  domRoot: 'app',

  rootComponent: cube,

  initialState: {
    raf: false,
    params: {
      lightPos: new Vec3([1, 1, 2]),
      f0: new Vec3([0.04, 0.04, 0.04]),
      albedo: new Vec3([0.9, 0.9, 0.9]),
      metalic: 0.0,
      roughness: 0.3,
      ambColor: new Vec3([0.03, 0.03, 0.03]),
      lightColor: new Vec3([1, 1, 1]),
      useTexNormal: true,
      useTexDiff: true,
      useGamma: false,
      distributionType: DistTypes.BlinnPhong,
      geometryType: GeometryTypes.Implicit,
      diffuseType: DiffuseTypes.Default,
      showNormal: false
    }
  },

  views: {
    raf: 'raf',
    params: 'params'
  },

  ui: {
    root, button, select, slider, checkbox, multiSlider,

    panel: addClass(panel, 'absolute w5', 'container'),

    cslider: addClass(slider, 'mr-2 ctrl', 'container'),
    cselect: addClass(select, 'mr-2 ctrl', 'container'),

    ca: { class: 'w-100 h-100 absolute' },
  }
};