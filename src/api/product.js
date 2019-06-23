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
  getStausList(data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material-category-status`
    return request.get(url, data, loading)
  },
  /**
   * 商品素材列表
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  reqGoodsList(data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material`
    return request.get(url, data, loading)
  },
  /**
   * 商品素材类型统计
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  reqGoodsStatus(data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material-status`
    return request.get(url, data, loading)
  },
  /**
   * 创建商品素材
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  createGoods(data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material`
    return request.post(url, data, loading)
  },
  /**
   * 编辑商品素材
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  editGoods(id, data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material/${id}`
    return request.put(url, data, loading)
  },
  /**
   * 删除商品素材
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  delGoods(id, data, loading = false) {
    let url = `/social-shopping/api/platform/goods-material/${id}`
    return request.delete(url, data, loading)
  },
  /**
   * 商品素材详情
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  getGoods(id, data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material/${id}`
    return request.get(url, data, loading)
  },
  /**
   * 商品素材上下架
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  onlineGoods(data, loading = true) {
    let url = `/social-shopping/api/platform/goods-material-toggle-online`
    return request.post(url, data, loading)
  },
  /**
   * 商品素材新建模板导入校验
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  checkGoodsData(data, loading = true) {
    let url = `/social-shopping/api/platform/import-create-goods-material-check`
    return request.post(url, data, loading)
  },
  /**
   * 商品素材新建模板导入
   * @param data
   * @param loading
   * @returns {AxiosPromise<any> | * | IDBRequest<IDBValidKey> | Promise<void>}
   */
  createMoreGoods(data, loading = true) {
    let url = `/social-shopping/api/platform/import-create-goods-material`
    return request.post(url, data, loading)
  }
}
