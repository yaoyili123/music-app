<template>
  <div class="data-detail" v-if="isLoaded">
    <van-nav-bar
      :title="album.name"
      left-text="返回"
      :right-text="isCollected? '取消收藏' : '收藏'"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="collect"
    />
    <van-image
      :src="album.picUrl"
    />
    <van-cell title="全部歌曲" size="large"/>
    <songList titleType :listType=1 ref="songs"></songList>
  </div>
</template>

<script>
import Api from 'src/api.js'
import SongList from './songList'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  components: {
    SongList,
  },

  data() {
    return {
      isLoaded: false,
      albumId: 0,
      album: {}, 
      isCollected: false,
    }
  },

  mounted: function(){
    this.albumId = this.$route.params.id

    if(this.isLogined) {
      let params = {
        uid: this.curUser.id,
        rid: this.albumId,
        t: 1,
      }
      Api.checkCollected(params)
      .then(function(res){
        console.log(res)
        if (res.data.code != 0) {
          this.$toast.fail(res.data.msg)
          return
        }
        this.isCollected = res.data.data
      }.bind(this)).catch(Api.onError.bind(this))
    }

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
      this.$refs.songs.belongId = this.albumId
      this.$refs.songs.tid = 2
    }.bind(this)).catch(Api.onError.bind(this))
    
  },

  methods: {
    
    collect() {
      if (!this.isLogined) {
        this.$toast.fail("您还未登陆")
        this.$router.push('/userform/login')
        return
      }

      var formData = new FormData()
      formData.append('uid', this.curUser.id)
      formData.append('rid', this.albumId)
      formData.append('t', 1)

      if (this.isCollected) {
        Api.uncollect(formData)
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
        Api.collect(formData)
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
    ...mapGetters(['curUser', 'isLogined']),
  } 
}
</script>

<style scoped>

</style>