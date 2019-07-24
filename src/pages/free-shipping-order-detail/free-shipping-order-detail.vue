<template>
  <div v-if="detail&&detail.order_sn" class="order-detail detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-order_list@2x.png" class="identification-icon">
        <p class="identification-name">订单详情</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="detail-item">
      <div class="top">
        <div class="title">基本信息</div>
        <div class="line"></div>
      </div>
      <div class="bot sobot">
        <div class="info-item">订单号：{{detail.order_sn}}</div>
        <div class="info-item">下单时间：{{detail.created_at}}</div>
        <div class="info-item">订单状态：{{detail.status_str}}</div>
        <div class="info-item">关联订单号：{{detail.source_order_id}}</div>
      </div>
    </div>
    <div class="detail-item">
      <div class="top">
        <div class="title">收货信息</div>
        <div class="line"></div>
      </div>
      <div class="bot sobot">
        <div class="info-item">会员名称：{{detail.buyer_name}}</div>
        <div class="info-item">会员手机：{{detail.buyer_mobile}}</div>
        <div class="info-item big-box">收货地址：{{detail.address}}</div>
      </div>
    </div>
    <div class="detail-item">
      <div class="top">
        <div class="title">商品清单</div>
        <div class="line"></div>
      </div>
      <div v-if="detail.order_details" class="bot goods-list">
        <div class="ro-order-list-header">
          <div v-for="(item, index) in titleList" :key="index" class="ro-order-list-item">
            {{item}}
          </div>
        </div>
        <div class="ro-order-list">
          <div v-for="(item, index) in detail.order_details" :key="index" class="ro-order-list-box">
            <div class="ro-order-list-item ro-order-list-text ro-order-list-item-double">{{item.name}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.unit}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.num}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.trade_price && `¥ ${item.trade_price}`}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.total && `¥ ${item.total}`}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.after_sale_status_str}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.express_company}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.express_sn}}</div>
          </div>
        </div>
      </div>
      <div class="ro-order-list-footer">
        <div class="ro-order-list-foot-box">
          <div class="foot-item">订单总价：<span class="block">{{detail.total && `¥ ${detail.total}`}}</span></div>
          <div class="foot-item">实付金额：<span class="block">{{detail.real_pay && `¥ ${detail.real_pay}`}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'

  const PAGE_NAME = 'ORDER_DETAIL'
  const TITLE = '订单详情'
  const TITLELIST = ['商品名称', '下单单位', '下单数量', '下单单价', '下单金额', '退款状态', '快递公司', '快递单号']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        titleList: TITLELIST,
        detail: {}
      }
    },
    created() {
      this._getOrderInfo()
    },
    methods: {
      _getOrderInfo() {
        const orderId = this.$route.query.id || ''
        if (!orderId) {
          this._back()
          return
        }
        API.FreeShipping.getOrderInfo(orderId)
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return
            }
            this.detail = res.data
          })
          .finally((e) => {
            this.$loading.hide()
          })
      },
      _back() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/detail"
  .order-detail
    flex-direction: column
    width: 100%
    padding-bottom: 80px
    .bot .info-item.big-box
      width: 600px

  .ro-order-list-item
    &:nth-child(1)
      flex: 1.5
      no-wrap()
      padding-right: 30px
    &:nth-child(2), &:nth-child(3), &:nth-child(4)
      flex: 1
      white-space: normal !important
      word-break: break-all
    &:nth-child(5), &:nth-child(6), &:nth-child(7)
      flex: 1
    &:last-child
      flex: 0.3

  .block
    font-family: $font-family-medium
</style>
