<template>
  <div class="order-manage table">
    <div class="down-content">
      <span class="down-tip">创建时间</span>
      <div class="down-item">
        <base-date-select placeHolder="选择创建日期" :dateInfo="dateInfo" @getTime="changeDate"></base-date-select>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="订单号/会员名称/手机号" :infoText="keyword" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">订单列表</p>
          <base-status-tab :statusList="dispatchSelect" @setStatus="changeTradeType"></base-status-tab>
        </div>
        <div class="function-btn">
          <div v-if="tabType === 'wait_pay'" class="btn-main btn-main-end" @click="_orderPay">付款</div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-if="tabType === 'wait_pay'" class="list-item small-item">
            <div :class="[allChecked?'checked':'']" class="list-radio" @click="_radioAllChecked"></div>
          </div>
          <div v-for="(item,index) in listTitle" :key="index" :class="item.class" class="list-item">{{item.name}}</div>
        </div>
        <div v-if="orderList.length" class="list">
          <div v-for="(item, index) in orderList" :key="index" class="list-content list-box">
            <div v-if="tabType === 'wait_pay'" class="list-item small-item">
              <div :class="[item.checked?'checked':'']" class="list-radio" @click="_radioChecked(item)"></div>
            </div>
            <div class="list-item list-double-row width-3">
              <div class="item-dark">{{item.order_sn}}</div>
              <div class="item-dark order-date">{{item.created_at}}</div>
            </div>
            <div class="list-item width-3">{{item.store_name}}</div>
            <div class="list-item width-2">{{item.total}}</div>
            <div class="list-item width-2">{{item.total}}</div>
            <div class="list-item width-3">{{item.out_trade_sn}}</div>
            <div class="list-item width-1">{{item.trade_type}}</div>
            <div class="list-item list-operation-box">
              <router-link tag="span" :to="'free-shipping-order-detail?id=' + item.order_id" append class="list-operation">详情</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <!--:pageDetail="pageTotal"-->
        <base-pagination
          ref="pagination"
          :pageDetail="pageDetail"
          :pagination="page"
          @addPage="setPage"
        >
        </base-pagination>
      </div>
    </div>
    <popup-confirm ref="popupModal" @confirm="_PIConfirm"></popup-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {authComputed, fsOrderComputed, fsOrderMethods} from '@state/helpers'
  import PopupConfirm from './popup-confirm/popup-confirm'

  const PAGE_NAME = 'FREE_SHIPPING_ORDER_MANAGE'
  const TITLE = '订单管理'
  const LIST_TITLE = [{name:'订单号',class:'width-3'}, {name:'会员名称',class:'width-3'}, {name:'订单总价',class:'width-2'}, {name:'实付金额',class:'width-2'}, {name:'所属社区',class:'width-3'}, {name:'状态',class:'width-1'}, {name:'操作',class:''}]
  const STATUS_TAB = [
    {name: '全部', value: '', key: 'all', num: 0},
    {name: '待推送', key: 'wait_release', num: 0},
    {name: '待结算', key: 'wait_pay', num: 0},
    {name: '待发货', key: 'wait_release', num: 0},
    {name: '配送中', key: 'wait_release', num: 0},
    {name: '已完成', key: 'wait_release', num: 0},
    {name: '已关闭', key: 'wait_purchase', num: 0}
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      PopupConfirm
    },
    data() {
      return {
        dispatchSelect: STATUS_TAB,
        tabType: 'all',
        listTitle: LIST_TITLE,
        orderList: [],
        allChecked: false
      }
    },
    computed: {
      ...authComputed,
      ...fsOrderComputed,
      dateInfo() {
        return this.date[0] && this.date[1] ? [this.date[0], this.date[1]] : []
      }
    },
    created() {
      this._setOrderData(true)
    },
    methods: {
      ...fsOrderMethods,
      _setOrderData(first=false) {
        this.allChecked = false
        this.orderList = this.list.map((item) => {
          return {checked: false, ...item}
        })
        this._getTradeOrderType()
        if (!first) {
          this.$refs.pagination.beginPage()
        }
      },
      async _getTradeOrderType() {
        let res = await API.Trade.getTradeOrderType({
          keyword: this.keyword,
          date: this.date[0] && this.date[1] ? this.date.join(',') : ''
        })
        if (res.error !== this.$ERR_OK) {
          console.warn('获取交易状态类型失败')
          return
        }
        let selectData = res.data
        // this.dispatchSelect = selectData.map((item) => {
        //   item.num = item.statistic
        //   item.name = item.status_str
        //   return item
        // })
        this.dispatchSelect.forEach((item) => {
          item.num = selectData[0].statistic
        })
      },
      changeTradeType(select) {
        this.tabType = select.key
        this.setTradeType(select)
        this._setOrderData()
      },
      changeDate(date) {
        this.setDate(date)
        this._setOrderData()
      },
      changeKeyword(keyword) {
        this.setKeyword(keyword)
        this._setOrderData()
      },
      _orderPay() {
        // 付款按钮，发起获取支付信息
        console.log('获取支付信息！')
        this.$refs.popupModal.show()
      },
      _PIConfirm() {
        // 弹窗点击支付，跳转支付链接
        console.log('支付成功！')
        this.$refs.popupModal.hide()
      },
      _radioChecked(item) {
        // 单选
        item.checked = !item.checked
        let allChecked = 0
        this.orderList.forEach((item)=>{
          if (item.checked) {
            allChecked++
          }
        })
        this.allChecked = allChecked === this.orderList.length
      },
      _radioAllChecked() {
        // 全选
        this.allChecked = !this.allChecked
        this.orderList.forEach((item) => {
          item.checked = this.allChecked
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box
    position: relative
    .tab-box
      margin-right: 10px
    .btn-main-end
      col-center()
      right: 0

  .list-box
    .list-item
      &.width-3
        max-width: 300px
        flex: 1.5
      &.width-2
        flex: 0.8
      &.width-1
        max-width: 80px
        flex: 0.5
      &:last-child,&.small-item
        padding: 0
        max-width: 36px
        flex: 0.5
    .list-radio
      width: 18px
      height: @width
      background: #FFFFFF
      border-1px(#D6D6D6,2px)
      transition: all 0.3s
      &.checked
        border-none()
        icon-image('icon-gou_list')

  .down-item-text
    width: 245px
  .order-manage
    .order-date
      font-family: $font-family-regular
      color: #acacac
</style>
