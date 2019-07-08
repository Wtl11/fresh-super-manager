import store from '@state/store'
import API from '@api'
import {ERR_OK} from '@utils/config'

export default [
  // 登录界面
  {
    path: '/login',
    name: 'login',
    component: () => lazyLoadView(import('@pages/login/login')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        // 判断用户是否已经登录
        if (store.getters['auth/loggedIn']) {
          next({name: 'product-list'})
        } else {
          next()
        }
      }
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => lazyLoadView(import('@pages/home/home')),
    meta: {
      authRequired: true
    },
    redirect: 'home/product-list',
    children: [
      /**
       * 客户
       *
       */
      // 加盟商
      {
        path: 'franchise-list',
        name: 'franchise-list',
        component: () => lazyLoadView(import('@pages/franchise-list/franchise-list')),
        meta: {
          titles: ['客户', '加盟商'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('franchise/getFranchiseList', routeTo.params.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 意向单
      {
        path: 'intent-list',
        name: 'intent-list',
        component: () => lazyLoadView(import('@pages/intent-list/intent-list')),
        meta: {
          titles: ['客户', '意向单', '加盟商'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('intent/getIntentList', routeTo.params.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 新建加盟商
      {
        path: 'franchise-list/edit-franchise',
        name: 'edit-franchise',
        component: () => lazyLoadView(import('@pages/edit-franchise/edit-franchise')),
        meta: {
          titles: ['客户', '加盟商', '加盟商'],
          variableIndex: 2,
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('franchise/getFranchiseDetail', routeTo.query.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                routeTo.params.detail = res
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        props: (route) => ({detail: route.params.detail})
      },

      /**
       * 客户
       *
       * ------------------------------------------------------------------------------------------
       *
       * 财务
       */
      // 加盟商结算
      {
        path: 'franchise-settlement',
        name: 'franchise-settlement',
        component: () => lazyLoadView(import('@pages/franchise-settlement/franchise-settlement')),
        meta: {
          titles: ['财务', '结算', '加盟商结算'],
          beforeResolve(routeTo, routeFrom, next) {
            //  订单列表
            store
              .dispatch('franchise/getFranchiseSettlement')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 团长提现
      {
        path: 'leader-withdrawal',
        name: 'leader-withdrawal',
        component: () => lazyLoadView(import('@pages/leader-withdrawal/leader-withdrawal')),
        meta: {
          titles: ['财务', '结算', '团长提现'],
          beforeResolve(routeTo, routeFrom, next) {
            //  订单列表
            store
              .dispatch('leader/getWithdrawalList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 收支明细
      {
        path: 'leader-withdrawal/budget-detail/:id/:name',
        name: 'budget-detail',
        component: () => lazyLoadView(import('@pages/budget-detail/budget-detail')),
        meta: {
          titles: ['财务', '结算', '团长提现', '收支明细', ''],
          beforeResolve(routeTo, routeFrom, next) {
            //    commit('SET_BILL_PAGE', page)
            store.dispatch('leader/setInfoPage')
            store
              .dispatch('leader/getBillList', routeTo.params.id)
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 交易记录
      {
        path: 'transaction-record',
        name: 'transaction-record',
        component: () => lazyLoadView(import('@pages/transaction-record/transaction-record')),
        meta: {
          titles: ['财务', '结算', '交易记录'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('trade/getTradeList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      /**
       * 商品
       *
       */
      // 商品类目
      {
        path: 'product-categories',
        name: 'product-categories',
        component: () => lazyLoadView(import('@pages/product-categories/product-categories')),
        meta: {
          titles: ['商品', '商品类目'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('product/getCategoryList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 商品素材
      {
        path: 'product-list',
        name: 'product-list',
        component: () => lazyLoadView(import('@pages/product-list/product-list')),
        meta: {
          titles: ['商品', '商品素材'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('product/getProductList', {})
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      // 导入商品
      {
        path: 'product-list/lead-goods',
        name: 'lead-goods',
        component: () => lazyLoadView(import('@pages/lead-goods/lead-goods')),
        meta: {
          titles: ['商品', '商品素材', '商品导入']
        }
      },
      // 新建商品
      {
        path: 'product-list/edit-goods',
        name: 'edit-goods',
        component: () => lazyLoadView(import('@pages/edit-goods/edit-goods')),
        meta: {
          titles: ['商品', '商品素材', '商品'],
          variableIndex: 2,
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            if (!routeTo.query.id) {
              return next()
            }
            store
              .dispatch('product/getGoodsDetailData', routeTo.query.id)
              .then((response) => {
                if (!response) {
                  return next({name: '404'})
                }
                console.log(response)
                routeTo.params.detail = response
                next()
              })
              .catch(() => {
                next({name: '404'})
              })
          }
        },
        props: (route) => ({detail: route.params.detail})
      },
      // 辅助资料
      {
        path: 'auxiliary-information',
        name: 'auxiliary-information',
        component: () => lazyLoadView(import('@pages/auxiliary-information/auxiliary-information')),
        meta: {
          titles: ['商品', '辅助资料'],
          beforeResolve(routeTo, routeFrom, next) {
            store
              .dispatch('product/getAuxiliaryList')
              .then((res) => {
                if (!res) {
                  return next({name: '404'})
                }
                return next()
              })
              .catch(() => {
                return next({name: '404'})
              })
          }
        }
      },
      /**
       * 内容
       */
      // 创作文章
      {
        path: 'content-center/article-add',
        name: 'content-center-article-add',
        component: () => lazyLoadView(import('@pages/article-add/article-add')),
        meta: {
          titles: ['商城', '内容', '我的作品', '创作作品'],
          marginBottom: 80,
          beforeResolve(routeTo, routeFrom, next) {
            let id = routeTo.query.id
            // 详情数据
            if (id) {
              API.Content.getArticleDetail({id}, false)
                .then((res) => {
                  console.log(res, ERR_OK)
                  if (res.error !== ERR_OK) {
                    return false
                  }
                  next({
                    params:res.data
                  })
                })
              .catch(() => {
                next({name: '404'})
              })
            } else {
              next()
            }
          }
        }
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    component: () => lazyLoadView(import('@pages/_404/_404')),
    props: true
  },
  // 系统升级
  {
    path: '/upgrade',
    name: 'upgrade',
    component: () => lazyLoadView(import('@pages/_upgrade/_upgrade')),
    props: true
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '*',
    redirect: '404'
  }
]

function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
  })
  // loading: require('@pages/_loading/_loading').default,
  // delay: 400,
  // error: require('@pages/_timeout/_timeout').default,
  // timeout: 10000
  return Promise.resolve({
    functional: true,
    render(h, {data, children}) {
      // 将属性和方法传递给所有展示组件
      return h(AsyncHandler, data, children)
    }
  })
}
