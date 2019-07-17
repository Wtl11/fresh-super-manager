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
        <div class="info-item">订单状态：{{detail.status_text}}</div>
        <div class="info-item">关联订单号：{{detail.order_sn}}</div>
      </div>
    </div>
    <div class="detail-item">
      <div class="top">
        <div class="title">收货信息</div>
        <div class="line"></div>
      </div>
      <div class="bot sobot">
        <div class="info-item">会员名称：{{detail.address && detail.address.nickname}}</div>
        <div class="info-item">会员手机：{{detail.address && detail.address.mobile}}</div>
        <div class="info-item big-box">收货地址：{{detail.address && detail.address.shop_address}}</div>
      </div>
    </div>
    <div class="detail-item">
      <div class="top">
        <div class="title">商品清单</div>
        <div class="line"></div>
      </div>
      <div v-if="detail.goods" class="bot goods-list">
        <div class="ro-order-list-header">
          <div v-for="(item, index) in titleList" :key="index" class="ro-order-list-item">
            {{item}}
          </div>
        </div>
        <div class="ro-order-list">
          <div v-for="(item, index) in detail.goods" :key="index" class="ro-order-list-box">
            <div class="ro-order-list-item ro-order-list-text ro-order-list-item-double">{{item.goods_name}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.goods_units}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.num}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.price && `¥ ${item.price}`}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.total && `¥ ${item.total}`}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.after_sale_status_text}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.goods_name}}</div>
            <div class="ro-order-list-item ro-order-list-text">{{item.order_detail_id}}</div>
          </div>
        </div>
      </div>
      <div class="ro-order-list-footer">
        <div class="ro-order-list-foot-box">
          <div class="foot-item">订单总价：<span class="block">{{detail.price && `¥ ${detail.price}`}}</span></div>
          <div class="foot-item">实付金额：<span class="block">{{detail.total && `¥ ${detail.actual_total}`}}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

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
    mounted() {
      this.detail = {"order_id":90893,"order_sn":"C1907161539245215","status":1,"status_text":"待提货","price":"101.01","total":"101.01","actual_total":"101.01","promote_price":"0.00","refund_price":"0.00","pay_at":"2019-07-16 15:39:33","created_at":"2019-07-16 15:39:24","remind_status":0,"remind_timestamp":0,"delivery_status":3,"code":"20","avatar_images":[],"goods":[{"order_detail_id":153691,"goods_name":"测试商品21","goods_id":null,"goods_sku_id":null,"goods_units":"件","image_url":"https://social-shopping-api-1254297111.picgz.myqcloud.com/corp1%2F2019%2F06%2F21%2F1561084444437-%E9%A5%BC%E5%B9%B2.jpg","num":1,"price":"10.00","total":"10.00","after_sale_status":0,"after_sale_status_text":"未退款","delivery_status":0,"delivery_at":"2019-07-17","is_time_out":0,"can_after_sale":1},{"order_detail_id":153692,"goods_name":"农家小菜3","goods_id":null,"goods_sku_id":null,"goods_units":"只","image_url":"https://social-shopping-api-1254297111.picgz.myqcloud.com/corp1%2F2019%2F06%2F26%2F1561544217489-%E8%82%89.jpg","num":1,"price":"0.01","total":"0.01","after_sale_status":0,"after_sale_status_text":"未退款","delivery_status":0,"delivery_at":"2019-07-17","is_time_out":0,"can_after_sale":1},{"order_detail_id":153693,"goods_name":"水蜜桃","goods_id":null,"goods_sku_id":null,"goods_units":"打","image_url":"https://social-shopping-api-1254297111.picgz.myqcloud.com/corp1%2F2019%2F07%2F01%2F1561951554478-%E6%A1%83%E5%AD%906.jpg","num":1,"price":"88.00","total":"88.00","after_sale_status":0,"after_sale_status_text":"未退款","delivery_status":0,"delivery_at":"2019-07-17","is_time_out":0,"can_after_sale":1},{"order_detail_id":153694,"goods_name":"农赐6枚包农家蛋","goods_id":null,"goods_sku_id":null,"goods_units":"盒","image_url":"https://social-shopping-api-1254297111.picgz.myqcloud.com/corp1%2F2019%2F06%2F27%2F1561627233049-%E5%B0%8F%E7%AC%BC%E5%8C%85.jpg","num":1,"price":"3.00","total":"3.00","after_sale_status":0,"after_sale_status_text":"未退款","delivery_status":0,"delivery_at":"2019-07-17","is_time_out":0,"can_after_sale":1}],"address":{"nickname":"集客 is 测试?微信??","mobile":"18027280831","shop_name":"小树","shop_mobile":"18027280831","wx_account":"xiaoshu9","delivery_at":"2019-07-17 00:00:00","shop_address":"广东省广州市海珠区新港中路378号 T.I.T创意园 翡冷翠小区 树德生活馆"}}
    },
    methods: {
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
