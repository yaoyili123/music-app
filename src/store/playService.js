/*
    播放器全局状态
*/
import store from './index'

const defsong = {
  id: '812116',
  albumId: '80429',
  name: '好きだから',
  mUrl: 'https://music.163.com/song/media/outer/url?id=812116.mp3',
  albumName: '好きだから',
  albumUrl: 'https://p2.music.126.net/Zi47GUsn1fASFS6OxtLQDg==/18613632348437157.jpg',
  artistId: 21196,
  author: "ラムジ"
}

export default {
  state: {
    //当前播放的歌曲
    curSong: defsong,
    //当前播放状态
    playing: false,
    currentTime: 0,
    duration: 0,
    playList: [defsong],
    playMode: 1,
    //播放列表当前播放索引
    index: 0,
    showPlayList: false,
  },
  mutations: {
    closePlayList(state) {
      state.showPlayList = false
    },
    showPlayList(state) {
      state.showPlayList = true
    },
    playIndex (state, index) {
      state.index = index
      state.curSong = state.playList[index]
    },
    setPlayingState(state, flag) {
      state.playing = flag
    },
    setCurSong(state, data) {
      state.curSong = data
    },
    setCurrentTime(state, data) {
      state.currentTime = data
    },
    setDuration(state, data) {
      state.duration = data
    },
    setPlayList(state, data) {
      state.playList = data
    },
    changePlayMode (state) {
      state.playMode = (state.playMode + 1) % 3
    },
    playItem(state, num) {
      state.index = num
      state.curSong = state.playList[num]
    },
    playFront (state) {
      state.index = (state.index - 1 + state.playList.length) % state.playList.length
      state.curSong = state.playList[state.index]
    },
    playNext (state) {
      state.index = (state.index + 1) % state.playList.length
      state.curSong = state.playList[state.index]
    },
    deleteFromPlayList (state, index) {
      if (isNaN(index) || index >= state.playList.length) {
        return false
      }
      if (index === state.index) {
        if (state.index === 0 && state.playList.length === 1) {
          state.curSong = defsong
        } else {
          state.curSong = state.playList[state.index + 1]
        }
      } else if (index < state.index) {
        state.index--
      }
      state.playList.splice(index, 1)
    },
  },
  getters: {
    playing: state => state.playing,
    curSong: state => state.curSong,
    currentTime: state =>
      parseInt(state.currentTime / 60) + ':' + (Array(2).join(0) + (state.currentTime % 60)).slice(-2),
    duration: state =>
      parseInt(state.duration / 60) + ':' + (Array(2).join(0) + (state.duration % 60)).slice(-2),
    playList: state => state.playList,      
    showPlayList: state => state.showPlayList,      
  },
}