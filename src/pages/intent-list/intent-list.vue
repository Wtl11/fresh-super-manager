<template>
  <div class="intent-list table">
    <base-tab-select :infoTabIndex="infoTabIndex" :tabStatus="tabStatus" :lineWidth="56" @getStatusTab="changeTabStatus"></base-tab-select>
    <div class="down-content">
      <span class="down-tip">意向单编号</span>
      <div class="down-item">
        <base-search ref="searchInput" :infoText="searchNum" placeHolder="请输入编号" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-franchisees@2x.png" class="identification-icon">
          <p class="identification-name">{{pageName}}列表</p>
          <base-status-tab :statusList="typeSelect" @setStatus="changeIntentStatus"></base-status-tab>
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
          <div v-for="(item,index) in listTitle" :key="index" :class="item.class" class="list-item">{{item.name}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in list" :key="index" class="list-content list-box">
            <div class="list-item width15">{{item.recruit_sn}}</div>
            <div class="list-item">{{item.name}}</div>
            <div class="list-item">{{item.mobile}}</div>
            <div v-if="item.social_name" class="list-item width20">{{item.social_name}}</div>
            <div class="list-item width20 text-wrap2">{{item.state}} {{item.city}} {{item.district}}</div>
            <div v-if="item.goods_category" class="list-item width20 text-wrap2">{{item.goods_category}}</div>
            <div v-if="item.address" class="list-item width20 text-wrap2">{{item.address}}</div>
            <div class="list-item">{{item.status_str}}</div>
            <div class="list-item width20">{{item.created_at}}</div>
            <div class="list-item width20">{{item.handle_at}}</div>
            <div class="list-item width20 text-wrap2">{{item.handle_tag}} {{item.remark}}</div>
            <div class="list-item">
              <span class="list-operation" @click="_handleIntent(item)">处理</span>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination
          ref="pagination"
          :pageDetail="pageDetail"
          :pagination="page"
          @addPage="setPage"
        >
        </base-pagination>
      </div>
    </div>

    <default-modal ref="handleConfirm">
      <div slot="content" class="intent-window">
        <div class="title-box">
          <div class="title">
            结算确认
          </div>
          <span class="close hand" @click="handleClose"></span>
        </div>
        <div class="content">
          <div class="main-model-box">
            <div class="text"><span class="start">*</span>处理标签</div>
            <div v-for="(tag, index) in handleTagList" :key="index" class="tag-box-con">
              <div class="tag-box" :class="tag === handleTag ? 'active' : ''" @click="changeHandleTag(tag)">{{tag}}</div>
            </div>
          </div>
          <div class="main-model-box textarea-box">
            <div class="text">处理说明</div>
            <textarea v-model="handleRemark" class="main-textarea-box"></textarea>
          </div>
        </div>
        <div class="btn-group">
          <div class="btn" @click="handleClose">取消</div>
          <div class="btn confirm" @click="handleConfirm">确定</div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import DefaultModal from '@components/default-modal/default-modal'
  import {authComputed, intentComputed, intentMethods} from '@state/helpers'

  const PAGE_NAME = 'INTENT_LIST'
  const TITLE = '加盟商'
  const LIST_TITLE = {
    '3' : [
      {name: '意向单编号', flex: 1.5, class: 'width15'},
      {name: '姓名', flex: 1},
      {name: '手机号', flex: 1.5},
      {name: '所属地区', flex: 2, class: 'width20'},
      {name: '状态', flex: 1},
      {name: '提交时间', flex: 2, class: 'width20'},
      {name: '处理时间', flex: 2, class: 'width20'},
      {name: '处理说明', flex: 2, class: 'width20'},
      {name: '操作', flex: 1},
    ],
    '1' : [
      {name: '意向单编号', flex: 1.5, class: 'width15'},
      {name: '姓名', flex: 1},
      {name: '手机号', flex: 1.5},
      {name: '小区名称', flex: 2, class: 'width20'},
      {name: '所属地区', flex: 2, class: 'width20'},
      {name: '详细地址', flex: 2, class: 'width20'},
      {name: '状态', flex: 1},
      {name: '提交时间', flex: 2, class: 'width20'},
      {name: '处理时间', flex: 2, class: 'width20'},
      {name: '处理说明', flex: 2, class: 'width20'},
      {name: '操作', flex: 1},
    ],
    '2' : [
      {name: '意向单编号', flex: 1.5, class: 'width15'},
      {name: '姓名', flex: 1},
      {name: '手机号', flex: 1.5},
      {name: '所属地区', flex: 2, class: 'width20'},
      {name: '供应商品类目', flex: 2, class: 'width20'},
      {name: '状态', flex: 1},
      {name: '提交时间', flex: 2, class: 'width20'},
      {name: '处理时间', flex: 2, class: 'width20'},
      {name: '处理说明', flex: 2, class: 'width20'},
      {name: '操作', flex: 1},
    ],
  }
  const TYPE_STATUS = [{text: '加盟商', type: 3}, {text: '团长', type: 1}, {text: '供应商', type: 2}]
  const TYPE_SELECT = [{name: '全部', status: '', num: 0}, {name: '待处理', status: 0, num: 0}, {name: '已处理', status: 1, num: 0}]
  const HANDLETAG = ['已电联客户','已添加微信','无法联系']
  const EXCEL_URL = '/social-shopping/api/platform/recruit-excel'

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
        tabStatus: TYPE_STATUS,
        listTitle: LIST_TITLE[3],
        typeSelect: TYPE_SELECT,
        handleTagList: HANDLETAG,
        handleTag: '',
        handleRemark: '',
        handleItem: '',
      }
    },
    computed: {
      ...authComputed,
      ...intentComputed,
      infoTabIndex() {
        return this.tabStatus.findIndex((item) => item.type === this.type)
      },
      IntentExportUrl() {
        let currentId = this.getCurrentId()
        let data = {
          current_corp: currentId,
          access_token: this.currentUser.access_token,
          type: this.type,
          status: this.status,
          recruit_sn: this.searchNum
        }
        let search = []
        for (let key in data) {
          search.push(`${key}=${data[key]}`)
        }
        return process.env.VUE_APP_API + EXCEL_URL + '?' + search.join('&')
      },
    },
    created() {
      this._getListStatus()
    },
    methods: {
      ...intentMethods,
      changeTabStatus(tabStatus) {
        // this.tableTitle = tabStatus.type === 1 ? this.regimentalListTitle : this.listTitle
        this.listTitle = LIST_TITLE[tabStatus.type]
        this.initData()
        this.setIntentType(tabStatus)
        this._getListStatus()
        this.$refs.pagination.beginPage()
        this.$refs.searchInput.infoTextMethods()
      },
      changeKeyword(keyword) {
        this.setSearchNum(keyword)
        this._getListStatus()
        this.$refs.pagination.beginPage()
      },
      changeIntentStatus(select) {
        this.setIntentStatus(select)
        this._getListStatus()
        this.$refs.pagination.beginPage()
      },
      async _getListStatus() {
        let res = await API.Intent.getIntentListStatus({
          type: this.type
        })
        if (res.error !== this.$ERR_OK) {
          console.warn('获取列表状态类型失败')
          return
        }
        let selectData = res.data
        this.typeSelect = selectData.map((item) => {
          item.num = item.statistic
          item.name = item.status_str
          return item
        })
      },
      exportExcel() {
        window.open(this.IntentExportUrl, '_blank')
      },
      _handleIntent(item) {
        this.handleItem = item
        this.handleTag = item.handle_tag
        this.handleRemark = item.remark
        this.$refs.handleConfirm.showModal()
      },
      handleClose() {
        this.$refs.handleConfirm.hideModal()
      },
      changeHandleTag(tag) {
        this.handleTag = tag
      },
      async handleConfirm() {
        if(!this.handleTag){
          this.$toast.show('请选择处理标签!')
          return
        }
        let res = await API.Intent.handleIntent({
          handle_tag: this.handleTag,
          remark: this.handleRemark
        },false,this.handleItem.id)
        if (res.error !== this.$ERR_OK) {
          console.warn('处理意向单失败！')
          return
        }
        this.handleAfter()
      },
      handleAfter() {
        this.handleTag = ''
        this.handleRemark = ''
        this.handleItem = ''
        this.getIntentList()
        this._getListStatus()
        this.handleClose()
        this.$toast.show('操作成功!')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .list-box
    .list-item
      /*flex: 1*/
      &.width15
        flex: 1.5
      &.width20
        flex: 2
        min-width: 150px
      &:last-child
        padding: 0
        max-width: 50px
      &.text-wrap2
        display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 2;  /*这里的数字代表行数*/
        -webkit-box-orient: vertical;
        white-space: pre-wrap

  .export-icon
    transition: all 0.2s
    icon-image('icon-derived')

  .btn-main
    &:hover
      .export-icon
        icon-image('icon-derived_white')


  .intent-window
    background: $color-white
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 3px
    box-sizing: border-box
    height: 318px
    width: 534px
    padding: 0 20px

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

    .content
      margin-top: 8px

      .main-model-box
        layout(row)
        align-items: center
        margin-bottom: 24px

        &.textarea-box
          align-items: flex-start

        .text
          color: #151515
          font-size: $font-size-14
          font-family: $font-family-regular
          width: 94px
          .start
            font-size: 14px
            color: #F52424

        .tag-box-con
          display: flex
          layout(row)

          .tag-box
            position: relative
            box-sizing: border-box
            width: auto
            height: 28px
            line-height: 28px
            padding: 0 10px
            margin-right: 10px
            border: 1px solid $color-line
            color: $color-text-main
            text-align: center
            border-radius: 2px
            cursor: pointer;
            &.active
              color: $color-main
              border: 1px solid $color-main
              background: url("./pic-selection@3x.png") no-repeat
              background-size: 14px 14px
              background-position: bottom right
              border-radius: 3px
            &:hover
              color: $color-main
              border: 1px solid $color-main

        .main-textarea-box
          flex: 1
          height: 107px
          border: 1px solid $color-line
          border-radius: 2px
          font-family: $font-family-regular
          color: $color-text-main
          font-size: $font-size-14
          padding: 10px
          transition: all 0.3s
          resize:none

          &::-webkit-inner-spin-button
            appearance: none

          &:hover
            border: 1px solid #ACACAC

          &::placeholder
            font-family: $font-family-regular
            color: $color-text-assist

          &:focus
            border-color: $color-main !important

</style>
