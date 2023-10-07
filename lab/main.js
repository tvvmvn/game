import { cat, sound, data } from "./header.js";
import { up } from "./sub.js";

up();

setInterval(() => {

  console.log("count:", data.count);

}, 1000)