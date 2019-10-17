import axios from 'axios'
import storage from 'storage-controller'
import API from '@api'
import app from '@src/main'
import {objDeepCopy} from '@utils/common'

const GOODS = [
  {
    title: '1688商品',
    key: 'goods-1688',
    children: [
      {
        title: '商品管理',
        url: '/home/goods-manage',
        key: 'goods-manage',
        isLight: false
      },
      {
        title: '商品选品',
        url: '/home/goods-choose',
        key: 'goods-choose',
        isLight: false
      },
      {
        title: '供应商管理',
        url: '/home/suppliers-manage',
        key: 'suppliers-manage',
        isLight: false
      }
    ]
  },
  {
    title: '商品',
    key: 'goods-goods',
    children: [
      {
        title: '商品素材',
        url: '/home/product-list',
        key: 'product-list',
        isLight: false
      },
      {
        title: '商品类目',
        url: '/home/product-categories',
        key: 'product-categories',
        isLight: false
      },
      {
        title: '辅助资料',
        url: '/home/auxiliary-information',
        key: 'auxiliary-information',
        isLight: false
      }
    ]
  }
]
const ORDER = [
  {
    title: '订单',
    key: 'order-order',
    children: [
      {
        title: '订单管理',
        url: '/home/order-manage',
        key: 'order-manage',
        isLight: false
      }
    ]
  }
]
const CUSTOMER = [
  {
    title: '客户',
    key: 'customer-customer',
    children: [
      {
        title: '加盟商',
        url: '/home/franchise-list',
        key: 'franchise-list',
        isLight: false
      },
      {
        title: '团长',
        url: '/home/leader-list',
        key: 'leader-list',
        isLight: false
      },
      {
        title: '消费者',
        url: '/home/consumer-list',
        key: 'consumer-list',
        isLight: false
      },
      {
        title: '意向单',
        url: '/home/intent-list',
        key: 'intent-list',
        isLight: false
      }
    ]
  }
]
const FINANCE = [
  {
    title: '交易',
    key: 'finance-trade',
    children: [
      {
        title: '交易记录',
        url: '/home/transaction-record',
        key: 'transaction-record',
        isLight: false
      }
    ]
  },
  {
    title: '结算',
    key: 'finance-balance',
    children: [
      {
        title: '加盟商结算',
        url: '/home/franchise-settlement',
        key: 'franchise-settlement',
        isLight: false
      },
      {
        title: '团长提现',
        url: '/home/leader-withdrawal',
        key: 'leader-withdrawal',
        isLight: false
      }
    ]
  }
]
const CONTENT = [
  {
    title: '内容',
    key: 'content-content',
    children: [
      {
        title: '内容中心',
        url: '/home/content-center',
        key: 'content-center',
        isLight: false
      },
      {
        title: '内容分类',
        url: '/home/content-classification',
        key: 'content-classification',
        isLight: false
      }
    ]
  }
]

export const state = {
  currentUser: storage.get('auth.currentUser', 0),
  firstMenu: [
    {
      name: '商品',
      icon: require('../../pages/home/navigation/icon-commodity_white@2x.png'),
      activeIcon: require('../../pages/home/navigation/icon-commodity@2x.png'),
      isLight: true,
      second: GOODS,
      key: 'goods',
      url: '/home/goods-manage'
    },
    {
      name: '订单',
      icon: require('../../pages/home/navigation/icon-order_white@2x.png'),
      activeIcon: require('../../pages/home/navigation/icon-order@2x.png'),
      isLight: true,
      second: ORDER,
      key: 'order',
      url: '/home/order-manage'
    },
    {
      name: '内容',
      icon: require('../../pages/home/navigation/icon-content_white@2x.png'),
      activeIcon: require('../../pages/home/navigation/icon-content@2x.png'),
      isLight: false,
      second: CONTENT,
      key: 'content',
      url: '/home/content-center'
    },
    {
      name: '客户',
      icon: require('../../pages/home/navigation/icon-customer1@2x.png'),
      activeIcon: require('../../pages/home/navigation/icon-customer2@2x.png'),
      isLight: true,
      second: CUSTOMER,
      key: 'customer',
      url: '/home/franchise-list'
    },
    {
      name: '财务',
      icon: require('../../pages/home/navigation/icon-money_white@2x.png'),
      activeIcon: require('../../pages/home/navigation/icon-money@2x.png'),
      isLight: false,
      second: FINANCE,
      key: 'finance',
      url: '/home/transaction-record'
    }
  ]
}

export const getters = {
  // 判断用户是否已经登录
  loggedIn(state) {
    return !!state.currentUser
  },
  firstMenu(state) {
    return state.firstMenu
  }
}

export const mutations = {
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
    // storage.set('menu', {})
    storage.set('auth.currentUser', user)
    setDefaultAuthHeaders(state)
  }
}

export const actions = {
  // 初始化用户登录状态
  init({state, dispatch}) {
    setDefaultAuthHeaders(state)
    dispatch('validate')
  },
  // 登录
  logIn({commit, dispatch, getters, state}, {username, password}) {
    if (getters.loggedIn) {
      return dispatch('validate')
    }
    return API.Auth.logIn({username, password})
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          app.$toast.show(res.message)
          return null
        }
        const user = res.data
        commit('SET_CURRENT_USER', user)
        // 请求商城权限
        dispatch('getPowerMenu')
        return user
      })
      .catch(() => {
        return null
      })
      .finally(() => {
        app.$loading.hide()
      })
  },
  // 退出
  logOut({commit}) {
    commit('SET_CURRENT_USER', null)
  },
  getPowerMenu() {
    API.Auth.getPowerMenu().then((res) => {
      if (res.error !== app.$ERR_OK) {
        app.$toast.show(res.message)
        return
      }
      storage.set('menu', res.data)
      let menuData = res.data
      let firstNav = objDeepCopy(state.firstMenu)
      let firstArr = firstNav.filter((first) => {
        return menuData[first.key].is_show
      })
      let arr = []
      if (!firstArr.length) {
        app.$toast.show('无权限')
        return
      }
      firstArr[0].second.forEach((item) => {
        let childArr = item.children.filter((child) => {
          return menuData[child.key].is_show
        })
        item.children = childArr
        menuData[item.key].is_show && arr.push(item)
      })
      storage.set('firstPage', arr[0].children[0].url)
      setTimeout(() => {
        app.$router.push(arr[0].children[0].url)
      }, 30)
      //
    })
  },
  // 验证用户身份的有效性
  validate({commit, state}) {
    if (!state.currentUser) {
      return Promise.resolve(null)
    }
    return API.Auth.validate()
      .then((res) => {
        if (res.error !== app.$ERR_OK) {
          commit('SET_CURRENT_USER', null)
          return null
        }
        const user = res.data
        commit('SET_CURRENT_USER', user)
        return user
      })
      .catch(() => {
        commit('SET_CURRENT_USER', null)
        return null
      })
  }
}

/**
 * 设置默认请求头 Authorization
 * @param state
 */
function setDefaultAuthHeaders(state) {
  let commonHeaders = {
    'Current-Corp': process.env.VUE_APP_CURRENT_CORP,
    Authorization: state.currentUser ? state.currentUser.access_token : ''
  }
  axios.defaults.headers.common = commonHeaders
}
