<template>
  <div class="data-detail">
    <van-nav-bar
      title="我的收藏"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <van-tabs v-model="active">
      <van-tab :title="'歌手 ' + artistList.length">
        <van-list
          v-if="artistList.length > 0"
          v-model="artistLoading"
          :finished="artistFinished"
          finished-text="没有更多了"
          error-text="加载失败"
          @load="onLoad(artistLoading, artistFinished)"
          immediate-check
        >
          <van-cell 
            :key="artist.id" 
            v-for="artist in artistList" 
            :title="artist.name"
            @click="$router.push('/artist/' + artist.id)"
            size="large">
            <template slot="icon">
              <van-image
                round
                width="2.5rem"
                height="2.5rem"
                :src="artist.picUrl"
              />
            </template>
          </van-cell>
        </van-list>
      </van-tab>
      
      <van-tab :title="'专辑 ' + albumList.length">
        <van-list
          v-if="albumList.length > 0"
          v-model="albumLoading"
          :finished="albumFinished"
          error-text="加载失败"
          finished-text="没有更多了"
          @load="onLoad(albumLoading, albumFinished)"
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

      <van-tab :title="'歌单 ' + sheetList.length">
        <van-list
          v-if="sheetList.length > 0"
          v-model="sheetLoading"
          :finished="sheetFinished"
          error-text="加载失败"
          finished-text="没有更多了"
          @load="onLoad(sheetLoading, sheetFinished)"
          immediate-check
        >
          <van-cell 
            :key="sheet.id" 
            v-for="sheet in sheetList" 
            :title="sheet.name"
            :label="sheet.username"
            @click=" $router.push('/sheet/' + sheet.id)"
            size="large">
            <template slot="icon">
              <van-image
                radius="3"
                width="2.5rem"
                height="2.5rem"
                :src="sheet.picUrl"
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
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  components: {
    
  },

  data() {
    return {
      active: 0,
      artistList: [],
      artistLoading: false,
      artistFinished: true,
      albumList: [],
      albumLoading: false,
      albumFinished: true,
      sheetList: [],
      sheetLoading: false,
      sheetFinished: true,
    }
  },

  mounted: function(){
    if(this.isLogined) {
      Api.findCollections(this.curUser.id, 1)
      .then(function(res){
        console.log(res)
        if (res.data.code != 0) {
          this.$toast.fail(res.data.msg);
          return
        }
        this.albumList = res.data.data
      }.bind(this)).catch(Api.onError.bind(this))

      Api.findCollections(this.curUser.id, 2)
      .then(function(res){
        console.log(res)
        if (res.data.code != 0) {
          this.$toast.fail(res.data.msg);
          return
        }
        this.sheetList = res.data.data
      }.bind(this)).catch(Api.onError.bind(this))

      Api.findCollections(this.curUser.id, 3)
      .then(function(res){
        console.log(res)
        if (res.data.code != 0) {
          this.$toast.fail(res.data.msg);
          return
        }
        this.artistList = res.data.data
      }.bind(this)).catch(Api.onError.bind(this))
    }
  },

  methods: {
    
    onLoad: function(loading, finished) {
      console.log('onLoad()')
    },
  },

  computed: {
    ...mapGetters(['curUser', 'isLogined']),
  } 
}
</script>

<style scoped>

</style>