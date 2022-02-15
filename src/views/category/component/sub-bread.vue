<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem v-if="category.top" :to="`/category/${category.top.id}`">{{
      category.top.name
    }}</XtxBreadItem>
    <Transition name="fade-right" mode="out-in">
      <XtxBreadItem v-if="category.sub" :to="`/category/${category.sub.id}`">{{
        category.sub.name
      }}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'SubBread',
  setup() {
    const store = useStore()
    const route = useRoute()

    // console.log(store)
    // console.log(route)
    // 获取一级二级类目
    const category = computed(() => {
      const obj = {}
      store.state.category.list.forEach(top => {
        top.children && top.children.forEach(sub => {
          if (sub.id === route.params.id) {
            obj.sub = { id: sub.id, name: sub.name }
            obj.top = { id: top.id, name: top.name }
          }
        })
      })
      return obj
    })
    return { category }
  }
}
</script>

<style>
</style>
