import { Route } from '@thi.ng/router/api';

const HOME: Route = {
  id: 'home',
  match: ['home'],
};

const WIRE: Route = {
  id: 'wire',
  match: ['wire'],
};

const PBR: Route = {
  id: 'pbr',
  match: ['pbr']
};

export default {
  HOME,
  WIRE,
  PBR
};