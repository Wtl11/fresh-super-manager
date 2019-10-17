import request from '@utils/request'

export default {
  /**
   * 获取消费者列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getConsumerList(data = {}, loading = false) {
    let url = '/social-shopping/api/platform/customers'
    return request.get(url, data, loading)
  }
}
