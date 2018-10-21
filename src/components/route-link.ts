import { AppContext } from "../api";
import { ev } from "../events";

export function routeLink(ctx: AppContext, attribs: any, routeID: PropertyKey, routeParams: any, body: any) {
  return ["a",
    {
      ...attribs,
      onclick: (e) => {
        e.preventDefault();
        ctx.bus.dispatch([ev.ROUTE_TO, [routeID, routeParams]]);
      }
    },
    body];
}