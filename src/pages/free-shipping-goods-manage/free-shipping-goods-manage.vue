<template>
  <div class="goods-manage table">
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
      <span class="down-tip">资料状态</span>
      <div class="down-item-small">
        <base-drop-down :select="infoStateSelect" :radius="2" @setValue="setSelectValue($event, 'infoState')"></base-drop-down>
      </div>
      <span class="down-tip">来源</span>
      <div class="down-item-small">
        <base-drop-down :select="sourceSelect" :radius="2" @setValue="setSelectValue($event, 'source')"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search :infoText="requestParams.keyWord" placeHolder="商品名称或编码" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">商品中心</p>
          <base-status-tab :statusList="statusTab" @setStatus="changeTradeType"></base-status-tab>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in goodsList" :key="index" class="list-content list-box">
            <div class="list-item">
              <img class="pic-box" :src="item.goods_cover_image" alt="">
            </div>
            <div class="list-item list-double-row">
              <div class="item-dark">{{item.name}}</div>
              <div class="item-dark">{{item.goods_sku_code}}</div>
            </div>
            <div class="list-item">￥{{item.trade_price}}/{{item.sale_unit}}</div>
            <div class="list-item">{{item.base_unit}}</div>
            <div class="list-item">{{item.base_sale_rate}}{{item.base_unit}}/{{item.sale_unit}}</div>
            <div class="list-item">{{item.goods_sku_code}}</div>
            <div class="list-item list-popup">
              {{item.goods_material_category}}
              <div class="popup-tip">{{item.trade_price}}</div>
            </div>
            <div class="list-item">
              <div class="list-item-btn" @click="switchBtn(item, index)">
                <base-switch :status="item.is_online" confirmText="上架" cancelText="下架" switchColor="#922C88"></base-switch>
              </div>
            </div>
            <div class="list-item list-operation-box">
              <router-link v-if="requestParams.infoState===1" tag="span" :to="'free-shipping-edit-goods?complete=1&id=' + item.id" append class="list-operation list-operation-all">完善资料</router-link>
              <router-link v-else tag="span" :to="'free-shipping-edit-goods?id=' + item.id" append class="list-operation">编辑</router-link>
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
  import {fsGoodsComputed, fsGoodsMethods} from '@state/helpers'
  import DefaultConfirm from '@components/default-confirm/default-confirm'
  import API from '@api'
  const PAGE_NAME = 'FREE_SHIPPING_GOODS_MANAGE'
  const TITLE = '商品管理'
  const LIST_TITLE = ['图片', '商品名称', '价格', '库存', '来源', '创建时间', '更新情况', '状态', '操作']

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
        stairSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        thirdlySelect: {check: false, show: false, content: '三级类目', type: 'default', data: []},
        infoStateSelect: {check: false, show: false, content: '待完善', type: 'default', data: [{name:'待完善',id:1},{name:'已完善',id:2}]},
        sourceSelect: {check: false, show: false, content: '1688市场', type: 'default', data: [{name:'1688市场',id:1},{name:'自建',id:2}]},
        showIndex: false,
        oneBtn: false,
        requestParams: {
          categoryId: '',
          keyWord: '',
          isOnline: '',
          page: 1,
          infoState: 1,
          source: 1
        },
        franListKeyword: '',
        curItem: ''
      }
    },
    computed: {
      ...fsGoodsComputed
    },
    created() {
      this.getGoodsStatus()
      this.getCategoriesData()
    },
    methods: {
      ...fsGoodsMethods,
      // 获取状态列表
      getGoodsStatus() {
        API.Product.reqGoodsStatus({
          keyword: this.requestParams.keyWord,
          goods_material_category_id: this.requestParams.categoryId
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
      // 获取类目列表
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
      // 搜索
      changeKeyword(text) {
        this.requestParams.keyWord = text
        this._getGoodsList()
      },
      // 切换状态
      changeTradeType(selectStatus) {
        this.requestParams.isOnline = selectStatus.value
        this._getGoodsList()
      },
      // 选择一级类目
      setStairValue(data) {
        this.secondSelect.content = '二级类目'
        this.secondSelect.data = data.list
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = ''
        this.requestParams.categoryId = data.id
        this._getGoodsList()
      },
      // 选择二级类目
      setSecondValue(data) {
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = data.list
        this.requestParams.categoryId = data.id
        this._getGoodsList()
      },
      // 选择三级类目
      setThirdlyValue(data) {
        this.requestParams.categoryId = data.id
        this._getGoodsList()
      },
      // 选择资料状态/来源
      setSelectValue(data, key) {
        this.requestParams[key] = data.id
        this._getGoodsList()
      },
      // 分页
      addPage(page) {
        this.requestParams.page = page
        this._getGoodsList(false)
      },
      // 上下架
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
            this._getGoodsList(false)
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 删除商品
      delGoods(item) {
        this.curItem = item
        this.oneBtn = false
        this.$refs.confirm.show('确定要删除该商品？')
      },
      delConfirm() {
        API.Product.delGoods(this.curItem.id).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('删除成功')
            if (this.goodsList.length === 1 && this.requestParams.page * 1 !== 1) {
              this.requestParams.page--
            }
            this._getGoodsList(false)
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 获取商品列表
      _getGoodsList(resPage=true) {
        if (resPage) {
          this.requestParams.page = 1
          this.$refs.pagination.beginPage()
        }
        this.getGoodsList({...this.requestParams, loading: false})
        this.getGoodsStatus()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .list-box
    .list-item
      &:nth-child(1)
        max-width: 100px
        flex: 0.5
      &:nth-child(2),&:nth-child(6),&:nth-child(7)
        max-width: 240px
        flex: 1.5
      &:last-child
        flex: 1.1
        padding: 5px
        max-width: 140px
      &.list-popup
        &:hover .popup-tip
          opacity: .8
          z-index: 111
          visibility: initial
      .popup-tip
        background: #32323A
        opacity: 0
        color: $color-white
        padding: 8px 18px
        border-radius: 2px
        line-height: 16px
        font-family: $font-family-regular
        font-size: $font-size-14
        min-width: 100px
        white-space: normal
        position: absolute
        top: 38px
        transition: opacity .3s
        visibility: hidden
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

  .goods-manage
    .search-input
      border-radius: 4px
    .list-operation-all
      border: 1px solid #4D77BD
      width: 76px
      height: 28px
      text-align: center
      line-height: 26px
      border-radius: 2px
      text-decoration: none
      &:after
        top: 7px
</style>
