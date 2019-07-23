<template>
  <div class="goods-choose table">
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-product_list@2x.png" class="identification-icon">
          <p class="identification-name">商品选品</p>
        </div>
      </div>
      <div class="search-con">
        商品链接
        <input v-model="searchText" type="text" class="search-input" @keyup.enter="_searchGoods">
        <div class="search-btn hand" @click="_searchGoods">查找1688商品信息</div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
        </div>
        <div v-if="goodsList.goods_skus&&goodsList.goods_skus.length>0" class="list">
          <div v-for="(item, index) in goodsList.goods_skus" :key="index" class="list-content list-box">
            <div class="list-item">
              <img v-if="item.image_url" class="pic-box" :src="item.image_url" alt="">
              <img v-else-if="goodsList.goods_banner_images&&goodsList.goods_banner_images[0]" class="pic-box" :src="goodsList.goods_banner_images[0]" alt="">
            </div>
            <div class="list-item">{{goodsList.name}}</div>
            <div class="list-item">{{goodsList.category_str}}</div>
            <div class="list-item">{{item.purchase_price}}</div>
            <div class="list-item">{{item.usable_stock}}</div>
            <div class="list-item">{{item.attribute_str}}</div>
          </div>
        </div>
        <div v-else class="empty-con">
          <div class="empty-img"></div>
          <div class="empty-text">暂无信息</div>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <div :class="[goodsList.goods_skus?'':'disabled']" class="button hand" @click="syncGoodsList">同步</div>
    </div>
    <popup-input ref="popupModal" @confirm="_PIConfirm"></popup-input>
  </div>
</template>

<script type="text/ecmascript-6">
  import API from '@api'
  import PopupInput from './popup-input/popup-input'

  const PAGE_NAME = 'FREE_SHIPPING_GOODS_CHOOSE'
  const TITLE = '商品选品'
  const LIST_TITLE = ['图片', '商品', '类目', '价格', '库存', '规格']

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
        goodsList: {},
        searchText: 'https://detail.1688.com/offer/598838051167.html?spm=a262eq.12572798.jsczf959.22.79792fb185Qz7b'
      }
    },
    methods: {
      _searchGoods() {
        if (!this.searchText.length) {
          this.$toast.show('请输入商品链接')
          return
        }
        console.log('搜索商品！')
        this.getGoodsList()
      },
      getGoodsList() {
        API.FreeShipping.goodsSearch({domin: this.searchText}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.goodsList = res.data
          } else {
            this.$toast.show(res.message)
          }
        }).finally(()=>{
          this.$loading.hide()
        })
      },
      // 同步商品
      syncGoodsList() {
        if (!this.goodsList.goods_skus) return
        // 同步商品逻辑，点击就同步，然后弹窗提示绑定供应商，可暂时不绑定
        API.FreeShipping.goodsCreate(this.goodsList).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$refs.popupModal.show()
          } else {
            this.$toast.show(res.message)
          }
        }).finally(()=>{
          this.$loading.hide()
        })
      },
      _PIConfirm(searchText) {
        this.getSuppliersMsg(searchText)
      },
      getSuppliersMsg(searchText) {
        this.$loading.show()
        API.FreeShipping.suppliersSearch({domin: searchText}).then((res) => {
          if (res.error === this.$ERR_OK) {
            this._syncSuppliersList(res.data)
          } else {
            this.$toast.show(res.message)
            this.$loading.hide()
          }
        }).catch(()=>{
          this.$loading.hide()
        })
      },
      _syncSuppliersList(suppliersMsg) {
        API.FreeShipping.suppliersCreate(suppliersMsg).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('绑定成功！')
            this.$refs.popupModal.hide()
          } else {
            this.$toast.show(res.message)
          }
        }).finally(()=>{
          this.$loading.hide()
        })
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .big-list
    min-height: 645px
    max-height: none
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
      &:nth-child(1)
        max-width: 100px
      &:nth-child(2)
        max-width: 500px
        flex: 3
      &:nth-child(3)
        max-width: 400px
        flex: 2
      &:nth-child(4),&:nth-child(5),&:nth-child(6)
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
