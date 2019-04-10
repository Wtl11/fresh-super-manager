import API from '@api'
import app from '@src/main'

export const state = {
  withdrawalList: [],
  withdrawalPageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  withdrawalPage: 1,
  withdrawalSn: '',
  withdrawalStatus: '',
  withdrawalType: 2,
  withdrawalKeyword: '',
  startAt: '',
  endAt: '',
  billList: [],
  billType: '',
  billAcceptType: 2,
  billAcceptId: '',
  billPageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  billPage: 1
}

export const getters = {
  withdrawalList(state) {
    return state.withdrawalList
  },
  withdrawalPageDetail(state) {
    return state.withdrawalPageDetail
  },
  withdrawalPage(state) {
    return state.withdrawalPage
  },
  withdrawalSn(state) {
    return state.withdrawalSn
  },
  withdrawalType(state) {
    return state.withdrawalType
  },
  withdrawalKeyword(state) {
    return state.withdrawalKeyword
  },
  withdrawalStatus(state) {
    return state.withdrawalStatus
  },
  billList(state) {
    return state.billList
  },
  billType(state) {
    return state.billType
  },
  billAcceptType(state) {
    return state.billAcceptType
  },
  billAcceptId(state) {
    return state.billAcceptId
  },
  billPageDetail(state) {
    return state.billPageDetail
  },
  billPage(state) {
    return state.billPage
  },
  startAt(state) {
    return state.startAt
  },
  endAt(state) {
    return state.endAt
  }
}

export const mutations = {
  SET_DELIVERY_ORDER(state, detail) {
    state.deliveryOrder = detail
  },
  SET_DELIVERY_DETAIL(state, detail) {
    state.deliveryDetail = detail
  },
  SET_SETTLEMENT_LIST(state, list) {
    state.settlementList = list
  },
  SET_SETTLEMENT_DETAIL(state, list) {
    state.settlementDetail = list
  },
  SET_WITHDRAWAL_LIST(state, list) {
    state.withdrawalList = list
  },
  SET_WITHDRAWAL_PAGE_DETAIL(state, pageDetail) {
    state.withdrawalPageDetail = pageDetail
  },
  SET_WITHDRAWAL_PAGE(state, page) {
    state.withdrawalPage = page
  },
  SET_WITHDRAWAL_KEYWORD(state, keyword) {
    state.withdrawalKeyword = keyword
  },
  SET_WITHDRAWAL_TYPE(state, type) {
    state.withdrawalType = type
  },
  SET_WITHDRAWAL_SN(state, withdrawalSn) {
    state.withdrawalSn = withdrawalSn
  },
  SET_WITHDRAWAL_STATUS(state, status) {
    state.withdrawalStatus = status
  },
  SET_BILL_ACCEPT_ID(state, id) {
    state.billAcceptId = id
  },
  SET_BILL_LIST(state, list) {
    state.billList = list
  },
  SET_BILL_PAGE_DETAIL(state, pageDetail) {
    state.billPageDetail = pageDetail
  },
  SET_BILL_PAGE(state, page) {
    state.billPage = page
  },
  SET_BILL_TYPE(state, billType) {
    state.billType = billType
  },
  SET_TIME_AT(state, value) {
    state.startAt = value[0]
    state.endAt = value[1]
  }
}

export const actions = {
  getWithdrawalList({commit, state}) {
    const {withdrawalPage, withdrawalSn, withdrawalType, withdrawalKeyword, withdrawalStatus, startAt, endAt} = state
    let data = {
      withdraw_sn: withdrawalSn,
      type: withdrawalType,
      keyword: withdrawalKeyword,
      page: withdrawalPage,
      status: withdrawalStatus,
      start_at: startAt,
      end_at: endAt
    }
    return API.Leader.getWithdrawalList(data)
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
        commit('SET_WITHDRAWAL_LIST', list)
        commit('SET_WITHDRAWAL_PAGE_DETAIL', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setWithdrawalPage({commit, dispatch}, page) {
    commit('SET_WITHDRAWAL_PAGE', page)
    dispatch('getWithdrawalList')
  },
  setWithdrawalType({commit, dispatch}, type) {
    commit('SET_WITHDRAWAL_TYPE', type)
    commit('SET_WITHDRAWAL_PAGE', 1)
    dispatch('getWithdrawalList')
  },
  setWithdrawalSearch({commit, dispatch}, {orderSn, keyword}) {
    commit('SET_WITHDRAWAL_SN', orderSn)
    commit('SET_WITHDRAWAL_KEYWORD', keyword)
    commit('SET_WITHDRAWAL_PAGE', 1)
    dispatch('getWithdrawalList')
  },
  setWithdrawalStatus({commit, dispatch}, withdrawalStatus) {
    commit('SET_WITHDRAWAL_STATUS', withdrawalStatus.id)
    commit('SET_WITHDRAWAL_PAGE', 1)
    dispatch('getWithdrawalList')
  },
  setWidthTime({commit, dispatch}, time) {
    commit('SET_TIME_AT', time)
    commit('SET_WITHDRAWAL_PAGE', 1)
    dispatch('getWithdrawalList')
  },
  getBillList({commit, state}, id) {
    let {billPage, billType, billAcceptType, billAcceptId} = state
    if (id) {
      commit('SET_BILL_ACCEPT_ID', id)
      billAcceptId = id
    }
    let data = {
      order_type: billType,
      payee_id: billAcceptId,
      type: billAcceptType,
      page: billPage
    }
    return API.Leader.getShopBill(data)
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          return
        }
        let list = res.data
        let pages = res.meta
        let pageDetail = {
          total: pages.total,
          per_page: pages.per_page,
          total_page: pages.last_page
        }
        commit('SET_BILL_LIST', list)
        commit('SET_BILL_PAGE_DETAIL', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setBillPage({commit, dispatch}, page) {
    commit('SET_BILL_PAGE', page)
    dispatch('getBillList')
  },
  setInfoPage({commit, dispatch}) {
    commit('SET_BILL_PAGE', 1)
  },
  setBillType({commit, dispatch}, select) {
    commit('SET_BILL_TYPE', select.id)
    commit('SET_BILL_PAGE', 1)
    dispatch('getBillList')
  }
}
