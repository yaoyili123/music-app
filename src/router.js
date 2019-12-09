import Vue from 'vue'
import VueRouter from 'vue-router'
import Artist from './components/artist'
import Album from './components/album'
import Sheet from './components/sheet'
import UserForm from './components/userform'
import UpdateSheet from './components/updateSheet'

Vue.use(VueRouter)

const routes = [
  { path: '/artist/:id', name:'artist',  component: Artist },
  { path: '/sheet/:id', name:'sheet',  component: Sheet },
  { path: '/album/:id', name:'album',  component: Album },
  { path: '/userform/:type', name:'userform',  component: UserForm},
  { path: '/updateSheet/:sid', name:'updateSheet',  component: UpdateSheet},
]

export default new VueRouter({
  routes,
  //只在history模式下有用
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})