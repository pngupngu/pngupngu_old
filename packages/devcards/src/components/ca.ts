import { gestureStream, GestureEvent, GestureType } from "@thi.ng/rstream-gestures";
import { Subscription } from "@thi.ng/rstream/subscription";
import { filter } from "@thi.ng/transducers/xform/filter";
import { map } from "@thi.ng/transducers/xform/map";
import { keys } from "@thi.ng/transducers/iter/keys";
import { partial } from '@thi.ng/compose/partial';

import {
  PanelAttribs, SelectAttribs, SliderAttribs,
  // CheckBoxAttribs, MultiSliderAttribs
} from '@pngu/ui/api';
import { panel } from '@pngu/ui/panel';
import { create as createSelect } from '@pngu/ui/select';
import { create as createSlider } from '@pngu/ui/slider';
import { canvas } from '@pngu/gl/canvas';
import { App, Params, presets } from '@pngu/scenes/ca';

import { Context, ev } from "../api";

interface ControlAttribs {
  panel: PanelAttribs;
  slider: SliderAttribs;
  select: SelectAttribs;
}

const controls = (attribs: ControlAttribs, onchange: (name: string, v: any) => void) => {
  const sliderOpts = (min, max, step, name, attribs) =>
    ({ min, max, step, onchange: partial(onchange, name), attribs });

  const sE1 = createSlider(sliderOpts(0, 8, 1, 'e1', attribs.slider));
  const sE2 = createSlider(sliderOpts(0, 8, 1, 'e2', attribs.slider));
  const sF1 = createSlider(sliderOpts(0, 8, 1, 'f1', attribs.slider));
  const sFade = createSlider(sliderOpts(0, 1, 0.01, 'fade', attribs.slider));

  const selOpts = [...map(x => [x, x], keys(presets))];
  const selPresets = createSelect({
    attribs: attribs.select,
    onchange(v) {
      onchange('e1', presets[v].e1);
      onchange('e2', presets[v].e2);
      onchange('f1', presets[v].f1);
    }
  });

  return (_: any, params: Params) =>
    [panel, attribs.panel,
      ['presets', [selPresets, {}, selOpts, 'growth']],
      ['e1', [sE1, {}, params.e1]],
      ['e2', [sE2, {}, params.e2]],
      ['f1', [sF1, {}, params.f1]],
      ['fade', [sFade, {}, params.fade]],
    ];
}

export default ({ ui, views, bus }: Context) => {
  const app = new App();
  const setParam = (name, value) => bus.dispatch([ev.SET_PARAM, ['ca', name, value]]);

  let sub: Subscription<any, GestureEvent>;
  const canvas_ = canvas(app, {
    init(el) {
      sub = gestureStream(el)
        .transform(filter(g => g[0] == GestureType.MOVE))
        .subscribe({
          next({ 1: { pos: [x, y] } }) {
            setParam('mouse', [x, el.clientHeight - y])
          }
        });

      bus.dispatch([ev.SET_RAF, true]);
    },
    release() {
      sub.unsubscribe();
      bus.dispatch([ev.SET_RAF, false]);
    }
  });

  const controls_ = controls({
    panel: ui.panel,
    slider: ui.slider,
    select: ui.select
  }, setParam);

  return () => {
    const params = views.params.deref().ca;
    return ['div', ui.root,
      [canvas_, ui.ca, params],
      [controls_, params]
    ];
  };
};