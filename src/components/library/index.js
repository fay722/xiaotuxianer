// 扩展vue原有的功能：全局组件，自定义指令，挂载原型方法，注意：没有全局过滤器。
// 这就是插件
// vue2.0插件写法要素：导出一个对象，有install函数，默认传入了Vue构造函数，Vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了app应用实例，app基础之上扩展

import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'
import defaultImg from '@/assets/images/200.png'
export default {
  install(app) {
    // 在app上进行扩展，app提供 component directive 函数
    // 如果要挂载原型 app.config.globalProperties 方式
    app.component(XtxSkeleton.name, XtxSkeleton)
    // 全局注册轮播图
    app.component(XtxCarousel.name, XtxCarousel)
    // 查看更多组件
    app.component(XtxMore.name, XtxMore)
    defineDirective(app)
  }
}

// 指令
const defineDirective = (app) => {
  // 图片加载指令
  // vue3.0中创建指令
  app.directive('lazyload', {
    mounted(el, binding) {
      const observer = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 如果进入 就停止监听
          observer.unobserve(el)
          // 发生错误
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        // 一个包含阈值的列表, 按升序排列, 列表中的每个阈值都是监听对象的交叉区域与边界区域的比率。
        threshold: 0.01
      })
      // 开始监听
      observer.observe(el)
    }
  })
}
