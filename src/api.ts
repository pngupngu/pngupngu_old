import { IObjectOf } from "@thi.ng/api/api";
import { ViewTransform, IView } from "@thi.ng/atom/api";
import { EventDef, EffectDef, InterceptorContext } from "@thi.ng/interceptors/api";
import { EventBus } from "@thi.ng/interceptors/event-bus";
import { HTMLRouterConfig, RouteMatch } from "@thi.ng/router/api";

import { UIAttrib, ComponentAttrib } from './components/api';
import { SelectAttribs } from './components/select';
import { SliderAttribs } from "./components/slider";
import { PanelAttribs } from "./components/panel";

export type AppComponent = (ctx: AppContext, ...args: any[]) => any;

export type ViewSpec = string | [string, ViewTransform<any>];

export interface Module {
  load(): Promise<any>;
  init(): InterceptorContext;
  release(): InterceptorContext;
  value: any;
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
  value: IView<number>;
}

export interface UIAttribs {
  [key: string]: Partial<UIAttrib> | ComponentAttrib;

  select: SelectAttribs;
  slider: SliderAttribs;
  panel: PanelAttribs;
}

export interface AppContext {
  bus: EventBus;
  views: AppViews;
  ui: UIAttribs;
}