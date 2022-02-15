<template>
  <div class="goods-tabs">
    <nav>
      <a
        :class="{ active: activeName === 'detail' }"
        @click="activeName = 'detail'"
        href="javascript:;"
      >
        商品详情
      </a>
      <a
        href="javascript:;"
        :class="{ active: activeName === 'comment' }"
        @click="activeName = 'comment'"
      >
        商品评价
        <span>({{ goods.commentCount }})</span>
      </a>
    </nav>
    <!-- 切换内容的地方 -->
    <goodsDetail v-if="activeName === 'detail'" />
    <goodsComment v-else />
  </div>
</template>

<script>
import { inject, ref } from 'vue'
import goodsComment from './goods-comment.vue'
import goodsDetail from './goods-detail.vue'
export default {
  name: 'GoodTabs',
  components: {
    goodsComment, goodsDetail
  },
  setup() {
    const goods = inject('goods')
    const activeName = ref('detail')
    return { goods, activeName }
  }
}
</script>

<style lang="less" scoped>
.goods-tabs {
  nav {
    height: 70px;
    line-height: 70px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    a {
      padding: 0 40px;
      font-size: 18px;
      position: relative;
      > span {
        color: @priceColor;
        font-size: 16px;
        margin-left: 10px;
      }
      &:first-child {
        border-right: 1px solid #f5f5f5;
      }
      &.active {
        &::before {
          content: "";
          position: absolute;
          left: 40px;
          bottom: -1px;
          width: 72px;
          height: 2px;
          background: @xtxColor;
        }
      }
    }
  }
}
</style>
