<template>
  <div class="product-categories normal-box">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-goods_classify@2x.png" class="identification-icon">
        <p class="identification-name">商品分类</p>
        <div class="base-status-tab">
          <div v-for="(item, index) in statusTab" :key="index" class="status-tab-item">
            {{item.name}} ({{item.num}})
          </div>
        </div>
      </div>
      <div class="function-btn">
        <div class="btn-main">新建大类<span class="add-icon"></span></div>
      </div>
    </div>
    <ul class="categories-box">
      <li v-for="(item, index) in categoryList" :key="index" class="big-box">
        <div class="big-box-main" :class="index === 0 ? 'box-main-none' : ''">
          <div class="big-main-left hand" @click="openList(index)">
            <div class="icon-hand" :class="item.select ? 'open' : ''"></div>
            <div class="img">
              <img class="img-icon" :src="item.image_url" alt="">
            </div>
            <div class="text">{{item.name}} <span class="tip">({{item.list && item.list.length}}个子类)</span></div>
          </div>
          <div class="big-main-right">
            <span class="list-operation" @click="addChilrenCate(item, index)">添加子类</span>
            <span class="list-operation" @click="editBigCatee(item, index)">修改</span>
            <span class="list-operation" @click="delBigCatee(item, index)">删除</span>
          </div>
        </div>
        <div v-if="item.select" class="open-list">
          <div v-for="(twoitem, twoindex) in item.list" :key="twoindex" class="">
            <div class="open-item">
              <div class="open-item-line"></div>
              <div class="big-main-left hand" @click="openTwoList(index, twoindex)">
                <div class="icon-hand mr-10" :class="twoitem.select ? 'open' : ''"></div>
                <div class="text">{{twoitem.name}} <span class="tip">({{twoitem.list && twoitem.list.length}}个子类)</span></div>
              </div>
              <div class="big-main-right">
                <span class="list-operation" @click="editSmallCatee(item, index, twoitem, twoindex)">添加子类</span>
                <span class="list-operation" @click="editSmallCatee(item, index, twoitem, twoindex)">修改</span>
                <span class="list-operation" @click="delSmallCatee(item, index, twoitem, twoindex)">删除</span>
              </div>
            </div>
            <div v-if="twoitem.select" class="child-list">
              <div class="open-item" v-for="(twoitem, twoindex) in twoitem.list">
                <div class="open-item-line"></div>
                <div class="big-main-left hand" @click="openList(index)">
                  <div class="text">{{twoitem.name}}</div>
                </div>
                <div class="big-main-right">
                  <span class="list-operation" @click="editSmallCatee(item, index, twoitem, twoindex)">修改</span>
                  <span class="list-operation" @click="delSmallCatee(item, index, twoitem, twoindex)">删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <change-model ref="smallModel" :showCate="true" numberPla="长度不能超过10位" @confirm="eidtConfirm"></change-model>
    <change-model ref="bigModel" :showCate="false" numberPla="长度不能超过10位" @confirm="newConfirm"></change-model>
    <default-confirm ref="bigConfirm" :oneBtn="oneBtn" @confirm="delConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import ChangeModel from './change-model/change-model'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  const PAGE_NAME = 'PRODUCT_CATEGORIES'
  const TITLE = '商品类目'

  export default {
    name: PAGE_NAME,
    components: {
      ChangeModel,
      DefaultConfirm
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        statusTab: [{name: '一级类目', num: 0}, {name: '二级类目', num: 0}, {name: '三级类目', num: 0}],
        categoryList: [
          {name: '一级类目', select: true, list: [{name: '一级类目', select: true, list: [{name: '一级类目'}]}]}, {name: '二级类目'}
        ]
      }
    },
    methods: {
      openList(index) {
        this.categoryList[index].select = !this.categoryList[index].select
        this.$forceUpdate()
      },
      openTwoList(index, twoIndex) {
        this.categoryList[index].list[twoIndex].select = !this.categoryList[index].list[twoIndex].select
        this.$forceUpdate()
      },
      addChilrenCate(item, index) {
        this.$refs.bigModel.show('新建商品子分类', {
          type: false
        })
      },
      editBigCatee(item, index) {
        this.$refs.bigModel.show('修改商品分类', {
          name: item.name,
          sort: item.sort,
          imageUrl: item.image_url,
          imageId: item.image_id,
          id: item.id,
          type: true
        })
      },
      delBigCatee() {
        this.oneBtn = false
        this.$refs.bigConfirm.show(`确定删除该分类？`)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .img-icon
    width :100%
    height @width
    display block
    object-fit :cover

  .product-top
    layout(row)
    align-items: center
    justify-content: space-between
    height: 80px
  .base-status-tab
    margin-left: 30px
    display: flex
    background: #F6F6F6
    border-radius: 100px
    height: 30px
    box-sizing: border-box
    position: relative
    .status-tab-item
      border-radius: 100px
      width: 106px
      color: $color-text-main
      line-height: 30px
      text-align: center
      transition: 0.2s all
      font-size: $font-size-14
      font-family: $font-family-regular
      background: transparent
      position: relative
      z-index: 1
  .categories-box
    border-1px($color-line)
    .big-box
      width: 100%
      .big-box-main
        height: 60px
        padding-left: 22px
        padding-right: 14px
        box-sizing: border-box
        border-top-1px($color-line)
        layout(row)
        align-items: center
        justify-content: space-between
      .box-main-none
        border-none()

  .add-box
    height: 60px
    border-top-1px($color-line)
    padding-left: 90px
    layout(row)
    align-items: center
    .icon
      width: 12px
      height: 12px
      border-radius: 50%
      background-size: 12px
      bg-image('icon-add')
      margin-right: 6px
    .text
      font-size: $font-size-14
      line-height: 1
      color: $color-main
      font-family: $font-family-regular

  .open-item
    height: 60px
    border-top-1px($color-line)
    background: $color-white
    padding-left: 75px
    padding-right: 14px
    layout(row)
    align-items: center
    justify-content: space-between
    font-size: $font-size-14
    position: relative
    .open-item-line
      position: absolute
      left: 27px
      top: 11px
      height: 20px
      width: 30px
      border-left: 1px solid #F3F4F6
      border-bottom: 1px solid #F3F4F6
    &:hover
      background: #F5EFF5
      .open-item-line
        border-left: 1px solid #fff
        border-bottom: 1px solid #fff
    .open-item-left
      font-size: $font-size-14
      color: $color-text-main
      font-family: $font-family-regular
  .child-list
    .open-item
      padding-left: 122px
      .open-item-line
        position: absolute
        left: 83px
        top: 11px
  .big-main-left
    layout(row)
    align-items: center
    min-height: 100%
    min-width: 200px
    .img
      width: 32px
      height: 32px
      border-radius: 2px
      border: 0.5px solid $color-line
      margin: 0 10px
      overflow :hidden
    .text
      font-size: $font-size-14
      line-height: 1
      color: $color-text-main
      font-family: $font-family-regular
    .tip
      color: $color-text-assist
  .icon-hand
    width: 16px
    height: 16px
    border-radius: 50%
    background-size: 16px
    bg-image('icon-retract')
    &.open
      bg-image('icon-open')
  .mr-10
    margin-right: 10px
  .product-categories
    width: 100%
</style>
