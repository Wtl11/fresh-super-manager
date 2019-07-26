import API from '@api'
import app from '@src/main'

export const state = {
  list: [],
  pageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  page: 1,
  type: '',
  startDate: '',
  endDate: '',
  keyword: ''
}

export const getters = {
  list(state) {
    return state.list
  },
  pageDetail(state) {
    return state.pageDetail
  },
  page(state) {
    return state.page
  },
  date(state) {
    return [state.startDate, state.endDate]
  },
  keyword(state) {
    return state.keyword
  },
  type(state) {
    return state.type
  }
}

export const mutations = {
  SET_LIST(state, list) {
    state.list = list
  },
  SET_PAGE_DETAIL(state, pageDetail) {
    state.pageDetail = pageDetail
  },
  SET_TYPE(state, type) {
    state.type = type
  },
  SET_PAGE(state, page) {
    state.page = page
  },
  SET_DATE(state, date) {
    state.startDate = date[0]
    state.endDate = date[1]
  },
  SET_KEYWORD(state, keyword) {
    state.keyword = keyword
  }
}

export const actions = {
  getOrderList({commit, state}) {
    const {type, keyword, page, startDate, endDate} = state
    let data = {
      status: type,
      keyword,
      page,
      start_time: startDate,
      end_time: endDate
    }
    return API.FreeShipping.getOrderList(data)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_LIST', list)
        commit('SET_PAGE_DETAIL', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setOrderType({commit, dispatch}, select) {
    commit('SET_TYPE', select)
    commit('SET_PAGE', 1)
  },
  setPage({commit, dispatch}, page) {
    commit('SET_PAGE', page)
  },
  setDate({commit, dispatch}, date) {
    commit('SET_DATE', date)
    commit('SET_PAGE', 1)
  },
  setKeyword({commit, dispatch}, keyword) {
    commit('SET_KEYWORD', keyword)
    commit('SET_PAGE', 1)
  },
  resetParams({commit, dispatch}) {
    commit('SET_PAGE', 1)
    commit('SET_DATE', '')
    commit('SET_KEYWORD', '')
    commit('SET_TYPE', '')
  }
}
