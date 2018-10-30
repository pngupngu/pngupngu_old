import { App } from "./app";
import { CONFIG } from "./config";

if (process.env.NODE_ENV == "development") {
  (window["APP"] = new App(CONFIG)).start();
} else {
  new App(CONFIG).start();
}