import { IObjectOf } from "@thi.ng/api/api";
import { Atom } from "@thi.ng/atom/atom";
import { isArray } from "@thi.ng/checks/is-array";
import { start } from "@thi.ng/hdom";
import { EventBus } from "@thi.ng/interceptors/event-bus";
import { EVENT_ROUTE_CHANGED } from "@thi.ng/router/api";
import { HTMLRouter } from "@thi.ng/router/history";

import { AppConfig, AppContext, AppViews, ViewSpec } from "./api";
import { fx } from './events';

export class App {

  config: AppConfig;
  ctx: AppContext;
  state: Atom<any>;
  router: HTMLRouter;

  constructor(config: AppConfig) {
    this.config = config;
    this.state = new Atom(config.initialState || {});

    const { ui, handlers, views } = config;
    const bus = new EventBus(this.state, handlers.events, handlers.effects);
    this.ctx = { bus, ui, views: <AppViews>{} };
    this.addViews(views);

    this.setupRouter();
  }

  private setupRouter() {
    const { bus } = this.ctx;

    this.router = new HTMLRouter(this.config.router);
    this.router.addListener(
      EVENT_ROUTE_CHANGED,
      e => bus.dispatch([EVENT_ROUTE_CHANGED, e.value])
    );
    bus.addEffect(
      fx.ROUTE_TO,
      ([id, params]) => this.router.routeTo(this.router.format(id, params))
    );
    this.addViews({
      routeComponent: ["route.id", id => this.config.components[id](this.ctx)]
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
    this.router.start();

    start(
      ({ bus, views: { raf, routeComponent } }: AppContext) => {
        if (bus.processQueue() || raf.deref()) {
          return routeComponent;
        } else {
          return null;
        }
      },
      { root: this.config.domRoot, ctx: this.ctx });
  }
}