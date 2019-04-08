<template>
  <div class="franchise-settlement table">
    <div class="down-content">
      <span class="down-tip">支付时间</span>
      <div class="down-item">
        <base-date-select placeHolder="选择支付日期"></base-date-select>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="加盟商"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-order_list2@2x.png" class="identification-icon">
          <p class="identification-name">交易记录</p>
          <base-status-tab :statusList="dispatchSelect"></base-status-tab>
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
          <div class="list-content list-box">
            <div class="list-item">
              sfcsfsdf
            </div>
            <div class="list-item">dgdfg</div>
            <div class="list-item">dfs}</div>
            <div class="list-item">dfd</div>
            <div class="list-item">dfs</div>
            <div class="list-item">dfs</div>
            <div class="list-item">dfs</div>
            <div class="list-item">
              <img src="./icon-voucher@2x.png" class="list-img">
            </div>
            <div class="list-item">
              <span class="list-operation" @click="settlement">结算</span>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <!--:pageDetail="pageTotal"-->
        <base-pagination
          ref="pagination"
        >
          <!--:pageDetail="pageDetail"-->
          <!--:pagination="page"-->
          <!--@addPage="setPage"-->
        </base-pagination>
      </div>
    </div>
    <default-modal ref="franchise">
      <div slot="content" class="franchise-window">
        <div class="title-box">
          <div class="title">
            结算确认
          </div>
          <span class="close hand" @click="cancel"></span>
        </div>
        <div class="franchise-content">
          <div class="franchise-title">正在进行结算，请确认：</div>
          <div class="franchise-msg">
            <div class="franchise-msg-item">加盟商：贵州茅台镇加盟商</div>
            <div class="franchise-msg-item">结算金额：<span class="franchise-money">78.89元</span></div>
            <div class="franchise-msg-item">收款人：张三丰</div>
            <div class="franchise-msg-item">银行账户：62225 7878 7899 888</div>
          </div>
        </div>
        <div class="franchise-upload">
          <span class="start">*</span>
          <span class="franchise-upload-title">上传银行转账流水：</span>
          <div v-if="!isGetSettlement" class="franchise-upload-input">
            选择文件
            <input type="file" class="franchise-upload-box">
          </div>
          <div v-else class="franchise-upload-img-box">
            <span class="clear-img hand" @click="clearSettlement"></span>
            <img src="" class="franchise-upload-img">
          </div>
          <span class="franchise-upload-tip">(支持3M以下，jpg、png、jpeg格式文件)</span>
        </div>
        <div class="btn-group">
          <div class="btn confirm" @click="confirm">确认结算</div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'

  const PAGE_NAME = 'FRANCHISE_SETTLEMENT'
  const TITLE = '加盟商结算'
  const LIST_TITLE = ['结算时间', '加盟商', '结算金额', '收款人', '银行账号', '结算周期', '状态', '打款凭证', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultModal
    },
    data() {
      return {
        exportUrl: '',
        dispatchSelect: [
          {name: '全部', value: '', key: 'all', num: 0},
          {name: '待结算', id: 1, key: 'wait_release', num: 0},
          {name: '已结算', id: 2, key: 'wait_purchase', num: 0}],
        listTitle: LIST_TITLE,
        isGetSettlement: true
      }
    },
    methods: {
      exportExcel() {
        window.open(this.exportUrl, '_blank')
      },
      cancel() {
        this.$refs.franchise.hideModal()
      },
      settlement(id) {
        this.$refs.franchise.showModal()
      },
      confirm() {
        this.cancel()
      },
      clearSettlement() {
        this.isGetSettlement = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .list-box
    .list-item
      &:nth-child(1), &:nth-child(5)
        flex: 1.5
      &:nth-child(6)
        flex: 2
      &:last-child
        padding: 0
        max-width: 50px
      &:nth-child(8)
        padding: 0
        max-width: 56px
        text-align: right
        margin-right: 5%
        display: flex
        justify-content: flex-end
      .list-img
        width: 18.7px
        height: 14.5px
        display: block
        border-radius: 0

  .export-icon
    transition: all 0.2s
    icon-image('icon-derived')

  .btn-main
    &:hover
      .export-icon
        icon-image('icon-derived_white')

  .franchise-window
    background: $color-white
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 3px
    height: 318px
    width: 534px
    padding: 0 20px
    box-sizing: border-box
    .title-box
      display: flex
      box-sizing: border-box
      padding: 22px 0
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
      .close
        width: 12px
        height: @width
        icon-image('icon-close')
    .franchise-content
      margin-top: 8px
      .franchise-title
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-14
      .franchise-msg
        display: flex
        padding: 8px 10px
        background: #F5F5F5
        border-radius: 2px
        margin-top: 10px
        flex-wrap: wrap
        .franchise-msg-item
          font-family: $font-family-regular
          color: $color-text-main
          font-size: $font-size-14
          line-height: 1
          margin: 10px 0
          width: 50%
          .franchise-money
            color: #F52424

    .franchise-upload
      display: flex
      line-height: 1
      .start
        margin-top: 30px
        font-size: 14px
        color: #F52424
      .franchise-upload-title
        margin-top: 30px
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-14
      .franchise-upload-input
        margin-top: 20px
        user-select: none
        cursor: pointer
        position: relative
        margin-left: 4.5px
        border-1px(#333333, 2px)
        box-sizing: border-box
        padding: 8px 16px
        .franchise-upload-box
          cursor: pointer
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
          opacity: 0
      .franchise-upload-tip
        margin-top: 30px
        font-family: $font-family-regular
        margin-left: 10px
        color: $color-text-assist
        font-size: $font-size-13
      .franchise-upload-img-box
        margin-top: 14px
        position: relative
        .franchise-upload-img
          width: 88px
          height: 44px
          object-fit: contain
        .clear-img
          width: 16px
          height: @width
          icon-image('icon-close_img')
          position: absolute
          top: -(@width/ 2)
          right: -(@width/ 2)
</style>
