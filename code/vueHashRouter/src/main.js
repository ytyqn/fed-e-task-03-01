import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Model from './modelsUsed'
import Power from './models/power.js'

Vue.config.productionTip = false

Vue.use(Model)
const model = new Model({
  mode: 'none',
  models: {
    $power: new Power()
  },
  components: {
    Test: () =>
      import('./components/test.vue')
  }
})

const vm = new Vue({
  router,
  model,
  render: h => h(App)
}).$mount('#app')

console.log(vm.$model.$power)
