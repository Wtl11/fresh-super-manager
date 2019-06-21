import API from '@api'
import app from '@src/main'

export const state = {
  unitsList: [],
  reqCategoryList: []
}

export const getters = {
  unitsList(state) {
    return state.unitsList
  },
  reqCategoryList(state) {
    return state.reqCategoryList
  }
}

export const mutations = {
  SET_UNITS_LIST(state, list) {
    state.unitsList = list
  },
  SET_CATEGORY_LIST(state, list) {
    state.reqCategoryList = list
  }
}

export const actions = {
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
  }
}
