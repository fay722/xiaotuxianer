<template>
  <!-- 分页 -->
  <div class="xtx-pagination">
    <a
      v-if="myCurrentPage > 1"
      href="javascript:;"
      @click="changPager(myCurrentPage - 1)"
      >上一页</a
    >
    <a v-else href="javascript:;" class="disabled">上一页</a>
    <span v-if="pager.start > 1">...</span>
    <a
      href="javascript:;"
      v-for="i in pager.btnArr"
      :key="i"
      :class="{ active: myCurrentPage === i }"
      @click="changPager(i)"
    >
      {{ i }}
    </a>
    <span v-if="pager.end < pager.pageCount">...</span>
    <a
      v-if="myCurrentPage < pager.pageCount"
      href="javascript:;"
      @click="changPager(myCurrentPage + 1)"
      >下一页</a
    >
    <a v-else href="javascript:;" class="disabled">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    // 总条数
    total: {
      type: Number,
      default: 100
    },
    // 每一页条数
    pageSize: {
      type: Number,
      default: 10
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    }
  },
  setup(props, { emit }) {
    // 需要按钮个数、当前页码、总页数、起始页码、结束页码、按钮数组 才能完成渲染
    // 1.按钮个数 5个
    const count = 5
    // 2.当前显示页码
    const myCurrentPage = ref(8)
    // 3.总页数 = 总条数/每一页条数 向上取整
    const myTotal = ref(100) // 总条数
    const myPageSize = ref(10) // 每一页条数
    // 其他数据 （总页数、起始页码、结束页码、按钮数组） 依赖以上数据
    const pager = computed(() => {
      // 总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 按钮个数 当前页码 ==> 起始页码、结束页码、按钮数组
      // 按钮前面或后面的偏移量
      // 1.理想情况
      const offset = Math.floor(count / 2)
      let start = myCurrentPage.value - offset
      let end = start + count - 1
      // 2.如果起始页码<1 最后页码>总页数
      if (start < 1) {
        start = 1
        end = (start + count - 1) > pageCount ? pageCount : (start + count - 1)
      }
      // 3.如果结束页码>总页数
      if (end > pageCount) {
        end = pageCount
        start = (end - count + 1) < 1 ? 1 : (end - count + 1)
      }
      // 按钮数组
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return {
        pageCount,
        btnArr,
        start,
        end
      }
    })

    // 监听props变化 更新组件内部数据
    watch(props, () => {
      myTotal.value = props.total
      myCurrentPage.value = props.currentPage
      myPageSize.value = props.pageSize
    }, { immediate: true })

    // 切换分页函数
    const changPager = (page) => {
      myCurrentPage.value = page
      emit('current-change', page)
    }

    return { myCurrentPage, pager, changPager }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
