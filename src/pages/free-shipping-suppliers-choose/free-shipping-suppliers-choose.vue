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
        <input v-model="searchText" type="text" class="search-input" @keydown="_searchGoods">
        <div class="search-btn hand" @click="_searchGoods">查找供应商</div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div v-if="suppliersList.length" class="list">
          <div v-for="(item, index) in suppliersList" :key="index" class="list-content list-box">
            <div class="list-item">{{item.name}}</div>
            <div class="list-item">{{item.goods_material_category}}</div>
          </div>
        </div>
        <div v-else class="empty-con">
          <div class="empty-img"></div>
          <div class="empty-text">暂无信息</div>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <div :class="[suppliersList.length?'':'disabled']" class="button hand" @click="_syncSuppliersList">同步</div>
    </div>
    <popup-input ref="popupModal" @confirm="_PIConfirm"></popup-input>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import PopupInput from './popup-input/popup-input'

  const PAGE_NAME = 'FREE_SHIPPING_SUPPLIERS_CHOOSE'
  const TITLE = '同步供应商信息'
  const LIST_TITLE = ['供应商名称', '公司全名']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      PopupInput
    },
    data() {
      return {
        listTitle: LIST_TITLE,
        suppliersList: [],
        searchText: ''
      }
    },
    created() {
      this.getSuppliersList()
    },
    methods: {
      getSuppliersList() {
        API.Product.reqGoodsList({},false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.suppliersList = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      _searchGoods() {
        if (!this.searchText.length) {
          this.$toast.show('请输入供应商链接')
          return
        }
        console.log('搜索供应商！')
        this.getSuppliersList()
      },
      _syncSuppliersList() {
        if (!this.suppliersList.length) return
        // 同步供应商逻辑，点击就同步，然后弹窗提示绑定供应商，可暂时不绑定
        this.$refs.popupModal.show()
      },
      _PIConfirm() {
        console.log('绑定成功！')
        this.$refs.popupModal.hide()
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
