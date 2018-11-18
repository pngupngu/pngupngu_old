import { gestureStream, GestureType, GestureInfo } from "@thi.ng/rstream-gestures";
import { ISubscribable } from "@thi.ng/rstream/api";
import { Vec2 } from '@thi.ng/vectors/vec2';
import { Vec3, setS3 } from '@thi.ng/vectors/vec3';
import { quat } from 'gl-matrix';

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
  private clickPos: Vec3 = new Vec3();
  private delta: Vec3 = new Vec3();

  private side: Vec3 = new Vec3();
  private axis: Vec3 = new Vec3();
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
    this.spherePos(this.clickPos, pos[0], pos[1]);
    this.up.set(this.camera.up);
    this.viewDir.set(this.camera.position).sub(this.camera.target);
  }

  private handleDrag({ pos, delta }: GestureInfo) {
    const d = this.spherePos(this.delta, delta[0] + pos[0], delta[1] + pos[1]).sub(this.clickPos);

    this.side.set(this.up).cross(this.viewDir).normalize().mulN(d[0]);
    this.axis.set(this.up).mulN(d[1]).add(this.side).cross(this.viewDir).normalize();

    quat.setAxisAngle(this.q, this.axis, d.magSq() * this.speed);
    transformQuat(this.vd, this.viewDir, this.q);
    transformQuat(this.u, this.up, this.q);

    this.camera.up = this.u;
    this.camera.position = this.camera.target.addNew(this.vd);
  }

  spherePos(v: Vec3, x: number, y: number): Vec3 {
    v.setS((x - this.center[0]), -(y - this.center[1]), 0).divN(this.radius);
    const mag = v.magSq()
    return mag > 1.0 ? v.normalize() : v.setS(v[0], v[1], Math.sqrt(1.0 - mag));
  }

  release() {
    this.sub.unsubscribe();
  }
}