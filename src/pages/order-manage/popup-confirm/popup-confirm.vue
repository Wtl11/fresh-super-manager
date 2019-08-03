<template>
  <default-modal ref="modal">
    <div slot="content" class="popup-input">
      <div class="title-box">
        <div class="title">
          付款详情
        </div>
        <span class="close hand" @click="cancel"></span>
      </div>
      <div class="main-input">
        <div class="text-con">
          <p style="margin-bottom: 12px">订单数：<span class="num-val">{{count}}</span></p>
          <p>合计支付金额：<span class="num-val">{{total}}</span>元</p>
        </div>
        <div class="btn-group">
          <span class="btn cancel" @click="cancel">取消</span>
          <span class="btn confirm" @click="confirm">立即支付</span>
        </div>
      </div>
    </div>
  </default-modal>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'

  const COMPONENT_NAME = 'POPUP_INPUT'

  export default {
    name: COMPONENT_NAME,
    components: {DefaultModal},
    props: {
      count: {
        type: Number,
        default: 0
      },
      total: {
        type: Number,
        default: 0
      },
    },
    data() {
      return {
        isSubmit: false
      }
    },
    methods: {
      show() {
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.isSubmit = false
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      confirm() {
        if (this.isSubmit) return
        this.isSubmit = true
        setTimeout(() => {
          this.isSubmit = false
        }, 800)
        this.$emit('confirm')
      },
      cancel() {
        this.hide()
        this.$emit('cancel')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .popup-input
    background: #fff
    width: 534px
    min-height: 232px
    border-radius: 2px
    padding: 0 20px
    box-sizing: border-box
    .title-box
      display: flex
      box-sizing: border-box
      padding: 23px 0
      align-items: center
      justify-content: space-between
      .title
        font-size: $font-size-16
        font-family: $font-family-medium
        line-height: 1
        color: $color-text-main
      .close
        width: 12px
        height: @width
        icon-image('icon-close')

    .main-input
      margin-top: 7px
      .text-con
        padding: 18px 10px
        background: #f5f5f5
        layout()
        font-size: $font-size-14
        font-family: $font-family-regular
        line-height: 1
        color: $color-text-main
        .num-val
          color: $color-negative
          font-family: $font-family-medium
  .z
    width: 100%
</style>
