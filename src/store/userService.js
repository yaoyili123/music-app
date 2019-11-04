import store from './index'

export default {
  state: {
    curUser: localStorage.curUser? JSON.parse(localStorage.curUser) : undefined,
    updateSheet: false,
  },
  mutations: {
    setCurUser(state, user) {
      state.curUser = user
      localStorage.curUser = JSON.stringify(user)
    },
    setUpdateSheet(state, val) {
      state.updateSheet = val
    },
  },
  getters: {
    curUser: state => state.curUser,
    isLogined: state => state.curUser != undefined,
    updateSheet: state => state.updateSheet
  },
}