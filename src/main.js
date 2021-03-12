import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, BIcon, BIconX, BIconList, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import device from "vue-device-detector"
import VueMq from "vue-mq"
import CKEditor from '@ckeditor/ckeditor5-vue';
import VueCookie from 'vue-cookie'
import axios from "axios"

import { Swiper as SwiperClass, Pagination, Mousewheel, Autoplay } from 'swiper/swiper.esm'
import getAwesomeSwiper from 'vue-awesome-swiper/dist/exporter'
const VueInputMask = require('vue-inputmask').default
Vue.use(VueInputMask)

Vue.prototype.$axios = axios

SwiperClass.use([Pagination, Mousewheel, Autoplay])
Vue.use(getAwesomeSwiper(SwiperClass))
Vue.use( getAwesomeSwiper );
Vue.use( VueCookie );
Vue.use( CKEditor );

Vue.use(VueMq, {
	breakpoints: {
		mobile: 760,
		desktop: Infinity,
	}
})

Vue.use(device)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.component('BIcon', BIcon)
Vue.component('BIconList', BIconList)
Vue.component('BIconX', BIconX)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  beforeCreate(){
    this.$store.dispatch("checkSession")
  },
  template: '<App/>',
  components: {
    BIcon,
    BIconList,
    BIconX
  },
  render: h => h(App)
}).$mount('#app')


