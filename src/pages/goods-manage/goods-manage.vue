<template>
  <div class="goods-manage table">
    <div class="down-content">
      <span class="down-tip">类目筛选</span>
      <div class="down-item-small">
        <base-drop-down :select="stairSelect" @setValue="setStairValue"></base-drop-down>
      </div>
      <div class="down-item-small">
        <base-drop-down :select="secondSelect" @setValue="setSecondValue"></base-drop-down>
      </div>
      <!--<div class="down-item-small">
        <base-drop-down :select="thirdlySelect" @setValue="setThirdlyValue"></base-drop-down>
      </div>-->
      <span class="down-tip">资料状态</span>
      <div class="down-item-small">
        <base-drop-down :select="infoStateSelect" @setValue="setSelectValue($event, 'complete_status')"></base-drop-down>
      </div>
      <span class="down-tip">来源</span>
      <div class="down-item-small">
        <base-drop-down :select="sourceSelect" @setValue="setSelectValue($event, 'source_type')"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search :infoText="requestParams.keyword" placeHolder="商品名称或编码" @search="changeKeyword"></base-search>
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
          <div v-for="(title,index) in listTitle" :key="index" :class="title.class" class="list-item">{{title.name}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in goodsList" :key="index" class="list-content list-box">
            <div v-for="(title) in listTitle" :key="title.key" :class="title.class" class="list-item">
              <img v-if="title.type==='img'" class="pic-box" :src="item[title.key]" alt="">
              <template v-else-if="title.type==='empty'">{{item[title.key]?item[title.key]:'——'}}</template>
              <template v-else-if="title.type==='price'">{{item[title.key]==='0.00'?'——':'￥'+item[title.key]}}
              </template>
              <template v-else-if="title.type==='update'">
                <div v-if="item[title.key]">
                  描述信息变更！
                  <div class="popup-tip">具体更新内容：图文信息变更</div>
                </div>
                <div v-else>——</div>
              </template>
              <div v-else-if="title.type==='online'" class="list-item-btn" @click="switchBtn(item, index)">
                <base-switch :status="item[title.key]" confirmText="上架" cancelText="下架"
                             switchColor="#922C88"
                ></base-switch>
              </div>
              <template v-else-if="title.type==='option'">
                <router-link v-if="item[title.key]===0" tag="span"
                             :to="'modify-goods?complete=1&id=' + item.id" append class="list-operation"
                >
                  完善资料
                </router-link>
                <router-link v-else tag="span"
                             :to="'modify-goods?id=' + item.id+'&updateInfo='+(item.goods_update_notice?1:0)"
                             append class="list-operation"
                >编辑
                </router-link>
                <span class="list-operation" @click="delGoods(item)">删除</span>
              </template>
              <template v-else>{{item[title.key]}}</template>
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
  const PAGE_NAME = 'GOODS_MANAGE'
  const TITLE = '商品管理'
  const LIST_CONFIG = [
    {name: '图片', class: 'w-img', type: 'img', key: 'image_url'},
    {name: '商品名称', class: 'w-3', type: 'empty', key: 'name'},
    {name: '价格', type: 'price', key: 'trade_price'},
    {name: '库存', key: 'usable_stock'},
    {name: '来源', key: 'source_type_str'},
    {name: '创建时间', class: 'w-2', key: 'created_at'},
    {name: '更新情况', class: 'w-2 list-popup', type: 'update', key: 'goods_update_notice'},
    {name: '状态', type: 'online', key: 'is_online'},
    {name: '操作', class: 'w-option list-operation-box', type: 'option', key: 'complete_status'}
  ]

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
        listTitle: LIST_CONFIG,
        statusTab: [{name: '全部', num: 0}, {name: '已上架', num: 0}, {name: '已下架', num: 0}],
        stairSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        thirdlySelect: {check: false, show: false, content: '三级类目', type: 'default', data: []},
        infoStateSelect: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', id: ''}, {name: '待完善', id: 0}, {name: '已完善', id: 1}]
        },
        sourceSelect: {
          check: false,
          show: false,
          content: '1688市场',
          type: 'default',
          data: [{name: '1688市场', id: 2}, {name: '自建', id: 1}]
        },
        showIndex: false,
        oneBtn: false,
        requestParams: {
          goods_category_id: '',
          keyword: '',
          is_online: '',
          complete_status: '',
          source_type: 2,
          page: 1
        },
        franListKeyword: '',
        curItem: ''
      }
    },
    computed: {
      ...fsGoodsComputed
    },
    created() {
      this.getGoodsOnlineStatus()
      this.getCategoryData()
    // this.getGoodsList(this.requestParams)
    },
    methods: {
      ...fsGoodsMethods,
      // 获取状态列表
      getGoodsOnlineStatus() {
        API.FreeShipping.goodsOnlineStatus(this.requestParams).then((res) => {
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
          // 交换数组位置
          const tab = this.statusTab[2]
          this.statusTab[2] = this.statusTab[1]
          this.statusTab[1] = tab
        })
      },
      // 获取类目列表
      getCategoryData() {
        API.FreeShipping.getGoodsCategory({parent_id: -1}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.stairSelect.data = res.data
            this.stairSelect.data.unshift({name: '全部', id: ''})
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 获取商品列表
      _getGoodsList(resPage = true) {
        if (resPage) {
          this.requestParams.page = 1
          this.$refs.pagination.beginPage()
        }
        this.getGoodsList(this.requestParams)
        this.getGoodsOnlineStatus()
      },
      // 搜索
      changeKeyword(text) {
        this.requestParams.keyword = text
        this._getGoodsList()
      },
      // 切换状态
      changeTradeType(selectStatus) {
        this.requestParams.is_online = selectStatus.value
        this._getGoodsList()
      },
      // 选择一级类目
      setStairValue(data) {
        this.secondSelect.content = '二级类目'
        this.secondSelect.data = data.list
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = ''
        this.requestParams.goods_category_id = data.id
        this._getGoodsList()
      },
      // 选择二级类目
      setSecondValue(data) {
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = data.list
        this.requestParams.goods_category_id = data.id
        this._getGoodsList()
      },
      // 选择三级类目
      setThirdlyValue(data) {
        this.requestParams.goods_category_id = data.id
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
        let data = {
          goods_id: item.id,
          is_online: item.is_online * 1 === 1 ? 0 : 1
        }
        API.FreeShipping.goodsOnline(data).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.oneBtn = true
            this.$refs.confirm.show(item.is_online * 1 === 1 ? '该商品已成功下架' : '该商品已成功上架')
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
        API.FreeShipping.goodsDelete(this.curItem.id).then((res) => {
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
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .list-box
    .list-item
      &.w-img
        max-width: 100px
        flex: 0.5
      &.w-3
        max-width: 300px
        flex: 3
      &.w-2
        max-width: 180px
        flex: 1.3
      &.w-option
        flex: 1.2
        padding: 5px
        min-width: 140px
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
