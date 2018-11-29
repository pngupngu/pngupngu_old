import { IObjectOf } from "@thi.ng/api/api";
import { ViewTransform, IView } from "@thi.ng/atom/api";
import { EventDef, EffectDef, InterceptorContext } from "@thi.ng/interceptors/api";
import { EventBus } from "@thi.ng/interceptors/event-bus";

import {
  UIAttrib, ComponentAttrib,
  SelectAttribs, SliderAttribs, PanelAttribs, CheckBoxAttribs,
  MultiSliderAttribs
} from '@pngu/ui/api';

import { Params as pbrParams } from './scenes/pbr';
import { Params as wireParams } from './scenes/wire';

export type AppComponent = (ctx: AppContext, ...args: any[]) => any;

export interface Module {
  load(): Promise<any>;
  init(): InterceptorContext;
  release(): InterceptorContext;
}

interface Views {
  raf: boolean;
  params: pbrParams & wireParams;
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
  checkbox?: CheckBoxAttribs;
  multiSlider?: MultiSliderAttribs;
}

export interface AppContext {
  bus: EventBus;
  views: AppViews;
  ui: UIAttribs;
}