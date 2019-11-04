/*
    播放器全局状态
*/
import store from './index'

export default {
  state: {
    //当前播放的歌曲
    curSong: {
      id: '812116',
      albumId: '80429',
      name: '好きだから',
      mUrl: 'https://music.163.com/song/media/outer/url?id=812116.mp3',
      albumName: '好きだから',
      albumUrl: 'https://p2.music.126.net/Zi47GUsn1fASFS6OxtLQDg==/18613632348437157.jpg',
      artistId: 21196,
      author: "ラムジ"
    },
    //当前播放状态
    playing: false
  },
  mutations: {
    setPlayingState(state, flag) {
      state.playing = flag
    },
    setCurSong(state, data) {
      state.curSong = data
    }
  },
  getters: {
    playing: state => state.playing,
    curSong: state => state.curSong
  },
}