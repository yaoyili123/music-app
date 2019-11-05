import store from './index'

export default {
  state: {
    curUser: localStorage.curUser? JSON.parse(localStorage.curUser) : undefined,
    updateSheet: false,
    own: false,
  },
  mutations: {
    setCurUser(state, user) {
      state.curUser = user
      localStorage.curUser = JSON.stringify(user)
    },
    deleteUser(state) {
      state.curUser = undefined
      localStorage.removeItem('curUser')
    },

    setUpdateSheet(state, val) {
      state.updateSheet = val
    },
    setOwn(state, val) {
      state.own = val
    }
  },
  getters: {
    curUser: state => state.curUser,
    isLogined: state => state.curUser != undefined,
    updateSheet: state => state.updateSheet,
    own: state => state.own,
  },
}