<template>
  <div class="container">
    <SubBread />
    <!-- 筛选区 -->
    <SubFilter @filter-change="filterChange" />
    <!-- 结果区域 -->
    <div class="goods-list">
      <!-- 排序 -->
      <Subsort @sort-change="sortChange" />
      <!-- 列表 -->
      <ul class="ul">
        <li v-for="obj in goodsList" :key="obj.id">
          <GoodsItem :goods="obj" />
        </li>
      </ul>
      <!-- 加载 -->
      <XtxInfiniteLoading
        :loading="loading"
        :finished="finished"
        @infinite="getData"
      />
    </div>
  </div>
</template>
<script>
import SubBread from './component/sub-bread.vue'
import SubFilter from './component/sub-filter.vue'
import Subsort from './component/sub-sort.vue'
import GoodsItem from './component/goods-item.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryGoods } from '@/api/category'
export default {
  name: 'SubCategory',
  components: {
    SubBread, SubFilter, Subsort, GoodsItem
  },
  setup() {
    // 1. 基础布局
    // 2. 无限加载组件
    // 3. 动态加载数据且渲染
    // 4. 任何筛选条件变化需要更新列表
    const route = useRoute()

    const loading = ref(false)
    const finished = ref(false)
    const goodsList = ref([])
    // 查询参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    // 获取数据函数
    const getData = () => {
      loading.value = true
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          goodsList.value.push(...result.items)
          // console.log('goodsList', goodsList.value)
          reqParams.page++
        } else {
          // 加载完毕
          finished.value = true
        }
        // 请求结束
        loading.value = false
      })
    }

    // 切换二级分类重新加载
    watch(() => route.params.id, (newVal) => {
      if (newVal && route.path === ('/category/sub/' + newVal)) {
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
        finished.value = false
      }
    })

    // 1.更改排序组件的筛选数据 重新请求
    const sortChange = (sortParams) => {
      finished.value = false
      // 合并参数 保留之前的参数
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
      getData()
    }
    // 2.更改筛选组件的筛选数据 重新请求
    const filterChange = (filterParams) => {
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
      finished.value = false
      getData()
    }
    return { loading, finished, goodsList, getData, sortChange, filterChange }
  }
}
</script>
<style scoped lang='less'>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
