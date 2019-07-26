import Vue from 'vue'
import App from './App'
import VueSteps from 'a-vue-steps'
import 'a-vue-steps/dist/vue-steps.min.css'
Vue.use(VueSteps)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
