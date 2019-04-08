<template>
  <div class="edit detail-content">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">{{id ? '编辑加盟商' : '新建加盟商'}}</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">基本信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          加盟商账号
        </div>
        <div class="edit-input-box">
          <input type="number" class="edit-input" maxlength="11" placeholder="请填写加盟商账号">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          加盟商名称
        </div>
        <div class="edit-input-box">
          <input type="number" class="edit-input" maxlength="11" placeholder="请填写加盟商名称">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          密码
        </div>
        <div class="edit-input-box">
          <input type="number" class="edit-input" maxlength="11" placeholder="请填写加盟商登录秘密">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          收款人
        </div>
        <div class="edit-input-box">
          <input type="number" class="edit-input" maxlength="11" placeholder="请填写加盟商收款人真实姓名">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          银行账户
        </div>
        <div class="edit-input-box">
          <input type="number" class="edit-input" maxlength="11" placeholder="请填写加盟商收款人真实姓名">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          地区
        </div>
        <div class="edit-input-box">
          <city-select ref="city"></city-select>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          平台服务费率(%)
        </div>
        <div class="edit-input-box">
          <input type="number" class="edit-input" maxlength="11">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CitySelect from '@components/city-select/city-select'

  const PAGE_NAME = 'EDIT_FRANCHISE'
  const TITLE = '新建加盟商'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components:{
      CitySelect
    },
    data() {
      return {
        id: ''
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/edit"

  .edit-franchise
    width: 100%
</style>
