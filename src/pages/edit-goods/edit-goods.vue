<template>
  <div class="edit-goods">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">{{id ? '编辑商品' : '新建商品'}}</p>
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
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          类目
        </div>
        <div class="edit-input-box mini-edit-input-box">
          <div class="mini-mr20">
            <base-drop-down :height="40" :width="190" radius="2" :select="stairSelect" @setValue="setStairValue"></base-drop-down>
          </div>
          <div class="mini-mr20">
            <base-drop-down :height="40" :width="190" radius="2" :select="stairSelect" @setValue="setStairValue"></base-drop-down>
          </div>
          <base-drop-down :height="40" :width="190" radius="2" :select="secondSelect" @setValue="setSecondValue"></base-drop-down>
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
            <div class="add-image hand">
              <input type="file" class="sendImage hand" multiple="multiple" accept="image/*" @change="_addPic('goods_banner_images', picNum, $event)">
              <div v-if="showLoading && uploadImg === 'goods_banner_images'" class="loading-mask">
                <img src="./loading.gif" class="loading">
              </div>
            </div>
          </div>
          <!--<base-edit-image :picList.sync="msg.goods_banner_images" @failFile="failFile" @getPic="getPic" @delPic="delPic"></base-edit-image>-->
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
            <draggable v-model="msg.goods_banner_images" class="draggable" @update="_setSort()">
              <div v-for="(item, index) in msg.goods_banner_images" :key="index" class="show-image hand">
                <img class="img" :src="item.image_url" alt="">
                <span class="close" @click="delPic(index)"></span>
              </div>
            </draggable>
            <div class="add-image hand">
              <input type="file" class="sendImage hand" multiple="multiple" accept="image/*" @change="_addPic('goods_banner_images', picNum, $event)">
              <div v-if="showLoading && uploadImg === 'goods_banner_images'" class="loading-mask">
                <img src="./loading.gif" class="loading">
              </div>
            </div>
          </div>
          <!--<base-edit-image :picList.sync="msg.goods_banner_images" @failFile="failFile" @getPic="getPic" @delPic="delPic"></base-edit-image>-->
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
          基本单位
        </div>
        <div class="edit-input-box">
          <base-drop-down :height="40" :width="400" radius="2" :select="dispatchSelect" :isUse="!id" @setValue="setValue"></base-drop-down>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          销售规格
        </div>
        <div class="edit-input-box mini-edit-input-box">
          <input type="number" class="edit-input mini-edit-input" maxlength="10" :disabled="id">
          <div class="edit-input-unit"><span></span>/</div>
          <base-drop-down :height="40" :width="133" radius="2" :select="saleSelect" :isUse="!id"
                          @setValue="setValue"
          ></base-drop-down>
        </div>
        <div class="edit-pla">例如：基本单位是kg，销售单位是份，则销售规格可输入0.5，即0.5kg/份</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          商品编码
        </div>
        <div class="edit-input-box">
          <input type="text" class="edit-input" maxlength="20">
        </div>
      </div>
    </div>
    <div class="content-header procurement-top">
      <div class="content-title">销售信息</div>
    </div>
    <div class="goods-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          划线价
        </div>
        <div class="edit-input-box">
          <input type="text" class="edit-input" maxlength="20">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          销售单价
        </div>
        <div class="edit-input-box">
          <input type="text" class="edit-input" maxlength="20">
        </div>
      </div>
    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn back-submit hand" @click="_submit">{{id ? '编辑' : '创建'}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Draggable from 'vuedraggable'

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
    data() {
      return {
        msg: {
          picNum: 5,
          goods_banner_images: [],
          goods_skus: {
            base_sale_rate: '',
            base_unit: ''
          },
          id: ''
        }
      }
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
      .edit-title
        margin-top: 7.5px
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
    .close
      icon-image('pic-delete')
      width: 15px
      height: 15px
      position: absolute
      top: 0
      right: 0
      z-index: 100

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
</style>
