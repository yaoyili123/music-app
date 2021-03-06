import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
import fastclick from 'fastclick'

fastclick.attach(document.body)
//FIXME:全局引入后，通过this.$<小写开头的组件名> 来调用函数
Vue.use(Vant)

router.beforeEach((to, from, next) => {
  
  if (to.path == 'userform/login') {
    localStorage.removeItem('curUser');
  }
  let user = JSON.parse(localStorage.getItem('curUser'));
  if (to.meta.logined && !user && to.path != 'userform/login') {
    next({ path: 'userform/login' })
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
