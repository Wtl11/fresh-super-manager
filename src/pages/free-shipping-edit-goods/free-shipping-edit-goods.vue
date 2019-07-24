<template>
  <div class="edit-goods">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-wanshan_commodity@2x.png" class="identification-icon">
        <p class="identification-name">{{id ? '编辑商品' : '完善资料'}}</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">商品信息</div>
    </div>
    <div class="goods-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          商品名称
        </div>
        <div class="edit-input-box">
          <input v-model="msg.name" type="text" class="edit-input" maxlength="29" @mousewheel.native.prevent>
        </div>
        <a :href="msg.source_url" target="_blank" class="edit-pla link hand">查看1688商品</a>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          销售标题
        </div>
        <div class="edit-input-box">
          <input v-model="msg.sale_name" type="text" class="edit-input" maxlength="29" @mousewheel.native.prevent>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          商品副标题
        </div>
        <div class="edit-input-box">
          <input v-model="msg.sub_name" type="text" class="edit-input" maxlength="29" @mousewheel.native.prevent>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          类目
        </div>
        <div class="edit-input-box mini-edit-input-box">
          <div class="mini-mr20">
            <base-drop-down :height="40" :width="190" :radius="2" :select="stairSelect" @setValue="setStairValue"></base-drop-down>
          </div>
          <div class="mini-mr20">
            <base-drop-down :height="40" :width="190" :radius="2" :select="secondSelect" @setValue="setSecondValue"></base-drop-down>
          </div>
          <base-drop-down :height="40" :width="190" :radius="2" :select="thirdlySelect" @setValue="setThirdlyValue"></base-drop-down>
        </div>
      </div>
      <div class="edit-item  edit-image-box">
        <div class="edit-title">
          <span class="start">*</span>
          商品图片
        </div>
        <div class="image-box">
          <div class="edit-image">
            <draggable v-model="msg.goods_banner_images" class="draggable" @update="_setSort()">
              <div v-for="(item, index) in msg.goods_banner_images" :key="index" class="show-image hand">
                <img class="img" :src="item.image_url" alt="">
                <span class="close" @click="delPic(index)"></span>
              </div>
            </draggable>
            <div v-if="msg.goods_banner_images.length < picNum" class="add-image hand">
              <input type="file" class="sendImage hand" multiple="multiple" accept="image/*" @change="_addPic('goods_banner_images', picNum, $event)">
              <div v-if="showLoading && uploadImg === 'goods_banner_images'" class="loading-mask">
                <img src="./loading.gif" class="loading">
              </div>
            </div>
          </div>
          <div class="tip">建议图片的尺寸：750*750，支持png，jpeg，jpg格式，最多可上传5张，首张为封面。</div>
        </div>
      </div>
      <div class="edit-item  edit-image-box">
        <div class="edit-title">
          <span class="start">*</span>
          详情图
        </div>
        <div class="image-box">
          <div class="edit-image">
            <draggable v-model="msg.goods_detail_images" class="draggable" @update="_setSort()">
              <div v-for="(item, index) in msg.goods_detail_images" :key="index" class="show-image hand">
                <img class="img" :src="item.image_url" alt="">
                <span class="close" @click="delPic2(index)"></span>
              </div>
            </draggable>
            <div v-if="msg.goods_detail_images.length < 15" class="add-image hand">
              <input type="file" class="sendImage hand" multiple="multiple" accept="image/*" @change="_addPic('goods_detail_images', 15, $event)">
              <div v-if="showLoading && uploadImg === 'goods_detail_images'" class="loading-mask">
                <img src="./loading.gif" class="loading">
              </div>
            </div>
          </div>
          <div class="tip">建议图片的尺寸：750*750，支持png，jpeg，jpg格式，最多可上传15张。</div>
        </div>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">商品规格</div>
    </div>
    <div class="goods-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          商品规格
        </div>
        <div class="goods-select-box">
          <div v-for="(item, index) in msg.goods_skus" :key="index" class="edit-input-box">
            <div class="goods-select-icon" :class="item.is_default === 1 ? 'select-active' : ''" @click="selectStock(item,index)"></div>
            <div class="goods-select-con">
              <div class="goods-select-text">{{item.attribute_str}}</div>
              <div class="goods-select-text">库存：{{item.usable_stock}}</div>
              <div class="goods-select-input">
                <div class="goods-select-text">商品编码</div>
                <input v-model="item.goods_sku_encoding" type="text" placeholder="商品编码"
                       class="edit-input edit-input-select" :disabled="false"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-header procurement-top">
      <div class="content-title">销售信息</div>
    </div>
    <div class="goods-box">
      <div class="edit-item edit-val">
        <div class="edit-title">建议零售价</div>
        <div class="edit-val-box">{{msg.retail_price}}</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          划线价
        </div>
        <div class="edit-input-box">
          <input v-model="goods_skus.original_price" type="text" class="edit-input" maxlength="20">
        </div>
        <div v-if="goods_skus.sale_unit" class="edit-pla">元/{{goods_skus.sale_unit}}</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          销售单价
        </div>
        <div class="edit-input-box">
          <input v-model="goods_skus.trade_price" type="text" class="edit-input" maxlength="20">
        </div>
        <div v-if="goods_skus.sale_unit" class="edit-pla">元/{{goods_skus.sale_unit}}</div>
      </div>
      <div class="edit-item edit-val">
        <div class="edit-title">邮费信息</div>
        <div class="edit-val-box">全国包邮</div>
      </div>
    </div>
    <div class="content-header procurement-top">
      <div class="content-title">供应信息</div>
    </div>
    <div class="goods-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          供应商
        </div>
        <div class="edit-input-box">
          <base-drop-down :height="40" :width="400" :radius="2" :select="supplierSelect" @setValue="setSuppliersVal"></base-drop-down>
        </div>
      </div>
      <div class="edit-item edit-val">
        <div class="edit-title">采购单价</div>
        <div class="edit-val-box">{{msg.purchase_price}}</div>
      </div>
      <div class="edit-item edit-val">
        <div class="edit-title">最小起订量</div>
        <div class="edit-val-box">{{msg.minimum}}</div>
      </div>
      <div class="edit-item edit-val">
        <div class="edit-title">采购邮费</div>
        <div class="edit-val-box">全国包邮</div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn back-submit hand" @click="_submit">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Draggable from 'vuedraggable'
  import API from '@api'
  // import _ from 'lodash'

  const PAGE_NAME = 'EDIT_GOODS'
  const TITLE = '新建商品'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      Draggable
    },
    props: {
      detail: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      // const params = this.$route.meta.params
      return {
        picNum: 5,
        showLoading: false,
        uploadImg: '',
        msg: {
          name: '',
          goods_category_id: 0,
          goods_banner_images: [],
          goods_detail_images: [],
          goods_skus: []
        },
        goods_skus: {
          id: '',
          goods_sku_id: '',
          is_default: 0,
          attribute_str: '',
          usable_stock: '',
          goods_sku_encoding: '',
          original_price: '',
          trade_price: ''
        },
        stairSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        thirdlySelect: {check: false, show: false, content: '三级类目', type: 'default', data: []},
        supplierSelect: {check: false, show: false, content: '选择供应商', type: 'default', data: []},
        id: this.$route.query.id || '',
        isSubmit: false,
        selectedIdx: 0
      }
    },
    created() {
      this.getGoodsInfo()
      this.getCategoryData()
      this._getSuppliersList()
    },
    methods: {
      getGoodsInfo() {
        API.FreeShipping.getGoodsInfo(this.id)
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              this.$toast.show(res.message)
              return
            }
            this.msg = res.data
            if (this.msg.sale_name.length <= 0) {
              this.msg.sale_name = res.data.name
            }
            this._setData()
          })
          .finally((e) => {
            this.$loading.hide()
          })
      },
      /**
       * 设置默认数据 -> 编辑状态
       * @private
       */
      _setData() {
        // if (!_.isEmpty(this.detail)) {
        // this.msg = _.cloneDeep(this.detail)
        for (let i = 0; i < this.msg.goods_skus.length; i++) {
          if (this.msg.goods_skus[i].is_default === 1) {
            this.selectedIdx = i
            break
          }
        }
        this.goods_skus = this.msg.goods_skus[this.selectedIdx]
        // }
      },
      // 获取类目列表
      getCategoryData() {
        API.FreeShipping.getGoodsCategory({parent_id: -1, goods_id: this.id}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.stairSelect.data = res.data
            res.data.forEach((item) => {
              if (item.is_selected) {
                this.stairSelect.content = item.name
                this.secondSelect.data = item.list
                this.secondSelect.data.forEach((twomitem) => {
                  if (twomitem.is_selected) {
                    this.secondSelect.content = twomitem.name
                    this.thirdlySelect.data = twomitem.list
                    this.thirdlySelect.data.forEach((thritem) => {
                      if(thritem.is_selected) {
                        this.thirdlySelect.content = thritem.name
                      }
                    })
                  }
                })
              }
            })
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 获取供应商列表
      _getSuppliersList() {
        API.FreeShipping.getSuppliersList()
          .then((res) => {
            if (res.error !== this.$ERR_OK) {
              return
            }
            if (res.data.length>0&&res.data[0].name) {
              this.supplierSelect.content = res.data[0].name
              this.supplierSelect.data = res.data
            }
          })
      },
      // 选择一级类目
      setStairValue(data) {
        this.secondSelect.content = '二级类目'
        this.secondSelect.data = data.list
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = ''
        this.msg.goods_category_id = data.id
      },
      // 选择二级类目
      setSecondValue(data) {
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = data.list
        this.msg.goods_category_id = data.id
      },
      // 选择三级类目
      setThirdlyValue(data) {
        this.msg.goods_category_id = data.id
      },
      // 添加图片
      _addPic(type, length, e) {
        this.uploadImg = type
        let arr = Array.from(e.target.files)
        e.target.value = ''
        if (arr.length < 1) return
        if (this.msg[type].length) {
          arr = arr.slice(0, length - this.msg[type].length)
        } else {
          arr = arr.slice(0, length)
        }
        this.showLoading = true
        this.$cos.uploadFiles(this.$cosFileType.IMAGE_TYPE, arr).then((resArr) => {
          this.showLoading = false
          let imagesArr = []
          resArr.forEach((item) => {
            if (item.error !== this.$ERR_OK) {
              return this.$toast.show(item.message)
            }
            let obj = {
              id: 0,
              image_id: item.data.id,
              image_url: item.data.url
            }
            imagesArr.push(obj)
          })
          this.$set(this.msg, type, this.msg[type].concat(imagesArr))
        })
      },
      // 选择供应商
      setSuppliersVal(data) {
        this.msg.supplier_id = data.id
      },
      // 删除商品图片
      delPic(index) {
        this.msg.goods_banner_images.splice(index, 1)
      },
      // 删除详情图片
      delPic2(index) {
        this.msg.goods_detail_images.splice(index, 1)
      },
      // 商品规格选择
      selectStock(item, index) {
        if (item.is_default === 1) return
        this.msg.goods_skus[this.selectedIdx].is_default = 0
        item.is_default = 1
        this.selectedIdx = index
      },
      // 提交信息
      _submit() {
        if (this.isSubmit) {
          return
        }
        if (this.msg.name.length === 0 || this.msg.name.length >= 30) {
          this.$toast.show('请输入商品名称且小于30字')
          return
        } else if (this.msg.goods_category_id <= 0) {
          this.$toast.show('请选择商品类目')
          return
        } else if (this.msg.goods_banner_images.length === 0) {
          this.$toast.show('请上传商品图片')
          return
        } else if (this.msg.goods_detail_images.length === 0) {
          this.$toast.show('请上传商品详情图')
          return
        }
        let skuCheck = false
        for(let i = 0; i < this.msg.goods_skus.length; i++) {
          const item = this.msg.goods_skus[i]
          if(item.is_default===1) {
            skuCheck = true
          }
          if (item.goods_sku_encoding.length === 0) {
            this.$toast.show('请输入商品编码')
            return
          }
        }
        if (!skuCheck) {
          this.$toast.show('请选择销售规格')
          return
        }
        if (this.goods_skus.original_price.length === 0) {
          this.$toast.show('请输入划线价')
          return
        } else if (this.goods_skus.trade_price.length === 0) {
          this.$toast.show('请输入销售单价')
          return
        } else if (+this.goods_skus.original_price < +this.goods_skus.trade_price) {
          this.$toast.show('划线价请大于销售单价')
          return
        }
        this.msg.goods_skus[this.selectedIdx].original_price = this.goods_skus.original_price
        this.msg.goods_skus[this.selectedIdx].trade_price = this.goods_skus.trade_price
        this.isSubmit = true
        API.FreeShipping.goodsModify(this.msg, this.id).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('编辑成功')
            setTimeout(() => {
              this._back()
            }, 1000)
          } else {
            this.isSubmit = false
            this.$toast.show(res.message)
          }
          this.$loading.hide()
        })
      },
      // 回退上一页
      _back() {
        this.$router.back()
      },
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .edit-goods
    width: 100%
    position: relative
    flex: 1
    background: $color-white
    padding: 0 20px 80px
    box-sizing: border-box
  .goods-box
    padding: 0 20px
    box-sizing: border-box
    .edit-item
      display: flex
      color: #2A2A2A
      min-height: 40px
      margin-top: 24px
      &.edit-val
        min-height: 16px
        line-height: 16px
        .edit-title
          margin-top: 0
      .edit-title
        margin-top: 7.5px
        color: #666666
        font-size: $font-size-14
        font-family: $font-family-regular
        white-space: nowrap
        text-align: left
        width: 64px
      .start
        display: inline-block
        margin-right: -2px
        color: #F52424
      .edit-input-box
        margin-left: 40.9px
        position: relative
      .edit-val-box
        margin-left: 40.9px
        position: relative
        font-family: $font-family-regular
        font-size: $font-size-14
        color: $color-text-main
      .edit-input
        font-size: $font-size-14
        padding: 0 14px
        border-radius: 2px
        width: 400px
        height: 40px
        border: 0.5px solid $color-line
        transition: all 0.3s
        &:disabled
          color: $color-text-assist
          background: $color-white
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 1px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
      .edit-textarea
        padding: 5px 14px
        height: 94px
        resize: none
      .num
        position: absolute
        right: 10px
        bottom: 10px
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-text-assist
      .mini-edit-input
        width: 133px
        border-radius: 0
        border-top-left-radius: 2px
        border-bottom-left-radius: 2px
        border-right: none
        &:hover
          border-color: $color-line
      .edit-input-unit
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        width: 134px
        height: 40px
        line-height: 40px
        text-align: center
        background: #F9F9F9
        border: 1px solid $color-line
        border-right: none
        margin-right: -1px
  .mini-edit-input-box
    layout(row)
    .mini-mr20
      margin-right: 20px
  .edit-image
    flex-wrap: wrap
    display: flex
    .draggable
      flex-wrap: wrap
      display: flex
    .add-image
      margin-bottom: 20px
      icon-image('pic-picture1')
      height: 90px
      width: @height
      position: relative
      border-radius: 2px
      overflow: hidden
      .sendImage
        height: 100%
        width: 100%
        top: 0
        left: 0
        opacity: 0
        z-index: 1
        position: absolute
    .show-image
      margin-bottom: 20px
      background-repeat: no-repeat
      background-size: cover
      background-position: center
      height: 90px
      margin-right: 20px
      width: @height
      border-radius: 2px
      position: relative
      overflow: hidden
      .img
        width :100%
        height :@width
        display :block
        object-fit :cover
    .close
      icon-image('pic-delete')
      width: 15px
      height: 15px
      position: absolute
      top: 0
      right: 0
      z-index: 9

    .loading-mask
      width: 100%
      height: 100%
      position: absolute
      top: 0
      left: 0
      background: rgba(0, 0, 0, .6)
      .loading
        all-center()
        width: 25px
        height: 25px
  .add-image
    margin-bottom: 20px
    icon-image('pic-picture1')
    height: 90px
    width: @height
    position: relative
    border-radius: 2px
    overflow: hidden
    .sendImage
      height: 100%
      width: 100%
      top: 0
      left: 0
      opacity: 0
      z-index: 1

  .edit-image-box
    align-items: flex-start
    min-height: 116px
    margin-bottom: 30px
    .edit-title
      margin-top: 15px
    .tip
      text-align: left
      margin-top: -6px
      font-size: $font-size-14
      color: $color-text-assist
      font-family: $font-family-regular
  .procurement-top
    margin-top: 24px
  .image-box
    margin-left: 40.9px
  .edit-msg
    font-size: $font-size-medium14
    color: #acacac
    margin-left: 10px
  .edit-pla
    font-size: $font-size-14
    color: $color-text-assist
    font-family: $font-family-regular
    display: flex
    align-items: center
    margin-left: 10px
    &.link
      text-decoration: underline
      color: #3F77C3

  .goods-box .edit-item .goods-select-box
    layout()
    .edit-input-box
      layout(row)
      align-items: center
    .goods-select-icon
      width: 18px
      height: @width
      border: 1px solid #E1E1E1
      background: #F9F9F9
      border-radius: 50%
      margin-right: 10px
      cursor: pointer
      &.select-active
        border: 0 solid transparent
        background-size: @width
        icon-image(icon-single_election)
    .goods-select-con
      box-sizing: border-box
      padding: 0 20px
      margin-bottom: 10px
      min-width: 590px
      max-width: 900px
      height: 52px
      line-height: @height
      background: #F5F7FA
      border-1px(#E9ECEE)
      border-radius: 1px
      layout(row)
      justify-content: space-between
      align-items: center
      font-size: $font-size-14
      font-family: $font-family-regular
      color: $color-text-main
      overflow: hidden
      .goods-select-text
        max-width: 400px
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-main
        margin-right: 10px
        no-wrap()
    .goods-select-input
      height: 100%
      layout(row)
      align-items: center
    .edit-input
      width: 200px
      height: 32px
    .stock-box-text
      width: 74px
      height: 44px
      line-height: 44px
      font-family: $font-family-regular
      color: $color-text-main
      font-size: $font-size-14
      padding-left: 14px
    .current-stock
      width: auto
      padding-left: 0
      .stock-color
        color: $color-negative
</style>
