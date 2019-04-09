import request from '@utils/request'

export default {
  /**
   * 获取交易记录类型列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getTradeOrderType(data = {}, loading = false) {
    let url = '/social-shopping/api/platform/trade-status'
    return request.get(url, data, loading)
  },
  /**
   * 获取交易记录列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getTradeList(data = {}, loading = false) {
    let url = '/social-shopping/api/platform/trades'
    return request.get(url, data, loading)
  },
  /**
   * 获取交易记录概况
   * @param data
   * @param loading
   * @returns {*}
   */
  getTradeDetail(data = {}, loading = false) {
    let url = '/social-shopping/api/platform/trade-statistics'
    return request.get(url, data, loading)
  }
}
