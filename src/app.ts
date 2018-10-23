import { IObjectOf } from "@thi.ng/api/api";
import { Atom } from "@thi.ng/atom/atom";
import { isArray } from "@thi.ng/checks/is-array";
import { start } from "@thi.ng/hdom";
import { EventBus } from "@thi.ng/interceptors/event-bus";
import { forwardSideFx, valueSetter } from "@thi.ng/interceptors/interceptors";
import { EVENT_ROUTE_CHANGED } from "@thi.ng/router/api";
import { HTMLRouter } from "@thi.ng/router/history";

import { AppConfig, AppContext, AppViews, ViewSpec } from "./api";
import { ev, fx } from "./events";

export class App {

  config: AppConfig;
  ctx: AppContext;
  state: Atom<any>;
  router: HTMLRouter;

  constructor(config: AppConfig) {
    this.config = config;
    this.state = new Atom(config.initialState || {});
    this.ctx = {
      bus: new EventBus(this.state, config.events, config.effects),
      views: <AppViews>{},
      ui: config.ui,
    };
    this.addViews(this.config.views);
    this.router = new HTMLRouter(config.router);
    this.router.addListener(
      EVENT_ROUTE_CHANGED,
      (e) => this.ctx.bus.dispatch([EVENT_ROUTE_CHANGED, e.value])
    );
    this.ctx.bus.addHandlers({
      [EVENT_ROUTE_CHANGED]: valueSetter("route"),
      [ev.ROUTE_TO]: forwardSideFx(ev.ROUTE_TO),
    });
    this.ctx.bus.addEffect(
      fx.ROUTE_TO,
      ([id, params]) => this.router.routeTo(this.router.format(id, params))
    );
    this.addViews({
      route: "route",
      routeComponent: ["route.id", (id) => this.config.components[id](this.ctx)]
    });
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
    this.init();
    start(
      ({ bus, views: { raf, routeComponent } }) =>
        bus.processQueue() || raf.deref() ? routeComponent : null,
      { root: this.config.domRoot, ctx: this.ctx });
  }

  init() {
    this.router.start();
  }
}