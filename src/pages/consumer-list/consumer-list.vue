<template>
  <div class="leader-list table">
    <div class="down-content">
      <span class="down-tip">通联账户</span>
      <div class="down-item-small">
        <base-drop-down :select="nameList" @setValue="setName"></base-drop-down>
      </div>
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search :infoText="keyword" placeHolder="消费者名称或帐号" @search="changeKeyword"></base-search>
      </div>
    </div>

    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-consumer_list@2x.png" class="identification-icon">
          <p class="identification-name">消费者列表</p>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(title,index) in listTitle" :key="index" :class="title.class" class="list-item">{{title.name}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in consumerList" :key="index" class="list-content list-box">
            <div v-for="(title) in listTitle" :key="title.key" :class="title.class" class="list-item">
              <img v-if="title.key === 'head_image_url'" :src="item.head_image_url" class="consumer-header">
              <template v-else-if="title.key === 'is_identification'">{{item.is_freeze ? '已开通' : '未开通'}}</template>
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

  const PAGE_NAME = 'CONSUMER_LIST'
  const TITLE = '消费者列表'


  const LIST_CONFIG = [
    {name: '消费者头像', key: 'head_image_url'},
    {name: '消费者名称', key: 'nickname'},
    {name: '消费者手机', key: 'mobile'},
    {name: '联通账户', key: 'is_identification'},
    {name: '注册时间', key: 'created_at'}
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
          data: [{name: '全部', id: ''}, {name: '已开通', id: 1}, {name: '未开通', id: 0}]
        },
        is_identification: '',
        keyword: '',
        page: 1,
        statePageTotal: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        consumerList: []
      }
    },
    created() {
      this.getConsumerList(true)
    },
    methods: {
      getConsumerList(loading) {
        API.Consumer.getConsumerList({
          keyword: this.keyword,
          page: this.page,
          is_identification: this.is_identification
        }, loading)
          .then(res => {
            this.$loading.hide()
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.consumerList = res.data
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
      setName(item) {
        this.is_identification = item.id
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getConsumerList()
      },
      changeKeyword(keyword) {
        this.keyword = keyword
        this.page = 1
        this.$refs.pagination.beginPage()
        this.getConsumerList()
      },
      addPage(page) {
        this.page = page
        this.getConsumerList()
      },
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .leader-list
    width: 100%
    .consumer-header
      width: 40px
      height: 40px
      border-radius: 50%
      object-fit: cover
    .list-box
      .list-item:last-child
        max-width: 161px
        margin-right: 0
</style>
