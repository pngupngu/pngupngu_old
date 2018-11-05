import * as uuid from 'uuid/v4';
import { IObjectOf } from "@thi.ng/api/api";

type Uniforms = IObjectOf<any>;

export class Material {
  id: string = uuid();

  constructor(
    readonly vert: String,
    readonly frag: String,
    readonly uniforms: Uniforms = {}) { }
}