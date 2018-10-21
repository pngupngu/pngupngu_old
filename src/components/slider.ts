import { IObjectOf } from '@thi.ng/api';
import { clamp } from '@thi.ng/math/interval';
import { fit } from '@thi.ng/math/fit';

import { streamDrag } from '../rstream/stream-drag';

export interface SliderArgs {
  min: number;
  max: number;
  step: number;
  onchange?: (e: number) => void;
  attribs: {
    container: IObjectOf<any>;
    handle: IObjectOf<any>;
    value: IObjectOf<any>;
  }
}

export const slider = () => {
  let sub, left = 0, width = 0;
  return {
    init(el: HTMLElement, _: any, { max, min, step, onchange = _ => { } }: SliderArgs, value: number) {
      const steps = Math.floor((max - min) / step);
      sub = streamDrag(el).subscribe({
        next({ pos, delta }) {
          const b = el.getBoundingClientRect();
          left = b.left;
          width = b.width;
          const pct = clamp(fit(pos[0] + delta[0] - left, 0, width, 0, steps), 0, steps);
          const val = min + Math.floor(pct + 0.5) * step;
          onchange(val);
        }
      });

      const b = el.getBoundingClientRect();
      left = b.left;
      width = b.width;
      onchange(value);
    },
    render(_: any, { max, min, attribs }: SliderArgs, value: number) {
      const w = fit(value, min, max, 0, width);
      return ['div', attribs.container,
        ['div', { style: { width: `${w}px` }, ...attribs.handle },
          ['span', attribs.value, value]]];
    },
    release() {
      sub.done();
    }
  }
};