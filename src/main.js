import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'
import App from './App.vue'
import store from './config/store'
import router from './config/router'
import './config/bootstrap'
import './config/msg'
import axios from './jwtInterceptor'
import vueNumeralFilterInstaller from 'vue-numeral-filter';
import numeral from 'numeral'
import excel from 'vue-excel-export'
import './config/mq'
import VueHtml2Canvas from 'vue-html2canvas';
import ExcelJS from 'exceljs'
import Chartist from 'chartist';
import 'chartist/dist/chartist.min.css';





// Vue.prototype.$echarts = echarts

//Vue.use(UUID)

Vue.config.productionTip = false
Vue.use(Chartist)
Vue.use(VueHtml2Canvas);
Vue.use(excel)

Vue.use(vueNumeralFilterInstaller, { locale: 'pt-br' });
Vue.use(numeral.locale('pt-br'))
Vue.use(ExcelJS)
//Vue.use(numeral.locale('de'))


/* eslint-disable no-new */
new Vue({
  store,
  router,
  axios,
  render: h => h(App),
}).$mount('#app')
