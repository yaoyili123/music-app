<template>
  <div class="player">
    <van-cell 
      style="background-color:#f6f7f9"
      :title="curSong.name"
      :label="curSong.author"
      size="large">
      <template slot="icon">
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

</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      //标志canplay事件是否完成
      songCanplay: false,
      currentIcon: 'play-circle-o',
    }
  },
  methods: {
    ...mapMutations({
      setPlayingState: 'setPlayingState',
    }),
    togglePlaying: function() {
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
    }
  },
  computed: {
     ...mapGetters(['curSong', 'playing']),
  },
  watch: {
    //FIXME: 设置Vuex中的全局状态为监听属性，使得播放器组件的状态成为响应式

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
.player {
  /* border-bottom: 1px solid #D3D3D3; */
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: 100%;
  height: 60px;
}
</style>