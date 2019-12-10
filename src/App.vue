<template>
  <div id="app">
    <div class="main" v-show="!playPageShow">
      <van-popup 
        v-model="userShow"
        position="left"
        :style="userPanelStyle"
        >
        <div class="user-info">
          <div class="user-img" @click="userDetail">
            <van-image
              round
              width="5rem"
              height="5rem"
              :src="userPic"
            />
            <p>{{userName}}</p>
          </div>
          <div class="buttons">
            <van-button @click="logOut" icon="clear" type="info">退出</van-button>
          </div>
        </div>
      </van-popup>

      <van-nav-bar title="MUSIC-APP">
        <van-icon name="user-o" slot="left" size="20" @click="userShow = true"/>
      </van-nav-bar>
      <van-tabs v-model="active">
        <van-tab title="推荐">

        </van-tab>
        <van-tab title="我的">
          <me></me>
        </van-tab>
        <van-tab title="搜索">
          <search></search>
        </van-tab>
      </van-tabs>
    </div>
    <!-- FIXME:放最下面就可以把上面全部遮住 -->
    <transition>
      <router-view v-show="!playPageShow"></router-view>
    </transition>

    <transition name="play-slide">
      <play v-show="playPageShow"></play>
    </transition>

    <transition 
      name="bar-slide" 
      >
      <div 
        id="play-bar" 
        v-show="!playPageShow"
        >
        <van-cell 
          style="background-color:#f6f7f9"
          :title="curSong.name"
          :label="curSong.author"
          @touchstart="showPlayPage" 
          @click="showPlayPage"
          size="large">
          <template 
           slot="icon"
            >
            <van-image
              radius="3"
              width="2.5rem"
              height="2.5rem"
              :src="curSong.albumUrl"
            />
          </template>
          <template slot="right-icon">
            <van-icon
              :name="playing? 'stop-circle-o' : 'play-circle-o'"
              size="30"
              @click="togglePlaying"
              @touchend="togglePlaying" 
          />
          </template>
        </van-cell>

        <audio 
          @canplay="canplay"
          @ended="ended"
          ref="audioRef"
          :src="curSong.mUrl">
          Your browser does not support the audio element.
        </audio>
      </div>
    </transition>

  </div>
</template>

<script>
import Search from './components/search'
import Artist from './components/artist'
import Play from './components/play'
import Me from './components/me'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  components : {
    Search,
    Artist,
    Play,
    Me,
  },

  data() {
    return {
      active: 0,
      userShow: false,
      userPanelStyle: {
        height: '100%',
        width: '50%'
      },
      //标志canplay事件是否完成
      songCanplay: false,
      currentIcon: 'play-circle-o',
      playPageShow: false,
    }
  },

  mounted() {
    this.$nextTick(()=>{
      setInterval(this.listenMusic, 1000)
    })
  },

  methods: {
    ...mapMutations({
      deleteUser: 'deleteUser',
      setPlayingState: 'setPlayingState',
      setCurrentTime: 'setCurrentTime',
      setDuration: 'setDuration',
    }),

    userDetail() {
      if (this.isLogined) {
        
      }
      else {
        this.$router.push('/userform/login')
        this.userShow = false
      }
    },

    logOut() {
      if(!this.isLogined) {
        this.$toast.fail('还未登陆')
        return
      }
      this.deleteUser()
      this.$toast.success('注销成功')
    },

    listenMusic(){
      if(!this.$refs.audioRef){
        return
      }
      if(this.$refs.audioRef.readyState){
        this.setDuration(parseInt(this.$refs.audioRef.duration))
      }
      // this.music.isPlay=!this.$refs.music.paused
      this.setCurrentTime(parseInt(this.$refs.audioRef.currentTime))
    },

    togglePlaying: function(event) {
      event.preventDefault()
      // event.stopPropagation()
      if (!this.songCanplay) {
        return
      }
      this.setPlayingState(!this.playing)
    },

    canplay: function() {
      this.songCanplay = true
    },

    ended: function() {
      this.setPlayingState(false)
    },

    showPlayPage(event) {
      event.preventDefault();
      this.playPageShow = true;
    },

    hidePlayPage(event) {
      event.preventDefault();
      this.playPageShow = false;
    },

  },
  computed: {
    ...mapGetters(['curUser', 'isLogined','curSong', 'playing']),

    userPic() {
      return this.isLogined ? this.curUser.picUrl : require("./assets/unlogined.jpg") 
    },

    userName() {
      return this.isLogined ? this.curUser.nickname : '未登录用户' 
    },
  },

  watch: {

    //FIXME: 设置Vuex中的全局状态为监听属性，使得播放器组件的状态成为响应式，此时在其他组件中改变全局状态，就可以同时改变播放器的视图
    curSong(newVal, oldVal) {
      //当前歌曲变化时，播放歌曲
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        const audio = this.$refs.audioRef
        let prom = audio.play()
        if (prom !== undefined) 
          prom.then(() => {}).catch(()=>{
            this.$notify({ type: 'danger', message: '音乐无法播放' })
          })
        this.setPlayingState(true)
      }, 1000)
    },

    playing(newVal) {
      const audio = this.$refs.audioRef
      this.$nextTick(() => {
        newVal ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style>
/* FIXME: body, html都要设置成100%, 才能自适应屏幕 */
/* body, html{
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
} */

* {
  margin: 0;
  padding: 0;
}

html {
  overflow-x: hidden;
  background: #fafafa;
}

body {
  display: flex;
  overflow-x: hidden;
}

#app {
  width: 100%;
  height: 100%;
}

.user-info{
  width: 100%;
  height: 100%;
}

.user-img {
  width: 100%;
  height: 20%;
  text-align:center;
  padding-top:10%;
}

.buttons{
  text-align:center;
}

.data-detail {
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  width: 100%;
  height: 100%;
  z-index: 1;
}

#play-bar {
  /* border-bottom: 1px solid #D3D3D3; */
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: 100%;
  height: 60px;
}

.page-slide-enter-active {
  transition: all 0.3s ease;
}

.page-slide-leave-active {
  transition: all 0.3s ease-out;
}

.page-slide-enter,
.page-slide-leave-active {
  transform: translateX(100%);
}

.fade-enter-active {
  transition: all 0.3s ease;
}

.fade-leave-active {
  transition: all 0.3s ease-out;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.play-slide-enter-active {
  transition: all 0.3s ease;
}

.play-slide-leave-active {
  transition: all 0.3s ease-out;
}

.play-slide-enter,
.play-slide-leave-active {
  transform: translateY(100vh);
}

.bar-slide-enter-active {
  transition: all 0.3s ease;
}

.bar-slide-leave-active {
  transition: all 0.3s ease-out;
}

</style>
