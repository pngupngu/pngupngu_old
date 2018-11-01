import { gestureStream, GestureType, GestureInfo } from "@thi.ng/rstream-gestures";
import { ISubscribable } from "@thi.ng/rstream/api";
import { quat, vec2, vec3 } from 'gl-matrix';

import { getContext } from '@pngu/gl';
import { Camera } from '@pngu/gl/camera';
import { canvas } from '@pngu/ui/canvas-webgl';

import { AppContext } from "./api";
import { ev } from "./events";
import { App } from './scene';

class CameraUI {
  sub: ISubscribable<any>;
  speed: number = 5;
  camera: Camera;

  private radius: number;
  private center: vec2;
  private up: vec3 = vec3.create();
  private viewDir: vec3 = vec3.create();
  private clickPos: vec3;

  constructor(el: HTMLCanvasElement, camera: Camera) {
    this.center = vec2.fromValues(el.width, el.height);
    vec2.scale(this.center, this.center, 0.5)
    this.radius = Math.max(el.width, el.height);
    this.camera = camera;

    const $this = this;

    this.sub = gestureStream(el).subscribe({
      next({ 0: type, 1: info }) {
        if (type == GestureType.START) {
          $this.handleStart(info);
        } else if (type == GestureType.DRAG) {
          $this.handleDrag(info);
        }
      }
    });
  }

  private handleStart({ pos }: GestureInfo) {
    this.clickPos = this.spherePos(pos[0], pos[1]);
    vec3.copy(this.up, this.camera.up);
    vec3.sub(this.viewDir, this.camera.position, this.camera.target);
  }

  private handleDrag({ pos, delta }: GestureInfo) {
    const curPos = this.spherePos(delta[0] + pos[0], delta[1] + pos[1]);

    let side = vec3.cross(vec3.create(), this.up, this.viewDir);
    vec3.normalize(side, side);
    let upScaled = vec3.scale(vec3.create(), this.up, curPos[1] - this.clickPos[1]);
    let sideScaled = vec3.scale(vec3.create(), side, curPos[0] - this.clickPos[0]);
    let move = vec3.add(vec3.create(), upScaled, sideScaled);
    let axis = vec3.cross(vec3.create(), move, this.viewDir);
    vec3.normalize(axis, axis);
    let angle = vec3.squaredLength(
      vec3.fromValues(curPos[0] - this.clickPos[0], curPos[1] - this.clickPos[1], 0));
    let q = quat.setAxisAngle(quat.create(), axis, angle * this.speed);
    let vd = vec3.transformQuat(vec3.create(), this.viewDir, q);
    let u = vec3.transformQuat(vec3.create(), this.up, q);
    let position = vec3.add(vec3.create(), this.camera.target, vd);

    this.camera.up = u;
    this.camera.position = position;
  }

  spherePos(x: number, y: number): vec3 {
    const vx = (x - this.center[0]) / this.radius;
    const vy = -(y - this.center[1]) / this.radius;
    const v = vec3.fromValues(vx, vy, 0);
    const mag = vec3.squaredLength(v);
    if (mag > 1.0) {
      return vec3.normalize(v, v);
    } else {
      return vec3.set(v, vx, vy, Math.sqrt(1.0 - mag));
    }
  }

  release() {
    this.sub.unsubscribe();
  }
}

const makeCanvas = app => {
  let camUI: CameraUI;
  return canvas({
    init(el: HTMLCanvasElement, gl: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, true]);
      app.init(gl);

      camUI = new CameraUI(el, app.camera);
    },
    update(_: HTMLCanvasElement, __: WebGLRenderbuffer, ___: AppContext, time: number, ____: number) {
      app.render(time);
    },
    release(_: HTMLCanvasElement, __: WebGLRenderingContext, { bus }: AppContext) {
      bus.dispatch([ev.SET_RAF, false]);
      camUI.release();
    }
  }, getContext());
};

export const cube = ({ ui }: AppContext) => {
  const app = new App();
  const canvas_ = makeCanvas(app);
  return () =>
    ['div', ui.root,
      [canvas_, ui.ca]];
};