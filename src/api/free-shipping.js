import request from '@utils/request'

export default {
  /**
   * 商品相关
   * **/
  // 商品列表
  getGoodsList(data, loading = false) {
    let url = '/market/api/backend/goods'
    return request.get(url, data, loading)
  },
  // 新建商品（同步）
  goodsCreate(data, loading = true) {
    let url = '/market/api/backend/alibaba-goods'
    return request.post(url, data, loading)
  },
  // 商品详情
  goodsInfo(id, loading = true) {
    let url = `/market/api/backend/goods/${id}`
    return request.get(url, loading)
  },
  // 商品编辑（完善资料）
  goodsModify(data, id, loading = true) {
    let url = `/market/api/backend/goods/${id}`
    return request.put(url, data, loading)
  },
  // 删除商品
  goodsDelete(id, loading = false) {
    let url = `/market/api/backend/goods/${id}`
    return request.delete(url, loading)
  },
  // 商品上下架
  goodsOnline(data, loading = false) {
    let url = `/market/api/backend/goods-toggle-online`
    return request.post(url, data, loading)
  },
  // 商品上下架状态统计
  goodsOnlineStatus(data, loading = false) {
    let url = `/market/api/backend/goods-online-statistic`
    return request.get(url, data, loading)
  },
  /**
   * 1688相关
   * **/
  // 1688供应商查询
  suppliersSearch(data, loading = true) {
    let url = `/market/api/backend/out-supplier`
    return request.get(url, data, loading)
  },
  // 1688商品查询
  goodsSearch(data, loading = true) {
    let url = `/market/api/backend/out-goods`
    return request.get(url, data, loading)
  },
  // 获取1688订单支付链接
  getOutOrderPayUrl(data, loading = true) {
    let url = `/market/api/backend/pay-url`
    return request.post(url, data, loading)
  },
  // 获取1688订单物流信息
  getOutOrderExpressMsg(data, loading = false) {
    let url = `/market/api/backend/order-logistics-info`
    return request.post(url, data, loading)
  },
  // 获取1688订单物流跟踪信息
  getOutOrderExpressInfo(data, loading = false) {
    let url = `/market/api/backend/order-logistics-trace-info`
    return request.post(url, data, loading)
  },
  // 获取1688订单详情
  getOutOrderInfo(data, loading = true) {
    let url = `/market/api/backend/order-info`
    return request.post(url, data, loading)
  },
  /**
   * 供应商相关
   * **/
  // 供应商列表
  getSuppliersList(data, loading = false) {
    let url = '/market/api/backend/suppliers'
    return request.get(url, data, loading)
  },
  // 新建供应商
  suppliersCreate(data, loading = true) {
    let url = '/market/api/backend/suppliers'
    return request.post(url, data, loading)
  },
  // 供应商编辑
  suppliersModify(data, id, loading = true) {
    let url = `/market/api/backend/suppliers/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 订单管理相关
   * **/
  // 订单列表
  getOrderList(data, loading = false) {
    let url = '/market/api/backend/orders'
    return request.get(url, data, loading)
  },
  // 订单详情
  getOrderInfo(data, id, loading = true) {
    let url = `/market/api/backend/orders/${id}`
    return request.get(url, data, loading)
  }
}
