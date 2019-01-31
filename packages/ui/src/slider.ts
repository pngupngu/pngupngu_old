import { Vec } from '@thi.ng/vectors';
import { clamp, fit } from '@thi.ng/math';
import { map, dedupe, range } from "@thi.ng/transducers";

import { SliderArgs, MultiSliderArgs } from './api';
import { streamDrag } from './utils';

const NOOP = () => { };

export const slider = () => ({
  init(el: HTMLElement, _: any, { max, min, step, onchange = NOOP }: SliderArgs, value: number) {
    const steps = Math.floor((max - min) / step);
    this.elm = el;

    this.sub = streamDrag(el).transform(
      map(({ pos, delta }) => {
        const { left, width } = el.getBoundingClientRect();
        const pct = clamp(fit(pos[0] + delta[0] - left, 0, width, 0, steps), 0, steps);
        return min + Math.floor(pct + 0.5) * step;
      }),
      dedupe()).subscribe({ next: onchange });

    onchange(value);
  },
  render(_: any, { max, min, attribs, precision = 2 }: SliderArgs, value: number) {
    const w = this.elm ? fit(value, min, max, 0, this.elm.getBoundingClientRect().width) : 0;
    return ['div', attribs.container,
      ['div', { style: { width: `${w.toFixed(3)}px` }, ...attribs.handle },
        ['span', attribs.value, value.toFixed(precision)]]];
  },
  release() {
    this.sub.done();
  }
});

export const create = (args0?: Partial<SliderArgs>) => {
  const slider_ = slider();
  return (_: any, args1: Partial<SliderArgs>, value: number) =>
    [slider_, { ...args0, ...args1 }, value];
};

export const multiSlider = (n: number, args0?: Partial<MultiSliderArgs>) => {
  const opts = {
    min: args0.min, max: args0.max, step: args0.step,
    precision: args0.precision, attribs: args0.attribs.slider
  };
  const sliders = [...map(() => create(opts), range(n))];

  return (_: any, args1: Partial<MultiSliderArgs>, value: Vec) =>
    ['div', args1.attribs ? args1.attribs.container : args0.attribs.container,
      ...map((i: number) =>
        [sliders[i], {
          min: args1.min || args0.min,
          max: args1.max || args0.max,
          step: args1.step || args0.step,
          precision: args1.precision || args0.precision,
          attribs: args1.attribs ? args1.attribs.slider : args0.attribs.slider,
          onchange: v => (args1.onchange || args0.onchange)((value[i] = v, value))
        }, value[i]],
        range(n))
    ];
}