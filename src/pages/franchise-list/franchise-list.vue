<template>
  <div class="franchise-list table">
    <div class="down-content">
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="加盟商名称或账号"></base-search>
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
            <div class="list-item">5646</div>
            <div class="list-item">
              <router-link to="edit-franchise" append class="list-operation">编辑</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination
          ref="pagination"
        >
          <!--:pageDetail="pageDetail"-->
          <!--:pagination="page"-->
          <!--@addPage="setPage"-->
        </base-pagination>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'FRANCHISE_LIST'
  const TITLE = '加盟商'
  const LIST_TITLE = ['加盟商名称', '加盟商账号', '收款人', '银行账号', '地区', '平台服务费率', '社区数量', '创建时间', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .list-box
    .list-item
      &:nth-child(1), &:nth-child(2), &:nth-child(5)
        flex: 1.5
      &:nth-child(4)
        flex: 1.5
        min-width: 150px
      &:last-child
        padding: 0
        max-width: 50px

</style>
