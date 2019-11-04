import store from './index'

export default {
  state: {
    curUser: localStorage.curUser? JSON.parse(localStorage.curUser) : undefined,
  },
  mutations: {
    setCurUser(state, user) {
      state.curUser = user
      localStorage.curUser = JSON.stringify(user)
    },
  },
  getters: {
    curUser: state => state.curUser,
    isLogined: state => state.curUser != undefined
  },
}