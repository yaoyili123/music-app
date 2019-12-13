<template>
  <div class="userform">
    <van-nav-bar
    :title="修改歌单信息"
    left-text="返回"
    left-arrow
    @click-left="$router.go(-1)"
    />
    <div class="updateSheet">
      <van-cell-group>
        <van-field
          v-model="sheet.name"
          required
          clearable
          label="歌单名称"
          placeholder="歌单名称"
        />

        <van-field
          v-model="sheet.description"
          rows="2"
          autosize
          label="歌单描述"
          placeholder="请输入描述"
        />
      </van-cell-group>
      <van-uploader 
        v-model="fileList"
        multiple
        :max-count="1"
        :after-read="afterRead"
      />
      <div class="form-button">
        <van-button 
          type="info" 
          size="large"
          style="width:50%"
          @click="updateSheet"
          >
          修改
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Api from 'src/api.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      pic: undefined,
      fileList: [],
      sheet: {}
    }
  },

  created() {
    this.sheetId = this.$route.params.sid
    Api.getSheet(this.sheetId).then(function (response) {
      console.log(response);
      if (response.data.code) {
        this.$toast.fail(response.data.msg);
        return
      }
      this.sheet = response.data.data
      this.fileList.push({'url' : this.sheet.picUrl})
    }.bind(this)).catch(Api.onError.bind(this))
  },

  methods: {
    ...mapMutations(['setUpdateSheet',]),

    afterRead: function(param) {
      var file = param.file
      if (file.type !== 'image/jpeg') {
        this.$toast.fail('请上传 jpg 格式图片')
        return false
      }
      this.pic = file
      return true
    },

    checkSheet: function() {
      if (this.sheet.name == '') {
        this.$toast.fail('歌单名不能为空')
        return false
      }
      return true
    },

    updateSheet: function() {
      if (!this.checkSheet()) return

      var formData = new FormData()
      formData.append('id', this.sheet.id)
      formData.append('name', this.sheet.name)
      formData.append('description', this.sheet.description)

      if (this.pic !== undefined)
        formData.append('pic', this.pic)
    
      Api.updateSheet(formData).then(function (response) {
        console.log(response);
        if (response.data.code) {
          this.$toast.fail(response.data.msg);
          return
        }
        this.$toast.success('修改成功')
        this.setUpdateSheet(true)
        this.$router.go(-1)
      }.bind(this)).catch(Api.onError.bind(this))
    }
  },
}
</script>

<style>

</style>