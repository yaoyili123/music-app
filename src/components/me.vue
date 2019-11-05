<template>
  <div class="me">
    <div class="me-logined" v-if="isLogined">
      <van-action-sheet 
        v-model="asShow" 
        :actions="actions" 
        @select="onSelect" 
        close-on-click-action />

      <van-dialog
      v-model="dialogShow"
      title="添加歌单"
      show-cancel-button
      @confirm="addSheet"
      >
        <van-field v-model="sheetName" placeholder="请输入歌单标题" />
      </van-dialog>

      <van-collapse v-model="activeNames">
        <van-collapse-item title="创建的歌单" name="1">
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
              size="large">
              <template slot="icon">
                <van-image
                  radius="3"
                  width="2.5rem"
                  height="2.5rem"
                  :src="sheet.picUrl"
                />
              </template>
              <van-icon
                slot="right-icon"
                name="bars"
                size="1.5em"
                style="line-height: inherit;"
                @click="asShow = true; selectId = sheet.id"
              />
            </van-cell>
          </van-list>
        </van-collapse-item>
      </van-collapse>

      <van-button 
        style="left:70%" 
        icon="plus" 
        type="info"
        @click="dialogShow = true">
        添加歌单
      </van-button>
    </div>
    <div class="me-unlogined" v-if="!isLogined">
      您还未登录，点击按钮去登陆
      <van-button 
        type="info"
        @click="toLogin">
        登陆
      </van-button>
    </div>
  </div>
</template>

<script>
import Api from 'src/api.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      activeNames: ['1'],
      asShow: false,
      dialogShow: false,
      actions: [
        { name: '删除歌单' },
        { name: '编辑歌单' },
      ],
      sheetName: '',
      sheetList: [],
      sheetLoading: false,
      sheetFinished: true,
      selectId: -1,
    };
  },

  methods: {
    ...mapMutations({
      setUpdateSheet: 'setUpdateSheet',
    }),
    addSheet: function() {
      if (this.sheetName == '') {
        this.$toast.fail('歌单名不能为空')
      }
      var formData = new FormData()
      formData.append('name', this.sheetName)
      formData.append('uid', this.curUser.id)
      
      this.sheetName = ''
      Api.addSheet(formData).then(function (response) {
        console.log(response);
        if (response.data.code) {
          this.$toast.fail(response.data.msg);
          return
        }
        var sheet = response.data.data
        this.sheetList.push(sheet)
        this.$toast.success('创建成功')
        
      }.bind(this)).catch(Api.onError.bind(this))
    },

    toLogin: function() {
      this.$router.push('/userform/login')
    },

    fetchSheets: function() {
      Api.getSheets(this.curUser.id).then(function (response) {
        console.log(response);
        if (response.data.code) {
          this.$toast.fail(response.data.msg);
          return
        }
        this.sheetList = response.data.data
      }.bind(this)).catch(Api.onError.bind(this))
    },

    onLoad: function(loading, finished) {
      console.log('onLoad()')
    },

    onSelect(item) {
      // 默认情况下，点击选项时不会自动关闭菜单
      // 可以通过 close-on-click-action 属性开启自动关闭
      // this.$toast(this.selectSheet);
      if (item.name == '编辑歌单')
        this.$router.push('/userform/updateSheet/' + this.selectId)
      else {
        Api.deleteSheet(this.selectId).then(function (response) {
        console.log(response);
        if (response.data.code) {
          this.$toast.fail(response.data.msg);
          return
        }
        this.$toast.success('删除成功')
        this.setUpdateSheet(true)
      }.bind(this)).catch(Api.onError.bind(this))
      }
    }
  },

  created() {
    if (this.isLogined)
      this.fetchSheets()
  },

  computed: {
    ...mapGetters(['curUser', 'isLogined', 'updateSheet']),
  },

  watch: {
    isLogined(newVal, oldVal) {
      if (oldVal != newVal && newVal == true) {
        this.fetchSheets()
      }
    },
    
    updateSheet(newVal, oldVal) {
      console.log('watch updateSheet()')
      if (oldVal != newVal && newVal == true) {
        this.fetchSheets()
        this.setUpdateSheet(false)
      }
    }
  }
}
</script>

<style>
.me-unlogined {
  padding: 10%;
}
</style>