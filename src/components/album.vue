<template>
  <div class="data-detail" v-if="isLoaded">
    <van-nav-bar
      :title="album.name"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-image
      :src="album.picUrl"
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

  mounted: function(){
    this.albumId = this.$route.params.id
     Api.albumDetail(this.albumId)
      .then(function(res){
        console.log(res)
        // console.log(this)
        if (res.data.code != 0) {
          this.$toast.fail(response.data.msg)
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
          this.$toast.fail(response.data.msg)
          return
        }
        this.$refs.songs.songList = res.data.data
      }.bind(this)).catch(Api.onError.bind(this))
      
  },
}
</script>

<style scoped>

</style>