<template>
  <div class="recommand">
    <div class="hotlist">
      <div class="list-title">
        <p class="title-text">热门歌单</p>
      </div>
      <div class="list-content" v-if="!loading1">
        <div class="list-item"
          :key="item.id"
          v-for="item in sheetList"
          @click="$router.push('/sheet/' + item.id)">
          <div class="list-img">
            <img :src="item.picUrl">
            <div class="listen-count">
              <img src="../assets/icon-erji.svg" alt="">
              <span>{{item.play}}</span>
            </div>
          </div>
          <div class="list-info">
            <p class="list-name">{{item.name}}</p>
            <p class="list-author">{{item.username}}</p>
          </div>
        </div>
      </div>

      <div class="list-title">
        <p class="title-text">热门专辑</p>
      </div>
      <div class="list-content" v-if="!loading2" style="margin-bottom: 20%;">
        <div class="list-item"
          :key="item.id"
          v-for="item in albumList"
          @click="$router.push('/album/' + item.id)">
          <div class="list-img">
            <img :src="item.picUrl">
            <div class="listen-count">
              <img src="../assets/icon-erji.svg" alt="">
              <span>{{item.play}}</span>
            </div>
          </div>
          <div class="list-info">
            <p class="list-name">{{item.name}}</p>
            <p class="list-author">{{item.author}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from 'src/api.js'

export default {
  data () {
    return {
      loading1: true,
      loading2: true,
      sheetList: [],
      albumList: [],
    }
  },

  created() {
    Api.getRank(1).then(function (res) {
      console.log(res);
      this.loading1 = false
      if (res.data.code) {
        this.$toast.fail(res.data.msg);
        return
      }
      this.sheetList = res.data.data
    }.bind(this)).catch(Api.onError.bind(this))

    Api.getRank(2).then(function (res) {
      console.log(res);
      this.loading2 = false
      if (res.data.code) {
        this.$toast.fail(res.data.msg);
        return
      }
      this.albumList = res.data.data
    }.bind(this)).catch(Api.onError.bind(this))
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">
.recommand {
  .swiper-position {
    position: relative;
    cursor: pointer;
    .recommand-swiper-img {
      width: 100%;
      display: block;
    }
  }
  .swiper-pagination-position {
    position: absolute;
    z-index: 1;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .hotlist {
    display: flex;
    flex-direction: column;
    background: #fff;
    box-shadow: 0 0 10px #DDD;
    .list-title {
      height: 50px;
      text-align: center;
      line-height: 50px;
    }
    .list-content {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      .list-item {
        
        width: 50%;
        cursor: pointer;
        .list-img {
          position: relative;
          img {
            width: 100%;
          }
          .listen-count {
            position: absolute;
            bottom: 5px;
            left: 5px;
            color: #fff;
            font-size: 12px;
            display: flex;
            flex-direction: row;
            align-items: center;
            img {
              width: 15px;
              height: 15px;
              display: inline-block;
              margin-right: 3px;
            }
          }
        }
        .list-info {
          padding: 0 5px;
          font-weight: 300;
          font-size: 14px;
          margin-bottom: 10px;
          .list-name {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .list-author {
            color: #777777
          }
        }
      }
    }
  }
}
</style>
