// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex'
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import "bootstrap";
import VeeValidate from 'vee-validate';
import zhTW from 'vee-validate/dist/locale/zh_TW';
import VueI18n from 'vue-i18n';
// 在引入時會將第三方套件往上放 
import App from './App';
import router from './router';
import './bus';
import currencyFilter from "./filters/currency";
import dateTransfer from "./filters/timestampTrans";
import store from './store';


Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'zhTW'
});
Vue.use(VeeValidate, {
  events: 'input|blur', //這是為了讓使用者離開該欄位時觸發驗證
  i18n,
  dictionary: {
    zhTW
  }
});


Vue.use(Vuex);
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
axios.defaults.withCredentials = true;

Vue.component('Loading', Loading);
Vue.filter('currency', currencyFilter);
Vue.filter('dateTransfer' ,dateTransfer);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  i18n,
  store,
});

router.beforeEach((to, from, next) => {
  console.log('to:',to,'from:',from,'next:',next);
  if(to.meta.requiresAuth){
    const api = `${process.env.APIPATH}/api/user/check`;
      axios.post(api).then((response) => {
        console.log(response.data);
        if(response.data.success){
          next();
        }else{
          next({
            path: '/login',
          });
        };
      });
  }else{
    next();
  };
});