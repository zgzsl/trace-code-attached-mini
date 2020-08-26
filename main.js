import Vue from 'vue'
import App from './App'
// import VueSteps from 'a-vue-steps'
// import scanner from 'scanner'
// import 'a-vue-steps/dist/vue-steps.min.css'
import common from './common/fetch.js'
import store from './store'
// Vue.use(VueSteps)
// Vue.use(scanner);
Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$common = common
Vue.prototype.$store = store
const app = new Vue({
    ...App
	
})
app.$mount()
