import { Node } from './node';

export class Scene extends Node {
  width: number;
  height: number;

  update() { };

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}