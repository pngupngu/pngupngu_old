import { partial } from '@thi.ng/compose/partial';

import { enumNames } from '@pngu/core/utils/enum-names';
import { PanelAttribs, SelectAttribs, SliderAttribs, CheckBoxAttribs, MultiSliderAttribs } from '@pngu/ui/api';
import { panel } from '@pngu/ui/panel';
import { create as createCheckbox } from '@pngu/ui/checkbox';
import { create as createSelect } from '@pngu/ui/select';
import { create as createSlider, multiSlider } from '@pngu/ui/slider';

import { Params, DistTypes, GeometryTypes, DiffuseTypes } from '@pngu/sketches/pbr';

export interface ControlAttribs {
  panel: PanelAttribs;
  slider: SliderAttribs;
  checkbox: CheckBoxAttribs;
  select: SelectAttribs;
  multislider3: MultiSliderAttribs;
  multislider4: MultiSliderAttribs;
}

export const controls = (attribs: ControlAttribs, onchange: (name: string, v: any) => void) => {
  const sliderOpts = (min, max, step, name, attribs) =>
    ({ min, max, step, onchange: partial(onchange, name), attribs });
  const makeCheckbox = (id, name) => createCheckbox({ id, onchange: partial(onchange, name), attribs: attribs.checkbox });
  const selOpts = e => enumNames(e).map(k => [e[k], k]);

  const cbTexNormal = makeCheckbox('texNormal', 'useTexNormal');
  const cbTexDiffuse = makeCheckbox('texDiffuse', 'useTexDiff');
  const cbGamma = makeCheckbox('gamma', 'useGamma');
  const cbNormal = makeCheckbox('normal', 'showNormal');

  const msF0 = multiSlider(3, sliderOpts(0, 1, 0.01, 'f0', attribs.multislider3));
  const msAlbedo = multiSlider(3, sliderOpts(0, 1, 0.01, 'albedo', attribs.multislider3));
  const msLightPos = multiSlider(3, sliderOpts(-3, 3, 0.01, 'lightPos', attribs.multislider3));
  const msAmbColor = multiSlider(3, sliderOpts(0, 1, 0.01, 'ambColor', attribs.multislider3));
  const msLightColor = multiSlider(3, sliderOpts(0, 1, 0.01, 'lightColor', attribs.multislider3));
  const sMetalic = createSlider(sliderOpts(0, 1, 0.01, 'metalic', attribs.slider));
  const sRoughness = createSlider(sliderOpts(0, 1, 0.01, 'roughness', attribs.slider));

  const selDistType = createSelect({ attribs: attribs.select, onchange: partial(onchange, 'distributionType') });
  const distTypes = selOpts(DistTypes);
  const selGeomType = createSelect({ attribs: attribs.select, onchange: partial(onchange, 'geometryType') });
  const geomTypes = selOpts(GeometryTypes);
  const selDiffType = createSelect({ attribs: attribs.select, onchange: partial(onchange, 'diffuseType') });
  const diffuseTypes = selOpts(DiffuseTypes);

  return (_: any, params: Params) =>
    [panel, attribs.panel,
      ['f0', [msF0, {}, params.f0]],
      ['albedo', [msAlbedo, {}, params.albedo]],
      ['lightPos', [msLightPos, {}, params.lightPos]],
      ['metalic', [sMetalic, {}, params.metalic]],
      ['roughness', [sRoughness, {}, params.roughness]],
      ['ambColor', [msAmbColor, {}, params.ambColor]],
      ['lightColor', [msLightColor, {}, params.lightColor]],
      ['texNormal', [cbTexNormal, {}, params.useTexNormal]],
      ['texDiffuse', [cbTexDiffuse, {}, params.useTexDiff]],
      ['gamma', [cbGamma, {}, params.useGamma]],
      ['distType', [selDistType, {}, distTypes, params.distributionType]],
      ['geomType', [selGeomType, {}, geomTypes, params.geometryType]],
      ['diffuseType', [selDiffType, {}, diffuseTypes, params.diffuseType]],
      ['normal', [cbNormal, {}, params.showNormal]]
    ];
}