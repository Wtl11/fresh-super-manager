<template>
  <div class="base-status-tab" :style="{opacity: show ? 1 : 0}">
    <div v-for="(item, index) in statusList" :key="index" class="status-tab-item hand"
         :class="{'status-tab-item-active': statusIndex === index}" @click="checkStatus(index, item)"
    >
      {{item.name}} ({{item.num}})
    </div>
    <span class="status-slider" :style="style"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BASE_STATUS_TAB'

  export default {
    name: COMPONENT_NAME,
    props: {
      statusList: {
        type: Array,
        default: () => {
          return [
            {name: '全部', value: '', num: 0},
            {name: '待提交', value: 0, num: 0},
            {name: '已完成', value: 1, num: 0}
          ]
        }
      },
      infoTabIndex: {
        type: Number,
        default: 0
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        statusIndex: this.infoTabIndex,
        style: '',
        el: null
      }
    },
    watch: {
      infoTabIndex(newVal) {
        this.statusIndex = newVal
        this.el = document.querySelectorAll('.status-tab-item')
        this.style = `left: ${this.el[this.statusIndex].offsetLeft}px; width: ${this.el[this.statusIndex].offsetWidth}px`
      },
      el: {
        handler(news) {
          this.style = `left: ${news[this.statusIndex].offsetLeft}px; width: ${news[this.statusIndex].offsetWidth}px`
        },
        deep: true
      },
      statusList: {
        handler(news) {
          setTimeout(() => {
            this.el = document.querySelectorAll('.status-tab-item')
          }, 100)
        },
        deep: true
      }
    },
    mounted() {
      this.el = document.querySelectorAll('.status-tab-item')
    },
    methods: {
      checkStatus(index, item) {
        this.statusIndex = index
        this.style = `left: ${this.el[index].offsetLeft}px; width: ${this.el[this.statusIndex].offsetWidth}px`
        this.$emit('setStatus', item, index)
      },
      infoStatus(news) {
        this.statusIndex = this.statusList.findIndex((item) => item.status === news)
        this.checkStatus(this.statusIndex, this.statusList[this.statusIndex])
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .base-status-tab
    margin-left: 30px
    display: flex
    background: #F6F6F6
    border-radius: 100px
    height: 30px
    box-sizing: border-box
    position: relative
    .status-tab-item
      user-select: none
      border-radius: 100px
      padding: 0 22px
      color: $color-text-main
      line-height: 30px
      text-align: center
      transition: 0.2s all
      font-size: $font-size-14
      font-family: $font-family-regular
      background: transparent
      position: relative
      z-index: 1
    .status-tab-item-active
      color: $color-white

  .status-slider
    width: 106px
    position: absolute
    top: 0
    left: 0
    height: 30px
    border-radius: 100px
    transition: all 0.2s
    background: $color-main
</style>
