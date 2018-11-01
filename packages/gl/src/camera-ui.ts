import { gestureStream, GestureType, GestureInfo } from "@thi.ng/rstream-gestures";
import { ISubscribable } from "@thi.ng/rstream/api";
import { quat, vec2, vec3 } from 'gl-matrix';

import { Camera } from './Camera';

export class CameraUI {
  sub: ISubscribable<any>;
  speed: number = 5;
  camera: Camera;

  private radius: number;
  private center: vec2;
  private up: vec3 = vec3.create();
  private viewDir: vec3 = vec3.create();
  private clickPos: vec3;

  private side: vec3 = vec3.create();
  private upScaled: vec3 = vec3.create();
  private move: vec3 = vec3.create();
  private axis: vec3 = vec3.create();
  private q: quat = quat.create();
  private vd: vec3 = vec3.create();
  private u: vec3 = vec3.create();
  private pos: vec3 = vec3.create();

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

    vec3.cross(this.side, this.up, this.viewDir);
    vec3.normalize(this.side, this.side);
    vec3.scale(this.side, this.side, curPos[0] - this.clickPos[0]);

    vec3.scale(this.upScaled, this.up, curPos[1] - this.clickPos[1]);

    vec3.add(this.move, this.upScaled, this.side);
    vec3.cross(this.axis, this.move, this.viewDir);
    vec3.normalize(this.axis, this.axis);

    let angle = vec3.squaredLength(
      vec3.fromValues(curPos[0] - this.clickPos[0], curPos[1] - this.clickPos[1], 0));
    quat.setAxisAngle(this.q, this.axis, angle * this.speed);
    vec3.transformQuat(this.vd, this.viewDir, this.q);
    vec3.transformQuat(this.u, this.up, this.q);
    vec3.add(this.pos, this.camera.target, this.vd);

    this.camera.up = this.u;
    this.camera.position = this.pos;
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