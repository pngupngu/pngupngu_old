import { IObjectOf } from "@thi.ng/api/api";
import { Atom } from "@thi.ng/atom/atom";
import { isArray } from "@thi.ng/checks/is-array";
import { start } from "@thi.ng/hdom";
import { EventBus } from "@thi.ng/interceptors/event-bus";

import { AppConfig, AppContext, AppViews, ViewSpec } from "./api";

export class App {

  config: AppConfig;
  ctx: AppContext;
  state: Atom<any>;

  constructor(config: AppConfig) {
    this.config = config;
    this.state = new Atom(config.initialState || {});
    this.ctx = {
      bus: new EventBus(this.state, config.events, config.effects),
      views: <AppViews>{},
      ui: config.ui,
    };
    this.addViews(this.config.views);
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
    start(
      () => ['div', 'fuck'],
      // ({ bus, views: { raf, routeComponent } }) =>
      //   bus.processQueue() || raf.deref() ? routeComponent : null,
      { root: this.config.domRoot, ctx: this.ctx });
  }
}