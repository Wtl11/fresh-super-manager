<template>
  <div class="base-date-select">
    <div v-if="dateType === 'date'" class="block">
      <el-date-picker
        v-model="time"
        type="date"
        placeholder="选择日期"
        valueFormat="yyyy-MM-dd"
      >
      </el-date-picker>
    </div>
    <div v-if="dateType === 'daterange'" class="block">
      <el-date-picker
        v-model="moreTime"
        type="daterange"
        rangeSeparator="至"
        startPlaceholder="开始日期"
        endPlaceholder="结束日期"
        valueFormat="yyyy-MM-dd"
        style="width: 260px"
      >
      </el-date-picker>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BASE_DATE_SELECT'

  export default {
    name: COMPONENT_NAME,
    props: {
      placeHolder: {
        type: String,
        default: '选择申请日期'
      },
      dateInfo: {
        // 初始化时间 -> eg: ['2016-01-01', '2016-02-15']
        type: Array,
        default: () => {
          return []
        }
      },
      dateTime: {
        // 初始化时间 -> eg: ''
        type: String,
        default: ''
      },
      disabledDate: {
        type: Object,
        default: () => {
          return {}
        }
      },
      clearable: {
        type: Boolean,
        default: true
      },
      dateType: {
        type: String,
        default: 'daterange'
      }
    },
    data() {
      return {
        time: this.dateTime,
        moreTime: this.dateInfo[0] && this.dateInfo[1] ? this.dateInfo : ''
      }
    },
    watch: {
      dateInfo(news) {
        this.moreTime = news
      },
      time(value) {
        // 选择单天的时间选择器
        this.$emit('getDateTime', value)
      },
      moreTime(value) {
        // 选择初始时间加结束时间的时间选择器
        this.$emit('getTime', value)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .base-date-select
    .el-date-editor
      .el-range-input
        font-size: $font-size-12

    .el-input__inner
      height: 28px
      line-height: 28px
      border-color: $color-line
      border-radius: $radius-main
      font-family: $font-family-regular
      font-size: $font-size-12
      color: $color-text-main

      &:focus
        border-color: $color-main

    .el-input__inner::-webkit-input-placeholder
      font-family: $font-family-regular
      font-size: $font-size-12
      color: $color-text-assist
    .el-input__icon
      line-height: 28px
    .el-range__icon, .el-range__close-icon
      align-items: center
      justify-content: center
      display: flex !important

    .el-date-editor
      .el-range-separator
        padding: 0
        color: $color-text-main
        font-size: $font-size-12
        line-height: 20px
</style>
