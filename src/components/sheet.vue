<template>
  <div class="data-detail" v-if="isLoaded">
    <van-nav-bar
      :title="sheet.name"
      left-text="返回"
      :right-text="collectText"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="collect"
    />
    <div style="width: 100%; text-align:center">
      <van-image
      :src="sheet.picUrl"
    />
    </div>
    <van-cell title="歌曲列表" size="large"/>
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
      sheetId: -1,
      sheet: {},  
      isCollected: false,
    }
  },

  mounted: function(){
    this.sheetId = this.$route.params.id

    if (this.isLogined) {
      let params = {
        uid: this.curUser.id,
        sid: this.sheetId
      }
      Api.checkHavedSheet(params)
      .then(function(res){
        // console.log(res)
        if (res.data.code != 0) {
          this.$toast.fail(res.data.msg)
          return
        }
        this.setOwn(res.data.data)
      }.bind(this)).catch(Api.onError.bind(this))

      let params2 = {
        uid: this.curUser.id,
        rid: this.sheetId,
        t: 2,
      }
      Api.checkCollected(params2)
      .then(function(res){
        console.log(res)
        if (res.data.code != 0) {
          this.$toast.fail(res.data.msg)
          return
        }
        this.isCollected = res.data.data
      }.bind(this)).catch(Api.onError.bind(this))
    }
    
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

  methods: {
    ...mapMutations(['setOwn']),

    collect() {
      if (this.own)
        return

      if (!this.isLogined) {
        this.$toast.fail("您还未登陆")
        this.$router.push('/userform/login')
        return
      }

      var formData = new FormData()
      formData.append('uid', this.curUser.id)
      formData.append('rid', this.sheetId)
      formData.append('t', 2)

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
    ...mapGetters(['curUser', 'isLogined', 'own']),

    collectText() {
      if (this.own) 
        return ''
      return this.isCollected ? '取消收藏' : '收藏'
    }
  }
}
</script>

<style scoped>

</style>