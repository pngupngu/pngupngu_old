import { AppContext } from "../api";

export function appState(ctx: AppContext) {
  return ["pre", ctx.ui.state, () => JSON.stringify(ctx.bus.state.deref(), null, 2)];
}
