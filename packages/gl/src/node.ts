import { Vec3, Vec4, set, copy, W4, ONE3 } from '@thi.ng/vectors';
import {
  Mat,
  normal44,
  identity44,
  identity33,
  mulM,
  set44
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

export class Node {
  protected _position: Vec3 = new Vec3();
  protected _rotation: Vec4 = new Vec4(copy(W4));
  protected _scale: Vec3 = new Vec3(copy(ONE3));

  protected _model: Mat = [];
  protected _modelDirty: boolean = true;

  modelView: Mat = [];
  normal: Mat = [];
  parent: Node;
  children: Array<Node> = [];

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
  }

  add(node: Node) {
    node.parent = this;
    this.children.push(node);
  }
}