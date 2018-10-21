import { Cube } from '../../gl/geom';
import { Scene, Mesh, Material } from '../../gl';
import vert from './vert.glsl';
import frag from './frag.glsl';

export default class extends Scene {
  constructor() {
    super();

    // this.camera = new Camera();
    // this.camera.position = [0, 0, -20];
    // this.camera.target = [0, 0, 0];
    // this.camera.up = [0, 1, 0];

    this.add(new Mesh(new Cube(4), new Material(vert, frag)));
  }
}