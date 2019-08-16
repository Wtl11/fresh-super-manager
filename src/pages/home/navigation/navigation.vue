<template>
  <div class="navigation">
    <div class="first">
      <header class="logo">
        <img class="logo-img" src="./pic-logo@2x.png">
      </header>
      <ul v-for="(item, index) in firstNav" :key="index" class="menu">
        <li v-if="menuData[item.key].is_show" class="nav-item hand" :class="item | isActive" @click="_setFirstMenu(index)">
          <img :src="item.isLight ? item.activeIcon : item.icon" class="nav-item-icon">
          <p class="nav-item-name">{{item.name}}</p>
        </li>
      </ul>
    </div>
    <div class="second">
      <div v-for="(item, index) in navList" :key="index" class="second-item">
        <p v-if="menuData[item.key].is_show" class="second-title">{{item.title}}</p>
        <div v-for="(child, i) in item.children" :key="i" class="second-link hand" @click="_setChildActive(child)">
          <span :class="child | childrenActive" class="second-link-content">{{child.title}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import storage from 'storage-controller'
  import {authComputed} from '@state/helpers'
  import {objDeepCopy} from '@utils/common'
  const COMPONENT_NAME = 'NAVIGATION_BAR'
  const INFO_INDEX = 0
  // const HEIGHT = 40

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
        firstIndex: INFO_INDEX,
        navList: [],
        firstNav: [],
        menuData: {}
      }
    },
    computed: {
      ...authComputed
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
      this.menuData = storage.get('menu', {})
      // 深拷贝导航
      let firstNav = objDeepCopy(this.firstMenu)
      this.firstNav = firstNav.filter((item) => {
        return this.menuData[item.key].is_show
      })
      this._getMenuIndex()
      this._handleNavList()
    },
    methods: {
      _getMenuIndex() {
        let currentPath = this.$route.fullPath
        let index = ''
        let smallIndex = -1
        this.firstNav = this.firstNav.map((item, idx) => {
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
        if (this.firstNav[i].isLight) {
          return
        } else if (!this.firstNav[i].second.length) {
          this.$toast.show('该功能正在开发中')
          return
        }
        this.firstNav = this.firstNav.map((item, index) => {
          item.isLight = index === i
          return item
        })
        this.firstIndex = i
        let arr = []
        this.firstNav[i].second.forEach((item) => {
          let childArr = item.children.filter((child) => {
            return this.menuData[child.key].is_show
          })
          item.children = childArr
          this.menuData[item.key].is_show && arr.push(item)
        })
        this.navList = arr
        this.$router.push(this.navList[0].children[0].url)
      },
      // 跳转二级菜单页面
      _setChildActive(child) {
        this.$router.push(child.url)
      },
      // 监听页面变化
      _handleNavList() {
        let currentPath = this.$route.fullPath
        let currentNav
        this.firstNav.forEach((item, idx) => {
          let arr = []
          item.second.forEach((menu) => {
            let childArr = menu.children.filter((child) => {
              return this.menuData[child.key].is_show
            })
            menu.children = childArr
            this.menuData[menu.key].is_show && arr.push(menu)
          })
          item.second = arr
          if (currentPath.includes(item.url)) {
            currentNav = item.second
            this.firstNav[idx].isLight = true
            this.firstNav[idx].second[0].children[0].isLight = true
          } else {
            this.firstNav[idx].isLight = false
          }
          item.second &&
            item.second.forEach((it, id) => {
              it.children &&
                it.children.forEach((child, i) => {
                  if (currentPath.includes(child.url)) {
                    currentNav = item.second
                    this.firstNav[idx].isLight = true
                    this.firstNav[idx].second[id].children[i].isLight = true
                  } else {
                    this.firstNav[idx].second[id].children[i].isLight = false
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
      color: #888888
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
