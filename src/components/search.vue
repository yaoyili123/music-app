<template>
  <div id="search">
    <van-search
      v-model="searchKey"
      placeholder="请输入搜索关键词"
      show-action
      @search="onSearch"
    />
    <div class="his-list">
      <van-tag 
        :key="hisKey" 
        v-for="hisKey in searchHistory" 
        @click="selectHistory(hisKey)"
        size="medium"
        @close="tagClose(hisKey)"
        closeable round plain>
      {{hisKey}}
    </van-tag>
    </div>

    <div class="result-list">
      <van-tabs v-model="active" v-if="isResult">
        <van-tab title="歌曲">
          <van-list
            v-if="songList.length > 0"
            v-model="songLoading"
            :finished="songFinished"
            error-text="加载失败"
            finished-text="没有更多了"
            @load="onLoad(songLoading, songFinished)"
            immediate-check
          >
            <van-cell 
              :title-style="song.mUrl? '': 'color: #D3D3D3'"
              :key="song.id" 
              v-for="song in songList" 
              :title="song.name + '-' + song.author"
              clickable
              @click="setCurSong(song)"
               />
          </van-list>
        </van-tab>

        <van-tab title="歌手">
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
              @click="toOther('/artist/' + artist.id)"
              size="large">
              <template slot="icon">
                <van-image
                  round
                  width="2.5rem"
                  height="2.5rem"
                  :src="artist.picurl"
                />
              </template>
            </van-cell>
          </van-list>
        </van-tab>
        
        <van-tab title="专辑">
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
              @click="toOther('/album/' + album.id)"
              size="large">
              <template slot="icon">
                <van-image
                  radius="3"
                  width="2.5rem"
                  height="2.5rem"
                  :src="album.picurl"
                />
              </template>
            </van-cell>
          </van-list>
        </van-tab>

        <van-tab title="歌单">
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

              size="large">
              <template slot="icon">
                <van-image
                  radius="3"
                  width="2.5rem"
                  height="2.5rem"
                  :src="sheet.picurl"
                />
              </template>
            </van-cell>
          </van-list>
        </van-tab>

      </van-tabs>
    </div>
  </div>
</template>

<script >
import Api from 'src/api.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      searchKey: '',
      searchHistory: [],
      active: 0,
      isResult: false,
      songList: [],
      songLoading: false,
      songFinished: true,
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

  methods: {
    ...mapMutations({
      setCurSong: 'setCurSong',
    }),

    selectHistory: function(kw) {  
      // console.log(this)
      this.$data.searchKey = kw
    },

    onSearch: function() {
      if (this.searchHistory.indexOf(this.searchKey) == -1)
        this.searchHistory.push(this.searchKey)
      // console.log('onSearch()')
      localStorage.searchHistory = JSON.stringify(this.searchHistory)

      if (this.isResult) {
        this.songList = []
        this.artistList = []
        this.sheetList = []
        this.albumList = []
        console.log('clean Lists')
      }
        
      Api.findMusic(this.searchKey, -1)
      .then(this.onSuccessSearch).catch(Api.onError.bind(this))
    },

    tagClose: function(kw) {
      console.log('tagClose()')
      let idx = this.searchHistory.indexOf(kw)
      if (idx != -1)
        this.searchHistory.splice(idx, 1)
    },

    onSuccessSearch: function(res) {
      console.log(res)
      let resData = res.data.data
      this.songList.push(...resData.songs)
      this.artistList.push(...resData.artists)
      this.sheetList.push(...resData.sheets)
      this.albumList.push(...resData.albums)
      this.isResult = true
    },

    onLoad: function(loading, finished) {
      console.log('onLoad()')
    },

    toOther: function(path) {
      this.$router.push(path)
    }
  },

  created: function() {
    if (localStorage.searchHistory) {
        this.searchHistory = JSON.parse(localStorage.searchHistory)
    }
  }
}
</script>

<style>
.his-list {
  padding-left: 5%;
  padding-right: 5%;
  padding-bottom: 10%;
}

.his-list span{
  margin-right: 5px;
}

.van-cell__title {
  padding-left: 1rem;
}
</style>