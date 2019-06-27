<template>
  <div class="navigation">
    <div class="first">
      <header class="logo">
        <img class="logo-img" src="./pic-logo@2x.png">
      </header>
      <ul v-for="(item, index) in firstMenu" :key="index" class="menu">
        <li class="nav-item hand" :class="item | isActive" @click="_setFirstMenu(index)">
          <img :src="item.isLight ? item.activeIcon : item.icon" class="nav-item-icon">
          <p class="nav-item-name">{{item.name}}</p>
        </li>
      </ul>
    </div>
    <div class="second">
      <div v-for="(item, index) in navList" :key="index" class="second-item">
        <p class="second-title">{{item.title}}</p>
        <div v-for="(child, i) in item.children" :key="i" class="second-link hand" @click="_setChildActive(child)">
          <span :class="child | childrenActive" class="second-link-content">{{child.title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'NAVIGATION_BAR'
  const INFO_INDEX = 0
  // const HEIGHT = 40
  const GOODS = [
    {
      title: '商品',
      children: [
        {
          title: '商品素材',
          url: '/home/product-list',
          isLight: false
        },
        {
          title: '商品类目',
          url: '/home/product-categories',
          isLight: false
        },
        {
          title: '辅助资料',
          url: '/home/auxiliary-information',
          isLight: false
        }
      ]
    }
  ]
  const CUSTOMER = [
    {
      title: '客户',
      children: [
        {
          title: '加盟商',
          url: '/home/franchise-list',
          isLight: false
        },
        {
          title: '意向单',
          url: '/home/intent-list',
          isLight: false
        }
      ]
    }
  ]
  const FINANCE = [
    {
      title: '交易',
      children: [
        {
          title: '交易记录',
          url: '/home/transaction-record',
          isLight: false
        }
      ]
    },
    {
      title: '结算',
      children: [
        {
          title: '加盟商结算',
          url: '/home/franchise-settlement',
          isLight: false
        },
        {
          title: '团长提现',
          url: '/home/leader-withdrawal',
          isLight: false
        }
      ]
    }
  ]
  const FIRST_MENU = [
    {
      name: '商品',
      icon: require('./icon-content1@2x.png'),
      activeIcon: require('./icon-content2@2x.png'),
      isLight: true,
      second: GOODS,
      url: '/home/product-list'
    },
    {
      name: '客户',
      icon: require('./icon-customer1@2x.png'),
      activeIcon: require('./icon-customer2@2x.png'),
      isLight: true,
      second: CUSTOMER,
      url: '/home/franchise-list'
    },
    {
      name: '财务',
      icon: require('./icon-money_white@2x.png'),
      activeIcon: require('./icon-money@2x.png'),
      isLight: false,
      second: FINANCE,
      url: '/home/transaction-record'
    }
  ]
  export default {
    name: COMPONENT_NAME,
    filters: {
      // 子路有的激活状态过滤
      childrenActive(value) {
        if (value.isLight) {
          return 'second-link-active'
        }
        return ''
      },
      // 本路由的激活状态过滤
      isActive(value) {
        if (value.isLight) {
          return 'nav-item-active'
        }
        return ''
      }
    },
    data() {
      return {
        currentIndex: '',
        firstMenu: FIRST_MENU,
        firstIndex: INFO_INDEX,
        navList: []
      }
    },
    watch: {
      $route(newVal, oldVal) {
        if (newVal.fullPath === oldVal.fullPath) {
          return
        }
        this._handleNavList()
      }
    },
    created() {
      this._getMenuIndex()
      this._handleNavList()
    },
    methods: {
      // 初始化一级菜单的高亮
      _getMenuIndex() {
        let currentPath = this.$route.fullPath
        let index = ''
        let smallIndex = -1
        this.firstMenu = this.firstMenu.map((item, idx) => {
          if (item.second.length) {
            item.second.forEach((end) => {
              if (smallIndex === -1 && index === '') {
                smallIndex = end.children.findIndex((child) => {
                  return currentPath.includes(child.url)
                })
                index = smallIndex !== -1 ? idx : ''
                this.firstIndex = index
                this.navList = index !== -1 ? JSON.parse(JSON.stringify(item.second)) : this.navList
              }
            })
          }
          item.isLight = idx === index
          return item
        })
      },
      // 点击一级导航
      _setFirstMenu(i) {
        if (this.firstMenu[i].isLight) {
          return
        } else if (!this.firstMenu[i].second.length) {
          this.$toast.show('该功能正在开发中')
          return
        }
        this.firstMenu = this.firstMenu.map((item, index) => {
          item.isLight = index === i
          return item
        })
        this.firstIndex = i
        this.navList = JSON.parse(JSON.stringify(this.firstMenu[i].second))
        this.$router.push(this.firstMenu[i].url)
      },
      // 跳转二级菜单页面
      _setChildActive(child) {
        this.$router.push(child.url)
      },
      // 监听页面变化
      _handleNavList() {
        let currentPath = this.$route.fullPath
        let currentNav
        this.firstMenu.forEach((item, idx) => {
          if (currentPath.includes(item.url)) {
            currentNav = item.second
            this.firstMenu[idx].isLight = true
            this.firstMenu[idx].second[0].children[0].isLight = true
          } else {
            this.firstMenu[idx].isLight = false
          }
          item.second && item.second.forEach((it, id) => {
            it.children && it.children.forEach((child, i) => {
              if (currentPath.includes(child.url)) {
                currentNav = item.second
                this.firstMenu[idx].isLight = true
                this.firstMenu[idx].second[id].children[i].isLight = true
              } else {
                this.firstMenu[idx].second[id].children[i].isLight = false
              }
            })
          })
        })
        this.navList = currentNav || []
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  $tab-height = 56px
  $color-menu-tag = #111747
  $color-menu-text = #6E748B
  $color-menu-text-active = #fff
  $color-menu-bg-active = #0F1922
  $color-menu-bg = #1D2B36
  $color-white = #fff
  $menu-width = 100px

  .navigation
    user-select: none
    position: fixed
    top: 0
    left: 0
    z-index: 2000
    width: 210px
    display: flex

    .first
      overflow: hidden
      min-height: 100vh
      width: $menu-width
      position: relative
      background: #352969

    .menu
      position: relative
      z-index: 1
      width: 100px

    .nav-item
      height: 70px
      display: flex
      flex-direction: column
      align-items: center
      box-sizing: border-box
      color: $color-text-main
      .nav-item-icon
        width: 20px
        height: @width
        margin: 15px 0 7px
      .nav-item-name
        line-height: 1
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-white
    .nav-item-active
      color: #352969
      background: $color-white
      .nav-item-name
        color: #352969

  .logo
    position: relative
    z-index: 1
    height: 86px
    display: flex
    align-items: center
    justify-content: center
    .logo-img
      overflow: hidden
      width: 32px

  .second
    padding: 10px 16px 20px
    box-sizing: border-box
    height: 100vh
    width: 110px
    background: $color-white
    overflow: auto
    white-space: nowrap
    transition: all 0.2s
    border-right-1px($color-line)
    &::-webkit-scrollbar
      width: 0
      height: 0
      transition: all 0.2s
    &::-webkit-scrollbar-thumb
      background-color: rgba(0, 0, 0, .15)
      border-radius: 10px
    &::-webkit-scrollbar-thumb:hover
      background-color: rgba(0, 0, 0, .3)
    &::-webkit-scrollbar-track
      box-shadow: inset 0 0 6px rgba(0, 0, 0, .15)
      border-radius: 10px
    &:hover
      &::-webkit-scrollbar
        transition: all 0.2s
        width: 6px
        height: 8px

    .second-title
      transition: all 0.2s
      margin: 30px 0 10px
      color: #666
      font-size: $font-size-14
      line-height: 1

    .second-link
      transition: all 0.2s
      height: 34px
      line-height: 34px
      color: $color-white
      font-size: $font-size-14
      font-family: $font-family-regular
      &:hover
        color: $color-sub


    .second-link-content
      display: inline-block
      margin-left: -6px
      border-radius: $radius-main
      line-height: 28px
      height: 28px
      color: #333
      padding: 0 8px
    .second-link-active
      color: #922C88
      background: rgba(146,44,136,.15)
</style>
