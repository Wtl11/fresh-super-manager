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
          <base-status-tab :statusList="dispatchSelect" @setStatus="changeOrderType"></base-status-tab>
        </div>
        <div class="function-btn">
          <div v-if="tabType*1 === 1 && orderList.length > 0" class="btn-main btn-main-end" @click="_orderPay">付款</div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-if="tabType*1 === 1" class="list-item small-item">
            <div :class="[allChecked?'checked':'']" class="list-radio" @click="_radioAllChecked"></div>
          </div>
          <div v-for="(item,index) in listTitle" :key="index" :class="item.class" class="list-item">{{item.name}}</div>
        </div>
        <div v-if="orderList.length" class="list">
          <div v-for="(item, index) in orderList" :key="index" class="list-content list-box">
            <div v-if="tabType*1 === 1" class="list-item small-item">
              <div :class="[item.checked?'checked':'']" class="list-radio" @click="_radioChecked(item)"></div>
            </div>
            <div class="list-item list-double-row width-3">
              <div class="item-dark">{{item.order_sn}}</div>
              <div class="item-dark order-date">{{item.created_at}}</div>
            </div>
            <div class="list-item width-3">{{item.buyer_name}}</div>
            <div class="list-item width-2">{{item.total}}</div>
            <div class="list-item width-2">{{item.real_pay}}</div>
            <div class="list-item width-3">{{item.distributor_name}}</div>
            <div class="list-item width-1">{{item.status_str}}</div>
            <div class="list-item list-operation-box">
              <router-link tag="span" :to="'free-shipping-order-detail?id=' + item.order_id" append class="list-operation">详情</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination
          ref="pagination"
          :pageDetail="pageDetail"
          :pagination="page"
          @addPage="changePage"
        >
        </base-pagination>
      </div>
    </div>
    <popup-confirm ref="popupModal" :count="payData.order_count" :total="payData.total" @confirm="_PIConfirm"></popup-confirm>
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
    {name: '全部', status: '', num: 0},
    {name: '待推送', status: 0, num: 0},
    {name: '待结算', status: 1, num: 0},
    {name: '待发货', status: 2, num: 0},
    {name: '配送中', status: 3, num: 0},
    {name: '已完成', status: 4, num: 0},
    {name: '已关闭', status: 5, num: 0}
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
        tabType: '',// 列表订单状态，用于判断是否是待结算
        listTitle: LIST_TITLE,
        orderList: [],
        allChecked: false,
        payData: {}
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
    beforeDestroy() {
      this.resetParams()
    },
    methods: {
      ...fsOrderMethods,
      async _getOrderList(resetPage=false) {
        await this.getOrderList()
        this._setOrderData(resetPage)
      },
      _setOrderData(resetPage=false) {
        this.allChecked = false
        // 待结算状态增加订单勾选
        if (this.list.length > 0 && this.tabType*1 === 1) {
          this.orderList = this.list.map((item) => {
            return {checked: false, ...item}
          })
        } else {
          this.orderList = this.list
        }
        this._getOrderType()
        if (!resetPage) {
          this.$refs.pagination.beginPage()
        }
      },
      // 获取订单状态统计
      async _getOrderType() {
        API.FreeShipping.getOrderListStatus({
          keyword: this.keyword,
          start_time: this.date[0],
          end_time: this.date[1]
        })
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              // return
            }
            let selectData = res.data
            this.dispatchSelect = selectData.map((item) => {
              item.num = item.statistic
              item.name = item.status_str
              return item
            })
          })
      },
      changeOrderType(select) {
        this.tabType = select.status
        this.setOrderType(select.status)
        this._getOrderList()
      },
      changeDate(date) {
        this.setDate(date)
        this._getOrderList()
      },
      changeKeyword(keyword) {
        this.setKeyword(keyword)
        this._getOrderList()
      },
      changePage(page) {
        this.setPage(page)
        this._getOrderList(true)
      },
      // 获取支付链接
      _orderPay() {
        let payArr = []
        this.orderList.forEach((item) => {
          if(item.checked) {
            payArr.push(item.order_id)
          }
        })
        if(payArr.length<=0) {
          this.$toast.show('请选择要支付的订单')
          return
        }
        // 付款按钮，获取支付信息
        API.FreeShipping.getOutOrderPayUrl({order_ids: payArr})
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.payData = res.data
            this.$refs.popupModal.show()
          }).finally((e) => {
            this.$loading.hide()
          })
      },
      _PIConfirm() {
        // 弹窗点击支付，跳转支付链接
        this.$refs.popupModal.hide()
        this.payData.pay_url&&window.open(this.payData.pay_url)
      },
      // 单选
      _radioChecked(item) {
        item.checked = !item.checked
        let allChecked = 0
        this.orderList.forEach((item)=>{
          if (item.checked) {
            allChecked++
          }
        })
        // 当前列表全部都选中了就把全选勾上
        this.allChecked = allChecked === this.orderList.length
      },
      // 全选
      _radioAllChecked() {
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
      margin-top: 6px
      font-family: $font-family-regular
      color: #acacac
</style>
