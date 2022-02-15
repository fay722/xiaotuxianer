<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <Transition name="fade-right" mode="in-out">
          <XtxBreadItem :key="topCategory.id">
            {{ topCategory.name }}
          </XtxBreadItem>
        </Transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :slider="sliders" style="height: 500px" autoPlay />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="item in topCategory.children" :key="item.id">
            <a href="javascript:;">
              <img :src="item.picture" />
              <p>{{ item.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 分类关联商品 -->
      <div class="ref-goods" v-for="item of subList" :key="item.id">
        <div class="head">
          <h3>- {{ item.name }} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XtxMore />
        </div>
        <div class="body">
          <GoodsItem
            v-for="goodItem in item.goods"
            :key="goodItem.id"
            :goods="goodItem"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import xtxBread from '@/components/library/xtx-bread.vue'
import { findBanner } from '@/api/home'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsItem from './component/goods-item.vue'
import { findTopCategory } from '@/api/category'

export default {
  components: { xtxBread, GoodsItem },
  name: 'TopCategory',
  setup() {
    const sliders = ref([])
    findBanner().then((data) => {
      sliders.value = data.result
    })

    // 获取二级分类商品
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      let cate = {}
      const item = store.state.category.list.find(item => {
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })

    // 获取分类商品展示
    const subList = ref([])
    const getSubList = () => {
      findTopCategory(route.params.id).then(data => {
        // console.log(data)
        subList.value = data.result.children
      })
    }
    watch(() => route.params.id, (newVal) => {
      // 解决切换到二级类目时也发生了跳转
      // 解决方法 判断拼接的路由字符串是否等于当前的路由地址
      if (newVal && `/category/${newVal}` === route.path) { getSubList() }
    }, { immediate: true })

    return { sliders, topCategory, subList }
  }
}
</script>
<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
