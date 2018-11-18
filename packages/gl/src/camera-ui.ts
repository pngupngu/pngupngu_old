import { gestureStream, GestureType, GestureInfo } from "@thi.ng/rstream-gestures";
import { ISubscribable } from "@thi.ng/rstream/api";
import { quat } from 'gl-matrix';
import { Vec2 } from '@thi.ng/vectors/vec2';
import { Vec3, setS3 } from '@thi.ng/vectors/vec3';

import { PerspectiveCamera } from './Camera';

function transformQuat(out: Vec3, a: Vec3, q: quat) {
  let qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  let x = a[0], y = a[1], z = a[2];
  let uvx = qy * z - qz * y,
    uvy = qz * x - qx * z,
    uvz = qx * y - qy * x;
  let uuvx = qy * uvz - qz * uvy,
    uuvy = qz * uvx - qx * uvz,
    uuvz = qx * uvy - qy * uvx;
  let w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;

  setS3(out.buf, x + uvx + uuvx, y + uvy + uuvy, z + uvz + uuvz);
}

export class CameraUI {
  sub: ISubscribable<any>;
  speed: number = 5;
  camera: PerspectiveCamera;

  private radius: number;
  private center: Vec2 = new Vec2();
  private up: Vec3 = new Vec3();
  private viewDir: Vec3 = new Vec3();
  private clickPos: Vec3;

  private q: quat = quat.create();
  private vd: Vec3 = new Vec3();
  private u: Vec3 = new Vec3();

  constructor(el: HTMLCanvasElement, camera: PerspectiveCamera) {
    this.center.setS(el.width, el.height).mulN(0.5);
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
    this.up = this.camera.up.copy();
    this.viewDir = this.camera.position.copy().sub(this.camera.target);
  }

  private handleDrag({ pos, delta }: GestureInfo) {
    const curPos = this.spherePos(delta[0] + pos[0], delta[1] + pos[1]);

    const side = this.up.copy().cross(this.viewDir).normalize().mulN(curPos[0] - this.clickPos[0]);
    const axis = this.up.copy().mulN(curPos[1] - this.clickPos[1]).add(side).cross(this.viewDir).normalize();
    const angle = new Vec3([curPos[0] - this.clickPos[0], curPos[1] - this.clickPos[1], 0]).magSq();

    quat.setAxisAngle(this.q, axis, angle * this.speed);
    transformQuat(this.vd, this.viewDir, this.q);
    transformQuat(this.u, this.up, this.q);

    this.camera.up = this.u;
    this.camera.position = this.camera.target.addNew(this.vd);
  }

  spherePos(x: number, y: number): Vec3 {
    const vx = (x - this.center[0]) / this.radius;
    const vy = -(y - this.center[1]) / this.radius;
    const v = new Vec3([vx, vy, 0]);
    const mag = v.magSq()
    if (mag > 1.0) {
      return v.normalize();
    } else {
      return v.setS(vx, vy, Math.sqrt(1.0 - mag));
    }
  }

  release() {
    this.sub.unsubscribe();
  }
}