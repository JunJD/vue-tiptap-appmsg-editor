import { createPinia } from "pinia";
export { useAppStore } from "./modules/app";
export { useScreenStore } from "./modules/screen";
export const pinia = createPinia();
