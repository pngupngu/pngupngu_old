import { GestureType } from "@thi.ng/rstream-gestures";
import { gestureStream } from "@thi.ng/rstream-gestures";
import { ISubscribable } from "@thi.ng/rstream/api";
import { merge } from '@thi.ng/rstream/stream-merge';
import { filter } from '@thi.ng/transducers/xform/filter';

import { App } from '@pngu/cube/scenes/wire';
import { canvas } from '@pngu/cube/components/wire';
import { fromOrientation } from '@pngu/core/rstream/from-orientation';
import { moveCamera, orientCamera, zoomCamera } from '@pngu/gl/camera-ui';

import { routeLink } from './route-link';
import { AppContext } from '../api';
import { ev } from "../events";

export const orientRoute = ({ bus, views, ui }: AppContext) => {
  let sub: ISubscribable<any>;
  const orient = fromOrientation(1e-2);

  const app = new App();
  const canvas_ = canvas(app, {
    init(el) {
      const gestures = gestureStream(el, { absZoom: false });
      const opts = { width: el.width, height: el.height };

      if (window.orientation !== undefined) {
        orient.subscribe({
          next(e) {
            bus.dispatch([ev.SET_LOCATION, [e.alpha, e.beta, e.gamma]]);
          }
        });
      }

      sub = merge({
        src: [
          gestures.transform(moveCamera(app.camera, opts)),
          orient.transform(orientCamera(app.camera)),
          gestures.transform(zoomCamera(app.camera))
        ]
      }).subscribe({
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

  return () => {
    const params = views.params.deref();
    const loc = views.location.deref();
    return ['div', ui.root,
      [canvas_, ui.ca, params],
      ['div', ui.logoBr, [routeLink, ui.link, 'home', {}, 'pngupngu']],
      window.orientation !== undefined ?
        ['div', ui.orient, `${loc[0].toFixed(2)}, ${loc[1].toFixed(2)}, ${loc[2].toFixed(2)}`] : null,
    ];
  }
}