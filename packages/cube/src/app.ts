import { IObjectOf } from "@thi.ng/api/api";
import { Atom } from "@thi.ng/atom/atom";
import { isArray } from "@thi.ng/checks/is-array";
import { start } from "@thi.ng/hdom";
import { EventBus } from "@thi.ng/interceptors/event-bus";
import { initGraph, node1 } from "@thi.ng/rstream-graph/graph";
import { map } from '@thi.ng/transducers/xform/map';
import { identity } from '@thi.ng/transducers/func/identity';

import { fromOrientation } from '@pngu/core/rstream/from-orientation';

import { AppConfig, AppContext, AppViews, ViewSpec } from "./api";
import { ev } from "./events";

export class App {

  config: AppConfig;
  ctx: AppContext;
  state: Atom<any>;

  constructor(config: AppConfig) {
    this.config = config;
    this.state = new Atom(config.initialState || {});

    const { ui, handlers, views } = config;
    const bus = new EventBus(this.state, handlers.events, handlers.effects);
    this.ctx = { bus, ui, views: <AppViews>{} };
    this.addViews(views);
  }

  addViews(specs: IObjectOf<ViewSpec>) {
    const views = this.ctx.views;
    for (let id in specs) {
      const spec = specs[id];
      if (isArray(spec)) {
        views[id] = this.state.addView(spec[0], spec[1]);
      } else {
        views[id] = this.state.addView(spec);
      }
    }
  }

  start() {
    this.initGraph();

    const root = this.config.rootComponent(this.ctx);
    let first = true;
    start(
      ({ bus, views: { raf } }) => {
        if (bus.processQueue() || raf.deref() || first) {
          first = false;
          return root;
        } else {
          return null;
        }
      },
      { root: this.config.domRoot, ctx: this.ctx });
  }

  initGraph() {
    const bus = this.ctx.bus;
    const orient = fromOrientation();

    initGraph(this.state, {
      orient: {
        fn: node1(map(identity)),
        ins: { src: { stream: (_) => orient } },
        outs: {
          '*': node => node.subscribe({
            next: e => {
              bus.dispatch([ev.SET_ORIENTATION, [e.alpha, e.beta, e.gamma]])
            }
          })
        }
      }
    });
  }
}