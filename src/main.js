import 'devextreme/dist/css/dx.common.css';
// import './themes/generated/theme.base.css';
// import './themes/generated/theme.additional.css';
// create theme at https://devexpress.github.io/ThemeBuilder/
// import './themes/generated/dx.material.yellow-dark.css';
import './themes/generated/yellowdark.base.css';
import Vue from "vue";

import App from "./App";
import router from "./router";
import appInfo from "./app-info";

Vue.config.productionTip = false;
Vue.prototype.$appInfo = appInfo;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
