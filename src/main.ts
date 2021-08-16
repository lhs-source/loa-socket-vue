import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import Notifications from 'vue-notification'
import VueGtag from "vue-gtag";

Vue.use(Notifications);

// GA 설정
let GA_MID = {
  id: 'G-3DFJ0YM1SS',
}
GA_MID.id = process.env.NODE_ENV === 'prod' ? 'G-3DFJ0YM1SS' : '';
Vue.use(VueGtag, {
  config: {
    id: GA_MID.id
  }
}, router);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
