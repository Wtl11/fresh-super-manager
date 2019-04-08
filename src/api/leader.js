import request from '@utils/request'

export default {
  /**
   * 社区下拉列表
   * @param id
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  deliveryDetail(id, loading = false) {
    let url = `/social-shopping/api/backend/store-delivery/${id}`
    return request.get(url, {}, loading)
  },
  /**
   * 获取团长提现列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getWithdrawalList(data = {}, loading = true) {
    let url = '/social-shopping/api/backend/backend-shop-manager/withdrawal'
    return request.get(url, data, loading)
  },
  /**
   * 提现审核
   * @param data
   * @param loading
   * @returns {*}
   */
  applyWithdrawal(data, loading = true) {
    let url = '/social-shopping/api/backend/backend-shop-manager/withdrawal-apply'
    return request.get(url, data, loading)
  },
  /**
   * 获取提现状态列表
   * @param data
   * @param loading
   * @returns {*}
   */
  getWithdrawalStatus(data = {}, loading = false) {
    let url = '/social-shopping/api/backend/backend-shop-manager/withdrawal-status'
    return request.get(url, data, loading)
  },
  /**
   * 获取收支明细
   * @param data
   * @param loading
   * @returns {*}
   */
  getShopBill(data = {}, loading = true) {
    let url = '/social-shopping/api/backend/backend-shop-manager/shop-bill'
    return request.get(url, data, loading)
  },
  /**
   * 获取收支明细类型
   * @param data
   * @param loading
   * @returns {*}
   */
  getShopBillType(data = {}, loading = false) {
    let url = '/social-shopping/api/backend/backend-shop-manager/shop-order-type'
    return request.get(url, data, loading)
  }
}
