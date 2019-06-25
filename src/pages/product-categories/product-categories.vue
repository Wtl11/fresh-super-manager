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
        <div class="btn-main" @click="newBigCate">新建大类<span class="add-icon"></span></div>
      </div>
    </div>
    <ul class="categories-box">
      <li v-for="(item, index) in categoryList" :key="index" class="big-box">
        <div class="big-box-main" :class="index === 0 ? 'box-main-none' : ''">
          <div class="big-main-left hand" @click="openList(index)">
            <div class="icon-hand" :class="item.select ? 'open' : ''"></div>
            <div class="text">{{item.name}} <span class="tip">({{item.list && item.list.length}}个子类)</span></div>
          </div>
          <div class="big-main-right">
            <span class="list-operation" @click="addChilrenCate(item, index)">添加二级类目</span>
            <span class="list-operation" @click="editBigCatee(item, index)">修改</span>
            <span class="list-operation" @click="delBigCatee(item, index)">删除</span>
          </div>
        </div>
        <div v-if="item.select" class="open-list">
          <div v-for="(twoitem, twoindex) in item.list" :key="twoindex" class="">
            <div class="open-item">
              <div class="open-item-line"></div>
              <div class="big-main-left hand" @click="openTwoList(index, twoindex)">
                <div class="icon-hand" :class="twoitem.select ? 'open' : ''"></div>
                <div class="text">{{twoitem.name}} <span class="tip">({{twoitem.list && twoitem.list.length}}个子类)</span></div>
              </div>
              <div class="big-main-right">
                <span class="list-operation" @click="addTwoCatee(item, index, twoitem, twoindex)">添加三级类目</span>
                <span class="list-operation" @click="editTwoCatee(item, index, twoitem, twoindex)">修改</span>
                <span class="list-operation" @click="delTwoCatee(item, index, twoitem, twoindex)">删除</span>
              </div>
            </div>
            <div v-if="twoitem.select" class="child-list">
              <div v-for="(thritem, thrindex) in twoitem.list" :key="thrindex" class="open-item">
                <div class="open-item-line"></div>
                <div class="big-main-left hand">
                  <div class="text">{{thritem.name}}</div>
                </div>
                <div class="big-main-right">
                  <span class="list-operation" @click="editThrCatee(item, index, twoitem, twoindex, thritem, thrindex)">修改</span>
                  <span class="list-operation" @click="delThrCatee(item, index, twoitem, twoindex, thritem, thrindex)">删除</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <change-model ref="smallModel" :showCate="false" numberPla="长度不能超过10位" @confirm="eidtConfirm"></change-model>
    <change-model ref="bigModel" :showCate="false" numberPla="长度不能超过10位" @confirm="newConfirm"></change-model>
    <default-confirm ref="bigConfirm" :oneBtn="oneBtn" @confirm="delConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {productComputed, productMethods} from '@state/helpers'
  import ChangeModel from './change-model/change-model'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'
  import _ from 'lodash'
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
        categoryList: [],
        categoryType: 0,
        deteleType: 1,
        editType: 2,
        oneBtn: false,
        categoryNewName: '',
        oneItem: '',
        oneIndex: '',
        twoItem: '',
        twoIndex: '',
        thrItem: '',
        thrIndex: ''
      }
    },
    computed: {
      ...productComputed
    },
    created() {
      this.categoryList = _.cloneDeep(this.reqCategoryList)
      this.getCategoryStatus()
    },
    methods: {
      ...productMethods,
      // 获得类目列表
      getCategoryStatus() {
        API.Product.getStausList().then((res) => {
          this.$loading.hide()
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.statusTab = res.data.map((item) => {
            return {
              name: item.status_str,
              num: item.statistic
            }
          })
        })
      },
      openList(index) {
        this.categoryList[index].select = !this.categoryList[index].select
        this.$forceUpdate()
      },
      openTwoList(index, twoIndex) {
        this.categoryList[index].list[twoIndex].select = !this.categoryList[index].list[twoIndex].select
        this.$forceUpdate()
      },
      // 新建一级类目
      newBigCate() {
        this.$refs.bigModel.show('新建商品一级类目', {
          name: '',
          type: false
        })
        this.categoryType = 0
      },
      // 添加二级类目
      addTwoCatee(item, index, twoitem, twoindex) {
        this.oneItem = item
        this.oneIndex = index
        this.twoItem = twoitem
        this.twoIndex = twoindex
        this.$refs.bigModel.show('新建商品三级类目', {
          name: '',
          type: false
        })
        this.categoryType = 3
      },
      // 编辑一级类目
      editBigCatee(item, index) {
        this.oneItem = item
        this.oneIndex = index
        this.categoryType = 2
        this.$refs.bigModel.show('修改商品一级类目', {
          name: item.name,
          sort: item.sort,
          imageUrl: item.image_url,
          imageId: item.image_id,
          id: item.id,
          type: false
        })
      },
      // 添加二级类目
      addChilrenCate(item, index) {
        this.categoryType = 1
        this.oneItem = item
        this.oneIndex = index
        this.$refs.bigModel.show('新建商品二级类目', {
          type: false
        })
      },
      newConfirm(data) {
        let {name, sort, imageId, type} = data
        if (name.length === 0 || name.length > 10) {
          this.$toast.show('分类名称的长度不能超过10个字')
          return
        }
        if (!imageId && type) {
          this.$toast.show('请上传分类图标')
          return
        }
        switch(this.categoryType) {
        case 0:
          API.Product.createCategory({name: name, sort: sort}).then((res) => {
            this.$loading.hide()
            if (res.error === this.$ERR_OK) {
              this.$refs.bigModel.hide()
              this.$toast.show('创建成功')
              this.categoryNewName = ''
              this.categoryList.push({
                name: name,
                sort: sort,
                id: res.data.id,
                list: []
              })
              this.getCategoryStatus()
              this.categoryList.sort(this._sort)
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        case 1:
          API.Product.createCategory({name: name, sort: sort, parent_id: this.oneItem.id}).then((res) => {
            this.$loading.hide()
            if (res.error === this.$ERR_OK) {
              this.$refs.bigModel.hide()
              this.$toast.show('创建成功')
              this.categoryNewName = ''
              this.categoryList[this.oneIndex].list.push({
                name: name,
                sort: sort,
                parent_id: this.oneItem.id,
                id: res.data.id,
                list: []
              })
              this.getCategoryStatus()
              this.categoryList[this.oneIndex].list.sort(this._sort)
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        case 2:
          API.Product.editCategory(this.oneItem.id, {name: name, sort: sort, image_id: imageId, parent_id: 0}).then(
            (res) => {
              this.$loading.hide()
              if (res.error === this.$ERR_OK) {
                this.$refs.bigModel.hide()
                this.$toast.show('修改成功')
                this.categoryList[this.oneIndex].name = name
                this.categoryList[this.oneIndex].sort = sort
                this.categoryList.sort(this._sort)
              } else {
                this.$toast.show(res.message)
              }
            }
          )
          break
        case 3:
          API.Product.createCategory({name: name, sort: sort, parent_id: this.twoItem.id}).then((res) => {
            this.$loading.hide()
            if (res.error === this.$ERR_OK) {
              this.$refs.bigModel.hide()
              this.$toast.show('创建成功')
              this.categoryNewName = ''
              this.categoryList[this.oneIndex].list[this.twoIndex].list.push({
                name: name,
                sort: sort,
                parent_id: this.oneItem.id,
                id: res.data.id
              })
              this.getCategoryStatus()
              this.categoryList[this.oneIndex].list[this.twoIndex].list.sort(this._sort)
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        }
      },
      // 编辑商品二级类目
      editTwoCatee(item, index, twoitem, twoindex) {
        this.oneItem = item
        this.oneIndex = index
        this.twoItem = twoitem
        this.twoIndex = twoindex
        this.editType = 2
        this.$refs.smallModel.setData(item, this.categoryList)
        this.$refs.smallModel.show('修改商品二级类目', {
          name: this.twoItem.name,
          sort: this.twoItem.sort,
          type: false
        })
      },
      // 编辑商品三级类目
      editThrCatee(item, index, twoitem, twoindex, thritem, thrindex) {
        this.oneItem = item
        this.oneIndex = index
        this.twoItem = twoitem
        this.twoIndex = twoindex
        this.thrItem = thritem
        this.thrIndex = thrindex
        this.editType = 3
        this.$refs.smallModel.setData(item, this.categoryList)
        this.$refs.smallModel.show('修改商品三级类目', {
          name: this.thrItem.name,
          sort: this.thrItem.sort,
          type: false
        })
      },
      eidtConfirm(data) {
        let {name, sort, id} = data
        if (name.length === 0 || name.length > 10) {
          this.$toast.show('分类名称的长度不能超过10个字')
          return
        }
        switch (this.editType * 1) {
        case 2:
          API.Product.editCategory(this.twoItem.id, {name: name, sort: sort, parent_id: id}).then((res) => {
            this.$loading.hide()
            if (res.error === this.$ERR_OK) {
              this.$refs.smallModel.hide()
              this.$toast.show('修改成功')
              if (this.oneItem.id * 1 === id * 1) {
                this.categoryList[this.oneIndex].list[this.twoIndex].name = name
                this.categoryList[this.oneIndex].list[this.twoIndex].sort = sort
                this.categoryList[this.oneIndex].list.sort(this._sort)
              } else {
                this.categoryList[this.oneIndex].list.splice(this.twoIndex, 1)
                let that = this
                this.categoryList.forEach((item, index) => {
                  if (item.id * 1 === id * 1) {
                    that.categoryList[index].list.push({name: name, sort: sort, parent_id: id, id: this.twoItem.id})
                    that.categoryList[index].list.sort(this._sort)
                  }
                })
              }
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        case 3:
          API.Product.editCategory(this.thrItem.id, {name: name, sort: sort, parent_id: this.twoItem.id}).then((res) => {
            console.log(this.twoItem.id, id)
            this.$loading.hide()
            if (res.error === this.$ERR_OK) {
              this.$refs.smallModel.hide()
              this.$toast.show('修改成功')
              this.categoryList[this.oneIndex].list[this.twoIndex].list[this.thrIndex].name = name
              this.categoryList[this.oneIndex].list[this.twoIndex].list[this.thrIndex].sort = sort
              this.categoryList[this.oneIndex].list[this.twoIndex].list.sort(this._sort)
            } else {
              this.$toast.show(res.message)
            }
          })
          break
        }
      },
      // 删除一级类目
      delBigCatee(item, index) {
        this.oneItem = item
        this.oneIndex = index
        this.oneBtn = false
        this.deteleType = 1
        this.$refs.bigConfirm.show(`确定删除该类目？`)
      },
      // 删除二级类目
      delTwoCatee(item, index, twoitem, twoindex) {
        this.oneItem = item
        this.oneIndex = index
        this.twoItem = twoitem
        this.twoIndex = twoindex
        this.oneBtn = false
        this.deteleType = 2
        this.$refs.bigConfirm.show(`确定删除该类目？`)
      },
      // 删除三级类目
      delThrCatee(item, index, twoitem, twoindex, thritem, thrindex) {
        this.oneItem = item
        this.oneIndex = index
        this.twoItem = twoitem
        this.twoIndex = twoindex
        this.thrItem = thritem
        this.thrIndex = thrindex
        this.oneBtn = false
        this.deteleType = 3
        this.$refs.bigConfirm.show(`确定删除该类目？`)
      },
      delConfirm() {
        switch (this.deteleType * 1) {
        case 1:
          API.Product.delCategory(this.oneItem.id).then((res) => {
            this.$loading.hide()
            if (res.error === this.$ERR_OK) {
              this.getCategoryStatus()
              setTimeout(() => {
                this.categoryList.splice(this.oneIndex, 1)
                this.oneBtn = true
                this.$toast.show(`该类目已成功删除`)
              }, 1000)
            } else {
              this.oneBtn = true
              this.$toast.show(res.message)
            }
          })
          break
        case 2:
          API.Product.delCategory(this.twoItem.id).then((res) => {
            this.$loading.hide()
            if (res.error === this.$ERR_OK) {
              this.getCategoryStatus()
              setTimeout(() => {
                this.categoryList[this.oneIndex].list.splice(this.twoIndex, 1)
                this.oneBtn = true
                this.$toast.show(`该类目已成功删除`)
              }, 1000)
            } else {
              this.oneBtn = true
              this.$toast.show(res.message)
            }
          })
          break
        case 3:
          API.Product.delCategory(this.thrItem.id).then((res) => {
            this.$loading.hide()
            if (res.error === this.$ERR_OK) {
              this.getCategoryStatus()
              setTimeout(() => {
                this.categoryList[this.oneIndex].list[this.twoIndex].list.splice(this.twoIndex, 1)
                this.oneBtn = true
                this.$toast.show(`该类目已成功删除`)
              }, 1000)
            } else {
              this.oneBtn = true
              this.$toast.show(res.message)
            }
          })
          break
        }
      },
      _sort(a, b) {
        return b.sort - a.sort
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
    margin-right: 10px
    bg-image('icon-retract')
    &.open
      bg-image('icon-open')
  .mr-10
    margin-right: 10px
  .product-categories
    width: 100%
</style>
