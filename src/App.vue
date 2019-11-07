<template>
  <div id="app">
    <div class="main">
      <van-popup 
        v-model="userShow"
        position="left"
        :style="userPanelStyle"
        >
        <div class="user-info">
          <div class="user-img" @click="userDetail">
            <van-image
              round
              width="5rem"
              height="5rem"
              :src="userPic"
            />
            <p>{{userName}}</p>
          </div>
          <div class="buttons">
            <van-button @click="logOut" icon="clear" type="info">退出</van-button>
          </div>
        </div>
      </van-popup>

      <van-nav-bar title="MUSIC-APP">
        <van-icon name="user-o" slot="left" size="20" @click="userShow = true"/>
      </van-nav-bar>
      <van-tabs v-model="active">
        <van-tab title="推荐">

        </van-tab>
        <van-tab title="我的">
          <me></me>
        </van-tab>
        <van-tab title="搜索">
          <search></search>
        </van-tab>
      </van-tabs>
    </div>
    <!-- FIXME:放最下面就可以把上面全部遮住 -->
    <transition name="page-slide">
      <router-view></router-view>
    </transition>

    <play></play>
  </div>
</template>

<script>
import Search from './components/search'
import Artist from './components/artist'
import Play from './components/play'
import Me from './components/me'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  components : {
    Search,
    Artist,
    Play,
    Me,
  },

  data() {
    return {
      active: 0,
      userShow: false,
      userPanelStyle: {
        height: '100%',
        width: '50%'
      },
    }
  },
  methods: {
    ...mapMutations({
      deleteUser: 'deleteUser',
    }),

    userDetail() {
      if (this.isLogined) {
        
      }
      else {
        this.$router.push('/userform/login')
        this.userShow = false
      }
    },

    logOut() {
      if(!this.isLogined) {
        this.$toast.fail('还未登陆')
        return
      }
      this.deleteUser()
      this.$toast.success('注销成功')
    }
  },
  computed: {
    ...mapGetters(['curUser', 'isLogined']),

    userPic() {
      return this.isLogined ? this.curUser.picUrl : require("./assets/unlogined.jpg") 
    },

    userName() {
      return this.isLogined ? this.curUser.nickname : '未登录用户' 
    },
  }
}
</script>

<style>
/* FIXME: body, html都要设置成100%, 才能适应屏幕 */
body, html{
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}

#app {
  width: 100%;
  height: 100%;
}

.main {
  width: 100%;
}

.user-info{
  width: 100%;
  height: 100%;
}

.user-img {
  width: 100%;
  height: 20%;
  text-align:center;
  padding-top:10%;
}

.buttons{
  text-align:center;
}

.data-detail {
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>
