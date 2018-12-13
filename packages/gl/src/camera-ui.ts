import { GestureEvent, GestureType } from "@thi.ng/rstream-gestures";
import { Vec2 } from '@thi.ng/vectors/vec2';
import { Vec3, setS3 } from '@thi.ng/vectors/vec3';
import { Mat44 } from '@thi.ng/vectors/mat44';
import { DEG2RAD } from '@thi.ng/math/api';
import { map } from '@thi.ng/transducers/xform/map';
import { comp } from '@thi.ng/transducers/func/comp';
import { filter } from '@thi.ng/transducers/xform/filter';
import { quat } from 'gl-matrix';

import { PerspectiveCamera } from './Camera';

function transformQuat(a: Vec3, q: quat) {
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

  return setS3(a.buf, x + uvx + uuvx, y + uvy + uuvy, z + uvz + uuvz);
}

function mat44FromEulerYXZ(mat: Mat44, alpha: number, beta: number, gamma: number) {
  let x = alpha * DEG2RAD, y = beta * DEG2RAD, z = gamma * DEG2RAD;
  let a = Math.cos(x), b = Math.sin(x);
  let c = Math.cos(y), d = Math.sin(y);
  let e = Math.cos(z), f = Math.sin(z);
  let ce = c * e, cf = c * f, de = d * e, df = d * f;

  mat[0] = ce + df * b;
  mat[4] = de * b - cf;
  mat[8] = a * d;

  mat[1] = a * f;
  mat[5] = a * e;
  mat[9] = - b;

  mat[2] = cf * b - de;
  mat[6] = df + ce * b;
  mat[10] = a * c;

  return mat;
}

const spherePos = (v: Vec3, pos: number[], center: Vec2, radius: number): Vec3 => {
  v.setS(pos[0] - center[0], -(pos[1] - center[1]), 0).divN(radius);
  const mag = v.magSq()
  return mag > 1.0 ? v.normalize() : v.setS(v[0], v[1], Math.sqrt(1.0 - mag));
}

export interface CameraUIOpts {
  width: number;
  height: number;
  speed?: number;
}

export const dragCamera = (camera: PerspectiveCamera, { width, height, speed = 5}: CameraUIOpts) => {
  const radius = Math.max(width, height);
  const center = new Vec2([width, height]).mulN(0.5);
  const click = new Vec3();
  const delta = new Vec3();

  const axis = new Vec3();
  const side = new Vec3();
  const up = new Vec3();
  const viewDir = new Vec3();
  const q = quat.create();
  const u = new Vec3();
  const vd = new Vec3();

  return comp(
    filter(g => g[0] == GestureType.START || g[0] == GestureType.DRAG),
    map(({ 0: type, 1: { pos } }: GestureEvent) => {
      if (type == GestureType.START) {
        spherePos(click, pos, center, radius);
        up.set(camera.up);
        viewDir.set(camera.position).sub(camera.target);
        return [up, camera.position];
      } else {
        spherePos(delta, pos, center, radius).sub(click);
        side.set(up).cross(viewDir).normalize().mulN(delta[0]);
        axis.set(up).mulN(delta[1]).add(side).cross(viewDir).normalize();
        quat.setAxisAngle(q, axis, delta.magSq() * speed);

        transformQuat(vd.set(viewDir), q);
        transformQuat(u.set(up), q);
        return [u, camera.target.addNew(vd)];
      }
    })
  );
}

export const moveCamera = (camera: PerspectiveCamera, { width, height, speed = 5 }: CameraUIOpts) => {
  const radius = Math.max(width, height);
  const center = new Vec2([width, height]).mulN(0.5);
  const delta = new Vec3();

  const axis = new Vec3();
  const side = new Vec3();
  const up = camera.up.copy();
  const viewDir = camera.position.copy().sub(camera.target);
  const q = quat.create();
  const u = new Vec3();
  const vd = new Vec3();

  return comp(
    filter(g => g[0] == GestureType.MOVE),
    map(({ 1: { pos } }: GestureEvent) => {
      spherePos(delta, pos, center, radius).sub(Vec3.Z_AXIS);
      side.set(up).cross(viewDir).normalize().mulN(delta[0]);
      axis.set(up).mulN(delta[1]).add(side).cross(viewDir).normalize();
      quat.setAxisAngle(q, axis, delta.magSq() * speed);

      transformQuat(vd.set(viewDir), q);
      transformQuat(u.set(up), q);
      return [u, camera.target.addNew(vd)];
    })
  );
}

export const orientCamera = (camera: PerspectiveCamera) => {
  const up0 = new Vec3();
  const vd = new Vec3();
  const pos = new Vec3();
  const mat = Mat44.identity();
  const rot = Mat44.rotationX(-90 * DEG2RAD);

  return map((e: DeviceOrientationEvent) => {
    mat44FromEulerYXZ(mat, e.beta, e.alpha, -e.gamma).mul(rot);

    const cameraPos = pos.set(camera.target)
      .add(mat.mulV3(vd.set(Vec3.Z_AXIS)).mulN(camera.pivotDistance));
    const cameraUp = mat.mulV3(up0.set(Vec3.Y_AXIS));
    return [cameraUp, cameraPos];
  });
}

export const zoomCamera = (camera: PerspectiveCamera) => {
  const vd = new Vec3();
  const pos = new Vec3();

  return comp(
    filter(g => g[0] == GestureType.ZOOM),
    map(({ 1: { zoom } }: GestureEvent) => {
      vd.set(camera.target).sub(camera.position);
      const speed = Math.pow(Math.E, 0.01 * zoom) * vd.mag();
      pos.set(camera.target).sub(vd.normalize().mulN(speed));
      return [camera.up, pos];
    }));
}