import { float } from '@thi.ng/strings/float';
import { gestureStream, GestureType, GestureEvent } from "@thi.ng/rstream-gestures";
import { Vec2 } from '@thi.ng/vectors/vec2';
import { Vec3, setS3 } from '@thi.ng/vectors/vec3';
import { ISubscribable } from "@thi.ng/rstream/api";
import { merge } from '@thi.ng/rstream/stream-merge';
import { filter } from '@thi.ng/transducers/xform/filter';
import { map } from '@thi.ng/transducers/xform/map';
import { Mat44 } from '@thi.ng/vectors/mat44';
import { DEG2RAD } from '@thi.ng/math/api';
import { quat } from 'gl-matrix';

import { fromOrientation } from '@pngu/core/rstream/from-orientation';
import { PerspectiveCamera } from '@pngu/gl/camera';

import { AppContext } from "./api";
import { ev } from "./events";
import { App } from './scenes/wire';
import { canvas, controls } from './components/wire';

const spherePos = (v: Vec3, pos: number[], center: Vec2, radius: number): Vec3 => {
  v.setS(pos[0] - center[0], -(pos[1] - center[1]), 0).divN(radius);
  const mag = v.magSq()
  return mag > 1.0 ? v.normalize() : v.setS(v[0], v[1], Math.sqrt(1.0 - mag));
}

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
  return out;
}

interface SphereGestureInfo {
  pos: Vec3;
  click: Vec3;
  delta: Vec3;
  zoom: number;
}

interface SphereGestureEvent {
  [0]: GestureType;
  [1]: SphereGestureInfo
}

const toSpherePos = (width: number, height: number) => {
  const radius = Math.max(width, height);
  const center = new Vec2([width, height]).mulN(0.5);
  const pos = new Vec3();
  const click = new Vec3();
  const delta = new Vec3();

  return ({ 0: type, 1: info }: GestureEvent) => {
    const body = {
      pos: info.pos && spherePos(pos, info.pos, center, radius),
      click: info.click && spherePos(click, info.click, center, radius),
      delta: info.delta && spherePos(delta, [info.delta[0] + info.pos[0], info.delta[1] + info.pos[1]], center, radius).sub(click),
      zoom: info.zoom
    };
    return <SphereGestureEvent>[type, body];
  }
};

const toRotation = (camera: PerspectiveCamera) => {
  const axis = new Vec3();
  const side = new Vec3();
  const up = new Vec3();
  const viewDir = new Vec3();
  const q = quat.create();
  const u = new Vec3();
  const vd = new Vec3();

  return ({ 0: type, 1: { delta } }) => {
    if (type == GestureType.START) {
      up.set(camera.up);
      viewDir.set(camera.position).sub(camera.target);
      return [up, camera.position];
    } else if (type == GestureType.DRAG) {
      side.set(up).cross(viewDir).normalize().mulN(delta[0]);
      axis.set(up).mulN(delta[1]).add(side).cross(viewDir).normalize();
      quat.setAxisAngle(q, axis, delta.magSq() * 3);

      transformQuat(vd, viewDir, q);
      transformQuat(u, up, q);
      return [u, camera.target.addNew(vd)];
    }
  };
}

const toCameraRot = (camera: PerspectiveCamera) => {
  const up0 = new Vec3();
  const vd = new Vec3();
  const pos = new Vec3();
  const mat = Mat44.identity();
  const rot = Mat44.rotationX(-90 * DEG2RAD);

  return (e: DeviceOrientationEvent) => {
    mat44FromEulerYXZ(mat, e.beta, e.alpha, -e.gamma).mul(rot);

    const cameraPos = pos.set(camera.target)
      .add(mat.mulV3(vd.set(Vec3.Z_AXIS)).mulN(camera.pivotDistance));
    const cameraUp = mat.mulV3(up0.set(Vec3.Y_AXIS));
    return [cameraUp, cameraPos];
  }
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

export const wire = ({ ui, views, bus }: AppContext) => {
  let sub: ISubscribable<any>;

  const app = new App();

  const canvas_ = canvas(app, {
    init(el) {
      const sub1 = gestureStream(el)
        .transform(
          filter(g => g[0] == GestureType.START || g[0] == GestureType.DRAG),
          map(toSpherePos(el.width, el.height)),
          map(toRotation(app.camera)));

      const sub2 = fromOrientation(1e-2).transform(map(toCameraRot(app.camera)));

      sub = merge({ src: [sub1, sub2] }).subscribe({
        next({ 0: up, 1: pos }) {
          bus.dispatch([ev.SET_PARAM, ['cameraUp', up]]);
          bus.dispatch([ev.SET_PARAM, ['cameraPos', pos]]);
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