import API from '@api'
import app from '@src/main'

export const state = {
  goodsList: [],
  statePageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  }
}

export const getters = {
  goodsList(state) {
    return state.goodsList
  },
  statePageTotal(state) {
    return state.statePageTotal
  }
}

export const mutations = {
  SET_GOODS_LIST(state, list) {
    state.goodsList = list
  },
  SET_PAGE_TOTAL(state, statePageTotal) {
    state.statePageTotal = statePageTotal
  }
}

export const actions = {
  // 商品列表
  getGoodsList({state, commit}, params, loading = true) {
    return API.FreeShipping.getGoodsList(params, loading)
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
        commit('SET_GOODS_LIST', arr)
        commit('SET_PAGE_TOTAL', statePageTotal)
        return true
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  }
  // 获取商品详情
}
