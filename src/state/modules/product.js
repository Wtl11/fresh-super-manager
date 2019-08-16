import API from '@api'
import app from '@src/main'

export const state = {
  unitsList: [],
  reqCategoryList: [],
  productList: [],
  statePageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  }
}

export const getters = {
  unitsList(state) {
    return state.unitsList
  },
  reqCategoryList(state) {
    return state.reqCategoryList
  },
  productList(state) {
    return state.productList
  },
  statePageTotal(state) {
    return state.statePageTotal
  }
}

export const mutations = {
  SET_UNITS_LIST(state, list) {
    state.unitsList = list
  },
  SET_CATEGORY_LIST(state, list) {
    state.reqCategoryList = list
  },
  SET_PRODUCT_LIST(state, list) {
    state.productList = list
  },
  SET_PAGE_TOTAL(state, statePageTotal) {
    state.statePageTotal = statePageTotal
  }
}

export const actions = {
  // 辅助资料列表
  getAuxiliaryList({state, commit}) {
    return API.Product.getUnitsList()
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_UNITS_LIST', arr)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 辅助类目列表
  getCategoryList({state, commit}) {
    return API.Product.getCategoryList({parent_id: '-1'})
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        commit('SET_CATEGORY_LIST', arr)
        app.$loading.hide()
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 商品列表
  getProductList(
    {state, commit},
    {keyword = '', page = 1, categoryId = '', isOnline = '', limit = 10, loading = true}
  ) {
    return API.Product.reqGoodsList(
      {
        keyword,
        page,
        goods_material_category_id: categoryId,
        is_online: isOnline,
        limit
      },
      loading
    )
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let arr = res.data
        let statePageTotal = {
          total: res.meta.total,
          per_page: res.meta.per_page,
          total_page: res.meta.last_page
        }
        commit('SET_PRODUCT_LIST', arr)
        commit('SET_PAGE_TOTAL', statePageTotal)
        app.$loading.hide()
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 获取商品详情
  getGoodsDetailData({commit}, id) {
    return API.Product.getGoods(id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return false
        }
        let goodsDetail = res.data
        return goodsDetail
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  }
}
