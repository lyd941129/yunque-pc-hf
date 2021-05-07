import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '../static/css/commonality.less';
import './common/mixin/mixin.js';
import '../public/ueditor/ueditor.config.js';
import '../public/ueditor/ueditor.all.js';
import '../public/ueditor/lang/zh-cn/zh-cn.js';

// 在 main.js 中引入
import VueUeditorWrap from 'vue-ueditor-wrap'

// 全局注册组件
Vue.component('vue-ueditor-wrap', VueUeditorWrap)

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
