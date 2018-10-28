import { IObjectOf } from "@thi.ng/api/api";
import { ViewTransform, IView } from "@thi.ng/atom/api";
import { EventDef, EffectDef, InterceptorContext } from "@thi.ng/interceptors/api";
import { EventBus } from "@thi.ng/interceptors/event-bus";

export interface UIAttrib {
  class: string;
}

export type ComponentAttrib = Record<string, Partial<UIAttrib>>;
// import { SelectAttribs } from '../../../src/components/select';
// import { SliderAttribs } from "../../../src/components/slider";
// import { PanelAttribs } from "../../../src/components/panel";

export type AppComponent = (ctx: AppContext, ...args: any[]) => any;

export type ViewSpec = string | [string, ViewTransform<any>];

export interface Module {
  load(): Promise<any>;
  init(): InterceptorContext;
  release(): InterceptorContext;
}

export interface AppConfig {
  domRoot: string | Element;
  rootComponent: any;
  effects: IObjectOf<EffectDef>;
  events: IObjectOf<EventDef>;
  initialState: any;
  ui: UIAttribs;
  views: Partial<Record<keyof AppViews, ViewSpec>>;
}

export interface AppViews extends Record<keyof AppViews, IView<any>> {
  raf: IView<boolean>;
  value: IView<number>;
}

export interface UIAttribs {
  [key: string]: Partial<UIAttrib> | ComponentAttrib;

  // select?: SelectAttribs;
  // slider?: SliderAttribs;
  // panel?: PanelAttribs;
}

export interface AppContext {
  bus: EventBus;
  views: AppViews;
  ui: UIAttribs;
}