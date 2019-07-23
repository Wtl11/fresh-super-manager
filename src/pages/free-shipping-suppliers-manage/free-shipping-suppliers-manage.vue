<template>
  <div class="order-manage table">
    <div class="down-content">
      <span class="down-tip">搜索</span>
      <div class="down-item">
        <base-search placeHolder="供应商名称" :infoText="keyword" @search="changeKeyword"></base-search>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">供应商列表</p>
        </div>
        <div class="function-btn">
          <router-link to="free-shipping-suppliers-choose" append class="btn-main btn-main-end">同步供应商</router-link>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div v-if="suppliersList.length" class="list">
          <div v-for="(item, index) in suppliersList" :key="index" class="list-content list-box">
            <div class="list-item">{{item.name}}</div>
            <div class="list-item">{{item.company_name}}</div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination
          ref="pagination"
          :pageDetail="pageDetail"
          :pagination="requestParams.page"
          @addPage="_addPage"
        >
        </base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'

  const PAGE_NAME = 'FREE_SHIPPING_SUPPLIERS_MANAGE'
  const TITLE = '供应商列表'
  const LIST_TITLE = ['供应商名称', '公司全名']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        keyword: '',
        listTitle: LIST_TITLE,
        suppliersList: [],
        pageDetail: {
          total: 1,
          per_page: 10,
          total_page: 1
        },
        requestParams: {
          page: 1,
          limit: 10
        },
      }
    },
    created() {
      this._getListData(true)
    },
    methods: {
      _getListData(first=false) {
        this.getSuppliersList()
        if (!first) {
          this.$refs.pagination.beginPage()
        }
      },
      getSuppliersList() {
        API.FreeShipping.getSuppliersList(this.requestParams,false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.suppliersList = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      _addPage(page) {
        this.requestParams.page = page
        this._getListData()
      },
      changeKeyword() {
        this._getListData()
      },
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
      max-width: 46%
      flex: 1

  .down-item-text
    width: 245px
</style>
