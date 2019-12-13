<template>
  <div class="song-list">
    <van-action-sheet 
      v-model="asShow" 
      :actions="actions" 
      @select="onSelect" 
      @close="closeActionSheet"
      close-on-click-action />

    <van-dialog
      v-model="dialogShow"
      title="选择歌单"
      >
      <van-list
        v-if="sheetList.length > 0"
        v-model="sheetLoading"
        :finished="sheetFinished"
        @load="onLoad(sheetLoading, sheetFinished)"
        immediate-check
      >
        <van-cell 
          :key="sheet.id" 
          v-for="sheet in sheetList" 
          :title="sheet.name"
          :label="sheet.songNum + '首'"
          @click="addSong(sheet.id)"
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
    </van-dialog>

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
      :title-style="song.mUrl? '': 'color: #D3D3D3'"
      v-for="song in songList" 
      :title="titleType? song.name : song.name + '-' + song.author" 
      @click="playSong(song)"
      >
        <van-icon
          slot="right-icon"
          name="bars"
          style="line-height: inherit;"
          @click.stop="showActionSheet(song.id)"
          @select="onSelect" 
        />
      </van-cell>
  </van-list>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Api from 'src/api.js'

export default {
  props: {
    titleType: Boolean,
    /* 
    1.Album/Artist/Sheet详情页
    2.播放列表页
    */
    listType: Number,
  },

  data() {
    return {
      songList: [],
      songLoading: false,
      songFinished: true,
      dialogShow: false,
      asShow: false,
      songId: -1, 
      //当前用户歌单ID
      sheetId: -1,
      sheetList: [],
      sheetLoading: false,
      sheetFinished: true,
    }
  },

  methods: {
    ...mapMutations(['setCurSong','setUpdateSheet','setPlayList',]),

    playSong(curSong) {
      this.setPlayList(this.songList)
      this.setCurSong(curSong)
    },

    onSelect(item) {
      if (item.name == '收藏到歌单') {
        Api.getSheets(this.curUser.id).then(function (response) {
          console.log(response);
          if (response.data.code) {
            this.$toast.fail(response.data.msg);
            return
          }
          this.sheetList = response.data.data
          this.dialogShow = true
        }.bind(this)).catch(Api.onError.bind(this))
      }
        
      if (item.name == '从歌单中删除') {
        this.$dialog.confirm({
          title: '确认',
          message: '确认删除吗?'
        }).then(() => {
          var formData = new FormData()
          formData.append('songId', this.songId)
          formData.append('sheetId', this.sheetId)

          Api.deleteSongFromSheet(formData).then(function (response) {
            console.log(response);
            if (response.data.code) {
              this.$toast.fail(response.data.msg);
              return
            }
            this.$toast.success('删除成功')
            for (let i = 0; i < this.songList.length; i++) {
              if (this.songList[i].id == this.songId) {
                this.songList.splice(i, 1)
                break
              }
            }
            this.setUpdateSheet(true)
            this.dialogShow = false
          }.bind(this)).catch(Api.onError.bind(this))
        }).catch(() => {
          // on cancel
        });
        
      }
    },

    addSong(sheetId) {
      var formData = new FormData()
      formData.append('songId', this.songId)
      formData.append('sheetId', sheetId)
      
      Api.addSongToSheet(formData).then(function (response) {
        console.log(response);
        if (response.data.code) {
          this.$toast.fail(response.data.msg);
          return
        }
        this.$toast.success('添加成功')
        this.setUpdateSheet(true)
        this.dialogShow = false
      }.bind(this)).catch(Api.onError.bind(this))
    },

    closeActionSheet() {
      console.log('closeActionSheet()')
      let nodes = document.getElementsByClassName('data-detail')
      if (nodes.length != 0)
        nodes[0].style.zIndex = '5'
    },

    showActionSheet(id) {
      this.songId = id
      //FIXME: js不能像python一样访问新key就能添加，要先有一个key-value
      let nodes = document.getElementsByClassName('data-detail')
      if (nodes.length != 0)
        nodes[0].style.zIndex = '11'
      this.asShow = true
    }
  },

  computed: {
    ...mapGetters(['curUser', 'isLogined', 'updateSheet', 'own']),

    actions() {
      var options = []
      if (this.listType == 2) {
        options.push(
          {name: '从播放列表中删除'},
        )
      }

      if (this.listType == 1) {
        if (this.own) options.push(
          { name: '从歌单中删除' },
        )
        else options.push(
          { name: '收藏到歌单' },
        )
      }
    
      return options
    }
  },
}
</script>

<style>

</style>