import { IObjectOf } from "@thi.ng/api/api";
import { ViewTransform, IView } from "@thi.ng/atom/api";
import { EventDef, EffectDef, InterceptorContext } from "@thi.ng/interceptors/api";
import { EventBus } from "@thi.ng/interceptors/event-bus";

import { UIAttrib, ComponentAttrib } from '@pngu/ui/api';
import { SelectAttribs, SliderAttribs, PanelAttribs } from '@pngu/ui/api';

import { Params } from './scene';

export type AppComponent = (ctx: AppContext, ...args: any[]) => any;

export interface Module {
  load(): Promise<any>;
  init(): InterceptorContext;
  release(): InterceptorContext;
}

interface Views {
  raf: boolean;
  params: Params;
}

export type AppViews = { [P in keyof Views]: IView<Views[P]> };

export type ViewSpec = string | [string, ViewTransform<any>];

export interface AppConfig {
  domRoot: string | Element;
  rootComponent: any;
  effects: IObjectOf<EffectDef>;
  events: IObjectOf<EventDef>;
  initialState: any;
  ui: UIAttribs;
  views: Partial<Record<keyof AppViews, ViewSpec>>;
}

export interface UIAttribs {
  [key: string]: Partial<UIAttrib> | ComponentAttrib;

  select?: SelectAttribs;
  slider?: SliderAttribs;
  panel?: PanelAttribs;
}

export interface AppContext {
  bus: EventBus;
  views: AppViews;
  ui: UIAttribs;
}