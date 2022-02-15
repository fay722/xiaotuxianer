<template>
  <div class="goods-comment-image">
    <div class="list">
      <a
        href="javascript:;"
        :class="{ active: currImage === url }"
        @click="currImage = url"
        v-for="url in pictures"
        :key="url"
      >
        <img :src="url" alt="" />
      </a>
    </div>
    <div class="preview" v-if="currImage">
      <img :src="currImage" alt="" />
      <i @click="currImage = null" class="iconfont icon-close-new"></i>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
export default {
  name: 'GoodsCommentImage',
  props: {
    pictures: {
      type: Array,
      default: () => []
    }
  },
  setup() {
    const currImage = ref(null)
    return { currImage }
  }
}
</script>
<style scoped lang="less">
.goods-comment-image {
  .list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    a {
      width: 120px;
      height: 120px;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      &.active {
        border-color: @xtxColor;
      }
    }
  }
}
</style>
