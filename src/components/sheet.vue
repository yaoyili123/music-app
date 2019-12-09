<template>
  <div class="data-detail" v-if="isLoaded">
    <van-nav-bar
      :title="sheet.name"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div style="width: 100%; text-align:center">
      <van-image
      :src="sheet.picUrl"
    />
    </div>
    <van-cell title="歌曲列表" size="large"/>
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
      sheetId: -1,
      sheet: {},  
    }
  },

  mounted: function(){
    this.sheetId = this.$route.params.id
      Api.getSheet(this.sheetId)
      .then(function(res){
        // console.log(res)
        if (res.data.code != 0) {
          this.$toast.fail(res.data.msg)
          return
        }
        this.sheet = res.data.data
        this.isLoaded = true
      }.bind(this)).catch(Api.onError.bind(this))

      Api.getSongs(this.sheetId, 'sheet')
      .then(function(res){
        // console.log(res)
        if (res.data.code != 0) {
          this.$toast.fail(res.data.msg)
          return
        }
        console.log("getSongs: ")
        // console.log(this.$refs)
        this.$refs.songs.songList = res.data.data
        this.$refs.songs.sheetId = this.sheetId
      }.bind(this)).catch(Api.onError.bind(this))
  },
}
</script>

<style scoped>

</style>