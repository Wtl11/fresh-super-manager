<template>
  <div class="transaction-record table">
    <div class="down-content detail-down">
      <div class="down-item-text">
        <span class="header-text">支付总额：{{tradeDetail.total && `￥${tradeDetail.total}`}}</span>
      </div>
      <div class="down-item-text">
        <span class="header-text">退款总额：{{tradeDetail.refund && `￥${tradeDetail.refund}`}}</span>
      </div>
      <div class="down-item-text">
        <span class="header-text">实收总额：{{tradeDetail.amount && `￥${tradeDetail.amount}`}}</span>
      </div>
    </div>
    <div class="down-content">
      <span class="down-tip">支付时间</span>
      <div class="down-item">
        <base-date-select placeHolder="选择支付日期" :dateInfo="dateInfo" @getTime="changeDate"></base-date-select>
      </div>
      <span class="down-tip">订单类型</span>
      <div class="down-item-small">
        <base-drop-down :select="tradeSelect" :radius="2" @setValue="setSelectValue"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="订单号或交易号" :infoText="keyword" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-transaction_list@2x.png" class="identification-icon">
          <p class="identification-name">交易记录</p>
          <base-status-tab :statusList="dispatchSelect" @setStatus="changeTradeType"></base-status-tab>
        </div>
        <div class="function-btn">
          <div class="btn-main btn-main-end" @click="exportExcel">
            <span class="export-icon"></span>
            导出
          </div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in trades" :key="index" class="list-content list-box">
            <div class="list-item">{{item.created_at}}</div>
            <div class="list-item">{{item.order_sn}}</div>
            <div class="list-item">{{item.out_trade_sn}}</div>
            <div class="list-item">{{item.total}}</div>
            <div class="list-item">{{item.trade_type}}</div>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import {authComputed, tradeComputed, tradeMethods} from '@state/helpers'

  const PAGE_NAME = 'TRANSACTION_RECORD'
  const TITLE = '交易记录'
  const LIST_TITLE = ['支付时间', '订单号', '交易号', '交易金额', '交易类型']
  const TRADE_SELECT = {
    check: false,
    show: false,
    content: '全部类型',
    type: 'default',
    data: [{name: '全部', status: ''}, {name: '自提订单', status: 1}, {name: '全国包邮', status: 2}]
  }
  const EXCEL_URL = '/social-shopping/api/platform/trade-excel'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        dispatchSelect: [{name: '全部', value: '', key: 'all', num: 0}, {
          name: '支付',
          key: 'wait_release',
          num: 0
        }, {name: '退款', key: 'wait_purchase', num: 0}],
        listTitle: LIST_TITLE,
        tradeSelect: TRADE_SELECT,
        tradeDetail: {}
      }
    },
    computed: {
      ...authComputed,
      ...tradeComputed,
      tradeExportUrl() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          access_token: this.currentUser.access_token,
          status: this.type,
          keyword: this.keyword,
          date: this.date[0] && this.date[1] ? `${this.date[0]},${this.date[1]}` : '',
          source_type: this.sourceType
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + EXCEL_URL + '?' + search.join('&')
      },
      dateInfo() {
        return this.date[0] && this.date[1] ? [this.date[0], this.date[1]] : []
      }
    },
    created() {
      this._getTradeOrderType()
      this._getTradeDetail()
    },
    methods: {
      ...tradeMethods,
      async _getTradeOrderType() {
        let res = await API.Trade.getTradeOrderType({
          keyword: this.keyword,
          date: this.date[0] && this.date[1] ? this.date.join(',') : '',
          source_type: this.sourceType
        })
        if (res.error !== this.$ERR_OK) {
          console.warn('获取交易状态类型失败')
          return
        }
        let selectData = res.data
        this.dispatchSelect = selectData.map((item) => {
          item.num = item.statistic
          item.name = item.status_str
          return item
        })
      },
      async _getTradeDetail() {
        let res = await API.Trade.getTradeDetail()
        if (res.error !== this.$ERR_OK) {
          console.warn('获取交易概况失败')
          return
        }
        this.tradeDetail = res.data
      },
      changeTradeType(select) {
        this.setTradeType(select)
        this._getTradeOrderType()
        this.$refs.pagination.beginPage()
      },
      changeDate(date) {
        this.setDate(date)
        this._getTradeOrderType()
        this.$refs.pagination.beginPage()
      },
      changeKeyword(keyword) {
        this.setKeyword(keyword)
        this._getTradeOrderType()
        this.$refs.pagination.beginPage()
      },
      setSelectValue(select) {
        this.setSourceType(select.status)
        this._getTradeOrderType()
        this.$refs.pagination.beginPage()
      },
      exportExcel() {
        window.open(this.tradeExportUrl, '_blank')
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
      &:nth-child(3)
        flex: 1.5
      &:nth-child(4)
        flex: 0.7
      &:last-child
        max-width: 80px
        flex: 0.8

  .export-icon
    transition: all 0.2s
    icon-image('icon-derived')

  .btn-main
    &:hover
      .export-icon
        icon-image('icon-derived_white')

  .down-item-text
    width: 245px
</style>
