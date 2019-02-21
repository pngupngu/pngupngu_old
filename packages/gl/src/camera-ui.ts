import { GestureEvent, GestureType } from "@thi.ng/rstream-gestures";
import { Vec, Vec2, Vec3, set, setC3, divN, mulN, sub, add, cross3, mag, magSq, normalize } from '@thi.ng/vectors';
import { Mat, identity44, rotationX44, mul44, mulV, quatFromAxisAngle, mulVQ } from '@thi.ng/matrices';
import { DEG2RAD } from '@thi.ng/math';
import { Transducer, map, comp, filter } from '@thi.ng/transducers';

import { PerspectiveCamera } from './Camera';

function transformQuat(a: Vec, q: Vec): Vec {
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

  return setC3(a, x + uvx + uuvx, y + uvy + uuvy, z + uvz + uuvz);
}

function mat44FromEulerYXZ(mat: Mat, alpha: number, beta: number, gamma: number) {
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

const spherePos = (v: Vec3, pos: number[], center: Vec, radius: number): Vec => {
  divN(null, setC3(v, pos[0] - center[0], -(pos[1] - center[1]), 0), radius);
  const mag = magSq(v);
  return mag > 1.0 ? normalize(null, v) : setC3(v, v[0], v[1], Math.sqrt(1.0 - mag));
}

export interface CameraUIOpts {
  width: number;
  height: number;
  speed?: number;
}

export interface CameraView {
  position: Vec3;
  target: Vec3;
  up: Vec3;
}

export const dragCamera = (camera: PerspectiveCamera, { width, height, speed = 5 }: CameraUIOpts): Transducer<GestureEvent, CameraView> => {
  const radius = Math.max(width, height);
  const center = mulN(null, new Vec2([width, height]), 0.5);
  const click = new Vec3();
  const delta = new Vec3();

  const axis = new Vec3();
  const side = new Vec3();
  const up = new Vec3();
  const viewDir = new Vec3();
  let q;
  const u = new Vec3();
  const vd = new Vec3();
  const camPos = new Vec3();

  return comp(
    filter(g => g[0] == GestureType.START || g[0] == GestureType.DRAG),
    map(({ 0: type, 1: { pos } }: GestureEvent) => {
      if (type == GestureType.START) {
        spherePos(click, pos, center, radius);
        set(up, camera.up);
        sub(null, set(viewDir, camera.position), camera.target);
        return { up, position: camera.position, target: camera.target };
      } else {
        sub(null, spherePos(delta, pos, center, radius), click);
        mulN(null, normalize(null, cross3(null, set(side, up), viewDir)), delta[0]);
        normalize(null, cross3(null, add(null, mulN(null, set(axis, up), delta[1]), side), viewDir))
        q = quatFromAxisAngle(axis, magSq(delta) * speed);

        return {
          up: transformQuat(set(u, up), q),
          position: add(null, set(camPos, camera.target), transformQuat(set(vd, viewDir), q)),
          target: camera.target
        };
      }
    })
  );
}

export const moveCamera = (camera: PerspectiveCamera, opts: CameraUIOpts): Transducer<GestureEvent, CameraView> => {
  const { width, height, speed = 5 } = opts;
  const radius = Math.max(width, height);
  const center = mulN(null, new Vec2([width, height]), 0.5);
  const delta = new Vec3();

  const axis = new Vec3();
  const side = new Vec3();
  const up = camera.up.copy();
  const viewDir = normalize(null, sub([], camera.position, camera.target));
  let q: Vec;
  const u = new Vec3();
  const vd = new Vec3();
  const position = new Vec3();

  return comp(
    filter(g => g[0] == GestureType.MOVE),
    map(({ 1: { pos } }: GestureEvent) => {
      sub(null, spherePos(delta, pos, center, radius), Vec3.Z_AXIS);
      mulN(null, normalize(null, cross3(side, up, viewDir)), delta[0]);
      normalize(null,
        cross3(null,
          add(null,
            mulN(axis, up, delta[1]),
            side),
          viewDir));
      q = quatFromAxisAngle(axis, magSq(delta) * speed);

      add(position,
        camera.target,
        mulVQ(null, q,
          mulN(vd, viewDir, camera.pivotDistance))
      );

      return {
        position,
        up: mulVQ(u, q, up),
        target: camera.target
      };
    })
  );
}

export const orientCamera = (camera: PerspectiveCamera): Transducer<DeviceOrientationEvent, CameraView> => {
  const up0 = new Vec3();
  const vd = new Vec3();
  const pos = new Vec3();
  const mat = identity44([]);
  const rot = rotationX44([], -90 * DEG2RAD);

  return map((e: DeviceOrientationEvent) => {
    mul44(null, mat44FromEulerYXZ(mat, e.beta, e.alpha, -e.gamma), rot);

    return {
      up: mulV(null, mat, set(up0, Vec3.Y_AXIS)),
      position: add(pos,
        camera.target,
        mulN(null, mulV(null, mat, set(vd, Vec3.Z_AXIS)), camera.pivotDistance)),
      target: camera.target
    };
  });
}

export const zoomCamera = (camera: PerspectiveCamera): Transducer<GestureEvent, CameraView> => {
  const vd = new Vec3();
  const pos = new Vec3();

  return comp(
    filter(g => g[0] == GestureType.ZOOM),
    map(({ 1: { zoom } }: GestureEvent) => {
      sub(null, set(vd, camera.target), camera.position);
      const speed = Math.pow(Math.E, 0.01 * zoom) * mag(vd);
      mulN(null, sub(null, set(pos, camera.target), normalize(null, vd)), speed);
      return { up: camera.up, position: pos, target: camera.target };
    }));
}