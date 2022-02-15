<template>
  <div class="goods-image" v-if="images">
    <div
      v-show="show"
      class="large"
      :style="[{ backgroundImage: `url(${images[current]})` }, largePosition]"
    ></div>
    <div class="middle" ref="target">
      <img :src="images[current]" alt="" />
      <div class="layer" v-show="show" :style="layerPosition"></div>
    </div>
    <ul class="small">
      <li
        v-for="(img, ind) in images"
        :key="ind"
        :class="{ active: ind === current }"
      >
        <img :src="img" alt="" @mouseenter="current = ind" />
      </li>
    </ul>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array
    }
  },
  setup() {
    const current = ref(0)

    // const target = ref(null)
    // 1.是否显示遮罩层
    const show = ref(false)
    // elementX 鼠标基于容器左上角X轴偏移
    // elementY 鼠标基于容器左上角Y轴偏移
    // isOutside 鼠标是否在模板容器外
    // const { elementX, elementY, isOutside } = useMouseInElement(target)
    // 2.遮罩坐标(样式)
    const layerPosition = reactive({
      left: 0, top: 0
    })
    // 3.大图的背景定位
    const largePosition = reactive({
      backgroundPositionX: 0,
      backgroundPositionY: 0
    })
    // 4.使用useMouseInElement得到基于元素左上角的坐标和是否离开元素
    const target = ref(null)
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    // 监听多个值使用中括号就可以
    watch([elementX, elementY, isOutside], () => {
      // 5.根据数据设置样式数据和是否显示数据
      show.value = !isOutside.value

      const position = { x: 0, y: 0 }
      if (elementX.value < 100) position.x = 0
      else if (elementX.value > 300) position.x = 200
      else position.x = elementX.value - 100

      if (elementY.value < 100) position.y = 0
      else if (elementY.value > 300) position.y = 200
      else position.y = elementY.value - 100
      // 6.给样式赋值
      layerPosition.left = position.x + 'px'
      layerPosition.top = position.y + 'px'
      largePosition.backgroundPositionX = -2 * position.x + 'px'
      largePosition.backgroundPositionY = -2 * position.y + 'px'
    })
    return { current, target, show, layerPosition, largePosition }
  }
}

</script>

<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
