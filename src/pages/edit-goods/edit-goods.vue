<template>
  <div class="edit-goods">
    <div style="height: 25px"></div>
    <div class="content-header">
      <div class="content-title">商品素材</div>
    </div>
    <section class="goods-box">
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
          推荐语
        </div>
        <div class="edit-input-box">
          <textarea v-model="msg.describe" class="edit-textarea edit-input" maxlength="50"></textarea>
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
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          基本单位
        </div>
        <div class="edit-input-box">
          <base-drop-down :height="40" :width="400" :radius="2" :select="dispatchSelect"
                          @setValue="setBaseValue"
          ></base-drop-down>
        </div>
        <p class="edit-explain">商品在仓库存放时的最小单位 <span class="see-sample" @click="showSampleHandle">查看示例</span></p>
      </div>
      <div class="edit-item  edit-image-box">
        <div class="edit-title">
          <span class="start">*</span>
          封面图
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
          主图视频
        </div>
        <div class="image-box">
          <div class="edit-image">
            <draggable v-model="msg.goods_videos" class="draggable">
              <div v-for="(item, index) in msg.goods_videos" :key="index" class="show-image hand">
                <video class="img" :src="item.full_url" alt=""></video>
                <span class="close" @click="delPic(index, 'goods_videos')"></span>
                <img src="./icon-play_upload.png" alt="" class="icon-video-button">
              </div>
            </draggable>
            <div v-if="msg.goods_videos.length < videoNum" class="add-image hand">
              <input type="file" class="sendImage hand" accept="video/*" @change="_addVideo('goods_videos', videoNum, $event)">
              <div v-if="showLoading && uploadImg === 'goods_videos'" class="loading-mask">
                <img src="./loading.gif" class="loading">
              </div>
            </div>
          </div>
          <div class="tip">建议上传50M以内的清晰视频，内容突出商品1-2个核心卖点。</div>
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
    </section>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="_back">返回</div>
      <div class="back-btn back-submit hand" @click="_submit">{{id ? '编辑' : '创建'}}</div>
    </div>
    <default-confirm ref="modal">
      <div slot="content" class="tip-wrapper">
        <img src="./icon-close@2x.png" alt="" class="icon-close hand" @click="hideExampleHandle">
        <header class="header">{{tipInfo.title}}</header>
        <ul class="example-wrapper">
          <li v-for="(item, index) in tipInfo.list" :key="index" class="example">
            <p class="tip-icon">{{item.title}}</p>
            <p class="tip-text">
              <span v-for="(ct, cIdx) in item.content" :key="cIdx" :class="ct.cname || ''">{{ct.text}}</span>
            </p>
          </li>
        </ul>
      </div>
    </default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-modal/default-modal'
  import Draggable from 'vuedraggable'
  import API from '@api'
  import _ from 'lodash'

  const PAGE_NAME = 'EDIT_GOODS'
  const TITLE = '新建商品'

  // 死变态
  function formatVideos(arr = []) {
    return arr.map(item => {
      if (item.id !== 0) {
        item.file_id = item.id
        return {
          file_id: item.id
        }
      }
      return item
    })
  }

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      Draggable,
      DefaultConfirm
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
      return {
        picNum: 5,
        videoNum: 1,
        showLoading: false,
        uploadImg: '',
        msg: {
          name: '',
          goods_material_category_id: 0,
          goods_banner_images: [],
          // goods_main_images: [],
          goods_detail_images: [],
          goods_material_skus: [],
          goods_videos: [],
          describe: ''
        },
        goods_skus: {
          base_sale_rate: '',
          base_unit: '',
          sale_unit: '',
          goods_sku_code: '',
          trade_price: '',
          original_price: '',
          goods_material_sku_id: 0
        },
        stairSelect: {check: false, show: false, content: '一级类目', type: 'default', data: []},
        secondSelect: {check: false, show: false, content: '二级类目', type: 'default', data: []},
        thirdlySelect: {check: false, show: false, content: '三级类目', type: 'default', data: []},
        dispatchSelect: {check: false, show: false, content: '基本单位', type: 'default', data: []},
        saleSelect: {check: false, show: false, content: '销售单位', type: 'default', data: []},
        categoryId: '',
        id: this.$route.query.id || '',
        isSubmit: false,
        tipInfo: {
          title: '基本单位示例',
          list: [
            {
              title: '示例1',
              content: [
                {
                  text: '苹果: 采购散装后自己包装，按“kg”存放在仓库，则',
                },
                {
                  text: '基本单位',
                  cname: 'mark'
                },
                {
                  text: '建议设置为',
                },
                {
                  text: 'kg',
                  cname: 'mark'
                }
              ]
            },
            {
              title: '示例2',
              content: [
                {
                  text: '苹果: 采购供应商已包装好的，按“份”存放在仓库，则',
                },
                {
                  text: '基本单位',
                  cname: 'mark'
                },
                {
                  text: '建议设置为',
                },
                {
                  text: '份',
                  cname: 'mark'
                }
              ]
            },
            {
              title: '示例3',
              content: [
                {
                  text: '酸奶: 采购1件30盒，按“盒”存放在仓库，则',
                },
                {
                  text: '基本单位',
                  cname: 'mark'
                },
                {
                  text: '建议设置为',
                },
                {
                  text: '盒',
                  cname: 'mark'
                }
              ]
            }
          ]
        }
      }
    },
    created() {
      this._setData()
      this.getCategoriesData()
      this.getSelectData()
    },
    methods: {
      showSampleHandle() {
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hideExampleHandle() {
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      /**
       * 设置默认数据 -> 编辑状态
       * @private
       */
      _setData() {
        if (!_.isEmpty(this.detail)) {
          this.msg = _.cloneDeep(this.detail)
          this.goods_skus = this.msg.goods_material_skus[0]
          this.dispatchSelect.content = this.goods_skus.base_unit
          this.saleSelect.content = this.goods_skus.sale_unit
        }
      },
      // 获取类目列表
      getCategoriesData() {
        API.Product.getCategoryList({parent_id: -1, goods_material_id: this.id}, false).then((res) => {
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
                      if (thritem.is_selected) {
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
      // 获取计量单位
      getSelectData() {
        API.Product.getUnitsList({}, false).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.dispatchSelect.data = res.data
            this.saleSelect.data = res.data
          } else {
            this.$toast.show(res.message)
          }
        })
      },
      // 选择一级类目
      setStairValue(data) {
        this.secondSelect.content = '二级类目'
        this.secondSelect.data = data.list
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = ''
        this.msg.goods_material_category_id = data.id
      },
      // 选择二级类目
      setSecondValue(data) {
        this.thirdlySelect.content = '三级类目'
        this.thirdlySelect.data = data.list
        this.msg.goods_material_category_id = data.id
      },
      // 选择三级类目
      setThirdlyValue(data) {
        this.msg.goods_material_category_id = data.id
      },
      _addVideo(type, length, e) {
        this.uploadImg = type
        this.showLoading = true
        this.$vod.uploadFiles(e.target.files[0]).then((res) => {
          this.showLoading = false
          let obj = {
            id: 0,
            file_id: res.data.id,
            full_url: res.data.full_url
          }
          this.$set(this.msg, type, [obj])
        }).catch(e => {
          this.showLoading = false
        })
        e.target.value = ''
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
      // 回退上一页
      _back() {
        this.$router.back()
      },
      // 提交信息
      _submit() {
        if (this.isSubmit) {
          return
        }
        if (this.msg.name.length === 0 || this.msg.name.length >= 30) {
          this.$toast.show('请输入商品名称且小于30字')
          return
        } else if (this.msg.goods_material_category_id <= 0) {
          this.$toast.show('请选择商品类目')
          return
        } else if (this.msg.goods_banner_images.length === 0) {
          this.$toast.show('请上传商品图片')
          return
        } else if (this.msg.goods_detail_images.length === 0) {
          this.$toast.show('请上传商品详情图')
          return
        } else if (this.goods_skus.base_unit === '') {
          this.$toast.show('请选择基本单位')
          return
        }
        this.msg.goods_material_skus[0] = this.goods_skus
        this.isSubmit = true
        // 转换视频字段
        this.msg.goods_videos = formatVideos(this.msg.goods_videos) || []
        if (this.id) {
          API.Product.editGoods(this.id, this.msg).then((res) => {
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
          return
        }
        API.Product.createGoods(this.msg).then((res) => {
          if (res.error === this.$ERR_OK) {
            this.$toast.show('创建成功')
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
      // 选择基本单位
      setBaseValue(data) {
        this.goods_skus.base_unit = data.name
      },
      // 选择销售单位
      setValueList(data) {
        this.goods_skus.sale_unit = data.name
      },
      // 删除图片
      delPic(index, key) {
        if (key) {
          this.msg[key].splice(index, 1)
        } else {
          this.msg.goods_banner_images.splice(index, 1)
        }
      },
      delPic2(index) {
        this.msg.goods_detail_images.splice(index, 1)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  // 弹窗
  .tip-wrapper
    width: 534px
    box-sizing :border-box
    padding :0 20px
    line-height: 1
    background: #FFFFFF;
    box-shadow: 0 0 5px 0 rgba(12,6,14,0.60);
    border-radius: 3px;
    position :relative
    .icon-close
      extend-click()
      position: absolute
      width: 8px
      height: @width
      right :20px
      top:@right

    .header
      font-family: $font-family-medium
      font-size: 16px;
      color: #333333;
      padding-top :26px
    .example-wrapper
      padding-top :30px
      padding-bottom :23px
      font-family: PingFangSC-Regular;
      font-size: 14px;
      .example
        background: #F5F7FA;
        border: 0.5px solid #E9ECEE;
        margin-bottom :20px
        &:last-child
          margin-bottom : 0
        .tip-icon
          height :24px
          width: 58px
          box-sizing:border-box
          background: #666666;
          color: #FFFFFF;
          border-radius: 0 0 20px 0;
          line-height :24px
          text-align :center
        .tip-text
          padding :18px 10px 19px
          line-height :1.2
          .mark
            color: $color-main

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
      .edit-explain
        align-self :center
        font-family: $font-family-regular
        font-size: 14px;
        color: #ACACAC;
        line-height: 1
        padding-left :10px
        .see-sample
          padding-left :20px
          text-decoration :underline
          color: #3E77C3;
          cursor :pointer
      .edit-textarea
        width: 400px
        padding: 5px 14px
        height: 94px
        resize: none
      .edit-title
        margin-top: 7.5px
        font-size: $font-size-14
        font-family: $font-family-regular
        white-space: nowrap
        text-align: right
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
      .icon-video-button
        width: 26px
        height: @with
        all-center()
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
