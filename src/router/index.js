import { createRouter, createWebHashHistory } from 'vue-router'
import TopCategory from '@/views/category'
import SubCategory from '@/views/category/sub-category'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home/index')
const Goods = () => import('@/views/goods')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: TopCategory },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 每次切换路由时 滚到顶部
  scrollBehavior() {
    return { left: 0, top: 0 }
  }
})

export default router
