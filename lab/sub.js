import { data } from "./header.js";

export function up() {
  setInterval(() => {
    data.count++;
  }, 2000)
}
