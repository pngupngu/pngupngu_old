// // import createTorusMesh from 'primitive-torus';
// import { Vec3, Vec, subN } from '@thi.ng/vectors';
// import { repeat, mapcat, flatten, transduce, comp, map, push } from '@thi.ng/transducers';
// import { AABB, tessellate } from '@thi.ng/geom';

// import { Application } from '@pngu/gl/application';
// import { Scene } from '@pngu/gl/scene';
// import { Mesh } from '@pngu/gl/mesh';
// import { Material } from '@pngu/gl/material';
// import { Command } from '@pngu/gl/command';
// import { tessellate3, Geometry, asPolygon3 } from '@pngu/gl/geometry';
// import { PerspectiveCamera } from '@pngu/gl/Camera';
// import { Texture } from '@pngu/gl/texture';

// import vert from './shaders/pbr/vert.glsl';
// import frag from './shaders/pbr/frag.glsl';
// import brickDiffuse from './assets/images/brick-diffuse.jpg';
// import brickNormal from './assets/images/brick-normal.jpg';
// import brickSpecular from './assets/images/brick-specular.jpg';

// export enum DistTypes { BlinnPhong, GGX, Beckmann }
// export enum GeometryTypes { Implicit, Schlick, GGX, CookTorrance }
// export enum DiffuseTypes { Default, Disney, NormalizedDisney, OrenNayar }

// export interface Params {
//   f0: Vec3;
//   albedo: Vec3;
//   lightPos: Vec3;
//   metalic: number;
//   roughness: number;
//   ambColor: Vec3;
//   lightColor: Vec3;
//   useTexNormal: boolean;
//   useTexDiff: boolean;
//   useGamma: boolean;
//   distributionType: DistTypes;
//   geometryType: GeometryTypes;
//   diffuseType: DiffuseTypes;
//   showNormal: boolean;
//   cameraUp: Vec3;
//   cameraPos: Vec3;
// }

// export const defaultParams: Params = {
//   lightPos: new Vec3([1, 1, 2]),
//   f0: new Vec3([0.04, 0.04, 0.04]),
//   albedo: new Vec3([0.9, 0.9, 0.9]),
//   metalic: 0.0,
//   roughness: 0.3,
//   ambColor: new Vec3([0.03, 0.03, 0.03]),
//   lightColor: new Vec3([1, 1, 1]),
//   useTexNormal: false,
//   useTexDiff: true,
//   useGamma: true,
//   distributionType: DistTypes.BlinnPhong,
//   geometryType: GeometryTypes.Implicit,
//   diffuseType: DiffuseTypes.Default,
//   showNormal: false,
//   cameraUp: new Vec3([0, 1, 0]),
//   cameraPos: new Vec3([1, 4, 8]),
// }

// export class App extends Application<Params> {
//   mat: Material;
//   cmd: Command;
//   camera: PerspectiveCamera;

//   set params(params: Params) {
//     const uniforms = this.mat.uniforms;

//     uniforms.albedo = params.albedo;
//     uniforms.f0 = params.f0;
//     uniforms.lightPos = params.lightPos;
//     uniforms.metalic = params.metalic;
//     uniforms.roughness = params.roughness;
//     uniforms.ambColor = params.ambColor;
//     uniforms.lightColor = params.lightColor;
//     uniforms.useTexNormal = params.useTexNormal;
//     uniforms.useTexDiff = params.useTexDiff;
//     uniforms.useGamma = params.useGamma;
//     uniforms.distributionType = params.distributionType;
//     uniforms.geometryType = params.geometryType;
//     uniforms.diffuseType = params.diffuseType;
//     uniforms.showNormal = params.showNormal;
//     this.camera.up = params.cameraUp;
//     this.camera.position = params.cameraPos;
//   }

//   init(gl) {
//     super.init(gl);

//     this.camera = new PerspectiveCamera(gl.canvas.clientWidth, gl.canvas.clientHeight);
//     this.camera.position = defaultParams.cameraPos;

//     // const attribs = createTorusMesh();
//     // const geom = new Geometry({
//     //   position: [...flatten(attribs.positions)],
//     //   indices: [...flatten(attribs.cells)],
//     //   texcoord: [...flatten(attribs.uvs)],
//     //   normal: [...flatten(attribs.normals)]
//     // });q

//     // const faces = new AABB().toPolygon().tessellate(tessellate3);

//     const faceNormals = [
//       [+1, 0, 0],
//       [-1, 0, 0],
//       [0, +1, 0],
//       [0, -1, 0],
//       [0, 0, +1],
//       [0, 0, -1],
//     ];

//     const polygon = asPolygon3(new AABB());
//     const faces = tessellate(polygon, [tessellate3]);

//     const points = transduce(
//       comp(mapcat((f: Vec[]) => f), map(v => subN([], v, 0.5) )),
//       push(),
//       faces);

//     const position = Vec3.intoBuffer(new Float32Array(polygon.faces.length * 3 * 3), <Vec3[]>points);

//     const geom = new Geometry({
//       position,
//       texcoord: [...flatten(repeat([[1, 0], [0, 0], [0, 1], [1, 0], [0, 1], [1, 1]], 6))],
//       normal: [...flatten(mapcat(n => repeat(n, 6), faceNormals))]
//     });

//     this.mat = new Material(vert, frag);

//     new Texture(gl, { src: brickDiffuse }, tex => { this.mat.uniforms.texDiffuse = tex.texture; });
//     new Texture(gl, { src: brickNormal }, tex => { this.mat.uniforms.texNormal = tex.texture; });
//     new Texture(gl, { src: brickSpecular }, tex => { this.mat.uniforms.texSpecular = tex.texture; });

//     const scene = new Scene();
//     scene.add(new Mesh(geom, this.mat));

//     this.cmd = new Command(gl, scene);
//   }

//   render(time) {
//     const gl = this.gl;
//     gl.enable(gl.DEPTH_TEST);
//     gl.enable(gl.CULL_FACE);
//     gl.clearColor(0, 0, 0, 0);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     this.cmd.draw(time, this.camera);
//   }
// }