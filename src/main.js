import "virtual:windi.css";
import "@/assets/styles/reset.css";
import "@/assets/styles/global.scss";
import SvgIcon from "@/components/SvgIcon/SvgIcon.js";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'        
import App from "./App.vue";

const app = createApp(App);
app.component("SvgIcon", SvgIcon);
app.use(ElementPlus);
app.mount("#app");
