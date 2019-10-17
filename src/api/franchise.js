import request from '@utils/request'

export default {
  /**
   * 交易记录列表
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  franchiseSettlement(data, loading = false) {
    let url = `/social-shopping/api/platform/payoffs`
    return request.get(url, data, loading)
  },
  /**
   * 交易记录列表
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  payoffStatus(data, loading = false) {
    let url = `/social-shopping/api/platform/payoff-status`
    return request.get(url, data, loading)
  },
  /**
   *  结算操作
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  payoffsComfirm(id, data, loading = false) {
    let url = `/social-shopping/api/platform/payoffs/${id}`
    return request.put(url, data, loading)
  },
  /**
   *  加盟商列表
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  franchiseList(data, loading = false) {
    let url = `/social-shopping/api/platform/stores`
    return request.get(url, data, loading)
  },
  /**
   *  加盟商状态数量
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  franchiseStatus(data, loading = false) {
    let url = `/social-shopping/api/platform/stores-status`
    return request.get(url, data, loading)
  },
  /**
   *  加盟商列表
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  storeFranchise(data, loading = true) {
    let url = `/social-shopping/api/platform/stores`
    return request.post(url, data, loading)
  },
  /**
   *  加盟商列表
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  updateFranchise(id, data, loading = true) {
    let url = `/social-shopping/api/platform/stores/${id}`
    return request.put(url, data, loading)
  },
  /**
   *  加盟商详情
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  franchiseDetail(id, loading = true) {
    let url = `/social-shopping/api/platform/stores/${id}`
    return request.get(url, {}, loading)
  }
}
