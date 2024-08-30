// import './assets/main.css'

import './assets/all.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';


// 引入 VeeValidate 元件跟功能
import {  Field, Form, ErrorMessage, defineRule, configure} from 'vee-validate';
  // 引入 VeeValidate 的驗證規則
import * as AllRules from '@vee-validate/rules';
Object.keys(AllRules).forEach(rule => {
  if (typeof AllRules[rule] === 'function') {
      defineRule(rule, AllRules[rule]);
  }
});

  // 引入 VeeValidate 的 i18n 功能
import { localize, setLocale } from '@vee-validate/i18n';
  // 引入 VeeValidate 的繁體中文語系檔
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

import App from './App.vue';
import router from './router';



  // 將當前 VeeValidate 的語系設定為繁體中文
configure({
    generateMessage: localize({ zh_TW: zhTW }),
    validateOnInput: true,
});
setLocale('zh_TW');

const app = createApp(App);

app.use(createPinia());
app.use(router);
// 掛載 Global 的 VeeValidate 元件
app.component('VField', Field);
app.component('VForm', Form);
app.component('ErrorMessage', ErrorMessage);
app.mount('#app');
