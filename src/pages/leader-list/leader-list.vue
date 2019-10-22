<template>
  <div class="leader-list table">
    <div class="down-content">
      <span class="down-tip">实名</span>
      <div class="down-item-small">
        <base-drop-down :select="nameList" @setValue="setName"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search :infoText="keyword" placeHolder="团长名称或者帐号" @search="changeKeyword"></base-search>
      </div>
    </div>

    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-franchisees@2x.png" class="identification-icon">
          <p class="identification-name">团长列表</p>
          <base-status-tab :statusList="statusTab" @setStatus="changeStatus"></base-status-tab>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(title,index) in listTitle" :key="index" :class="title.class" class="list-item">{{title.name}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in leaderList" :key="index" class="list-content list-box">
            <div v-for="(title) in listTitle" :key="title.key" :class="title.class" class="list-item">
              <template v-if="title.key === 'is_certification'">{{item.is_certification ? '已实名' : '未实名'}}</template>
              <template v-else-if="title.key === 'is_freeze'">{{item.is_freeze ? '禁用' : '启用'}}</template>
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
  </div>
</template>
<script type="text/ecmascript-6">
  import API from '@api'

  const PAGE_NAME = 'LEADER_LIST'
  const TITLE = '团长列表'


  const LIST_CONFIG = [
    {name: '团长名称', key: 'name'},
    {name: '团长账号', key: 'mobile'},
    {name: '社区名称', key: 'social_name'},
    {name: '所属加盟商', key: 'store_name'},
    {name: '是否实名', key: 'is_certification'},
    {name: '创建时间', key: 'created_at'},
    {name: '状态', key: 'is_freeze'}
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_CONFIG,
        nameList: {
          check: false,
          show: false,
          content: '全部',
          type: 'default',
          data: [{name: '全部', id: ''}, {name: '已实名', id: 1}, {name: '未实名', id: 0}]
        },
        statusTab: [{name: '全部', num: 0}, {name: '启用中', num: 0}, {name: '已失效', num: 0}],
        is_certification: '',
        keyword: '',
        status: '',
        page: 1,
        statePageTotal: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        leaderList: []
      }
    },
    created() {
      this.getLeaderList(true)
      this.getStatus()
    },
    methods: {
      getLeaderList(loading) {
        API.Leader.getLeaderList({
          keyword: this.keyword,
          page: this.page,
          status: this.status,
          is_certification: this.is_certification
        }, loading)
          .then(res => {
            this.$loading.hide()
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.leaderList = res.data
            let pageTotal = {
              total: res.meta.total,
              per_page: res.meta.per_page,
              total_page: res.meta.last_page
            }
            this.statePageTotal = pageTotal
          })
          .catch(res => {
            this.$loading.hide()
          })
      },
      getStatus() {
        API.Leader.getStatus({is_certification: this.is_certification, keyword: this.keyword})
          .then(res => {
            this.statusTab = res.data.map(item => {
              return {
                name: item.status_str,
                value: item.status,
                num: item.statistic
              }
            })
          })
      },
      setName(item) {
        this.is_certification = item.id
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getLeaderList()
        this.getStatus()
      },
      changeKeyword(keyword) {
        this.keyword = keyword
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getLeaderList()
        this.getStatus()
      },
      changeStatus(item) {
        this.status = item.value
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getLeaderList()
      },
      addPage(page) {
        this.page = page
        this.getLeaderList()
      },
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .leader-list
    width: 100%
    .list-box
      .list-item:last-child
        max-width: 70px
        margin-right: 0
</style>
