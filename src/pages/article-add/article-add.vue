<template>
  <div class="advertisement normal-box">
    <div class="identification">
      <div class="identification-page">
        <img src="./icon-new_commodity@2x.png" class="identification-icon">
        <p class="identification-name">{{editName}}{{name}}</p>
      </div>
      <div class="function-btn">
      </div>
    </div>
    <div class="wrap-container">
      <phone-box :isShowEmpty="isShowEmpty" :data="addData" :type="currentType"></phone-box>
      <div class="edite-right-box">
        <!--分类 -->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            内容分类
          </div>
          <div class="edit-input-box">
            <zb-dropdown v-model="addData.category" :data="articleCategoryList" valueKey="id" :width="400" :height="40"
                         placeholder="请选择内容分类" @change-visible="_getArticleCategory"
            ></zb-dropdown>
          </div>
          <div class="add-category-operate hand" @click="addCategory">添加分类</div>
        </div>
        <!--标题-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            {{name}}标题
          </div>
          <div class="edit-input-box">
            <input v-if="currentType === 'video'" v-model="addData.title"
                   type="text"
                   :placeholder="'在此输入'+name+'标题，最多30个字'"
                   class="edit-input title-input"
                   max-length="30"
            >
            <input v-else v-model="addData.title"
                   type="text"
                   :placeholder="'在此输入'+name+'标题，最少5个最多50个字'"
                   class="edit-input title-input"
                   max-length="50"
            >
          </div>
        </div>
        <!-- 封面-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            {{name}}封面
          </div>
          <div class="edit-input-box flex-box">
            <base-upload :videoUrl="addData.coverVideo.url"
                         :imageUrl="addData.coverImage.url"
                         :videoSize="10"
                         :fileType="currentType!=='video' ?'image-video' :'image'"
                         @failFile="failFile"
                         @getPic="getPic"
                         @delPic="delPic"
                         @successVideo="getCoverVideo"
            ></base-upload>
            <div class="tip">
              <template v-if="currentType === 'video'">
                请添加不大于10M的清晰图片
              </template>
              <template v-else>
                请添加不大于10M的清晰图片或视频
                <br>
                {{name}}封面是{{name}}首图
              </template>
            </div>
          </div>
        </div>
        <!--作者信息-->
        <div class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            作者信息
          </div>
          <div class="edit-input-box flex-box author-info-box">
            <base-upload :imageUrl="addData.authPhoto.url"
                         :picNum="1"
                         imageIconClassName="add-image-head-photo"
                         fileType="image"
                         @failFile="failFile"
                         @getPic="getAuthorPic"
                         @delPic="delAuthorPic"
            ></base-upload>
            <div class="auto-input">
              <input v-model="addData.authName"
                     type="text"
                     placeholder="请输入作者名称15个字以内"
                     class="edit-input"
                     maxlength="15"
              >
              <input v-model="addData.authSignature"
                     type="text"
                     placeholder="请输入20个字以内的个性签名"
                     class="edit-input edit-signature"
                     maxlength="20"
              >
            </div>
          </div>
        </div>
        <!-- 视频  视频内容-->
        <div v-if="currentType === 'video'" class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            视频内容
          </div>
          <!-- todo-->
          <div class="edit-input-box flex-box">
            <template v-if="addData.videoContent.url">
              <div class="video-wrap">
                <video :src="addData.videoContent.url" class="video-wrap">
                </video>
                <div class="delete-icon" @click="deleteVideoContent"></div>
              </div>
              <div class="tip">
                视频上传成功，处理完成
                <div>视频名称-{{addData.videoContent.name}}</div>
              </div>
            </template>
            <div v-else class="video-content-wrap">
              <div class="video-tip"></div>
              <div class="upload-video-wrap">
                <base-upload :videoUrl="addData.videoContent.url"
                             :picNum="1"
                             fileType="video-custom"
                             :videoSize="100"
                             @failFile="failFile"
                             @successVideo="getVideoContent"
                >
                  <button class="upload-video btn-main  hand">
                    点击上传视频
                  </button>
                </base-upload>
              </div>

            </div>
          </div>
        </div>
        <!--视频  视频简介-->
        <div v-if="currentType === 'video'" class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            视频简介
          </div>
          <div class="edit-input-box">
            <textarea v-model="addData.videoIntroduce" class="edit-textarea edit-input" placeholder="" maxlength="60"></textarea>
            <span class="num">{{addData.videoIntroduce && addData.videoIntroduce.length || 0}}/60</span>
          </div>
        </div>
        <!--菜谱  食材清单-->
        <div v-if="currentType === 'cookbook'" class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            食材清单
          </div>
          <div class="edit-input-box">
            <textarea v-model="addData.foodList" class="edit-textarea edit-input"
                      placeholder="例子：大蒜，酱油，猪肉，食材之间用逗号隔开，最多输入50个字符"
                      maxlength="100"
            ></textarea>
            <span class="num">{{addData.foodList && addData.foodList.length || 0}}/100</span>
          </div>
        </div>
        <!--文章/菜谱 内容详情-->
        <div v-if="currentType!=='video'" class="edit-item">
          <div class="edit-title">
            <span class="start">*</span>
            内容详情
          </div>
          <div class="edit-input-box add-cont-type-box">
            <div class="add-cont-type-item hand" @click="addTextItem">
              <div class="icon icon-text"></div>
              <div>文本</div>
            </div>
            <div class="add-cont-type-item  hand">
              <base-upload fileType="image-custom" @getPic="addImageItem">
                <div class="add-cont-type-item">
                  <div class="icon icon-img"></div>
                  <div>图片</div>
                </div>
              </base-upload>
            </div>
            <div class="add-cont-type-item hand">
              <base-upload fileType="video-custom" @successVideo="addVideoItem">
                <div class="add-cont-type-item hand">
                  <div class="icon icon-video"></div>
                  <div>视频</div>
                </div>
              </base-upload>
            </div>
          </div>
        </div>
        <draggable v-if="currentType!=='video' && addData.details.length" ref="detailsContent" v-model="addData.details" class="content-details">
          <transition-group>
            <div v-for="(item, idx) in addData.details" :key="idx" class="content-item">
              <div class="close-icon hand" @click="deleteContentItem(idx,item)"></div>
              <img v-if="item.type==='image'" :src="item.value" class="conten-image">
              <video v-else-if="item.type==='video'" :src="item.value" class="conten-video"></video>
              <textarea v-else v-model="item.value" class="edit-textarea edit-input" placeholder="输入文字">
              </textarea>
            </div>
          </transition-group>
        </draggable>
        <!-- 其他设置 -->
        <div class="edit-item  other-edit-item">
          <div class="edit-title">
            其他设置
          </div>
          <div class="edit-input-box">
            <div class="edit-input-item">
              <div class="edit-title">
                初始点赞人数
              </div>
              <input v-model="addData.goodCount"
                     type="number"
                     placeholder=""
                     class="edit-input"
              >
            </div>
            <div class="edit-input-item look-item">
              <div class="edit-title">
                初始浏览人数
              </div>
              <input v-model="addData.lookCount"
                     type="number"
                     placeholder=""
                     class="edit-input"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="back">
      <template v-if="!id">
        <div class="back-cancel back-btn hand" @click="_submitBtn('addDraft',0)">存为草稿</div>
        <div class="back-btn back-submit hand" @click="_submitBtn('addContent',1)">上线</div>
      </template>
      <template v-else>
        <div class="back-btn back-cancel hand" @click="_submitBtn('editContetnArticle',0)">存为草稿</div>
        <div class="back-btn back-submit hand" @click="_submitBtn('editContetnArticle',1)">上线</div>
      </template>
    </div>
    <default-modal ref="addCategory">
      <div slot="content" class="shade-box add-category-box">
        <div class="title-box">
          <div class="title">
            增加分类
          </div>
          <span class="close hand" @click="$refs.addCategory.hideModal()"></span>
        </div>
        <div>
          <input v-model="addCategoryText" placeholder="长度不能超过6个字" maxlength="6" type="text" class="edit-input add-category-input">
        </div>
        <div class="back">
          <div class="back-cancel back-btn hand" @click="$refs.addCategory.hideModal()">取消</div>
          <div class="back-btn back-submit hand" @click="_submitCategory">确定</div>
        </div>
      </div>
    </default-modal>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultModal from '@components/default-modal/default-modal'
  import PhoneBox from './phone-box/phone-box'
  import API from '@api'
  import Draggable from 'vuedraggable'
  import ZbDropdown from '@components/zb-dropdown/zb-dropdown'

  const PAGE_NAME = 'ARTICLE_ADD'
  const TITLE = '创作文章'

  const ARTICLE = 'common'
  const VIDEO = 'video'
  const COOKBOOK = 'cookbook'

  export default {
    name: PAGE_NAME,
    components: {
      DefaultModal,
      PhoneBox,
      Draggable,
      ZbDropdown
    },
    page: {
      title: TITLE
    },
    data() {
      return {
        isCanSelectMore: true,
        typeList: {
          [ARTICLE]: {
            name: '文章'
          },
          [VIDEO]: {
            name: '视频'
          },
          [COOKBOOK]: {
            name: '菜谱'
          }
        }, // 三种创作
        currentType: 'common', // 现在创作类型
        addCategoryText: "",
        addData: {
          likes: [],
          category: '',
          title: '',
          coverImage: {
            url: '',
            id: ''
          },
          coverVideo: {
            url: '',
            id: '',
            file_id: ''
          },
          authPhoto: {
            url: '',
            id: ''
          },
          authName: '',
          authSignature: '',
          goodCount: 30,
          lookCount: 50,
          // 不同情况的字段
          videoContent: {
            url: '',
            id: '',
            name: ''
          },
          videoIntroduce: "",
          foodList: '',
          // 内容详情
          details: [],
        },
        articleCategoryList: [],// 内容分类列表
      }
    },
    computed: {
      isShowEmpty() {
        return !(this.addData.title || this.addData.coverImage.id
          || this.addData.authPhoto.id || this.addData.authName
          || ((this.addData.videoContent.id || this.addData.videoIntroduce) && this.currentType === 'video')
          || (this.currentType === 'cookbook' && this.addData.foodList)
          || (this.currentType !== 'video' && this.addData.details.length))
      },
      name() {
        return this.typeList[this.currentType] && this.typeList[this.currentType].name || '文章'
      },
      editName() {
        return this.id ? '编辑' : '创作'
      }
    },
    async created() {
      this._getArticleCategory()
      this.currentType = this.$route.query.type
      this.id = this.$route.query.id || ''
      if (this.id) {
        this.$route.meta.params && this.changeDetialData(this.$route.meta.params)
      } else {
        this._getAuth()
      }
    },
    methods: {
      // 新增创建时获取最后一次作者信息
      _getAuth() {
        API.Content.getAuth().then(res => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
          }
          this.addData.authPhoto.url = res.data.head_image_url
          this.addData.authPhoto.id = res.data.head_image_id
          this.addData.authName = res.data.nickname
          this.addData.authSignature = res.data.sign
        }).finally(() => {
          this.$loading.hide()
        })
      },
      // 转换详情数据
      changeDetialData(obj) {
        this.currentType = obj.type || 'common'
        this.addData.title = obj.title
        this.addData.category = obj.category.id
        this.addData.coverImage.url = obj.cover_image.source_url
        this.addData.coverImage.id = obj.cover_image.id
        this.addData.coverVideo.url = obj.cover_video.full_url || ''
        this.addData.coverVideo.id = obj.cover_video.id || ''
        this.addData.authPhoto.url = obj.author.head_image_url
        this.addData.authPhoto.id = obj.author.head_image_id
        this.addData.authName = obj.author.nickname
        this.addData.authSignature = obj.author.sign
        this.addData.goodCount = obj.init_fabulous_num || 0
        this.addData.lookCount = obj.init_browse_num || 0
        obj.assembly.forEach(item => {
          if (item.type === 'combination' && item.style_type === 'content') {
            let details = []
            item.content.map(cont => {
              if (!(cont.content && cont.content.length)) return false
              let contItem = cont.content[0]

              /* eslint-disable */
              switch (cont.type) {
                case "image":
                  details.push({
                    type: 'image',
                    value: contItem.image.source_url,
                    id: contItem.image.id
                  })
                  break
                case "video":
                  details.push({
                    type: 'video',
                    value: contItem.video.full_url,
                    id: contItem.video.id
                  })
                  break
                case "text":
                  details.push({
                    type: 'text',
                    value: contItem.text,
                  })
                  break
              }
            })
            this.addData.details = details
          }
          if (item.type === 'text' && item.style_type === 'content_cookbook_food_list') {
            this.addData.foodList = item.content[0].text
          }
          if (item.type === 'video' && item.style_type === 'content_video') {
            this.addData.videoContent.url = item.content[0].video.full_url
            this.addData.videoContent.name = item.content[0].video.name
            this.addData.videoContent.id = item.content[0].video.id
            this.addData.videoIntroduce = item.content[0].introduction
          }
        })
      },
      // 获取内容分类列表
      _getArticleCategory() {
        API.Content.getSortList().then(res => {
          if (res.error !== this.$ERR_OK) this.$toast.show(res.message)
          this.articleCategoryList = res.data
        }).finally(() => {
          this.$loading.hide()
        })
      },
      addCategory() {
        this.addCategoryText = ''
        this.$refs.addCategory.showModal()
      },
      _submitCategory() {
        API.Content.addSort({name: this.addCategoryText}).then(res => {
          if (res.error !== this.$ERR_OK) {
            this.$toast.show(res.message)
          }
          this.$toast.show(res.message)
          this.$refs.addCategory.hideModal()
        }).finally(() => {
          this.$loading.hide()
        })
      },
      // 封面
      getCoverVideo(video) {
        this.addData.coverVideo.id = video.id
        this.addData.coverVideo.file_id = video.file_id
        this.addData.coverVideo.url = video.full_url
        this.addData.coverImage.id = video.cover_image_id
        this.addData.coverImage.url = video.full_cover_url
        if (!this.addData.coverImage.id) {
          setTimeout(() => {
            this._getCoverImage(video.file_id)
          }, 10000)
        }
      },
      _getCoverImage() {
        this.addData.coverVideo.file_id && API.Content.getCoverImage({file_id: this.addData.coverVideo.file_id}).then(res => {
          if (res.error !== this.$ERR_OK) return false
          this.addData.coverImage.id = res.data.cover_image_id
          this.addData.coverImage.url = res.data.full_cover_url
        })
      },
      getPic(image) {
        this.addData.coverImage.url = image.url
        this.addData.coverImage.id = image.id
      },
      delPic() {
        this.addData.coverImage = {
          url: '',
          id: ''
        }
        this.addData.coverVideo = {
          url: '',
          id: ''
        }
      },
      failFile(msg) {
        this.$toast.show(msg)
      },
      // 作者头像
      getAuthorPic(image) {
        this.addData.authPhoto.url = image.url
        this.addData.authPhoto.id = image.id
      },
      delAuthorPic() {
        this.addData.authPhoto.url = ''
        this.addData.authPhoto.id = ''
      },
      // 视频内容
      getVideoContent(video) {
        this.addData.videoContent.url = video.full_url
        this.addData.videoContent.id = video.id
        this.addData.videoContent.name = video.name
      },
      deleteVideoContent() {
        this.addData.videoContent = {
          url: '',
          id: '',
          name: ''
        }
      },
      // 内容详情增加
      addDetailContentItem(item) {
        this.addData.details.push(item)
        if (!this.id) {
          this.$nextTick(function () {
            let el = this.$refs.detailsContent.$el
            el.scrollTop = el.scrollHeight
          })
        }
      },
      addTextItem() {
        this.addDetailContentItem({
          type: 'text',
          value: ''
        })
      },
      addImageItem(image) {
        this.addDetailContentItem({
          type: 'image',
          value: image.url,
          id: image.id
        })
      },
      addVideoItem(video) {
        this.addDetailContentItem({
          type: 'video',
          value: video.full_url,
          id: video.id
        })
      },
      deleteContentItem(idx, item) {
        this.addData.details.splice(idx, 1)
        if (item.type === 'goods') {
          let index = this.addData.goodsList.findIndex(goods => goods.id === item.value.id)
          if (index !== -1) this.addData.goodsList.splice(index, 1)
        }
      },
      justifyConent() {
        let message = ''
        if (!this.addData.category) message = '请选择内容分类'
        else if (!this.addData.title) message = '请输入文章标题'
        else if (this.addData.title && (this.addData.title.length < 5 || this.addData.title.length > 50)) message = '请输入文章标题最少5个最多50个字符'
        else if (!this.addData.coverImage.id) message = '请上传封面'
        else if (!this.addData.authPhoto.id) message = '请上传作者头像'
        else if (!this.addData.authName) message = '请填写作者名字'
        else if (this.currentType === 'video') {
          if (!this.addData.videoContent.id) message = '请上传视频内容'
          else if (!this.addData.videoIntroduce) message = '请填写视频简介'
        } else if (this.currentType === 'cookbook' && !this.addData.foodList) message = '请填写食材清单'
        else if (this.currentType !== 'video' && !this.addData.details.length) message = '请编辑内容详情'
        else if (this.addData.goodCount > this.addData.lookCount) message = '初始化点赞数不能大于初始化浏览数'
        else if (!(/^[+]{0,1}(\d+)$/.test(this.addData.goodCount)))  message = '请输入正确的初始化点赞数'
        else if (!(/^[+]{0,1}(\d+)$/.test(this.addData.lookCount)))  message = '请输入正确的初始化浏览数'
        if (message) {
          this.$toast.show(message)
          return false
        } else {
          return true
        }
      },
      justifyDraft() {
        let message = ''
        if (!this.addData.title) message = '请输入文章标题'
        if (message) {
          this.$toast.show(message)
          return false
        } else {
          return true
        }
      },
      // 上线 草稿 保存
      async _submitBtn(name, status) {
        console.log(name, status)
        let res = status ? this.justifyConent() : this.justifyDraft()
        if (res) {
          let data = this.getSubmitData(status)
          let res = await API.Content[name](data, true)
          this.$toast.show(res.message)
          this.$loading.hide()
          if (res.error === this.$ERR_OK) this.$router.go(-1)
        }
      },
      getSubmitData(status) {
        let params = {
          type: this.currentType,
          title: this.addData.title,
          category_id: this.addData.category,
          author_image_id: this.addData.authPhoto.id,
          author_nickname: this.addData.authName,
          author_sign: this.addData.authSignature,
          image_cover_id: this.addData.coverImage.id,
          video_cover_id: this.addData.coverVideo.id,
          init_fabulous_num: this.addData.goodCount,
          init_browse_num: this.addData.lookCount,
          assembly: [],
          status
        }
        if (this.currentType === 'video' || this.currentType === 'cookbook') {
          if (this.currentType === 'video') {
            params.assembly.push({
              type: "video",
              style_type: "content_video",
              content: [{
                video_id: this.addData.videoContent.id,
                title: this.addData.videoContent.name,
                introduction: this.addData.videoIntroduce
              }]
            })
          } else if (this.currentType === 'cookbook') {
            params.assembly.push({
              type: "text",
              style_type: "content_cookbook_food_list",
              content: [{
                text: this.addData.foodList
              }]
            })
          }
        }
        if (this.currentType !== 'video') {
          let contents = this.addData.details.map(item => {
            let newItem = {
              type: item.type,
              style_type: 'content_' + item.type
            }
            /* eslint-disable */
            switch (item.type) {
              case 'goods':
                newItem.content = [{
                  goods_id: item.value.goods_id,
                  goods_sku_id: item.value.goods_sku_id
                }]
                break;
              case 'image':
                newItem.content = [{
                  image_id: item.id
                }]
                break;
              case 'video':
                newItem.content = [{
                  video_id: item.id,
                  title: '',
                  introduction: ''
                }]
                break;
              default:
                newItem.content = [{
                  text: item.value
                }]
            }
            return newItem
          })
          params.assembly.push({
            type: "combination",
            style_type: "content",
            content: contents
          })
        }
        if (this.id) params.id = this.id
        return params
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .add-category-operate
    color: #4D77BD
    text-decoration underline
    height: 40px
    line-height: 40px
    margin-left: 20px

  /*输入框*/
  .edit-input
    font-size: $font-size-14
    padding: 0 14px
    border-radius: 2px
    height: 40px
    display: flex
    align-items: center
    justify-content: space-between
    border: 1px solid $color-line
    transition: all 0.3s

    &:hover
      border-color: #ACACAC

    &:focus
      border-color: $color-main

  .flex-box
    display flex
    align-items center

  /* 编辑每一行样式*/
  .edit-item
    display: flex
    color: #2A2A2A
    margin-top: 30px
    position: relative

    &.other-edit-item
    .edit-input
      width: 240px

    .edit-title
      margin-top: 7.5px
      font-size: $font-size-14
      font-family: $font-family-regular
      white-space: nowrap
      min-width: 64px
      text-align: right

    .start
      display: inline-block
      margin-right: -2px
      color: #F52424

    .edit-input-box
      margin: 0 0px 0 40px
      position: relative

      .edit-input.title-input
        width: 400px

      .edit-input-item
        display flex

        .edit-title
          text-align left
          min-width: 105px

      .look-item
        margin-top 20px
        margin-bottom: 60px

      &.author-info-box
        flex: 1
        background: #F5F7FA
        padding: 20px 20px 20px 20px

        .auto-input
          margin-left: 20px

          .edit-input
            width: 670px

          .edit-signature
            margin-top: 10px


      .edit-textarea
        padding: 5px 14px
        height: 94px
        resize: none
        width: 800px
        resize: none

      .num
        position: absolute
        right: 10px
        bottom: 10px
        font-size: $font-size-12
        font-family: $font-family-regular
        color: $color-text-assist


      .video-wrap
        width: 265px
        height: 140px
        border-radius 4px
        position: relative
        object-fit: fill

        .delete-icon
          position: absolute
          top: 0
          right: 0
          width: 18px
          height: @width
          icon-image(icon-delete_img)

      .video-content-wrap
        padding: 12px
        width: 265px
        height: 140px
        display flex
        flex-direction column
        justify-content space-around
        align-items center
        background: #FAFAFA
        border-1px(#D3D8DC, 4px, dashed)

        .video-tip
          width: 100%
          padding: 0px 14px 20px
          flex: 1
          icon-image(pic-video_select)
          background-origin content-box
          background-repeat no-repeat

        .upload-video-wrap
          &:hover  .upload-video
            color: #ffffff
            background: #4D77BD
            cursor pointer

        .upload-video
          border-radius: 2px
          height: 28px
          padding: 0px 10px
          color: #4D77BD
          border-color #4D77BD

          &.btn-main:hover
            background #4D77BD
            color: #fff

  /* 布局*/
  .advertisement
    flex: 1

    .wrap-container
      display: flex
      font-family: $font-family-regular

      .edite-right-box
        flex: 1

      .tip
        font-size: $font-size-14
        font-family: $font-family-regular
        color: $color-text-assist
        margin-left: 14px

      /* 内容详情*/

      .add-cont-type-box
        display flex
        flex: 1
        border-1px()

        .add-cont-type-item
          height 46px
          border-right-1px()
          width: 92px
          display flex
          align-items center
          justify-content center

          .icon
            width: 20px
            height: 18px
            margin-right: 5px

          .icon-text
            icon-image(icon-text_normal)

          .icon-img
            icon-image(icon-picture_normal)

          .icon-video
            icon-image(icon-vedio_normal)

          .icon-goods
            icon-image(icon-commodity_normal)

          &:hover
            color: $color-main

            .icon-text
              icon-image(icon-text_hover)

            .icon-img
              icon-image(icon-picture_hover)

            .icon-video
              icon-image(icon-vedio_hover)

            .icon-goods
              icon-image(icon-commodity_hover)


      .content-details
        background: #F5F7FA
        border-radius: 2px
        padding: 20px
        margin-top: 20px
        margin-left: 104px
        max-height: 600px
        overflow auto

        .content-item
          border-1px(#D3D8DC)
          border-radius: 2px
          background: #fff
          height: 140px
          position relative
          margin-bottom: 20px
          padding: 14px

          .good-item
            height: 112px
            display flex

            .goods-photo
              width: 112px
              height: @width

            .info
              margin-left: 14px
              flex: 1
              display flex
              flex-direction column
              justify-content space-around

            .name
              font-family $font-family-medium
              font-size: $font-size-16
              color: #111111
              overflow hidden
              text-overflow ellipsis
              white-space: nowrap

            .details
              font-family $font-family-regular
              font-size: $font-size-14
              color: #808080
              margin: 0px 0px 5px
              overflow hidden
              text-overflow ellipsis
              white-space: nowrap

            .price-now
              color: #FA7500
              font-size: 32px
              font-family $font-family-medium

              .small
                font-size: $font-size-20

                .unit
                  font-family $font-family-regular

            .price
              color: #B7B7B7
              font-size: $font-size-30
              font-family $font-family-regular
              text-decoration-line line-through
              margin-left 6px

          .conten-video
          .conten-image
            width: 112px
            height @width
            border-radius 2px

          .edit-textarea
            border-width: 0px
            padding: 0px
            scroll-opacity(5px, 100px)
            height: 100%
            width: 100%
            resize: none

          &:last-child
            margin-bottom: 0px

          .close-icon
            width: 12px
            height: @width
            icon-image(icon-close_content)
            position absolute
            right: 10px
            top: 10px


  //  商品弹窗
  .shade-box
    box-shadow: 0 0 5px 0 rgba(12, 6, 14, 0.60)
    border-radius: 2px
    background: $color-white
    position: relative
    overflow-x: hidden
    overflow-y: auto
    flex-wrap: wrap
    padding: 0 20px
    box-sizing: border-box

    &.add-category-box
      width: 380px
      height: 213px

      .add-category-input
        width: 340px
        margin-top: 7px

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

    .back
      position: absolute
      left: 0
      right: 0
      bottom: 0
      background: $color-white
      justify-content: flex-end
      border-none()

    .page-box
      padding: 0 20px
      box-sizing: border-box
      height: 77px
      align-items: center
      display: flex


</style>
