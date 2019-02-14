// import { Vec3, Vec4, Vec } from '@thi.ng/vectors';
// import { AttribPool, GLType } from '@thi.ng/vector-pools';
// import { mapcat, flatten, map, transduce, repeat, assocObj, pairs } from "@thi.ng/transducers";
// import { AABB, tessellate } from '@thi.ng/geom';

// import { Application } from '@pngu/gl/application';
// import { Scene } from '@pngu/gl/scene';
// import { Mesh } from '@pngu/gl/mesh';
// import { Material } from '@pngu/gl/material';
// import { Command } from '@pngu/gl/command';
// import { tessellate3, asPolygon3 } from '@pngu/gl/geometry';
// import { PerspectiveCamera } from '@pngu/gl/camera';

// import vert from './shaders/wire/vert.glsl';
// import frag from './shaders/wire/frag.glsl';
// // import lineVert from './shaders/wire/line.vert';
// // import lineFrag from './shaders/wire/line.frag';

// export interface Params {
//   width: number;
//   feather: number;
//   removeEdge: boolean;
//   squeezeMin: number;
//   squeezeMax: number;
//   dashOffset: number;
//   dashRepeat: number;
//   dashLength: number;
//   colorEdge: Vec4;
//   colorFill: Vec4;
//   cameraUp: Vec3;
//   cameraPos: Vec3;
// }

// export const defaultParams: Params = {
//   width: 1.4,
//   feather: 0.1,
//   removeEdge: true,
//   squeezeMin: 1.0,
//   squeezeMax: 1.0,
//   dashOffset: 0.0,
//   dashRepeat: 0,
//   dashLength: 0.5,
//   colorEdge: new Vec4([0.3, 0.3, 0.3, 1.0]),
//   colorFill: new Vec4([0.0, 0.0, 0.0, 0.25]),
//   cameraUp: new Vec3([0, 1, 0]),
//   cameraPos: new Vec3([0, 0, 8]),
// };

// export class App extends Application<Params> {
//   cmd: Command;
//   camera: PerspectiveCamera;
//   mat: Material;

//   vd: Vec3 = new Vec3();

//   set params(params: Params) {
//     const uniforms = this.mat.uniforms;

//     uniforms.width = params.width;
//     uniforms.feather = params.feather;
//     uniforms.removeEdge = params.removeEdge;
//     uniforms.squeezeMin = params.squeezeMin;
//     uniforms.squeezeMax = params.squeezeMax;
//     uniforms.dashOffset = params.dashOffset;
//     uniforms.dashRepeat = params.dashRepeat;
//     uniforms.dashLength = params.dashLength;
//     uniforms.colorEdge = params.colorEdge;
//     uniforms.colorFill = params.colorFill;

//     this.camera.up = params.cameraUp;
//     this.camera.position = params.cameraPos;
//   }

//   init(gl: WebGLRenderingContext) {
//     super.init(gl);

//     this.camera = new PerspectiveCamera(gl.canvas.clientWidth, gl.canvas.clientHeight);
//     this.camera.position = defaultParams.cameraPos;

//     const aabb = new AABB();
//     const faces = tessellate(asPolygon3(aabb), [tessellate3]);

//     const ap = new AttribPool({
//       num: faces.length * 3,
//       mem: { size: 0x200 },
//       attribs: {
//         position: { type: GLType.F32, size: 3, byteOffset: 0 },
//         barycentric: { type: GLType.F32, size: 2, byteOffset: 12 }
//       }
//     });

//     const bc = [
//       1, 0,
//       0, 0,
//       0, 1,
//       0, 1,
//       1, 0,
//       0, 0
//     ];

//     ap.setAttribValues('position', [...mapcat((f: Vec[]) => f, faces)]);
//     ap.setAttribValues('barycentryc', [...flatten(repeat(bc, 6))]);

//     const arraySpecs = transduce(
//       map(([name, { size }]) => [name, { numComponents: size, data: [...flatten(ap.attribValues(name))] }]),
//       assocObj(),
//       pairs(ap.specs)
//     );

//     // const faces = new AABB().toPolygon().tessellate(tessellate3);
//     // const points = transduce(
//     //   comp(mapcat((f: Vec3[]) => f), map(v => v.subNewN(0.5))),
//     //   push(),
//     //   faces);
//     // const position = Vec3.intoBuffer(new Float32Array(faces.length * 3 * 3), points);
//     // const barycentric = {
//     //   data: [...flatten(repeat([
//     //     [1, 0], [0, 0], [0, 1],
//     //     [0, 1], [1, 0], [0, 0]
//     //   ], 6))],
//     //   numComponents: 2
//     // };

//     // const geom = new Geometry({
//     //   position, barycentric,
//     //   texcoord: [...flatten(repeat([[1, 0], [0, 0], [0, 1], [1, 0], [0, 1], [1, 1]], 6))],
//     // });

//     // const geom2 = new Geometry({
//     //   position: [...flatten([
//     //     [0, 0, 0],
//     //     [1, 0, 0],
//     //     [0, 0, 0],
//     //     [0, 1, 0],
//     //     [0, 0, 0],
//     //     [0, 0, 1]
//     //   ])],
//     //   color: [...flatten([
//     //     [1, 0, 0, 1],
//     //     [1, 0, 0, 1],
//     //     [0, 1, 0, 1],
//     //     [0, 1, 0, 1],
//     //     [0, 0, 1, 1],
//     //     [0, 0, 1, 1],
//     //   ])]
//     // });

//     this.mat = new Material(vert, frag);

//     const scene = new Scene();
//     scene.add(new Mesh(arraySpecs, this.mat));
//     // scene.add(new Mesh(geom2, new Material(lineVert, lineFrag), gl.LINES));

//     this.cmd = new Command(gl, scene);
//   }

//   render(time: number) {
//     const gl = this.gl;
//     gl.disable(gl.DEPTH_TEST);
//     gl.enable(gl.BLEND);
//     gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//     gl.enable(gl.SAMPLE_COVERAGE);
//     gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
//     gl.clearColor(0, 0, 0, 0);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     this.cmd.draw(time, this.camera);
//   }
// }