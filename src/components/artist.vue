<template>
  <div class="data-detail" v-if="isLoaded">
    <van-nav-bar
      :title="artist.name"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <van-image
      :src="artist.picUrl"
    />

    <van-tabs>
      <van-tab title="歌曲">
        <songList titleType ref="songs"></songList>
      </van-tab>
      <van-tab title="专辑">
        <van-list
            v-if="albumList.length > 0"
            v-model="albumLoading"
            :finished="albumFinished"
            error-text="加载失败"
            finished-text="没有更多了"
            immediate-check
          >
            <van-cell 
              :key="album.id" 
              v-for="album in albumList" 
              :title="album.name"
              :label="album.author"
              @click="$router.push('/album/' + album.id)"
              size="large">
              <template slot="icon">
                <van-image
                  radius="3"
                  width="2.5rem"
                  height="2.5rem"
                  :src="album.picUrl"
                />
              </template>
            </van-cell>
          </van-list>
      </van-tab>
    </van-tabs>
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
      artistId: 0,
      artist: {},   
      albumList: [],
      albumLoading: false,
      albumFinished: true, 
    }
  },

  mounted: function(){
    this.artistId = this.$route.params.id
    //FIXME: Promis的then函数注意要绑定vue组件（当前this引用）

     Api.artistDetail(this.artistId)
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
        this.artist = res.data.data
        this.isLoaded = true
      }.bind(this)).catch(Api.onError.bind(this))

      Api.getSongs(this.artistId, 'artist')
      .then(function(res){
        console.log(res)
        if (res.data.code != 0) {
          this.$toast.fail(res.data.msg)
          return
        }
        this.$refs.songs.songList = res.data.data
      }.bind(this)).catch(Api.onError.bind(this))

      Api.getAlbumsbyArtist(this.artistId)
      .then(function(res){
        console.log(res)
        if (res.data.code != 0) {
          this.$toast.fail(res.data.msg)
          return
        }
        this.albumList = res.data.data
        this.isLoaded = true
      }.bind(this)).catch(Api.onError.bind(this))
  },
}
</script>

<style scoped>

</style>