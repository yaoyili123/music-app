import Vue from 'vue'
import VueRouter from 'vue-router'
import Artist from './components/artist'
import Album from './components/album'
import Sheet from './components/sheet'
import UserForm from './components/userform'
import UpdateSheet from './components/updateSheet'
import Collections from './components/collections'

Vue.use(VueRouter)

const routes = [
  { 
    path: '/artist/:id', 
    name:'artist',  
    component: Artist, 
    meta: {
      logined: false 
    }
  },
  { 
    path: '/sheet/:id', 
    name:'sheet',  
    component: Sheet, 
    meta: {
      logined: false 
    }
  },
  { 
    path: '/album/:id', 
    name:'album',  
    component: Album, 
    meta: {
      logined: false 
    }
  },
  { 
    path: '/userform/:type', 
    name:'userform',  
    component: UserForm, 
    meta: {
      logined: false 
    }
  },
  { 
    path: '/updateSheet/:sid', 
    name:'updateSheet',  
    component: UpdateSheet, 
    meta: {
      logined: true 
    }
  },
  { 
    path: '/collections', 
    name:'collections',  
    component: Collections, 
    meta: {
      logined: true 
    }
  },
]

export default new VueRouter({
  routes,
  //只在history模式下有用
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})