import request from '@utils/request'

export default {
  /**
   *  意向单列表
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getIntentList(data, loading = false) {
    let url = `/social-shopping/api/platform/recruit`
    return request.get(url, data, loading)
  },
  /**
   *  意向单状态统计列表
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getIntentListStatus(data, loading = false) {
    let url = `/social-shopping/api/platform/recruit-status`
    return request.get(url, data, loading)
  },
  /**
   *  意向单处理操作
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  handleIntent(data, loading = false, id = '') {
    let url = `/social-shopping/api/platform/recruit/`+id
    return request.post(url, data, loading)
  },
}
