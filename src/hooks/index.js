import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'

// 数据懒加载函数
export const useLazyData = (apiFn) => {
  // 被观察的DOM对象 和 不同的api函数
  const target = ref(null)
  const result = ref([])
  // stop停止观察
  const { stop } = useIntersectionObserver(
    // 监听的目标元素
    target,
    // isIntersecting是否进入可视区
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        //  判断是否进入 可视区 进入 停止监听
        stop()
        // 调用接口
        apiFn().then(data => {
          result.value = data.result
        })
      }
    }, { threshold: 0 }
  )
  return { target, result }
}
