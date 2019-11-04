<template>
  <div class="song-list">
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
      :title="song.name" 
      @click="setCurSong(song)"
      />
  </van-list>
  </div>
</template>

<script>
export default {

  data() {
    return {
      songList: [],
      songLoading: false,
      songFinished: true,    
    }
  },

  methods: {
    ...mapMutations({
      setCurSong: 'setCurSong',
    }),
  }
}
</script>

<style>

</style>