<template>
  <div class="goods-hot">
    <h3>{{ title }}</h3>
    <div v-if="goodsList">
      <goods-item
        v-for="item in goodsList"
        :key="item.id"
        :goods="item"
      ></goods-item>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { findHotGoods } from '@/api/product'
import goodsItem from '@/views/category/component/goods-item.vue'
export default {
  components: { goodsItem },
  name: 'GoodHot',
  props: {
    type: {
      type: Number,
      default: 1
    },
    goods: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const titleObj = {
      1: '24小时热销榜',
      2: '周热销榜',
      3: '总热销榜'
    }
    const title = computed(() => {
      return titleObj[props.type]
    })
    const goodsList = ref(null)
    findHotGoods({ id: props.goods.id, type: props.type }).then(data => {
      goodsList.value = data.result
      // console.log(goodsList)
    })
    return { title, goodsList }
  }
}
</script>

<style scoped lang="less">
.goods-hot {
  h3 {
    height: 70px;
    background: @helpColor;
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  ::v-deep .goods-item {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
