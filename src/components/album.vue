<template>
  <div class="album-detail" v-if="isLoaded">
    <van-nav-bar
      :title="album.name"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-image
      :src="album.picurl"
    />
    <van-cell title="全部歌曲" size="large"/>
    <songList titleType ref="songs"></songList>
  </div>
</template>

<script>
import Api from 'src/api.js'
import SongList from './songList'

export default {
  components: {
    SongList,
  },

  data() {
    return {
      isLoaded: false,
      albumId: 0,
      album: {},  
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
        this.$refs.songs.songList = res.data.data
      }.bind(this)).catch(Api.onError.bind(this))
      
  },
}
</script>

<style scoped>
.album-detail {
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 1;
  width: 100%;
  height: 100%;
}
</style>