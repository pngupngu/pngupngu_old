import { IObjectOf } from "@thi.ng/api/api";
import { ViewTransform, IView } from "@thi.ng/atom/api";
import { EventDef, EffectDef, InterceptorContext } from "@thi.ng/interceptors/api";
import { EventBus } from "@thi.ng/interceptors/event-bus";
import { HTMLRouterConfig, RouteMatch } from "@thi.ng/router/api";

export type AppComponent = (ctx: AppContext, ...args: any[]) => any;

export type ViewSpec = string | [string, ViewTransform<any>];

export interface Module {
  load: () => Promise<any>;
  onload: () => InterceptorContext;
  loaded: boolean;
}

export interface AppConfig {
  components: IObjectOf<AppComponent>;
  domRoot: string | Element;
  effects: IObjectOf<EffectDef>;
  events: IObjectOf<EventDef>;
  initialState: any;
  router: HTMLRouterConfig;
  ui: UIAttribs;
  views: Partial<Record<keyof AppViews, ViewSpec>>;
}

export interface AppViews extends Record<keyof AppViews, IView<any>> {
  route: IView<RouteMatch>;
  routeComponent: IView<any>;
  modules: IView<IObjectOf<Module>>;
  raf: IView<boolean>;
  ca: IView<any>;
}

export interface UIAttrib {
  class: string;
}

export interface UIAttribs {
  [key: string]: Partial<UIAttrib>;
}

export interface AppContext {
  bus: EventBus;
  views: AppViews;
  ui: UIAttribs;
}