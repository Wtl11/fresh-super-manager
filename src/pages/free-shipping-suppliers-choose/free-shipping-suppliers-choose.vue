<template>
  <div class="goods-choose table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">供应商同步</p>
        </div>
      </div>
      <div class="search-con">
        供应商链接
        <input v-model="searchText" type="text" class="search-input" @keyup.enter="searchSuppliers">
        <div class="search-btn hand" @click="searchSuppliers">查找供应商</div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div v-if="suppliersList.name" class="list">
          <div class="list-content list-box">
            <div class="list-item">{{suppliersList.name}}</div>
            <div class="list-item">{{suppliersList.company_name}}</div>
          </div>
        </div>
        <div v-else class="empty-con">
          <div class="empty-img"></div>
          <div class="empty-text">暂无信息</div>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <div :class="[suppliersList.name?'':'disabled']" class="button hand" @click="_syncSuppliersList">同步</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'

  const PAGE_NAME = 'FREE_SHIPPING_SUPPLIERS_CHOOSE'
  const TITLE = '同步供应商信息'
  const LIST_TITLE = ['供应商名称', '公司全名']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        suppliersList: {},
        searchText: ''
      }
    },
    methods: {
      searchSuppliers() {
        if (!this.searchText.length) {
          this.$toast.show('请输入供应商链接')
          return
        }
        this.getSuppliersList()
      },
      getSuppliersList() {
        API.FreeShipping.suppliersSearch({domin: this.searchText}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.suppliersList = res.data
          } else {
            this.$toast.show(res.message)
          }
        }).finally(()=>{
          this.$loading.hide()
        })
      },
      _syncSuppliersList() {
        if (!this.suppliersList.name) return
        API.FreeShipping.suppliersCreate(this.suppliersList).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('同步成功！')
          } else {
            this.$toast.show(res.message)
          }
        }).finally(()=>{
          this.$loading.hide()
          this.restoreData()
        })
      },
      restoreData() {
        this.suppliersList = []
        this.searchText = ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .big-list
    min-height: 645px
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
  .order-manage
    .order-date
      font-family: $font-family-regular
      color: #acacac
  .pic-box
    height: 40px
    width: 40px
    border-radius: 2px
    object-fit: cover
    background-repeat: no-repeat
    background-size: cover
    background-position: center
  .table .table-content
    padding-bottom: 40px
    .search-con
      height: 40px
      line-height: 40px
      margin: 10px 0 40px 0
      padding: 0 20px
      layout(row)
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-main
      .search-input
        width: 450px
        height: 40px
        padding: 0 20px
        margin: 0 10px
        border: 1px solid #d3d8dc
        border-radius: 20px
      .search-btn
        padding: 0 12px
        height: 40px
        background: $color-main
        color: #fff
        text-align: center
        border-radius: 20px
        &:hover
          opacity: 0.8
  .bottom-btn
    width: 100%
    height: 70px
    background: #f9f9f9
    border-top-1px($color-line)
    layout(row)
    justify-content: center
    align-items: center
    .button
      height: 40px
      line-height: 40px
      padding: 0 34px
      background: $color-main
      font-size: $font-size-14
      font-family: $font-family-regular
      text-align: center
      color: #fff
      border-radius: 20px
      &.disabled
        opacity: 0.8
      &:hover
        opacity: 0.8
  .empty-con
    height: 100%
    layout()
    align-items: center
    justify-content: center
    .empty-img
      width: 88px
      height: 100px
      icon-image('pic-zanwu')
    .empty-text
      margin-top: 20px
      font-family: $font-family-regular
      font-size: 14px
      color: #666666
</style>
