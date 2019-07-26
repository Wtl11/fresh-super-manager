<template>
  <div class="leader-withdrawal table">
    <div class="down-content">
      <span class="down-tip">筛选</span>
      <div class="down-item-small">
        <base-drop-down :select="statusSelect" @setValue="changeWithdrawalStatus"></base-drop-down>
      </div>
      <div class="down-item">
        <!---->
        <base-date-select :dateInfo="infoTime" @getTime="_setTime"></base-date-select>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <input v-model="orderSn" type="text" class="with-search" placeholder="提现单号">
        <input v-model="keyword" type="text" class="with-search" placeholder="社区名称/团长名称/团长账号">
        <div class="search-icon-box hand" @click="search">
          搜索
        </div>
      </div>

    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-transaction_list@2x.png" class="identification-icon">
          <p class="identification-name">团长提现列表</p>
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
          <div v-for="(item, index) in withdrawalList" :key="index" class="list-content list-box">
            <div class="list-item list-double-row">
              <p class="item-dark">{{item.withdraw_sn}}</p>
              <p class="item-sub">{{item.created_at}}</p>
            </div>
            <div class="list-item">{{item.store_name}}</div>
            <div class="list-item">{{item.mobile}}</div>
            <div class="list-item">{{item.name}}</div>
            <div class="list-item">{{item.social_name}}</div>
            <div class="list-item">{{item.total}}</div>
            <div class="list-item">{{item.poundage}}</div>
            <div class="list-item">{{item.realy_total}}</div>
            <div class="list-item list-help">
              {{item.status_str}}
              <div v-if="item.status === 2 || item.status === 4" class="help-box">
                <img src="./icon-help@2x.png" class="help hand">
                <!--v-if="item.note"-->
                <div class="help-tip">{{item.note}}</div>
              </div>
            </div>
            <div class="list-item list-operation-box">
              <router-link tag="span" :to="`budget-detail/${item.payee_id}/${item.name}`" append class="list-operation">
                收支明细
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <!--:pageDetail="pageTotal"-->
        <base-pagination
          ref="pagination"
          :pageDetail="withdrawalPageDetail"
          :pagination="withdrawalPage"
          @addPage="setWithdrawalPage"
        ></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {authComputed, leaderComputed, leaderMethods} from '@state/helpers'
  import API from '@api'

  const PAGE_NAME = 'LEADER_WITHDRAWAL'
  const TITLE = '团长提现'
  const LIST_TITLE = [
    '提现单号',
    '加盟商',
    '团长账号',
    '团长名称',
    '社区名称',
    '提现金额',
    '手续费',
    '预计到账金额',
    '提现状态',
    '操作'
  ]
  const STATUS_SELECT = {
    check: false,
    show: false,
    content: '全部状态',
    type: 'default',
    data: []
  }
  const EXCEL_URL = '/social-shopping/api/platform/withdrawal-excel'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        page: 1,
        orderSn: '',
        excelParams: '',
        keyword: '',
        note: '',
        checkId: 0,
        statusSelect: STATUS_SELECT,
        start: '',
        end: ''
      }
    },
    computed: {
      ...authComputed,
      ...leaderComputed,
      withdrawalExportUrl() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          access_token: this.currentUser.access_token,
          withdraw_sn: this.withdrawalSn,
          type: this.withdrawalType,
          keyword: this.withdrawalKeyword,
          status: this.withdrawalStatus,
          start_at: this.startAt || '',
          end_at: this.endAt || ''
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + EXCEL_URL + '?' + search.join('&')
      },
      infoTime() {
        let time = this.startAt && this.endAt ? [this.startAt, this.endAt] : []
        return time
      }
    },
    created() {
      this.orderSn = this.withdrawalSn
      this.keyword = this.withdrawalKeyword
      this._getWithdrawalStatus()
    },
    methods: {
      ...leaderMethods,
      async _getWithdrawalStatus() {
        let res = await API.Leader.getWithdrawalStatus()
        if (res.error !== this.$ERR_OK) {
          console.warn('获取不到提现状态列表')
          return
        }
        let selectData = res.data
        selectData.unshift({name: '全部状态', id: ''})
        this.statusSelect.data = selectData
      },
      exportExcel() {
        window.open(this.withdrawalExportUrl, '_blank')
      },
      hideModal() {
        this.$refs.modal.hideModal()
      },
      search() {
        let searchValue = {
          orderSn: this.orderSn,
          keyword: this.keyword
        }
        this.setWithdrawalSearch(searchValue)
        this.$refs.pagination.beginPage()
      },
      changeWithdrawalStatus(status) {
        this.setWithdrawalStatus(status)
        this.$refs.pagination.beginPage()
      },
      _setTime(time) {
        this.setWidthTime(time)
        this.$refs.pagination.beginPage()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  textarea::-webkit-input-placeholder
    font-size: $font-size-14
    color: #ACACAC

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box
    position: relative
    .tab-item
      margin-left: 10px

  .list-box
    .list-item
      &:nth-child(1)
        flex: 1.5
        min-width: 188px
      &:nth-child(2), &:nth-child(3)
        flex: 1.3
      &:nth-child(5)
        flex: 1.7
      &:nth-child(9)
        flex: 1.2
        min-width: 123px
        padding: 0
      &:last-child
        max-width: 60px
        min-width: 60px
        padding: 0
    .list-help
      overflow: visible !important
      display: flex
      align-items: center
      line-height: 1
      .help-box
        display: block
        transform translateY(1px)
        margin-left: 5px
        position: relative
        z-index: 150
        &:hover .help-tip
          z-index: 111
          visibility: initial
      .help
        width: 14px
        height: 14px
      .help-tip
        background: rgba(50, 50, 58, 0.85)
        color: $color-white
        padding: 12px 10px
        border-radius: 2px
        line-height: 16px
        font-family: $font-family-regular
        font-size: $font-size-14
        min-width: 136px
        white-space: normal
        position: absolute
        left: -75px
        top: 27px
        transition: background .3s
        visibility: hidden
        opacity: 0.8
        &:before
          content: ''
          position: absolute
          z-index: 99
          top: -6px
          left: 76px
          width: 0
          height: 0
          border-left: 6px solid transparent
          border-right: 6px solid transparent
          border-bottom: 6px solid rgba(50, 50, 58, 0.85)

  .btn-main
    position: relative
    .file-box
      position: absolute
      top: 0
      left: 0
      width: 84px
      height: 28px
      opacity: 0

  .Auditing
    width: 380px
    height: 225px
    padding: 0 20px
    box-sizing: border-box
    background: $color-white
    border-radius: 2px
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.6)
    text-align: center
    .top
      height: 59.5px
      border-bottom: 0.5px solid $color-line
      align-items: center
      justify-content: space-between
      padding: 0 20px
      layout(row)
    .title-box
      display: flex
      box-sizing: border-box
      padding: 23px 0
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
    .textarea-box
      margin-top: -3px
      .modelarea
        font-size: $font-size-14
        width: 100%
        resize: none
        height: 76px
        padding: 13px 11px
        box-sizing: border-box
        border-radius: 2px
        border: 0.5px solid $color-line
        background: #F9F9F9
        &:focus
          background: $color-white

  .with-search
    height: 28px
    width: 187px
    margin-right: 10px
    color: $color-text-main
    font-family: $font-family-regular
    font-size: $font-size-12
    box-sizing: border-box
    border: 0.5px solid $color-line
    border-radius: $radius-main
    padding-left: 14px
    transition: all 0.2s
    &:hover
      border: 1px solid #ACACAC
    &::placeholder
      font-family: $font-family-regular
      color: $color-text-assist
    &:focus
      border: 0.5px solid $color-main !important

  .search-icon-box
    overflow: hidden
    height: 28px
    width: 47px
    border-radius: $radius-main
    background: $color-main
    text-align: center
    line-height: 28px
    font-size: $font-size-12
    color: $color-white
    &:hover
      opacity: 0.8

  .export-icon
    transition: all 0.2s
    icon-image('icon-derived')

  .btn-main
    &:hover
      .export-icon
        icon-image('icon-derived_white')
</style>
