import { gestureStream } from "@thi.ng/rstream-gestures";
import { ISubscribable, merge } from "@thi.ng/rstream";

import { fromOrientation } from '@pngu/core/rstream/from-orientation';
import { moveCamera, zoomCamera , orientCamera } from '@pngu/gl/camera-ui';
import { canvas } from '@pngu/gl/canvas';
import { App } from '@pngu/scenes/wire';

import { Context, ev } from "../api";
import { controls } from './wire-controls';

export default ({ ui, views, bus }: Context) => {
  let sub: ISubscribable<any>;

  const app = new App();

  const setParam = (name, value) => bus.dispatch([ev.SET_PARAM, ['wire', name, value]]);

  const canvas_ = canvas(app, {
    init(el) {
      const gestures = gestureStream(el, { absZoom: false });
      const opts = { width: el.width, height: el.height };

      sub = merge({
        src: [
          fromOrientation().transform(orientCamera(app.camera)),
          gestures.transform(moveCamera(app.camera, opts)),
          gestures.transform(zoomCamera(app.camera))
        ]
      }).subscribe({
        next({ up, position }) {
          setParam('cameraUp', up);
          setParam('cameraPos', position);
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
  }, setParam);

  return () => {
    const params = views.params.deref().wire;
    return ['div', ui.root,
      [canvas_, ui.ca, params],
      [controls_, params],
    ];
  };
}