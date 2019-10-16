<template>
  <div class="franchise-list table">
    <div class="down-content">
      <span class="down-tip">实名</span>
      <div class="down-item">
        <base-drop-down :select="nameList" @setValue="setName"></base-drop-down>
      </div>
      <span class="down-tip">绑卡</span>
      <div class="down-item">
        <base-drop-down :select="cardList" @setValue="setCard"></base-drop-down>
      </div>

      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search :infoText="franListKeyword" placeHolder="加盟商名称或账号" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-new_commodity@2x.png" class="identification-icon">
          <p class="identification-name">交易记录</p>
        </div>
        <div class="function-btn">
          <router-link to="edit-franchise" append class="btn-main btn-main-end">
            新建加盟商<span class="add-icon"></span>
          </router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in franchiseList" :key="index" class="list-content list-box">
            <div class="list-item">{{item.name}}</div>
            <div class="list-item">{{item.mobile}}</div>
            <div class="list-item">{{item.province}} {{item.city}} {{item.district}}</div>
            <div class="list-item">{{item.service_tariffing}}%</div>
            <div class="list-item">
              {{'已实名'}}
              <img src="./icon-eye@2x.png" alt="" class="see-icon" @mouseenter="showName(index)" @mouseleave="hideName">
              <transition name="fade">
                <div v-if="nameShow === index" class="name-content">
                  <span class="text">姓名: **峰</span>
                  <span class="text">身份证号： 420**************3</span>
                </div>
              </transition>
            </div>
            <div class="list-item">
              {{'已绑卡'}}
              <img src="./icon-eye@2x.png" alt="" class="see-icon" @mouseenter="showCard(index)" @mouseleave="hideCard">
              <transition name="fade">
                <div v-if="cardShow === index" class="card-content">
                  <span class="text">卡号： ****************321</span>
                </div>
              </transition>
            </div>
            <div class="list-item">{{'启用中'}}</div>
            <div class="list-item">{{item.account_count}}</div>
            <div class="list-item">{{item.created_at}}</div>
            <div class="list-item">
              <router-link :to="`edit-franchise?id=${item.id}`" append class="list-operation">编辑</router-link>
              <router-link :to="`edit-franchise?id=${item.id}&editName=1`" append class="list-operation">实名信息</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination
          ref="pagination"
          :pageDetail="franListPageTotal"
          :pagination="franListPage"
          @addPage="setfranListPage"
        >
        </base-pagination>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import {franchiseComputed, franchiseMethods} from '@state/helpers'

  const PAGE_NAME = 'FRANCHISE_LIST'
  const TITLE = '加盟商'
  const LIST_TITLE = [
    '加盟商名称',
    '加盟商账号',
    '所在地区',
    '服务费率',
    '是否实名',
    '是否绑卡',
    '状态',
    '社区数量',
    '创建时间',
    '操作'
  ]

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        nameList: [],
        cardList: [],
        nameShow: '',
        cardShow: '',
        timer: ''
      }
    },
    computed: {
      ...franchiseComputed
    },
    methods: {
      ...franchiseMethods,
      setCard(item) {
        this.setfranData({})
      },
      setName(item) {
        this.setfranData({})
      },
      changeKeyword(keyword) {
        this.setfranListKeyword(keyword)
        this.$refs.pagination.beginPage()
      },
      showName(index) {
        clearTimeout(this.timer)
        this.nameShow = index
      },
      hideName() {
        this.timer = setTimeout(() => {
          this.nameShow = ''
        }, 300)
      },
      showCard(index) {
        clearTimeout(this.timer)
        this.cardShow = index
      },
      hideCard() {
        this.timer = setTimeout(() => {
          this.cardShow = ''
        }, 300)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .list-box
    .list-item
      position: relative
      &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(9)
        flex: 1.5
      &:nth-child(5),&:nth-child(6)
        overflow: inherit
      &:last-child
        padding: 0
        flex: 2
        max-width: 108px
    .see-icon
      width: 20px
      height: 12px
      margin-left: 4px
      &:hover
        cursor: pointer
    .name-content,.card-content
      position: absolute
      left: 77px
      bottom: -32px
      border-radius: 4px
      padding: 3px 10px 3px 10px
      box-shadow: 0 0 8px 0 #E9ECEE
      border: 1px solid #E9ECEE
      background: rgba(50,50,50,0.8)
      z-index: 10
      &:before
        content: ""
        width: 9px
        height: 10px
        border: 5px solid rgba(50,50,50,0.8)
        border-top: 4px solid transparent
        border-bottom: 5px solid transparent
        border-left: 4px solid transparent
        position: absolute
        top: 7px
        left: -9px
      .text
        font-size: $font-size-14
        color: #FFF
        font-family: $font-family-regular
        line-height: 24px
        height: 24px
        display: block

    .card-content
      bottom: -6px
      &:before
        top: 9px
</style>
