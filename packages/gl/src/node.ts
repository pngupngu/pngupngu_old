import { Vec3, Vec4, set, copy, W4, ONE3 } from '@thi.ng/vectors';
import {
  Mat,
  normal44,
  identity44,
  identity33,
  mulM,
  set44,
  // set33
} from '@thi.ng/matrices';

function fromRotationTranslationScale(out: Mat, q: Vec4, v: Vec3, s: Vec3) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  let sx = s[0];
  let sy = s[1];
  let sz = s[2];

  set44(out, [
    (1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
    (xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0,
    (xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0,
    v[0], v[1], v[2], 1
  ]);
}

// function normalFromMat4(out: Mat, a: Mat) {
//   let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
//   let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
//   let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
//   let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

//   let b00 = a00 * a11 - a01 * a10;
//   let b01 = a00 * a12 - a02 * a10;
//   let b02 = a00 * a13 - a03 * a10;
//   let b03 = a01 * a12 - a02 * a11;
//   let b04 = a01 * a13 - a03 * a11;
//   let b05 = a02 * a13 - a03 * a12;
//   let b06 = a20 * a31 - a21 * a30;
//   let b07 = a20 * a32 - a22 * a30;
//   let b08 = a20 * a33 - a23 * a30;
//   let b09 = a21 * a32 - a22 * a31;
//   let b10 = a21 * a33 - a23 * a31;
//   let b11 = a22 * a33 - a23 * a32;

//   // Calculate the determinant
//   let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

//   if (!det) {
//     return null;
//   }
//   det = 1.0 / det;

//   set33(out, [
//     (a11 * b11 - a12 * b10 + a13 * b09) * det,
//     (a12 * b08 - a10 * b11 - a13 * b07) * det,
//     (a10 * b10 - a11 * b08 + a13 * b06) * det,

//     (a02 * b10 - a01 * b11 - a03 * b09) * det,
//     (a00 * b11 - a02 * b08 + a03 * b07) * det,
//     (a01 * b08 - a00 * b10 - a03 * b06) * det,

//     (a31 * b05 - a32 * b04 + a33 * b03) * det,
//     (a32 * b02 - a30 * b05 - a33 * b01) * det,
//     (a30 * b04 - a31 * b02 + a33 * b00) * det
//   ]);

//   return out;
// }

export class Node {
  protected _position: Vec3 = new Vec3();
  protected _rotation: Vec4 = new Vec4(copy(W4));
  protected _scale: Vec3 = new Vec3(copy(ONE3));

  protected _model: Mat = [];
  protected _modelDirty: boolean = true;

  modelView: Mat = [];
  normal: Mat = [];
  parent: Node;
  children: Node[] = [];

  constructor() {
    identity44(this.modelView);
    identity33(this.normal);
    identity44(this._model);
  }

  set position(val: Vec3) { set(this._position, val); this._modelDirty = true; }
  get position(): Vec3 { return this._position; }
  set rotation(val: Vec4) { this._rotation = val; this._modelDirty = true; }
  get rotation(): Vec4 { return this._rotation; }
  set scale(val: Vec3) { set(this._scale, val); this._modelDirty = true; }
  get scale(): Vec3 { return this._scale; }

  get model() {
    if (this._modelDirty) {
      fromRotationTranslationScale(this._model, this.rotation, this.position, this.scale);
      this._modelDirty = false;
    }
    return this._model;
  }

  updateMatrices(view: Mat) {
    mulM(this.modelView, view, this.model);
    normal44(this.normal, this.modelView);
    // normalFromMat4(this.normal, this.modelView);
  }

  add(node: Node) {
    node.parent = this;
    this.children.push(node);
  }
}