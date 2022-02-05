import request from '@/utils/request'

// 获取品牌数据
export const findBrand = (limit) => {
  return request('/home/brand', 'get', { limit })
}

// 获取广告图 （banner轮播图）
export const findBanner = () => {
  return request('/home/banner', 'get')
}

// 获取首页新鲜好物
export const findNew = () => {
  return request('home/new', 'get')
}

// 获取人气推荐
export const findHot = () => {
  return request('home/hot', 'get')
}

// 获取首页商品
export const findGoods = () => {
  return request('home/goods', 'get')
}

// 获取最新专题
export const findSpecial = (limit) => {
  return request('/home/special', 'get', { limit })
}
