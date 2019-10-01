import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import Croppa from 'vue-croppa'
import vuetify from './plugins/vuetify'
import moment from 'moment'
require('moment/locale/ja')
import './registerServiceWorker'
import 'element-ui/lib/theme-chalk/index.css'
import 'vue-croppa/dist/vue-croppa.css'
import './vee-validate'

Vue.config.productionTip = false

Vue.prototype.$stripe = Stripe(process.env.VUE_APP_STRIPE_PUBLIC_API_KEY)

Vue.use(Croppa)
Vue.use(require('vue-moment'), {
  moment
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
