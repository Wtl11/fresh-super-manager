import API from '@api'
import app from '@src/main'
import storage from 'storage-controller'
const TYPE_STATUS = [
  {text: '团长', type: 1, key: 'intent-group'},
  {text: '供应商', type: 2, key: 'intent-supplier'},
  {text: '加盟商', type: 3, key: 'intent-franchise'}
]
export const state = {
  list: [],
  pageDetail: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  page: 1,
  searchNum: '',
  status: '',
  tabStatus: getType(),
  type: (getType()[0] && getType()[0].type) || 1,
  startTime: '',
  endTime: '',
  limit: 10,
  pageName: (getType()[0] && getType()[0].text) || '团长'
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
  searchNum(state) {
    return state.searchNum
  },
  tabStatus(state) {
    return state.tabStatus
  },
  status(state) {
    return state.status
  },
  type(state) {
    return state.type
  },
  pageName(state) {
    return state.pageName
  }
}

export const mutations = {
  SET_INTENT_LIST(state, list) {
    state.list = list
  },
  SET_SEARCH_NUM(state, searchNum) {
    state.searchNum = searchNum
  },
  SET_STATUS(state, status) {
    state.status = status
  },
  SET_TYPE(state, type) {
    state.type = type
  },
  SET_DETAIL_PAGE(state, pageDetail) {
    state.pageDetail = pageDetail
  },
  SET_PAGE(state, page) {
    state.page = page
  },
  SET_PAGE_NAME(state, pageName) {
    state.pageName = pageName
  },
  INIT_TYPE(state) {
    state.tabStatus = getType()
    state.type = (state.tabStatus[0] && state.tabStatus[0].type) || 1
    state.status = ''
    state.page = 1
    state.searchNum = ''
    state.pageName = (state.tabStatus[0] && state.tabStatus[0].text) || '团长'
  }
}

export const actions = {
  initData({commit, dispatch, state}) {
    commit('SET_TYPE', state.tabStatus[0].type)
    // commit('SET_STATUS', '')
    commit('SET_PAGE', 1)
    commit('SET_SEARCH_NUM', '')
  },
  getIntentList({commit, dispatch}) {
    const {page, status, type, searchNum} = state
    // type:1=团长、2=供应商，3=加盟商
    // status:空=所有，0=待处理，1=已处理
    let data = {
      status,
      page,
      type: type,
      recruit_sn: searchNum
    }
    return API.Intent.getIntentList(data)
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
        commit('SET_DETAIL_PAGE', pageDetail)
        commit('SET_INTENT_LIST', list)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  setSearchNum({commit, dispatch}, searchNum) {
    commit('SET_SEARCH_NUM', searchNum)
    commit('SET_PAGE', 1)
    dispatch('getIntentList')
  },
  setIntentStatus({commit, dispatch}, select) {
    commit('SET_STATUS', select.status)
    commit('SET_PAGE', 1)
    dispatch('getIntentList')
  },
  setIntentType({commit, dispatch}, tabStatus) {
    commit('SET_TYPE', tabStatus.type)
    commit('SET_PAGE_NAME', tabStatus.text)
    // commit('SET_STATUS', '')
    commit('SET_PAGE', 1)
    dispatch('getIntentList')
  },
  setPage({commit, dispatch}, page) {
    commit('SET_PAGE', page)
    dispatch('getIntentList')
  },
  initType({commit, dispatch, state}) {
    commit('INIT_TYPE')
  }
}

function getType() {
  let menuData = storage.get('menu')
  let arr = TYPE_STATUS.filter((item) => {
    return menuData[item.key].is_show
  })
  return arr
}
