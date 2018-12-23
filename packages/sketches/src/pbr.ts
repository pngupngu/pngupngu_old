import { gestureStream } from "@thi.ng/rstream-gestures";
import { ISubscribable } from "@thi.ng/rstream/api";
import { merge } from '@thi.ng/rstream/stream-merge';

import { fromOrientation } from '@pngu/core/rstream/from-orientation';
import {
  dragCamera,
  // moveCamera,
  orientCamera, zoomCamera
} from '@pngu/gl/camera-ui';
import { canvas } from '@pngu/gl/canvas';


import { AppContext } from "./api";
import { ev } from "./events";
import { App } from './scenes/pbr';
import { controls } from './components/pbr';

export const pbr = ({ ui, views, bus }: AppContext) => {
  let sub: ISubscribable<any>;
  const app = new App();
  const canvas_ = canvas(app, {
    init(el) {
      const gestures = gestureStream(el, { absZoom: false });
      const opts = { width: el.width, height: el.height };

      sub = merge({
        src: [
          gestures.transform(dragCamera(app.camera, opts)),
          // gestures.transform(moveCamera(app.camera, opts)),
          fromOrientation(1e-2).transform(orientCamera(app.camera)),
          gestures.transform(zoomCamera(app.camera))
        ]
      }).subscribe({
        next({ up, position }) {
          bus.dispatch([ev.SET_PARAM, ['pbr', 'cameraUp', up]]);
          bus.dispatch([ev.SET_PARAM, ['pbr', 'cameraPos', position]]);
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
    select: ui.select,
    checkbox: ui.checkbox,
    multislider3: ui.multiSlider3,
    multislider4: ui.multiSlider4
  }, (name, value) => bus.dispatch([ev.SET_PARAM, ['pbr', name, value]]));

  return () => {
    const params = views.params.deref().pbr;
    return ['div', ui.root,
      [canvas_, ui.ca, params],
      [controls_, params],
    ];
  };
};