import API from '@api'
import app from '@src/main'
// 加盟商
export const state = {
  franchiseSettlement: [],
  settlementStart: '',
  settlementEnd: '',
  settlementKeyword: '',
  isCertification: '',
  settlementStatus: '',
  pageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  settlementPage: 1,
  franListPageTotal: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  franchiseList: [],
  franListKeyword: '',
  franListPage: 1,
  franchiseDetail: {}
}

export const getters = {
  franchiseSettlement(state) {
    return state.franchiseSettlement
  },
  settlementStart(state) {
    return state.settlementStart
  },
  settlementEnd(state) {
    return state.settlementEnd
  },
  settlementKeyword(state) {
    return state.settlementKeyword
  },
  settlementStatus(state) {
    return state.settlementStatus
  },
  pageTotal(state) {
    return state.pageTotal
  },
  settlementPage(state) {
    return state.settlementPage
  },
  franListPageTotal(state) {
    return state.franListPageTotal
  },
  franchiseList(state) {
    return state.franchiseList
  },
  franListKeyword(state) {
    return state.franListKeyword
  },
  franListPage(state) {
    return state.franListPage
  },
  franchiseDetail(state) {
    return state.franchiseDetail
  }
}

export const mutations = {
  SET_FRANCHISE_SETTLEMENT(state, franchiseSettlement) {
    state.franchiseSettlement = franchiseSettlement
  },
  SET_SETTLEMENT_Start(state, settlementStart) {
    state.settlementStart = settlementStart
  },
  SET_SETTLEMENT_END(state, settlementEnd) {
    state.settlementEnd = settlementEnd
  },
  SET_SETTLEMENT_KEYWORD(state, settlementKeyword) {
    state.settlementKeyword = settlementKeyword
  },
  SET_SETTLEMENT_STATUS(state, settlementStatus) {
    state.settlementStatus = settlementStatus
  },
  SET_SETTLEMENT_PAGE_TOTAL(state, pageTotal) {
    state.pageTotal = pageTotal
  },
  SET_SETTLEMENT_PAGE(state, page) {
    state.settlementPage = page
  },
  SET_FRAN_LIST_PAGE_TOTAL(state, franListPageTotal) {
    state.franListPageTotal = franListPageTotal
  },
  SET_FRANCHISE_LIST(state, franchiseList) {
    state.franchiseList = franchiseList
  },
  SET_FRAN_LIST_KEYWORD(state, franListKeyword) {
    state.franListKeyword = franListKeyword
  },
  SET_FRAN_LIST_PAGE(state, franListPage) {
    state.franListPage = franListPage
  },
  SET_FRANCHISE_DETAIL(state, franchiseDetail) {
    state.franchiseDetail = franchiseDetail
  },
  SET_FRAN_DATA(state, object) {
    for (let i in object) {
      state[i] = object[i]
    }
  }
}

export const actions = {
  // 加盟商编辑详情
  getFranchiseDetail({commit, dispatch}, id) {
    return API.Franchise.franchiseDetail(id)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        commit('SET_FRANCHISE_DETAIL', res.data)
        return res.data
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 加盟商结算
  getFranchiseSettlement({commit, dispatch}) {
    const {settlementPage, settlementKeyword, settlementStatus, settlementStart, settlementEnd} = state
    let time = settlementStart && settlementEnd ? [settlementStart, settlementEnd] : []
    let data = {
      status: settlementStatus,
      keyword: settlementKeyword,
      page: settlementPage,
      date: time.join(',')
    }
    return API.Franchise.franchiseSettlement(data)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = res.meta && {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_FRANCHISE_SETTLEMENT', list)
        commit('SET_SETTLEMENT_PAGE_TOTAL', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setfranPage({commit, dispatch}, page) {
    commit('SET_SETTLEMENT_PAGE', page)
    dispatch('getFranchiseSettlement')
  },
  setfranTime({commit, dispatch}, time) {
    commit('SET_SETTLEMENT_Start', time[0])
    commit('SET_SETTLEMENT_END', time[1])
    dispatch('getFranchiseSettlement')
  },
  setfranStatus({commit, dispatch}, select) {
    commit('SET_SETTLEMENT_STATUS', select)
    commit('SET_SETTLEMENT_PAGE', 1)
    dispatch('getFranchiseSettlement')
  },
  setfranKeyword({commit, dispatch}, keyword) {
    commit('SET_SETTLEMENT_KEYWORD', keyword)
    commit('SET_SETTLEMENT_PAGE', 1)
    dispatch('getFranchiseSettlement')
  },
  // 加盟商列表
  getFranchiseList({commit, dispatch}) {
    const {franListKeyword, franListPage, isCertification} = state
    let data = {
      keyword: franListKeyword,
      page: franListPage,
      is_certification: isCertification
    }
    return API.Franchise.franchiseList(data)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = res.meta && {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_FRANCHISE_LIST', list)
        commit('SET_FRAN_LIST_PAGE_TOTAL', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setfranListKeyword({commit, dispatch}, keyword) {
    commit('SET_FRAN_LIST_KEYWORD', keyword)
    commit('SET_FRAN_LIST_PAGE', 1)
    dispatch('getFranchiseList')
  },
  setfranListPage({commit, dispatch}, page) {
    commit('SET_FRAN_LIST_PAGE', page)
    dispatch('getFranchiseList')
  },
  setfranData({commit, dispatch}, object) {
    commit('SET_FRAN_DATA', object)
    commit('SET_FRAN_LIST_PAGE', 1)
    dispatch('getFranchiseList')
  }
}
