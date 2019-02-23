import { IObjectOf } from "@thi.ng/api";
import { ViewTransform, IView } from "@thi.ng/atom";
import { EventDef, EffectDef, EventBus } from "@thi.ng/interceptors";
import { HTMLRouterConfig, RouteMatch } from "@thi.ng/router";

import {
  UIAttrib, ComponentAttrib,
  SelectAttribs, SliderAttribs, PanelAttribs, CheckBoxAttribs,
  MultiSliderAttribs
} from '@pngu/ui/api';

import { Params as pbrParams } from '@pngu/scenes/pbr';
import { Params as wireParams } from '@pngu/scenes/wire';
import { Params as caParams } from '@pngu/scenes/ca';

export enum ev {
  ROUTE_TO,
  SET_RAF,
  SET_PARAM,
  SET_PARAMS,
};

export enum fx {
  ROUTE_TO = '1'
};

export type AppComponent = (ctx: Context, ...args: any[]) => any;

interface Views {
  route: RouteMatch;
  routeComponent: any;
  raf: boolean;
  params: {
    wire: wireParams;
    pbr: pbrParams;
    ca: caParams;
  };
}

export type AppViews = { [P in keyof Views]: IView<Views[P]> };

export type ViewSpec = string | [string, ViewTransform<any>];

export interface Config {
  domRoot: string | Element;
  router: HTMLRouterConfig;
  components: IObjectOf<any>;
  events: IObjectOf<EventDef>;
  effects: IObjectOf<EffectDef>;
  initialState: any;
  ui: UIAttribs;
  views: Partial<Record<keyof AppViews, ViewSpec>>;
}

export interface UIAttribs {
  [key: string]: Partial<UIAttrib> | ComponentAttrib<string> | any;

  select: SelectAttribs;
  slider: SliderAttribs;
  cslider: SliderAttribs;
  panel: PanelAttribs;
  checkbox: CheckBoxAttribs;
  multiSlider3: MultiSliderAttribs;
  multiSlider4: MultiSliderAttribs;
}

export interface Context {
  bus: EventBus;
  views: AppViews;
  ui: UIAttribs;
}