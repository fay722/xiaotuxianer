<template>
  <!-- 轮播图组件 -->
  <div class="xtx-carousel" @mouseenter="stop()" @mouseleave="start()">
    <ul class="carousel-body">
      <li
        class="carousel-item"
        v-for="(item, i) in slider"
        :key="item.id"
        :class="{ fade: index === i }"
      >
        <!-- 图片 -->
        <RouterLink to="/" v-if="item.imgUrl">
          <img :src="item.imgUrl" alt="" />
        </RouterLink>
        <!-- 商品列表 4个 -->
        <div v-else class="slider">
          <RouterLink
            v-for="goods in item"
            :key="goods.id"
            :to="`/product/${goods.id}`"
          >
            <img :src="goods.picture" alt="" />
            <p class="name ellipsis">{{ goods.name }}</p>
            <p class="price">&yen;{{ goods.price }}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <!-- 左右按钮 -->
    <a href="javascript:;" class="carousel-btn prev" @click="cut(-1)">
      <i class="iconfont icon-angle-left"></i>
    </a>
    <a href="javascript:;" class="carousel-btn next" @click="cut(1)">
      <i class="iconfont icon-angle-right"></i>
    </a>
    <!-- 小圆点 -->
    <div class="carousel-indicator">
      <span
        v-for="(item, i) in slider"
        :key="i"
        :class="{ active: index === i }"
        @click="dotCut(i)"
      ></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue-demi'
export default {
  name: 'XtxCarousel',
  props: {
    slider: {
      type: Array,
      require: true
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 1000
    }
  },
  setup(props) {
    // 默认显示图片的索引
    const index = ref(0)

    // 自动播放
    let timer = null
    const autoPlayFn = () => {
      clearInterval(timer)
      timer = setInterval(() => {
        index.value++
        if (index.value >= props.slider.length) {
          index.value = 0
        }
      }, props.duration)
    }
    watch(() => props.slider, (newVal) => {
      // 有数据就开启自动播放
      if (newVal.length && props.autoPlay) {
        index.value = 0
        autoPlayFn()
      }
    }, { immediate: true })

    // 鼠标离开开启 进入暂停
    const stop = () => {
      if (timer) clearInterval(timer)
    }
    const start = () => {
      if (props.slider.length && props.autoPlay) {
        autoPlayFn()
      }
    }

    // 上一张下一张
    const cut = (next) => {
      const newIndex = index.value + next
      if (newIndex < 0) {
        index.value = props.slider.length - 1
        return
      }
      if (newIndex > props.slider.length - 1) {
        index.value = 0
        return
      }
      index.value = newIndex
    }
    // 指示器切换
    const dotCut = (i) => {
      index.value = i
    }

    // 销毁组件 清除定时器
    onUnmounted(() => {
      clearInterval(timer)
    })
    return { index, stop, start, cut, dotCut }
  }

}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
  // 轮播商品
  .slider {
    display: flex;
    justify-content: space-around;
    padding: 0 40px;
    > a {
      width: 240px;
      text-align: center;
      img {
        padding: 20px;
        width: 230px !important;
        height: 230px !important;
      }
      .name {
        font-size: 16px;
        color: #666;
        padding: 0 40px;
      }
      .price {
        font-size: 16px;
        color: @priceColor;
        margin-top: 15px;
      }
    }
  }
}
</style>
