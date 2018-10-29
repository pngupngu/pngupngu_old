import { clamp } from '@thi.ng/math/interval';
import { fit } from '@thi.ng/math/fit';

import { UIAttrib } from './api';
import { streamDrag } from '../rstream/stream-drag';

export type SliderAttribs = Record<'container' | 'handle' | 'value', Partial<UIAttrib>>;

export interface SliderArgs {
  min: number;
  max: number;
  step: number;
  onchange?: (e: number) => void;
  attribs: SliderAttribs;
}

const NOOP = _ => { };

export const slider = () => {
  let sub, elm: HTMLElement;
  return {
    init(el: HTMLElement, _: any, { max, min, step, onchange = NOOP }: SliderArgs, value: number) {
      const steps = Math.floor((max - min) / step);
      elm = el;

      sub = streamDrag(el).subscribe({
        next({ pos, delta }) {
          const { left, width } = el.getBoundingClientRect();
          const pct = clamp(fit(pos[0] + delta[0] - left, 0, width, 0, steps), 0, steps);
          return min + Math.floor(pct + 0.5) * step;
        }
      }).subscribe({ next: onchange });

      onchange(value);
    },
    render(_: any, { max, min, attribs }: SliderArgs, value: number) {
      const w = elm ? fit(value, min, max, 0, elm.getBoundingClientRect().width) : 0;
      return ['div', attribs.container,
        ['div', { style: { width: `${w.toFixed(3)}px` }, ...attribs.handle },
          ['span', attribs.value, value]]];
    },
    release() {
      sub.done();
    }
  };
};