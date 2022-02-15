<template>
  <div class="goods-comment" v-if="commentInfo">
    <!-- 评价头部 -->
    <div class="head">
      <div class="data">
        <p>
          <span>{{ commentInfo.salesCount }}</span
          ><span>人购买</span>
        </p>
        <p>
          <span>{{ commentInfo.praisePercent }}</span
          ><span>好评率</span>
        </p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a
            href="javascript:;"
            v-for="(item, i) in commentInfo.tags"
            :key="i"
            @click="changeTag(i)"
            :class="{ active: activeTag === i }"
          >
            {{ item.title }}（{{ item.tagCount }}）
          </a>
        </div>
      </div>
    </div>
    <!-- 排序 -->
    <div class="sort" v-if="commentInfo">
      <span>排序：</span>
      <a
        @click="changeSort(null)"
        href="javascript:;"
        :class="{ active: reqParams.sortField === null }"
      >
        默认
      </a>
      <a
        @click="changeSort('praiseCount')"
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'praiseCount' }"
      >
        最热
      </a>
      <a
        @click="changeSort('createTime')"
        href="javascript:;"
        :class="{ active: reqParams.sortField === 'createTime' }"
      >
        最新
      </a>
    </div>
    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="item in commentList.items" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="" />
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <i class="iconfont icon-wjx01" v-for="n in item.score" :key="n"></i>
            <i
              class="iconfont icon-wjx02"
              v-for="n in 5 - item.score"
              :key="n"
            ></i>
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">
            {{ item.content }}
          </div>
          <!-- 使用图片预览组件 -->
          <GoodsCommentImage
            v-if="item.pictures.length"
            :pictures="item.pictures"
          />
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan"
              ><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 分页 -->
    <XtxPagination
      v-if="total"
      :total="total"
      :currentPage="reqParams.page"
      :pageSize="reqParams.pageSize"
      @current-change="changePager"
    />
  </div>
</template>
<script>
import { inject, reactive, ref, watch } from 'vue'
import { findGoodsCommentList, findGoodsEvaluate } from '@/api/product'
import GoodsCommentImage from './goods-comment-image.vue'
export default {
  name: 'GoodsComment',
  components: {
    GoodsCommentImage
  },
  setup() {
    const goods = inject('goods')
    // 头部 数据
    // 评价信息
    const commentInfo = ref(null)
    findGoodsEvaluate(goods.value.id).then(data => {
      data.result.tags.unshift({ type: 'img', title: '有图', tagCount: data.result.hasPictureCount })
      data.result.tags.unshift({ type: 'all', title: '全部评价', tagCount: data.result.evaluateCount })
      commentInfo.value = data.result
      // console.log(commentInfo.value)
    })
    // 选中tags
    const activeTag = ref(0)

    // 改变tag
    const changeTag = (i) => {
      activeTag.value = i
      // 情况1 全部
      const tag = commentInfo.value.tags[i]
      if (tag.type === 'all') {
        reqParams.hasPicture = null
        reqParams.tag = null
      } else if (tag.type === 'img') {
        // 情况2 有图
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        // 情况3 正常
        reqParams.hasPicture = null
        reqParams.tag = tag.title
      }
      // 页面重置1
      reqParams.page = 1
    }
    // 筛选条件准备(接口文档)
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      // 排序字段，可选值范围[praiseCount最新,createTime最热]
      sortField: null
    })
    // 改变排序
    const changeSort = (type) => {
      reqParams.sortField = type
      reqParams.page = 1
    }
    // 初始化发请求 筛选条件时 发请求
    const commentList = ref([])
    const total = ref(0)
    watch(reqParams, () => {
      findGoodsCommentList(goods.value.id, reqParams).then(data => {
        commentList.value = data.result
        total.value = data.result.counts
        // console.log(commentList.value)
      })
    }, { immediate: true })

    // 定义转换数据的函数 对应2.0过滤器
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name}:${c.nameValue}`, '').trim()
    }
    // 名字加*
    // substr() 方法返回一个字符串中从指定位置开始到指定字符数的字符。
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + '****' + nickname.substr(-1)
    }
    // 实现分页切换
    const changePager = (page) => {
      reqParams.page = page
    }

    return { goods, activeTag, reqParams, changeSort, commentInfo, changeTag, commentList, formatSpecs, formatNickname, total, changePager }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;
    .data {
      width: 340px;
      display: flex;
      padding: 20px;
      p {
        flex: 1;
        text-align: center;
        span {
          display: block;
          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }
          &:last-child {
            color: #999;
          }
        }
      }
    }
    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;
      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }
      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        > a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;
          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }
          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }
  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;
    > span {
      margin-left: 20px;
    }
    > a {
      margin-left: 30px;
      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }
  .list {
    padding: 0 20px;
    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;
      .user {
        width: 160px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        span {
          padding-left: 10px;
          color: #666;
        }
      }
      .body {
        flex: 1;
        .score {
          line-height: 40px;
          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }
          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }
      .text {
        color: #666;
        line-height: 24px;
      }
      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
