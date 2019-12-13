<template>
  <div class="userform">
    <van-nav-bar
      :title="titleName"
      left-text="返回"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="register" v-show="formType == 'register'">
      <van-cell-group>
        <van-field
          v-model="username"
          required
          clearable
          label="用户名"
          placeholder="请输入用户名"
        />

        <van-field
          v-model="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
        />

        <van-field
          v-model="nickname"
          clearable
          label="昵称"
          placeholder="请输入昵称"
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
          style="width:60%"
          @click="register"
          >
          注册
        </van-button>
      </div>
    </div>
    
    <div class="login" v-show="formType == 'login'">
      <van-cell-group>
        <van-field
          v-model="loginUn"
          required
          clearable
          label="用户名"
          placeholder="请输入用户名"
        />

        <van-field
          v-model="loginPw"
          type="password"
          label="密码"
          placeholder="请输入密码"
          required
        />
        <div class="form-button">
          <van-button 
            type="info" 
            size="large"
            style="width:60%"
            @click="login"
            >
            登陆
          </van-button>
          <span 
            class="van-nav-bar__text" 
            @click="formType = 'register'"
          >注册
          </span>
        </div>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import Api from 'src/api.js'
import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  data() {
    return {
      formType: '',
      username: '',
      password: '',
      nickname: '',
      pic: undefined,
      fileList: [],
      loginUn: '',
      loginPw: '',
      sheet: {}
    }
  },

  created() {
    this.formType = this.$route.params.type
  },

  methods: {
    ...mapMutations(['setCurUser',]),

    afterRead: function(param) {
      var file = param.file
      if (file.type !== 'image/jpeg') {
        this.$toast.fail('请上传 jpg 格式图片')
        return false
      }
      this.pic = file
      return true
    },

    checkRegister: function() {
      if (this.username == '') {
        this.$toast.fail('用户名不能为空')
        return false
      }
        
      if (this.password == '') {
        this.$toast.fail('密码不能为空')
        return false
      }
      
      return true
    },

    checkLogin: function() {
      if (this.loginUn == '') {
        this.$toast.fail('用户名不能为空')
        return false
      }
        
      if (this.loginPw == '') {
        this.$toast.fail('密码不能为空')
        return false
      }
      
      return true
    },

    register: function() {
      if (!this.checkRegister()) return

      //FIXME: 上传不用这个API会默认JSON格式
      var formData = new FormData()
      formData.append('username', this.username)
      formData.append('password', this.password)
      formData.append('nickname', this.nickname)

      if (this.pic !== undefined)
        formData.append('pic', this.pic)
    
      Api.register(formData).then(function (response) {
        console.log(response);
        if (response.data.code) {
          this.$toast.fail(response.data.msg);
          return
        }
        this.$toast.success('注册成功');
        this.formType = 'login'
      }.bind(this)).catch(Api.onError.bind(this))

    },

    login: function() {
      if (!this.checkLogin()) return

      var formData = new FormData()
      formData.append('username', this.loginUn)
      formData.append('password', this.loginPw)

      Api.login(formData).then(function (response) {
        console.log(response);
        if (response.data.code) {
          this.$toast.fail(response.data.msg);
          return
        }
        var curUser = response.data.data
        this.$toast.success('登陆成功')
        this.setCurUser(curUser)
        this.$router.go(-1)
      }.bind(this)).catch(Api.onError.bind(this))
    },
  },

  computed: {
    ...mapGetters(['curUser', 'isLogined']),

    titleName() {
      let m = {
        'register': '注册新用户',
        'login': '登陆',
      }
      return m[this.formType]
    }
  }
}
</script>

<style>
.userform {
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.form-button {
  text-align: center;
}
</style>