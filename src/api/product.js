import request from '@/utils/request'

// 获得商品详情
export const findGoods = (id) => {
  return request('/goods', 'get', { id })
}

// 同类推荐/猜你喜欢
export const findRelevant = ({ id, limit = 16 }) => {
  return request('/goods/relevant', 'get', { id, limit })
}

// 获取热销推荐
export const findHotGoods = ({ id, limit = 3, type }) => {
  return request('/goods/hot', 'get', { id, limit, type })
}

// 获取商品评论
export const findGoodsEvaluate = (id) => {
  // 遇见http url不会加基准地址
  // mock
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`, 'get')
  // return request(`/goods/${id}/evaluate`, 'get')
}

// 获取热销推荐
export const findGoodsCommentList = (id, params) => {
  return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
}
