import { IObjectOf } from "@thi.ng/api/api";
import { ViewTransform, IView } from "@thi.ng/atom/api";
import { EventDef, EffectDef } from "@thi.ng/interceptors/api";
import { EventBus } from "@thi.ng/interceptors/event-bus";
import { HTMLRouterConfig, RouteMatch } from "@thi.ng/router/api";

import {
  UIAttrib, ComponentAttrib,
  SelectAttribs, SliderAttribs, PanelAttribs, CheckBoxAttribs,
  MultiSliderAttribs
} from '@pngu/ui/api';

import { Params as pbrParams } from './scenes/pbr';
import { Params as wireParams } from './scenes/wire';

export type AppComponent = (ctx: AppContext, ...args: any[]) => any;

interface Views {
  route: RouteMatch;
  routeComponent: any;
  raf: boolean;
  params: {
    wire: wireParams,
    pbr: pbrParams
  };
}

export type AppViews = { [P in keyof Views]: IView<Views[P]> };

export type ViewSpec = string | [string, ViewTransform<any>];

export type Handlers = {
  events: IObjectOf<EventDef>;
  effects: IObjectOf<EffectDef>;
}

export interface AppConfig {
  domRoot: string | Element;
  router: HTMLRouterConfig;
  components: IObjectOf<any>;
  handlers: Handlers;
  initialState: any;
  ui: UIAttribs;
  views: Partial<Record<keyof AppViews, ViewSpec>>;
}

export interface UIAttribs {
  [key: string]: Partial<UIAttrib> | ComponentAttrib<string> | any;

  select: SelectAttribs;
  slider: SliderAttribs;
  cslide?: SliderAttribs;
  panel: PanelAttribs;
  checkbox: CheckBoxAttribs;
  multiSlider3: MultiSliderAttribs;
  multiSlider4: MultiSliderAttribs;
}

export interface AppContext {
  bus: EventBus;
  views: AppViews;
  ui: UIAttribs;
}