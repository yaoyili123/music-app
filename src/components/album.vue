<template>
  <div class="album-detail" v-if="isLoaded">
    <van-nav-bar
      :title="album.name"
      left-text="返回"
      left-arrow
      @click-left="onBack"
    />
    <van-image
      :src="album.picurl"
    />
    <van-cell title="全部歌曲" size="large"/>
    <van-list
        v-if="songList.length > 0"
        v-model="songLoading"
        :finished="songFinished"
        error-text="加载失败"
        finished-text="没有更多了"
        immediate-check
    >
        <van-cell
        :key="song.id" 
        :title-style="song.mUrl? '': 'color:#D3D3D3'"
        v-for="song in songList" 
        :title="song.name" 
        @click="setCurSong(song)"
        />
    </van-list>
  </div>
</template>

<script>
import Api from 'src/api.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      isLoaded: false,
      albumId: 0,
      album: {},
      songList: [],
      songLoading: false,
      songFinished: true,    
    }
  },

  created: function(){
    this.albumId = this.$route.params.id
     Api.albumDetail(this.albumId)
      .then(function(res){
        console.log(res)
        // console.log(this)
        if (res.data.code != 0) {
          this.$dialog.alert({
            title: '提示',
            message: res.data.msg
          }).then(() => {
            this.$router.go(-1)
          })
          return
        }
        this.album = res.data.data
        this.isLoaded = true
      }.bind(this)).catch(Api.onError.bind(this))

      Api.getSongs(this.albumId, 'album')
      .then(function(res){
        console.log(res)
        // console.log(this)
        if (res.data.code != 0) {
          this.$dialog.alert({
            title: '提示',
            message: res.data.msg
          }).then(() => {
            this.$router.go(-1)
          })
          return
        }
        this.songList = res.data.data
      }.bind(this)).catch(Api.onError.bind(this))
      
  },
  methods: {
    ...mapMutations({
      setCurSong: 'setCurSong',
    }),

    onBack: function() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.album-detail {
  background-color: white;
  width: 100%;
  height: 100%;
}
</style>