import { float } from '@thi.ng/strings/float';
import { gestureStream } from "@thi.ng/rstream-gestures";
import { ISubscribable } from "@thi.ng/rstream/api";
import { merge } from '@thi.ng/rstream/stream-merge';

import { fromOrientation } from '@pngu/core/rstream/from-orientation';
import { dragCamera,
  // moveCamera,
  orientCamera, zoomCamera
} from '@pngu/gl/camera-ui';

import { AppContext } from "./api";
import { ev } from "./events";
import { App } from './scenes/wire';
import { canvas, controls } from './components/wire';

export const wire = ({ ui, views, bus }: AppContext) => {
  let sub: ISubscribable<any>;

  const app = new App();

  const canvas_ = canvas(app, {
    init(el) {
      const gestures = gestureStream(el, { absZoom: false });

      const opts = { width: el.width, height: el.height };
      // const sub1 = gestures.transform(moveCamera(app.camera, opts));
      const sub1 = gestures.transform(dragCamera(app.camera, opts));
      const sub2 = fromOrientation(1e-2).transform(orientCamera(app.camera));
      const sub3 = gestures.transform(zoomCamera(app.camera));

      sub = merge({ src: [sub1, sub2, sub3] }).subscribe({
        next({ up, position }) {
          bus.dispatch([ev.SET_PARAM, ['cameraUp', up]]);
          bus.dispatch([ev.SET_PARAM, ['cameraPos', position]]);
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
    slider: ui.cslider,
    checkbox: ui.checkbox,
    multislider3: ui.multiSlider3,
    multislider4: ui.multiSlider4
  }, (name, value) => bus.dispatch([ev.SET_PARAM, [name, value]]));

  const fmt = float(2);

  return () => {
    const params = views.params.deref();
    const orient = views.orientation.deref();
    return ['div', ui.root,
      [canvas_, ui.ca, params],
      [controls_, params],
      ['div', ui.orient, `${fmt(orient[0])}, ${fmt(orient[1])}, ${fmt(orient[2])}`],
    ];
  };
}