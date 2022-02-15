<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggleDialog" :class="{ active: visible }">
      <span class="placeholder" v-if="!fullLocation">请选择配送地址</span>
      <span class="value" v-else>{{ fullLocation }}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <div v-if="loading" class="loading"></div>
      <template v-else>
        <span
          class="ellipsis"
          @click="changeItem(item)"
          v-for="item in currList"
          :key="item.code"
        >
          {{ item.name }}
        </span>
      </template>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    // 默认显示的地址
    fullLocation: {
      type: String
    }
  },
  setup(props, { emit }) {
    // 控制展开收起,默认收起
    const visible = ref(false)
    const openDialog = () => {
      visible.value = true
      open()
    }
    const closeDialog = () => {
      visible.value = false
    }
    // 切换展开收起
    const toggleDialog = () => {
      if (visible.value) closeDialog()
      else openDialog()
    }
    // 点击其他位置隐藏
    const target = ref(null)
    onClickOutside(target, () => {
      closeDialog()
    })
    // 获取城市数据
    // 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
    // 2. 何时获取？打开城市列表的时候，做个内存中缓存
    // 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
    const getCityData = () => {
      // 用promise获取是因为这里可能是同步操作 也可能是异步操作
      return new Promise((resolve) => {
        if (window.cityData) {
          // 有内存
          resolve(window.cityData)
        } else {
          // 无内存
          const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
          axios.get(url).then(res => {
            window.cityData = res.data
            resolve(window.cityData)
            // console.log(window.cityData)
          })
        }
      })
    }
    // 获取城市数据,显示当前地方列表
    // 显示和隐藏函数（为什么是函数，做更多事情）
    const loading = ref(false)
    // 所有省市区数据
    const cityData = ref([])
    const open = () => {
      visible.value = true
      loading.value = true
      // 获取数据
      getCityData().then(data => {
        cityData.value = data
        loading.value = false
      })
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    // 定义计算属性 获取当前显示的地区数组
    const currList = computed(() => {
      // 默认是省一级
      let list = cityData.value
      // 可能是市级
      if (changeResult.provinceCode && changeResult.provinceName) {
        list = list.find(p => p.code === changeResult.provinceCode).areaList
      }
      // 县级
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(c => c.code === changeResult.cityCode).areaList
      }
      return list
    })

    // 定义选择的省市区 数据 code和name code是唯一标识
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })

    // 当点击按钮时 记录
    const changeItem = (item) => {
      // console.log(item.level)
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        closeDialog()
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        // 选完了 关闭对话框 通知父组件

        emit('change', changeResult)
      }
    }
    return { toggleDialog, target, currList, loading, visible, changeItem }
  }
}
</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  padding: 0 0 0 15px;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
