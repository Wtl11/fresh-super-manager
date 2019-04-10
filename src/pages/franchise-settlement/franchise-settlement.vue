<template>
  <div class="franchise-settlement table">
    <div class="down-content">
      <span class="down-tip">支付时间</span>
      <div class="down-item">
        <base-date-select placeHolder="选择支付日期" :dateInfo="dateInfo" @getTime="changeDate"></base-date-select>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="加盟商" :infoText="settlementKeyword" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-order_list2@2x.png" class="identification-icon">
          <p class="identification-name">交易记录</p>
          <base-status-tab :statusList="dispatchSelect" @setStatus="changeStatus"></base-status-tab>
        </div>
        <div class="function-btn"></div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item,index) in franchiseSettlement" :key="index" class="list-content list-box">
            <div class="list-item">{{item.created_at}}</div>
            <div class="list-item">{{item.name}}</div>
            <div class="list-item">{{item.money}}</div>
            <div class="list-item">{{item.user_name}}</div>
            <div class="list-item">{{item.withdrawal_card}}</div>
            <div class="list-item">{{`${item.start_time} - ${item.end_time}`}}</div>
            <div class="list-item">{{item.status_str}}</div>
            <div class="list-item">
              <img
                v-if="item.image_url"
                src="./icon-voucher@2x.png"
                class="list-img hand"
                @click="showImg(item.image_url)"
              >
            </div>
            <div class="list-item">
              <span
                v-if="item.status === 0 && !item.image_url"
                class="list-operation"
                @click="settlement(item.payoff_log_id, item)"
              >
                结算
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <!--:pageDetail="pageTotal"-->
        <base-pagination
          ref="pagination"
          :pageDetail="pageTotal"
          :pagination="franListPage"
          @addPage="setfranPage"
        >
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
            <div class="franchise-msg-item">加盟商：{{settlementItem.name}}</div>
            <div class="franchise-msg-item">结算金额：<span class="franchise-money">{{settlementItem.money}}元</span></div>
            <div class="franchise-msg-item">收款人：{{settlementItem.user_name}}</div>
            <div class="franchise-msg-item">银行账户：{{settlementItem.withdrawal_card}}</div>
          </div>
        </div>
        <div class="franchise-upload">
          <span class="start">*</span>
          <span class="franchise-upload-title">上传银行转账流水：</span>
          <div v-if="!settlementImg" class="franchise-upload-input">
            选择文件
            <input type="file" accept="image/*" class="franchise-upload-box" @change="addImg">
          </div>
          <div v-else class="franchise-upload-img-box">
            <span class="clear-img hand" @click="clearSettlement"></span>
            <img :src="settlementImg" class="franchise-upload-img">
          </div>
          <span class="franchise-upload-tip">(支持3M以下，jpg、png、jpeg格式文件)</span>
        </div>
        <div class="btn-group">
          <div class="btn confirm" @click="confirm">确认结算</div>
        </div>
      </div>
    </default-modal>
    <default-modal ref="franchiseImg">
      <div slot="content" class="franchise-img">
        <div class="title-box">
          <div class="title">
            打款凭证
          </div>
          <span class="close hand" @click="cancelImg"></span>
        </div>
        <img :src="franImg" class="fran-img">
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import {franchiseComputed, franchiseMethods} from '@state/helpers'
  import API from '@api'

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
        settlementImg: '',
        payoffLogId: '',
        imgObj: {},
        settlementItem: {},
        franImg: ''
      }
    },
    computed: {
      ...franchiseComputed,
      dateInfo() {
        return this.settlementStart && this.settlementEnd ? [this.settlementStart, this.settlementEnd] : []
      }
    },
    async created() {
      await this._getPayoffStatus()
    },
    methods: {
      ...franchiseMethods,
      async addImg(e) {
        let param = this._infoImage(e.target.files[0])
        console.log(param)
        e.target.value = ''
        await this._upImage(param)
      },
      // 格式化图片流
      _infoImage(file) {
        let param = new FormData() // 创建form对象
        param.append('file', file, file.name) // 通过append向form对象添加数据
        return param
      },
      async _upImage(param) {
        this.$loading.show('图片上传中')
        let res = await API.Upload.UploadImg(param)
        this.$loading.hide('图片上传中')
        if (res.error !== this.$ERR_OK) {
          this.$toast.show(res.message)
          return
        }
        this.settlementImg = res.data.source_url
        this.imgObj = res.data
      },
      async _getPayoffStatus() {
        let res = await API.Franchise.payoffStatus({
          keyword: this.settlementKeyword,
          date: this.dateInfo[0] && this.dateInfo[1] ? this.dateInfo.join(',') : ''
        })
        if (res.error !== this.$ERR_OK) {
          console.warn('获取结算记录类型失败')
          return
        }
        let selectData = res.data
        this.dispatchSelect = selectData.map((item) => {
          item.num = item.statistic
          item.name = item.status_str
          return item
        })
      },
      showImg(img) {
        this.franImg = img
        this.$refs.franchiseImg.showModal()
      },
      cancel() {
        this.payoffLogId = ''
        this.settlementImg = ''
        this.$refs.franchise.hideModal()
      },
      cancelImg() {
        setTimeout(() => {
          this.franImg = ''
        }, 300)
        this.$refs.franchiseImg.hideModal()
      },
      async settlement(id, item) {
        this.settlementItem = item
        this.payoffLogId = id
        this.$refs.franchise.showModal()
      },
      // 确认结算
      async confirm() {
        let res = await API.Franchise.payoffsComfirm(this.payoffLogId, {image_id: this.imgObj.id})
        this.$toast.show(res.message)
        if (res.error !== this.$ERR_OK) {
          return
        }
        this.getFranchiseSettlement()
        await this._getPayoffStatus()
        this.cancel()
      },
      clearSettlement() {
        this.settlementImg = ''
      },
      async changeDate(date) {
        this.setfranTime(date)
        await this._getPayoffStatus()
        this.$refs.pagination.beginPage()
      },
      async changeKeyword(keyword) {
        this.setfranKeyword(keyword)
        await this._getPayoffStatus()
        this.$refs.pagination.beginPage()
      },
      async changeStatus(select) {
        this.setfranStatus(select.status)
        await this._getPayoffStatus()
        this.$refs.pagination.beginPage()
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
        flex: 3.2
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
    box-sizing: border-box
    height: 318px
    width: 534px
    padding: 0 20px
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

  .franchise-img
    background: $color-white
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 3px
    box-sizing: border-box
    padding: 0 20px
    background: $color-white
    height: 560px
    width: 1000px
    .fran-img
      object-fit: cover
      overflow: hidden
      margin-top: 7px
      height: 470px
      width: 960px
</style>
