import request from '@utils/request'

export default {
  /**
   * 单位列表
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getUnitsList(data, loading = true) {
    let url = '/social-shopping/api/platform/goods-material-units'
    return request.get(url, data, loading)
  },
  /**
   * 创建单位
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  createUnits(data, loading = true) {
    let url = '/social-shopping/api/platform/goods-material-units'
    return request.post(url, data, loading)
  },
  /**
   * 编辑单位
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  editUnits(id, data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material-units/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 删除单位
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  delUnits(id, data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material-units/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 商品素材系统分类列表
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getCategoryList(data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material-category`
    return request.get(url, data, loading)
  },
  /**
   * 创建商品素材系统分类
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  createCategory(data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material-category`
    return request.post(url, data, loading)
  },
  /**
   * 编辑商品素材系统分类
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  editCategory(id, data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material-category/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 删除商品素材系统分类
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  delCategory(id, data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material-category/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 商品素材系统分类类型统计
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getStausList(id, data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material-category-status`
    return request.get(url, data, loading)
  }
}
