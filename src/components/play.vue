<template>
  <div id="player" class="music-play-page">
    <div class="music-album">
      <div class="play-page-hide-btn"
           @touchend.prevent.stop="hidePlayPage"
           @click="hidePlayPage">
        <img src="../assets/icon-jiantou.png" alt="">
      </div>
      <van-image
        :src="curSong.albumUrl"
      />
    </div>
    <div class="button-group">
      <img class="blurbg" :src="curSong.albumUrl">
      <div class="progress-bar-group">
        <div class="progress-bar">
          <div class="progress" :style="{width:indicatorPosition+'%'}"></div>
          <div class="indicater" :style="{left:indicatorPosition+'%'}"></div>
        </div>
        <div class="time-indicater">
          <span>{{currentTime}}</span>
          <span>{{duration}}</span>
        </div>
      </div>
      <div class="music-info">
        <p class="music-name">{{curSong.name}}</p>
        <p class="music-author">{{curSong.author}}</p>
      </div>
      <div class="lyric">
        <lyric :songid="curSong.id" :currentTime="currentTime"></lyric>
      </div>
      <div class="music-ctrl">
      <ul>
        <li><img :src="isCollected ? iconLiked : iconLike"
                 @click="likeSong"
                 @touchend.prevent="likeSong"
                 ></li>
        <li><img src="../assets/icon-shangyiqu.png"
                 @click="playFront"
                 @touchend.prevent="playFront"
                  ></li>
        <li><img :src="playing? iconPause : iconPlay"
                  @click="$parent.togglePlaying"
                  @touchend="$parent.togglePlaying"></li>
        <li><img src="../assets/icon-xiayiqu.png"
                 @click="playNext"
                 @touchend.prevent="playNext"
                ></li>
        <li><img src="../assets/icon-list.png"
                 @touchend.prevent="showPlayList"
                 @click="showPlayList"
                ></li>
      </ul>
    </div>
  </div>
</div>

</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import Lyric from './lyric.vue'
import Api from 'src/api.js'

export default {
  components: {
    Lyric
  },
  data() {
    return {
      iconPlay: require("../assets/icon-play.png"),
      iconPause: require("../assets/icon-pause.png"),
      iconLiked: require("../assets/like.png"),
      iconLike: require("../assets/icon-like.png"),
      isCollected: false,
    }
  },

  methods: {
    ...mapMutations(['setPlayingState','showPlayList','playFront', 'playNext']),

    hidePlayPage: function () {
      this.$parent.playPageShow = false
    },

    likeSong() {
      if (!this.isLogined) {
        this.$toast.fail("您还未登陆")
        this.$router.push('/userform/login')
        return
      }

      var formData = new FormData()
      formData.append('songId', this.curSong.id)
      formData.append('sheetId', this.curUser.lid)

      if (this.isCollected) {
        Api.deleteSongFromSheet(formData)
          .then(function(res){
            console.log(res)
            if (res.data.code != 0) {
              this.$toast.fail(res.data.msg)
              return
            }
            this.$toast.success(res.data.msg)
            this.isCollected = false
          }.bind(this)).catch(Api.onError.bind(this))
      }
      else {
        Api.addSongToSheet(formData)
          .then(function(res){
            console.log(res)
            if (res.data.code != 0) {
              this.$toast.fail(res.data.msg)
              return
            }
            this.$toast.success(res.data.msg)
            this.isCollected = true
          }.bind(this)).catch(Api.onError.bind(this))
      }
    },
  },
  computed: {
     ...mapGetters(['curSong', 'playing', 'currentTime', 'duration','isLogined', 'curUser']),
     ...mapState({
        indicatorPosition: state => state.PlayService.currentTime / state.PlayService.duration * 100,
      })
  },
  watch: {

  }
}
</script>

<style scoped>
    .music-play-page {
    width: 100%;
    max-width: 68vh;
    height: 100%;
    position: fixed;
    top: 0;
    z-index: 5;
  }

  .music-play-page .music-album {
    width: 100%;
    height: 100vw;
    max-height: 68vh;
  }

  .music-play-page .music-album img {
    width: 100%;
    display: block;
    /*    -webkit-filter:blur(100px);*/
  }

  .music-play-page .button-group {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    top: 100vw;
    background: rgba(255, 255, 255, 0.76);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .blurbg {
    position: absolute;
    width: 100%;
    z-index: -1;
    display: block;
    -webkit-filter: blur(30px);
    -moz-filter: blur(30px);
    -ms-filter: blur(30px);
    -o-filter: blur(30px);
    filter: blur(30px);
  }

  .music-play-page .button-group .lyric {
    min-height: 35px;
    flex-grow: 2;
    display: flex;
    flex-direction: column;
  }

  .music-play-page .button-group .progress-bar-group {
    height: 30px;
  }

  .music-play-page .button-group .progress-bar-group .progress-bar {
    height: 4px;
    background: #cccccc;
    position: relative;
  }

  .music-play-page .button-group .progress-bar-group .progress-bar .progress {
    height: 100%;
    background: #7f7f7f;
    /*width: 20%;*/
  }

  .music-play-page .button-group .progress-bar-group .progress-bar .indicater {
    position: absolute;
    width: 2px;
    height: 12px;
    background: #ff2d55;
    top: 0;
    /*left: 20%;*/
  }

  .music-play-page .button-group .progress-bar-group .time-indicater {
    margin-top: 8px;
    line-height: 16px;
    font-size: 12px;
  }

  .music-play-page .button-group .progress-bar-group .time-indicater span {
    padding: 0 10px;
  }

  .music-play-page .button-group .progress-bar-group .time-indicater span:last-child {
    float: right;
  }

  .music-play-page .button-group .music-info .music-name {
    text-align: center;
    font-weight: bold;
    font-size: 18px;
  }

  .music-play-page .button-group .music-info .music-author {
    text-align: center;
    font-size: 12px;
    color: #8f8f8f;
  }

  .music-play-page .button-group .music-ctrl {
    height: 50px;
  }

  .music-play-page .button-group .music-ctrl ul {
    height: 100%;
    width: 100%;
    list-style: none;
  }

  .music-play-page .button-group .music-ctrl ul li {
    float: left;
    width: 20%;
    height: 100%;
  }

  .music-play-page .button-group .music-ctrl ul li img {
    display: block;
    width: 35px;
    margin: 0 auto;
  }

  .music-play-page .button-group .music-ctrl ul li:first-child img {
    margin-left: 10px;
  }

  .music-play-page .button-group .music-ctrl ul li:last-child img {
    margin-right: 10px;
  }

  .music-play-page .button-group .volue-bar-group {

  }

  .music-play-page .button-group .volue-bar-group .volue-bar {
    width: 70%;
    height: 100%;
    margin: 0px auto;
    position: relative;
  }

  .music-play-page .button-group .volue-bar-group .volue-bar .volue-line {
    width: 100%;
    height: 3px;
    background: #cccccc;
    position: absolute;
    top: 50%;
    margin-top: -1.5px;
  }

  .music-play-page .button-group .volue-bar-group .volue-bar .volue-line .volue {
    height: 100%;
    width: 20%;
    background: #7f7f7f;
  }

  .music-play-page .button-group .volue-bar-group .volue-bar .value-indicater {
    position: absolute;
    height: 15px;
    width: 15px;
    border: 1px solid rgba(185, 185, 185, 0.4);
    border-radius: 50%;
    margin-top: -7.5px;
    margin-left: -7.5px;
    top: 50%;
    left: 20%;
    background: #fff;
    box-shadow: 0 2px 2px 0 #8f8f8f;
  }

  .music-play-page .button-group .volue-bar-group .volue-icon {
    width: 15%;
    height: 100%;
    position: relative;
  }

  .music-play-page .button-group .volue-bar-group .volue-icon img {
    width: 20px;
    display: block;
    position: absolute;
    top: 50%;
    margin-top: -10px;
  }

  .music-play-page .button-group .volue-bar-group .volue-left {
    float: left;
  }

  .music-play-page .button-group .volue-bar-group .volue-right {

    float: right;
  }

  .music-play-page .button-group .volue-bar-group .volue-left img {
    right: 0;
  }

  .music-play-page .button-group .other-button ul {
    height: 100%;
    width: 100%;
    list-style: none;
  }

  .music-play-page .button-group .other-button ul li {
    float: left;
    width: 25%;
    height: 100%;
    position: relative;
  }

  .music-play-page .button-group .other-button ul li img {
    display: block;
    width: 20px;
    position: absolute;
    bottom: 10px;
    left: 50%;
    margin-left: -10px;
  }

  .music-play-page .music-album .play-page-hide-btn {
    width: 25px;
    height: 25px;
    top: 27px;
    left: 11px;
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1;
  }

  .music-play-page .music-album .play-page-hide-btn img {
    width: 12px;
    height: 12px;
    display: inline-block;
  }

  @media screen and (min-width: 68vh) {
    .music-play-page .music-album {
      height: 68vh;
    }

    .music-play-page .button-group {
      top: 68vh;
      width: 68vh;
      margin: 0 auto;
      margin-left: -34vh;
      left: 50%;
    }
  }
</style>