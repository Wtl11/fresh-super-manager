<template>
  <div class="edit detail-content is-back">
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
          加盟商名称
        </div>
        <div class="edit-input-box">
          <input v-model="stores.name" type="text" class="edit-input" maxlength="11" placeholder="请填写加盟商名称">
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          地区
        </div>
        <div class="edit-input-box">
          <city-select ref="city" @setValue="getCity"></city-select>
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          社区数量
        </div>
        <div class="edit-input-box">
          <input v-model="stores.account_count" type="number" class="edit-input" maxlength="11"
                 placeholder="请填写社区数量"
          >
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          平台服务费率(%)
        </div>
        <div class="edit-input-box">
          <input v-model="stores.service_tariffing" type="number" class="edit-input">
        </div>
      </div>



      <div class="edit-item">
        <div class="edit-title">
          收款人
        </div>
        <div class="edit-input-box">
          <div v-if="stores.user_name && id" class="edit-change">{{stores.user_name}}</div>
          <input v-else v-model="stores.user_names" type="text" class="edit-input"
                 placeholder="请填写加盟商收款人真实姓名"
          >
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          开户行
        </div>
        <div class="edit-input-box">
          <div v-if="stores.bank && id" class="edit-change">{{stores.bank}}</div>
          <input v-else v-model="stores.banks" type="text" class="edit-input"
                 placeholder="请填写加盟商收款开户行"
          >
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          银行账户
        </div>
        <div class="edit-input-box">
          <div v-if="stores.withdrawal_card && id" class="edit-change">{{stores.withdrawal_card}}</div>
          <input v-else v-model="stores.withdrawal_cards" type="number" class="edit-input"
                 placeholder="请填写加盟商收款银行账户"
          >
        </div>
      </div>

    </div>
    <div class="content-header">
      <div class="content-title">实名信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          真实姓名
        </div>
        <div class="edit-input-box">
          <input v-model="stores.real_name"
                 type="text"
                 class="edit-input"
                 :disabled="stores.is_certification > 0"
                 placeholder="请输入真实姓名"
          >
        </div>
        <div class="edit-msg">请输入货款结算银行卡持卡人的真实姓名</div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          身份证号
        </div>
        <div class="edit-input-box">
          <input v-model="stores.identity_cart"
                 :type="stores.is_certification ? 'text' : 'number'"
                 class="edit-input"
                 :disabled="stores.is_certification > 0"
                 placeholder="请输入身份证号"
          >
        </div>
        <div class="edit-msg">请输入18位身份证号码</div>
      </div>

    </div>

    <div class="content-header">
      <div class="content-title">登录信息</div>
    </div>
    <div class="leader-box">
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          账号
        </div>
        <div class="edit-input-box">
          <!--onpaste="return false"-->
          <div v-if="id" class="edit-change">{{stores.mobile}}</div>
          <input v-else v-model="stores.mobile" type="number" class="edit-input" maxlength="11"
                 placeholder="请填写加盟商账号"
          >
        </div>
      </div>
      <div class="edit-item">
        <div class="edit-title">
          <span class="start">*</span>
          密码
        </div>
        <div class="edit-input-box">
          <div v-if="!isChangePassword" class="list-operation edit-change" @click="changeType">修改密码</div>
          <input v-else v-model="stores.password" type="text" class="edit-input" maxlength="11"
                 placeholder="请填写加盟商登录密码"
          >
        </div>
      </div>

    </div>
    <div class="back">
      <div class="back-cancel back-btn hand" @click="back">返回</div>
      <div class="back-btn back-submit hand" @click="submit">保存</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import CitySelect from '@components/city-select/city-select'
  import API from '@api'
  import _ from 'lodash'

  const PAGE_NAME = 'EDIT_FRANCHISE'
  const TITLE = '新建加盟商'
  const TELREG = /^(([1-9][0-9]*)|([1-9][0-9]*\.\d{1,2})|([0-9])|([0-9]*\.\d{1,2}))$/

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      CitySelect
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
        id: this.$route.query.id,
        editName: this.$route.query.editName,
        isChangePassword: !this.$route.query.id,
        stores: {
          mobile: '',
          name: '',
          real_name: '',
          identity_cart: '',
          password: '',
          user_name: '',
          user_names: '',
          withdrawal_card: '',
          withdrawal_cards: '',
          province: '',
          city: '',
          account_count: '',
          district: '',
          service_tariffing: 0.8,
          banks: '',
          bank: ''
        },
        isSubmit: true
      }
    },
    mounted() {
      this._setData()
      if (this.id) {
        this.stores = JSON.parse(JSON.stringify(this.detail))
      }
    },
    methods: {
      /**
       * 设置默认数据 -> 编辑状态
       * @private
       */
      _setData() {
        if (!_.isEmpty(this.detail)) {
          this.$refs.city.infoCity([this.detail.province, this.detail.city, this.detail.district])
          this.stores = JSON.parse(JSON.stringify(this.detail))
        }
      },
      changeType() {
        this.isChangePassword = true
      },
      back() {
        this.$router.back()
      },
      getCity(value) {
        this.stores.province = value[0]
        this.stores.city = value[1]
        this.stores.district = value[2]
      },
      async submit() {
        if (!this.isSubmit) {
          return
        }
        if (!this.stores.name) {
          this.$toast.show('请填写加盟商名称')
          return
        } else if (!this.stores.province) {
          this.$toast.show('请选择省份')
          return
        } else if (!this.stores.city) {
          this.$toast.show('请选择城市')
          return
        } else if (!this.stores.district) {
          this.$toast.show('请选择区/县')
          return
        } else if (!this.stores.account_count) {
          this.$toast.show('请填写社区数量')
          return
        } else if (!this.stores.service_tariffing) {
          this.$toast.show('请填写平台服务费率')
          return
        } else if (!this.stores.real_name) {
          this.$toast.show('请填写真实姓名')
          return
        } else if (!this.stores.identity_cart) {
          this.$toast.show('请填写身份证号')
          return
        } else if (!this.id && !this.stores.mobile) {
          this.$toast.show('请填写加盟商账号')
          return
        } else if (!this.id && !TELREG.test(this.stores.mobile)) {
          this.$toast.show('请填写正确加盟商账号')
          return
        } else if (this.isChangePassword && !this.stores.password) {
          this.$toast.show('请填写加盟商登录密码')
          return
        }
        this.isSubmit = false
        let res = null
        let data = Object.assign({}, this.stores, {
          user_name: this.stores.user_names,
          bank: this.stores.banks,
          withdrawal_card: this.stores.withdrawal_cards
        })
        if (this.id) {
          if (!this.isChangePassword) {
            delete this.stores.password
          }
          res = await API.Franchise.updateFranchise(this.id, data)
        } else {
          res = await API.Franchise.storeFranchise(data)
        }
        this.$loading.hide()
        this.$toast.show(res.message, 600)
        if (res.error !== this.$ERR_OK) {
          this.isSubmit = true
          return
        }
        setTimeout(() => {
          this.back()
        }, 800)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  @import "~@style/edit"
  .edit-change
    line-height: 40px
    .edit-input:disabled
      background: #f9f9f9
      font-family: $font-family-regular
      color: $color-text-assist
      cursor: not-allowed
</style>
