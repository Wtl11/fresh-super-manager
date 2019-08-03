<template>
  <default-modal ref="modal">
    <div slot="content" class="popup-input">
      <div class="title-box">
        <div class="title">同步成功！请绑定供应商</div>
        <span class="close hand" @click="cancel"></span>
      </div>
      <div class="main-input">
        <div class="input-con">
          供应商1688店铺地址
          <input v-model="popupTxt" type="text" class="main-input-box">
        </div>
        <div class="btn-group">
          <span class="btn cancel" @click="cancel">取消</span>
          <span class="btn confirm" @click="confirm">确定</span>
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
    data() {
      return {
        popupTxt: '',
        isSubmit: false
      }
    },
    methods: {
      show() {
        this.$refs.modal && this.$refs.modal.showModal()
      },
      hide() {
        this.popupTxt = ''
        this.isSubmit = false
        this.$refs.modal && this.$refs.modal.hideModal()
      },
      confirm() {
        if (this.isSubmit) return
        if (!this.popupTxt.length) {
          this.$toast.show('请输入供应商1688店铺地址')
          return
        }
        this.isSubmit = true
        setTimeout(() => {
          this.isSubmit = false
        }, 800)
        this.$emit('confirm', this.popupTxt)
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
    width: 620px
    min-height: 202px
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
      .input-con
        layout(row)
        align-items: center
        font-size: $font-size-14
        font-family: $font-family-regular
        line-height: 1
        color: $color-text-main
      .main-input-box
        flex: 1
        height: 44px
        margin-left: 12px
        border: 0.5px solid #D3D8DC
        border-radius: 2px
        font-family: $font-family-regular
        color: $color-text-main
        font-size: $font-size-14
        padding-left: 14px
        transition: all 0.3s
        &::-webkit-inner-spin-button
          appearance: none
        &:hover
          border: 0.5px solid #ACACAC
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
        &:focus
          border-color: $color-main !important
  .z
    width: 100%
</style>
