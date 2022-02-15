<template>
  <div class="xtx-numbox">
    <div class="label" v-if="label">{{ label }}</div>
    <div class="numbox">
      <a href="javascript:;" @click="changeNum(-1)">-</a>
      <input type="text" readonly :value="modelValue" />
      <a href="javascript:;" @click="changeNum(1)">+</a>
    </div>
  </div>
</template>
<script>
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxNumbox',
  props: {
    label: {
      type: String
    },
    modelValue: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 100
    }
  },
  setup(props, { emit }) {
    // 修改num就会通知父组件
    const num = useVModel(props, 'modelValue', emit)
    const changeNum = (value) => {
      console.log('1')
      const newValue = num.value + value
      console.log('newValue', newValue)
      console.log(props.min, props.max)
      if (newValue < props.min || newValue > props.max) {
        console.log('newValue11', newValue)
        return
      }
      num.value = newValue
      console.log('num.value', num.value)
      emit('change', newValue)
    }
    return { num, changeNum }
  }
}
</script>
<style scoped lang="less">
.xtx-numbox {
  display: flex;
  align-items: center;
  .label {
    width: 60px;
    color: #999;
    padding-left: 10px;
  }
  .numbox {
    width: 120px;
    height: 30px;
    border: 1px solid #e4e4e4;
    display: flex;
    > a {
      width: 29px;
      line-height: 28px;
      text-align: center;
      background: #f8f8f8;
      font-size: 16px;
      color: #666;
      &:first-of-type {
        border-right: 1px solid #e4e4e4;
      }
      &:last-of-type {
        border-left: 1px solid #e4e4e4;
      }
    }
    > input {
      width: 60px;
      padding: 0 5px;
      text-align: center;
      color: #666;
    }
  }
}
</style>
