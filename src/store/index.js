import Vue from 'vue'
import Vuex from 'vuex'

import PlayService from './playService'
import UserService from './userService'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    PlayService,
    UserService,
  }
})