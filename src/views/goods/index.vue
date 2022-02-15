<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">
          {{ goods.categories[1].name }}
        </XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">
          {{ goods.categories[0].name }}
        </XtxBreadItem>
        <XtxBreadItem>
          {{ goods.name }}
        </XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImages :images="goods.mainPictures" />
          <GoodsSales :goods="goods" />
        </div>
        <div class="spec">
          <GoodName :goods="goods" />
          <GoodsSku :goods="goods" @change="changeSku" />
          <!-- 数量选择组件 -->
          <XtxNumbox label="数量" v-model="num" :max="goods.inventory || 100" />
          <!-- 按钮 加入购物车 -->
          <XtxButton size="middle" type="primary" style="margin: 20px 0">
            加入购物车
          </XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <div class="goods-tabs">
            <!-- tab栏 -->
            <goodsTabs :goods="goods" />
          </div>
          <!-- 注意事项 -->
          <div class="goods-warn">
            <goodsWarn />
          </div>
        </div>
        <!-- 24热榜+专题推荐 -->
        <div class="goods-aside">
          <goodsHot :type="1" :goods="goods" />
          <goodsHot :type="2" :goods="goods" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsSku from './component/goods-sku.vue'
import GoodsSales from './component/goods-sales.vue'
import GoodsRelevant from './component/goods-relevant.vue'
import GoodName from './component/goods-name.vue'
import { useRoute } from 'vue-router'
import { findGoods } from '@/api/product'
import { ref, watch, nextTick, provide } from 'vue'
import GoodsImages from './component/goods-image.vue'
import goodsTabs from './component/goods-tabs.vue'
import goodsHot from './component/goods-hot.vue'
import goodsWarn from './component/goods-warn.vue'
// 获取商品详情
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImages, GoodsSales, GoodName, GoodsSku, goodsTabs, goodsHot, goodsWarn },
  setup() {
    const goods = useGoods()
    const changeSku = (sku) => {
      // console.log(sku)
      // 修改商品现价原价及库存
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
    }

    // 选择的数量
    const num = ref(1)

    // 依赖注入
    provide('goods', goods)

    return { goods, changeSku, num }
  }
}
// 获取商品详情
const useGoods = () => {
  // 出现路由地址商品ID发生变化，但是不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    if (newVal && `/product/${newVal}` === route.path) {
      findGoods(route.params.id).then(data => {
        // 让商品数据为null然后使用v-if的组件可以重新销毁和创建
        goods.value = null
        nextTick(() => {
          goods.value = data.result
        })
      })
    }
  }, { immediate: true })
  return goods
}

</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
