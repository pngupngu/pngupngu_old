import uuid from 'uuid/v4';
import { IObjectOf } from "@thi.ng/api";

type Uniforms = IObjectOf<any>;

export class Material {
  id: string = uuid();

  constructor(
    readonly vert: string,
    readonly frag: string,
    readonly uniforms: Uniforms = {}) { }
}