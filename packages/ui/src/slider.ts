import { IVec } from '@thi.ng/vectors/api';
import { clamp } from '@thi.ng/math/interval';
import { fit } from '@thi.ng/math/fit';
import { map } from "@thi.ng/transducers/xform/map";
import { dedupe } from "@thi.ng/transducers/xform/dedupe";
import { range } from '@thi.ng/transducers/iter/range'

import { SliderArgs, MultiSliderArgs } from './api';
import { streamDrag } from './utils';

const NOOP = _ => { };

export const slider = () => {
  let sub, elm: HTMLElement;
  return {
    init(el: HTMLElement, _: any, { max, min, step, onchange = NOOP }: SliderArgs, value: number) {
      const steps = Math.floor((max - min) / step);
      elm = el;

      sub = streamDrag(el).transform(
        map(({ pos, delta }) => {
          const { left, width } = el.getBoundingClientRect();
          const pct = clamp(fit(pos[0] + delta[0] - left, 0, width, 0, steps), 0, steps);
          return min + Math.floor(pct + 0.5) * step;
        }),
        dedupe()).subscribe({ next: onchange });

      onchange(value);
    },
    render(_: any, { max, min, attribs, precision = 2 }: SliderArgs, value: number) {
      const w = elm ? fit(value, min, max, 0, elm.getBoundingClientRect().width) : 0;
      return ['div', attribs.container,
        ['div', { style: { width: `${w.toFixed(3)}px` }, ...attribs.handle },
          ['span', attribs.value, value.toFixed(precision)]]];
    },
    release() {
      sub.done();
    }
  };
};

export const create = () => {
  const slider_ = slider();
  return (_: any, args: SliderArgs, value: number) => [slider_, args, value];
};

export const multiSlider = (n: number) => {
  const sliders = [...map(_ => create(), range(n))];
  return (_: any, { min, max, step, precision = 2, onchange = NOOP, attribs }: MultiSliderArgs, value: IVec) =>
    ['div', attribs.container, ...map((i: number) =>
      [sliders[i], { min, max, step, precision, attribs: attribs.slider, onchange: v => onchange((value[i] = v, value)) }, value[i]],
      range(n))
    ];
}