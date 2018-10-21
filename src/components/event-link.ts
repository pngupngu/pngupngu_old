import { Event } from "@thi.ng/interceptors/api";

import { AppContext } from "../api";

export function eventLink(ctx: AppContext, attribs: any, event: Event, body: any) {
  return ["a",
    {
      ...attribs,
      onclick: (e) => {
        e.preventDefault();
        ctx.bus.dispatch(event);
      }
    },
    body];
}
