// import { vec3, vec2, quat } from 'gl-matrix';
// import { pipe, forEach, map } from 'callbag-basics';

// import { streamMouseDown, streamMouseUp, streamMouseMove } from '../events';
// import { switchMap, takeUntil } from '../callbag';

// export default class Arcball {
//   radius: number;
//   center: vec2;

//   constructor(canvas: HTMLCanvasElement, camera) {
//     let ww = canvas.width * 0.5;
//     let hh = canvas.height * 0.5;

//     this.center = vec2.fromValues(ww, hh);
//     this.radius = Math.min(ww, hh);

//     const mousedown = streamMouseDown(canvas);
//     const mouseup = streamMouseUp(canvas);
//     const mousemove = streamMouseMove(canvas);

//     pipe(
//       mousedown,

//       map(d => {
//         const clickPos = this.spherePos(d.x, d.y);
//         const up = vec3.clone(camera.up);
//         const viewDir = vec3.sub(vec3.create(), camera.position, camera.target);

//         return { clickPos, up, viewDir };
//       }),

//       switchMap(
//         d => pipe(mousemove, takeUntil(mouseup)),
//         ({ clickPos, up, viewDir }, m) => {
//           const curPos = this.spherePos(m.x, m.y);

//           let side = vec3.cross(vec3.create(), up, viewDir);
//           vec3.normalize(side, side);
//           let upScaled = vec3.scale(vec3.create(), up, curPos[1] - clickPos[1]);
//           let sideScaled = vec3.scale(vec3.create(), side, curPos[0] - clickPos[0]);
//           let move = vec3.add(vec3.create(), upScaled, sideScaled);
//           let axis = vec3.cross(vec3.create(), move, viewDir);
//           vec3.normalize(axis, axis);
//           let angle = vec3.squaredLength(vec3.fromValues(curPos[0] - clickPos[0], curPos[1] - clickPos[1], 0));
//           let q = quat.setAxisAngle(quat.create(), axis, angle * 3);
//           let vd = vec3.transformQuat(vec3.create(), viewDir, q);
//           let u = vec3.transformQuat(vec3.create(), up, q);
//           let position = vec3.add(vec3.create(), camera.target, vd);

//           return { position, u };
//         }
//       ),

//       forEach(({ position, u }) => {
//         camera.position = position;
//         camera.up = u;
//       })
//     );
//   }

//   spherePos(x: number, y: number): vec3 {
//     const vx = (x - this.center[0]) / this.radius;
//     const vy = -(y - this.center[1]) / this.radius;
//     const v = vec3.fromValues(vx, vy, 0);
//     const mag = vec3.squaredLength(v);
//     if (mag > 1.0) {
//       return vec3.normalize(v, v);
//     } else {
//       return vec3.set(v, vx, vy, Math.sqrt(1.0 - mag));
//     }
//   }
// }