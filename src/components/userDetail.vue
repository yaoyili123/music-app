<template>
  <div class="data-detail">
    <van-nav-bar
      :title="user.nickname + ' 关注 0 | 粉丝 0'"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <!-- <div> -->
      <van-image
        :src="user.picUrl"
        style="height:30%;"
      />
      <!-- <div class="info">
        <p>T1 Faker</p>
        <p></p>
      </div> -->
    <!-- </div> -->
    <van-tabs v-model="active">
      <van-tab title="主页">
        <van-collapse v-model="activeNames">
          <van-collapse-item title="创建的歌单" name="1">
            <van-list
              v-if="userSheets.length > 0"
              v-model="sheetLoading"
              :finished="sheetFinished"
              @load="onLoad(sheetLoading, sheetFinished)"
              immediate-check
            >
              <van-cell 
                :key="sheet.id" 
                v-for="sheet in userSheets" 
                :title="sheet.name"
                :label="sheet.songNum + '首'"
                size="large"
                @click="$router.push('/sheet/' + sheet.id)"
                >
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
          </van-collapse-item>
          <van-collapse-item title="收藏的歌单" name="2">
            <van-list
              v-if="collectedSheets.length > 0"
              v-model="sheetLoading"
              :finished="sheetFinished"
              @load="onLoad(sheetLoading, sheetFinished)"
              immediate-check
            >
              <van-cell 
                :key="sheet.id" 
                v-for="sheet in collectedSheets" 
                :title="sheet.name"
                :label="sheet.songNum + '首'"
                size="large"
                @click="$router.push('/sheet/' + sheet.id)"
                >
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
          </van-collapse-item>
        </van-collapse>
      </van-tab>
      
      <van-tab title="动态">
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Api from 'src/api.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      active: 0,
      activeNames: ['1', '2'],
      sheetLoading: false,
      sheetFinished: true,
      uid: -1,
      user: {},
      userSheets: [],
      collectedSheets: [],
      // selectId: -1,
    }
  },

  created() {
    this.uid = this.$route.params.uid
    if (this.uid != -1) {
      Api.getUserInfo(this.uid)
      .then(function(res){
        console.log(res)
        if (res.data.code != 0) {
          this.$toast.fail(res.data.msg)
          return
        }
        this.user = res.data.data
      }.bind(this)).catch(Api.onError.bind(this))

      Api.getSheets(this.uid)
      .then(function(res){
        console.log(res)
        if (res.data.code != 0) {
          this.$toast.fail(res.data.msg)
          return
        }
        this.userSheets = res.data.data
      }.bind(this)).catch(Api.onError.bind(this))

      Api.findCollections(this.uid, 2)
      .then(function(res){
        console.log(res)
        if (res.data.code != 0) {
          this.$toast.fail(res.data.msg)
          return
        }
        this.collectedSheets = res.data.data
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
/* .info {
  position: absolute;
  color:black;
  z-index: 14;
  left: 10%;
  top: 40%;
} */
</style>