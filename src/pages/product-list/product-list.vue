<template>
  <div class="franchise-list table">
    <div class="down-content">
      <span class="down-tip">类目筛选</span>
      <div class="down-item-small">
        <base-drop-down :select="stairSelect" :radius="2" @setValue="setStairValue"></base-drop-down>
      </div>
      <div class="down-item-small">
        <base-drop-down :select="secondSelect" :radius="2" @setValue="setSecondValue"></base-drop-down>
      </div>
      <div class="down-item-small">
        <base-drop-down :select="thirdlySelect" :radius="2" @setValue="setThirdlyValue"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search :infoText="franListKeyword" placeHolder="商品名称或编码" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">商品中心</p>
          <base-status-tab :statusList="statusTab" @setStatus="changeTradeType"></base-status-tab>
        </div>
        <div class="function-btn">
          <router-link to="edit-goods" append class="btn-main btn-main-end">
            新建商品<span class="add-icon"></span>
          </router-link>
          <a :href="downUrl" class="btn-main btn-main-end g-btn-item" target="_blank">商品模板导出</a>
          <router-link to="lead-goods" append class="btn-main g-btn-item">
            批量新建
          </router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in productList" :key="index" class="list-content list-box">
            <div class="list-item">
              <img class="pic-box" :src="item.goods_cover_image" alt="">
            </div>
            <div class="list-item list-double-row">
              <div class="item-dark">{{item.name}}</div>
              <div class="item-dark">{{item.goods_sku_code}}</div>
            </div>
            <div class="list-item">{{item.goods_material_category}}</div>
            <div class="list-item">{{item.base_unit}}</div>
            <div class="list-item">{{item.base_sale_rate}}{{item.base_unit}}/{{item.sale_unit}}</div>
            <div class="list-item">￥{{item.trade_price}}/{{item.sale_unit}}</div>
            <div class="list-item">
              <div class="list-item-btn" @click="switchBtn(item, index)">
                <base-switch :status="item.is_online" confirmText="展示" cancelText="隐藏" switchColor="#922C88"></base-switch>
              </div>
            </div>
            <div class="list-item list-operation-box">
              <router-link tag="span" :to="'edit-goods?id=' + item.id" append class="list-operation">编辑</router-link>
              <span class="list-operation" @click="delGoods(item)">删除</span>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination
          ref="pagination"
          :pageDetail="statePageTotal"
          @addPage="addPage"
        >
        </base-pagination>
      </div>
    </div>
    <default-confirm ref="confirm" :oneBtn="oneBtn" @confirm="delConfirm"></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import {productComputed, productMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'
  const PAGE_NAME = 'PRODUCT_LIST'
  const TITLE = '商品素材'
  const LIST_TITLE = ['图片', '商品名称', '类目', '基本单位', '销售规格', '销售单价', '状态', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        statusTab: [{name: '全部', num: 0, key: ''}, {name: '已上架', num: 0, key: 1}, {name: '已下架', num: 0, key: 0}],
        stairSelect: {
          check: false,
          show: false,
          content: '一级类目',
          type: 'default',
          data: []
        },
        secondSelect: {
          check: false,
          show: false,
          content: '二级类目',
          type: 'default',
          data: []
        },
        thirdlySelect: {
          check: false,
          show: false,
          content: '三级类目',
          type: 'default',
          data: []
        },
        showIndex: false,
        oneBtn: false,
        categoryId: '',
        keyWord: '',
        isOnline: '',
        page: 1,
        franListKeyword: '',
        downUrl: '',
        curItem: ''
      }
    },
    computed: {
      ...productComputed
    },
    created() {
      this._getUrl()
      this.getGoodsStatus()
      this.getCategoriesData()
    },
    methods: {
      ...productMethods,
      getCategoriesData() {
        API.Product.getCategoryList({parent_id: -1}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.stairSelect.data = res.data
            this.stairSelect.data.unshift({name: '全部', id: ''})
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      _getUrl() {
        let currentId = this.getCurrentId()
        let token = this.$storage.get('auth.currentUser', '')
        let params = `access_token=${token.access_token}&is_online=${this.isOnline}&keyword=${
          this.keyWord}&current_corp=${currentId}&goods_material_category_id=${this.categoryId}`
        console.log(process.env.NODE_ENV)
        if (process.env.NODE_ENV === 'development') {
          this.downUrl = process.env.VUE_APP_API + `/social-shopping/v1/api/platform/create-goods-material-template?${params}`
        } else {
          this.downUrl = process.env.VUE_APP_API + `/social-shopping/api/platform/create-goods-material-template?${params}`
        }
        console.log(this.downUrl)
      },
      changeKeyword(text) {
        console.log(text)
        this.keyWord = text
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      changeTradeType(selectStatus) {
        this.isOnline = selectStatus.value
        this.$refs.pagination.beginPage()
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList(false)
      },
      setStairValue(data) {
        this.secondSelect.content = '二级类目'
        this.secondSelect.data = data.list
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = ''
        this.categoryId = data.id
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      setSecondValue(data) {
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = data.list
        this.categoryId = data.id
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      setThirdlyValue(data) {
        this.categoryId = data.id
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getReqList()
      },
      addPage(page) {
        this.page = page
        this.getReqList(false)
      },
      getGoodsStatus() {
        API.Product.reqGoodsStatus({
          keyword: this.keyWord,
          goods_material_category_id: this.categoryId
        }, false).then((res) => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
            return
          }
          this.statusTab = res.data.map((item, index) => {
            return {
              name: item.status_str,
              value: item.status,
              num: item.statistic
            }
          })
        })
      },
      switchBtn(item, index) {
        if (item.goods_sku_code.length === 0 && item.is_online * 1 === 0) {
          this.$toast.show('请先补充商品编码再上架')
          return
        }
        if (item.goods_material_category_id <= 0 && item.is_online * 1 === 0) {
          this.$toast.show('请先补充类目再上架')
          return
        }
        let data = {
          goods_material_id: item.id,
          is_online: item.is_online * 1 === 1 ? 0 : 1
        }
        API.Product.onlineGoods(data, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            // this.goodsList[index].is_online = item.is_online * 1 === 1 ? 0 : 1
            this.oneBtn = true
            this.$refs.confirm.show(item.is_online * 1 === 1 ? '该商品已成功隐藏' : '该商品已成功展示')
            this.getReqList()
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      delGoods(item) {
        this.curItem = item
        this.oneBtn = false
        this.$refs.confirm.show('确定要删除该商品？')
      },
      delConfirm() {
        API.Product.delGoods(this.curItem.id).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('删除成功')
            if (this.productList.length === 1 && this.page * 1 !== 1) {
              this.page--
            }
            this.getReqList()
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      getReqList(isReq = true) {
        this.getProductList({
          categoryId: this.categoryId,
          page: this.page,
          isOnline: this.isOnline,
          keyword: this.keyWord,
          loading: true
        })
        this._getUrl()
        if (isReq) {
          this.getGoodsStatus()
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .list-box
    .list-item
      box-sizing: border-box
      flex: 1

      &:nth-child(1)
        flex: 0.55

      &:nth-child(2)
        flex: 1.5

      &:nth-child(3)
        flex: 1.1

      &:nth-child(7)
        flex: 0.8

      &:last-child
        padding: 5px
        max-width: 80px
        flex: 0.8
  .product-list
    width: 100%
  .show-more-box
    position: relative
    cursor: pointer

    .big-hide-box
      position: absolute
      z-index: 1
      width: 106px
      height: 20px
      right: 0

    .show-more-text
      width: 80px
      height: 28px
      line-height: 26px
      color: $color-white
      border: 1px solid $color-main
      border-radius: $radius-main
      layout(row)
      align-items: center
      justify-content: center

      .show-text
        font-size: $font-size-12
        color: $color-main
        font-family: $font-family-regular

      .show-icon
        width: 8px
        height: 6px
        margin-left: 6px
        position: relative
        transform: translateY(-1px) rotate(0deg)
        transition: all 0.4s

        &:after
          content: ''
          position: absolute
          z-index: 99
          top: 0
          right: 0
          width: 0
          height: 0
          border-left: 4px solid transparent
          border-right: 4px solid transparent
          border-top: 6px solid $color-main
    .show-hide-box
      position: absolute
      width: 106px
      top: 38px
      right: 0
      z-index: 11
      color: $color-text-main
      font-family: $font-family-regular
      font-size: $font-size-14
      background: $color-white
      box-shadow: 0 0 8px 0 #EBEBEB
      border-radius: 4px

      .show-hide-item
        height: 50px
        line-height: 50px
        color: $color-text-main
        font-family: $font-family-regular
        font-size: $font-size-14
        padding-left: 16px
        display: block
        position: relative
        border-bottom-1px($color-line)

    .show-hide-item:hover
      color: $color-main


  .show-more-active
    .show-more-text
      background: $color-main
      .show-text
        color: $color-white
      .show-icon
        transform: translateY(-1px) rotate(180deg)
        &:after
          border-top: 6px solid $color-white
  .stock-file
    position: absolute
    top: 0
    left: 0
    font-size: 0
    opacity: 0
    height: 100%
    width: 100%
  .pic-box
    height: 40px
    width: 40px
    border-radius: 2px
    object-fit: cover
    background-repeat: no-repeat
    background-size: cover
    background-position: center
</style>
