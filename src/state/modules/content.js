import API from '@api'
import app from '@src/main'

const TYPE = ['common', 'video', 'cookbook']

export const state = {
  contentClassList: [{}],
  contentClassPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  workList: [{id: 1}],
  workPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  centerList: [{id: 1, is_select: false}, {id: 2, is_select: false}],
  centerPage: {
    total: 1,
    per_page: 10,
    total_page: 1
  },
  contentWorkPage: 1,
  workStatus: '',
  workKeyword: '',
  workTabIndex: 0,
  workCategoryId: '',
  workType: 'common'
}

export const getters = {
  contentClassList: (state) => state.contentClassList,
  contentClassPage: (state) => state.contentClassPage,
  workList: (state) => state.workList,
  workPage: (state) => state.workPage,
  contentWorkPage: (state) => state.contentWorkPage,
  workStatus: (state) => state.workStatus,
  workKeyword: (state) => state.workKeyword,
  workTabIndex: (state) => state.workTabIndex,
  centerList: (state) => state.centerList,
  centerPage: (state) => state.centerPage,
  workCategoryId: (state) => state.workCategoryId,
  workType: (state) => state.workType
}

export const mutations = {
  SET_CONTENT_CLASS_LIST(state, contentClassList) {
    state.contentClassList = contentClassList
  },
  SET_CONTENT_CLASS_PAGE(state, contentClassPage) {
    state.contentClassPage = contentClassPage
  },
  SET_WORK_LIST(state, workList) {
    state.workList = workList
  },
  SET_WORK_PAGE(state, workPage) {
    state.workPage = workPage
  },
  SET_CENTER_PAGE(state, workPage) {
    state.workPage = workPage
  },
  SET_CENTER_LIST(state, workPage) {
    state.workPage = workPage
  },
  SET_WORK_CONTENT_PAGE(state, contentWorkPage) {
    state.contentWorkPage = contentWorkPage
  },
  SET_WORK_STATUS(state, workStatus) {
    state.workStatus = workStatus
  },
  SET_WORK_KEYWORD(state, workKeyword) {
    state.workKeyword = workKeyword
  },
  SET_WORK_TAB_INDEX(state, workTabIndex) {
    state.workTabIndex = workTabIndex

    state.workType = TYPE[workTabIndex]
  },
  SET_WORK_CATEGORY_ID(state, workCategoryId) {
    state.workCategoryId = workCategoryId
  }
}

export const actions = {
  getContentClassList({commit}, obj) {
    // let {page, loading} = obj
    // return API.Content.getContentClassList({page}, loading)
    //   .then((res) => {
    //     if (res.error !== app.$ERR_OK) {
    //       app.$toast.show(res.message)
    //       return
    //     }
    //     let list = res.data
    //     let pages = res.meta
    //     let pageDetail = {
    //       total: pages.total,
    //       per_page: pages.per_page,
    //       total_page: pages.last_page
    //     }
    //     commit('SET_CONTENT_CLASS_LIST', list)
    //     commit('SET_CONTENT_CLASS_PAGE', pageDetail)
    //     return list
    //   })
    //   .catch(() => {
    //     return false
    //   })
    //   .finally(() => {
    //     app.$loading.hide()
    //   })
    console.log('ddd')
    return true
  },
  getWorkList({commit, state}, obj) {
    let {contentWorkPage, workStatus, workKeyword, workCategoryId, workType, loading} = state
    let data = {
      page: contentWorkPage,
      status: workStatus,
      keyword: workKeyword,
      category_id: workCategoryId,
      type: workType
    }
    return API.Content.getWorkList(data, loading)
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
        commit('SET_WORK_LIST', list)
        commit('SET_WORK_PAGE', pageDetail)
        return list
      })
      .catch(() => {
        return false
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  getCenterList({commit}, obj) {
    // let {page,status, keyword,type, loading} = obj
    // return API.Content.getCenterList({page}, loading)
    // .then((res) => {
    //   if (res.error !== app.$ERR_OK) {
    //     app.$toast.show(res.message)
    //     return
    //   }
    //   let list = res.data
    //   let pages = res.meta
    //   let pageDetail = {
    //     total: pages.total,
    //     per_page: pages.per_page,
    //     total_page: pages.last_page
    //   }
    //   commit('SET_CENTER_LIST', list)
    //   commit('SET_CENTER_PAGE', pageDetail)
    //   return list
    // })
    // .catch(() => {
    //   return false
    // })
    // .finally(() => {
    //   app.$loading.hide()
    // })
    console.log('666')
    return true
  },
  selectWork({commit, state}, obj) {
    let {type, index, value, ids} = obj
    let arr = JSON.parse(JSON.stringify(state.workList))

    if (type === 'all') {
      arr = arr.map((item) => {
        item.select = value
        if (value) {
          ids.push(item.id)
        }
        return item
      })
    } else {
      arr[index].select = !arr[index].select
      if (arr[index].select) {
        ids.push(arr[index].id)
      } else {
        let idIndex = ids.findIndex((item) => item.id === arr[index].id)
        ids.splice(idIndex, 1)
      }
    }
    commit('SET_WORK_LIST', arr)
    return ids
  },
  infoWork({commit}, obj) {
    commit('SET_WORK_CONTENT_PAGE', 1)
    commit('SET_WORK_STATUS', '')
    commit('SET_WORK_KEYWORD', '')
  },
  setWorkIndex({commit, dispatch}, index) {
    commit('SET_WORK_TAB_INDEX', index)
  },
  getWorkListMore({commit, dispatch}, obj) {
    typeof (obj.tabIndex) === 'number' && commit('SET_WORK_TAB_INDEX', obj.tabIndex)
    typeof (obj.page) !== 'undefined' && commit('SET_WORK_CONTENT_PAGE', obj.page)
    typeof (obj.status) !== 'undefined' && commit('SET_WORK_STATUS', obj.status)
    typeof (obj.keyword) !== 'undefined' && commit('SET_WORK_KEYWORD', obj.keyword)
    typeof (obj.workCategoryId) !== 'undefined' && commit('SET_WORK_CATEGORY_ID', obj.workCategoryId)
    // console.log(state)
    dispatch('getWorkList')
  }
}
