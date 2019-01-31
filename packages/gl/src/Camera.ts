import { Vec3, set, dist } from '@thi.ng/vectors';
import { Mat, identity44, lookAt, perspective, ortho } from '@thi.ng/matrices';

import { Node } from './node';

export class Camera extends Node {
  protected _width: number;
  protected _height: number;
  protected _view: Mat = identity44([]);
  protected _projection: Mat = identity44([]);

  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
  }

  set width(val: number) { this._width = val; }
  get width(): number { return this._width; }
  set height(val: number) { this._height = val; }
  get height(): number { return this._height; }
  get projection(): Mat { return this._projection; }
  get view(): Mat { return this._view; }
}

export class PerspectiveCamera extends Camera {
  private _fov: number = 30;
  private _near: number = 0.01;
  private _far: number = 1000;
  private _projectionCached: boolean = false;
  private _target: Vec3 = new Vec3();
  private _up: Vec3 = new Vec3([0, 1, 0]);
  private _viewCached: boolean = false;

  set width(val: number) { this._width = val; this._projectionCached = false; }
  get width(): number { return this._width; }
  set height(val: number) { this._height = val; this._projectionCached = false; }
  get height(): number { return this._height; }
  set fov(val: number) { this._fov = val; this._projectionCached = false; }
  get fov(): number { return this._fov; }
  get aspect(): number { return this.width / this.height; }
  set near(val: number) { this._near = val; this._projectionCached = false; }
  get near(): number { return this._near; }
  set far(val: number) { this._far = val; this._projectionCached = false; }
  get far(): number { return this._far; }
  set position(val: Vec3) { set(this._position, val); this._viewCached = false; }
  get position(): Vec3 { return this._position; }
  set target(val: Vec3) { set(this._target, val); this._viewCached = false; }
  get target(): Vec3 { return this._target; }
  set up(val: Vec3) { set(this._up, val); this._viewCached = false; }
  get up(): Vec3 { return this._up; }

  get pivotDistance(): number { return dist(this.target, this.position); }

  get projection(): Mat {
    if (!this._projectionCached) {
      perspective(this._projection, this.fov, this.aspect, this.near, this.far);
      this._projectionCached = true;
    }
    return this._projection;
  }

  get view(): Mat {
    if (!this._viewCached) {
      lookAt(this._view, this.position.buf, this.target.buf, this.up.buf);
      this._viewCached = true;
    }
    return this._view;
  }
}

export class OrthoCamera extends Camera {
  left: number = -1 ;
  right: number = 1;
  top: number = 1;
  bottom: number = -1;
  near: number = 0.0;
  far: number = 1000;

  private _projectionCached: boolean = false;

  get projection() {
    if (!this._projectionCached) {
      ortho(this._projection, this.left, this.right, this.bottom, this.top, this.near, this.far);
      this._projectionCached = true;
    }
    return this._projection;
  }
}