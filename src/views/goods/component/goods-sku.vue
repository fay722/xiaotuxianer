<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            @click="changeSku(item, val)"
            :class="{ selected: val.selected, disabled: val.disabled }"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
          />
          <span
            v-else
            @click="changeSku(item, val)"
            :class="{ selected: val.selected, disabled: val.disabled }"
          >
            {{ val.name }}
          </span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from '@/vender/power-set'
const spliter = '★'
// 得到一个路径字典对象
const getPathMap = (skus) => {
  // 1.得到所有的sku集合 props.goods.skus
  // 2.从所有的sku筛选出有效的sku(有库存)
  // 3.根据有效的sku使用算法power-set得到子集
  // 4.根据子集往路径字典对象中存储key-value
  // 路径字典
  const pathMap = {}
  // skus[0].inventory = 0
  // skus[5].inventory = 0
  // console.log(skus)
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // 计算当前有库存的sku子集
      // 可选值数组
      const valueArr = sku.specs.map(val => val.valueName)
      // console.log(valueArr)
      // 可选数值子集
      const valueArrPowerSet = powerSet(valueArr)
      // 遍历子集 插入数据
      // console.log(valueArrPowerSet)
      valueArrPowerSet.forEach(arr => {
        // 根据arr得到字符串的key
        const key = arr.join(spliter)
        // 给pathMap设置数据
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
// 得到当前选中规格集合
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    // 选中按钮对象
    const selectVal = item.values.find(val => val.selected === true)
    arr.push(selectVal ? selectVal.name : undefined)
  })
  return arr
}
// 更新按钮禁用状态
const updateDisableStatus = (specs, pathMap) => {
  // console.log(pathMap)
  // 1.约定每一个按钮的状态由本身的disabled来控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs)
    // console.log(selectedValues)
    item.values.forEach(val => {
      // 2.判断当前是都选中 是选中不用判端
      if (val.selected) return
      // 3.拿当前的值按照顺序套入选中的值数组
      selectedValues[i] = val.name
      // 4.剔除undefined数据 按照分隔符拼接成key
      const key = selectedValues.filter(value => value).join(spliter)
      // 5.拿着key去路径字典中查找是否有数据 有可以点击 没有就禁用
      val.disabled = !pathMap[key]
    })
  })
}
// 默认选中
const initDefaultSelected = (goods, skuId) => {
  // console.log('skuId', skuId)
  // console.log(goods.skus)
  // 1.找出sku信息
  // 2.遍历每一个按钮 按钮的值和sku记录的值相同就选中
  const sku = goods.skus.find(sku => sku.id === skuId)
  // console.log(sku)
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    // 得到路径字典
    const pathMap = getPathMap(props.goods.skus)
    // 根据skuID初始化选中
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }
    // 组件初始化 更新按钮禁用状态
    updateDisableStatus(props.goods.specs, pathMap)
    // 1.选中与取消选中 约定每一个按钮都有自己选中状态数据：selected
    const changeSku = (item, val) => {
      // 1.1 点击已选中 只需要取消当前选中
      // 1.2 点击未选中 把同一个规格按钮改成未选中
      // 当按钮是禁用的 阻止运行
      if (val.disabled) return
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }
      updateDisableStatus(props.goods.specs, pathMap)
      // 将选择的sku信息通知父组件{skuId price oldPrice inventory specsText}
      // 1.选择完整的sku组合按钮 才可以拿到这些信息 提交父组件
      // 2.不是完整的sku组合 提交空对象给父组件
      // 有效的选择的值 过滤了undef
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(v => v)
      if (validSelectedValues.length === props.goods.specs.length) {
        // 完整情况
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        // skuIds返回的是数组
        // console.log(skuIds)
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        // console.log(sku)
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名:属性值 属性名:属性值
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}:${c.valueName}`, '').trim()
        })
      } else {
        // 不完整情况
        // 父组件需要判断规格是否选择完整 不完整不能加购物车
        emit('change', {})
      }
    }
    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        margin-top: 5px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
