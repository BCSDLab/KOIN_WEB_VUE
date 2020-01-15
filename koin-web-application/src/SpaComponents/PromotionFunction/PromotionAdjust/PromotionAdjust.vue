<template>
  <div class="promotion--adjust">
    <promotion-header
      v-if="!mobileFlag"
      @click="$router.push('/board/promotion')">
      <button
        class="promotion__button promotion__button--home"
        @click="goHome">
        목록으로
      </button>
    </promotion-header>

    <div class="promotion__info">
      <div class="promotion__title">
        <div class="promotion__store">
          <label
            v-if="!mobileFlag"
            for="store"
            class="promotion__label">
            상점 선택
          </label>
          <div
            id="store"
            :class="{'promotion__dropdown': true, 'promotion__dropdown--active': dropdownActive}">
            <div class="promotion__dropdown__list">
              <a
                :class="{'promotion__dropdown__item': true, 'promotion__dropdown__item--active': store.shop_id === storeId}"
                v-for="(store, index) in storeList"
                :key="store.name"
                @click="clickStore(index)">
                {{ store.name | shortenString }}
              </a>
            </div>

            <button
              class="promotion__dropdown__button"
              @click="dropdownActive = !dropdownActive">
              <img
                class="promotion__dropdown__image"
                src="https://static.koreatech.in/assets/img/ic_store%403x.png"
                alt="store">
              {{ storeId | filterStore(storeList) | shortenString }}
            </button>
          </div>
        </div>

        <input
          class="promotion__input promotion__input--title"
          type="text"
          placeholder="제목을 입력해주세요. (20자 이내)"
          :value="title"
          @input="title = $event.target.value">
      </div>

      <div class="promotion__summary">
        <label
          v-if="!mobileFlag"
          for="summary"
          class="promotion__label">
          홍보 문구
        </label>

        <div class="promotion__field">
          <input
            id="summary"
            class="promotion__input promotion__input--summary"
            type="text"
            placeholder="홍보문구를 입력해주세요. (50자 이내)"
            :value="summary"
            @input="summary = $event.target.value">
          <promotion-popup-button>
            <div class="popup__title">제목과 홍보문구는 자유게시판 상단의 배너에 들어가게 됩니다.</div>
            예시)
            <br/>
            <span>제목 : </span>옛날통닭 시험기간 50% 할인 이벤트!
            <br/>
            <span>홍보 문구 : </span>시험기간에 지친 한기대 학생들을 위해 준비한 특별 이벤트! 높치면 후회합니다 지금바로 시키세요 ~^^
            <br/>
            <span>행사 기간 : </span>11월 7일 ~ 22일
            <img
              class="popup__image"
              :src="imageSource"/>
          </promotion-popup-button>
        </div>
      </div>

      <div class="promotion__dates">
        <label
          v-if="!mobileFlag"
          for="store"
          class="promotion__label">
          행사기간
        </label>
        <date-picker
          v-if="startDate.length !== 0"
          v-model="startDate"
          :mobile="mobileFlag"
          @activate="dropdownActive = false"/>
        ~
        <date-picker
          v-if="endDate.length !== 0"
          v-model="endDate"
          :start-date="startDate"
          :mobile="mobileFlag"
          @activate="dropdownActive = false"/>
      </div>

      <div
        v-if="!mobileFlag"
        class="promotion__author">
        <div class="promotion__label">
          닉네임
        </div>
        <div class="promotion__nickname">
          {{ nickname }}
        </div>
      </div>

      <div
        class="promotion__warning"
        v-if="!(mobileFlag && content)">
        계정 당 하나의 게시물을 작성하여 업데이트, 수정 할 수 있습니다.
        <div class="promotion__badge">!</div>
      </div>
    </div>

    <div class="promotion__content">
      <vue-editor
        id="editor"
        class="promotion__editor"
        v-model="content"
        :editor-options="editorOption"
        use-custom-image-handler
        @imageAdded="imageUpload"/>
    </div>

    <div class="promotion__footer">
      <button
        class="promotion__button promotion__button--cancel"
        @click="$router.go(-1)">
        취소
      </button>
      <button
        class="promotion__button promotion__button--update"
        @click="submitPromotion">
        {{ componentType }}
      </button>
      <button
        v-if="!mobileFlag"
        class="promotion__button promotion__button--home"
        @click="goHome">
        목록으로
      </button>
    </div>
  </div>
</template>

<script>
  import PromotionHeader from "../PromotionSharedComponent/PromotionHeader";
  import {VueEditor} from "vue2-editor";
  import PromotionPopupButton from "./PromotionAdjustComponent/PromotionPopupButton";
  import PromotionDatePicker from "./PromotionAdjustComponent/PromotionDatePicker";
  import * as api from "../../../api/api";

  export default {
    name: 'PromotionAdjust',
    components: {
      'promotion-header': PromotionHeader,
      'promotion-popup-button': PromotionPopupButton,
      'date-picker': PromotionDatePicker,
      'vue-editor': VueEditor
    },
    data() {
      return {
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'header': [1, 2, 3, 4, 5, 6, false]}],
              [{'color': []}, {'background': []}],
              ['image', 'video']
            ],
            syntax: {
              highlight: text => hljs.highlightAuto(text).value
            }
          }
        },
        title: '',
        summary: '',
        content: '',
        storeId: null,
        nickname: '닉네임',
        storeList: [],
        startDate: '',
        endDate: '',
        mobileFlag: false,
        dropdownActive: false,
        componentType: '등록',
        urlR: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,256}\b(\/?[-a-zA-Z0-9@:;|_\+.~#%?&//=]*)?/gi
      }
    },
    computed: {
      imageSource () {
        return this.mobileFlag ? "https://static.koreatech.in/assets/img/ic_mobile-store.png" : "https://static.koreatech.in/assets/img/ic_pc-store.png"
      }
    },
    methods: {
      imageUpload(file, Editor, cursorLocation, resetUploader) {
        let formData = new FormData();
        formData.append('image[]', file);

        api.uploadImage(this.$session.get("token"), formData)
          .catch((error) => {
            alert("이미지의 크기가 너무 큽니다.");
            return;
          }).then(res => {
          Editor.insertEmbed(cursorLocation, 'image', res.data.url[0]);
          resetUploader();
        })
      },
      goHome () {
        this.$router.push('/board/promotion')
      },
      clickStore (index) {
        this.storeId = this.storeList[index].shop_id;
        this.dropdownActive = false;
      },
      submitPromotion () {
        if (this.title === "" || this.content === "") {
          alert("제목이나 내용을 채워주세요");
          return;
        }
        if (this.title.length > 20) {
          alert(`제목 길이는 최대 20자 입니다. 지금 제목의 길이는 ${this.title.length}자 입니다.`);
          return;
        }
        if (this.summary.length > 50) {
          alert(`홍보 문구 길이는 최대 50자 입니다. 지금 제목의 길이는 ${this.summary.length}자 입니다.`);
          return;
        }
        if (this.content.replace(this.tagFilter, "").length > 10000) {
          alert(`내용 길이는 최대 10,000자 입니다. 지금 내용의 길이는 ${this.content.replace(this.tagFilter, "").length}자 입니다.`);
          return;
        }
        if (this.storeId === null) {
          alert("상점이 선택되지 않았습니다. 상점을 선택해주세요.");
          return;
        }
        let today = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).getTime();
        let startDate = new Date(this.startDate);
        let startTime = startDate.getTime();
        startDate.setMonth(startDate.getMonth() + 1);
        let limitTime = startDate.getTime();
        let endTime = (new Date(this.endDate)).getTime();
        if (endTime <= startTime) {
          alert("시작 일자는 종료 일자보다 앞서야 합니다.");
          return;
        }
        if (endTime >= limitTime) {
          alert("최대 홍보 기간은 한 달입니다.");
        }
        if (endTime <= today) {
          alert("종료 일자는 오늘 이후여야 합니다.");
          return;
        }

        let link = this.content.match(this.urlR)
        console.log(link)
        let payload = {
          title: this.title,
          summary: this.summary,
          content: this.content,
          shopId: this.storeId,
          startDate: this.startDate,
          endDate: this.endDate,
          token: this.$session.get("token"),
          specificPromotionId: this.$session.get("specificPromotionId"),
        };
        if (link !== null) {
          payload.thumbnail = link.find(
            value => value.indexOf('static.koreatech') !== -1 &&
              (value.indexOf('.png') !== -1 || value.indexOf('.jpg') !== -1 || value.indexOf('.jpeg') !== -1 ||
                value.indexOf('.gif') !== -1 || value.indexOf('.bmp') !== -1 || value.indexOf('.raw') !== -1 || value.indexOf('.svg') !== -1 ||
                value.indexOf('.PNG') !== -1 || value.indexOf('.JPG') !== -1 || value.indexOf('.JPEG') !== -1 ||
                value.indexOf('.GIF') !== -1 || value.indexOf('.BMP') !== -1 || value.indexOf('.RAW') !== -1 || value.indexOf('.SVG') !== -1)
          )
        }
        console.log("payload : ", payload);

        this.$store.dispatch((this.componentType === '등록' ? 'register' : 'adjust') + 'Promotion', payload)
          .then((res) => {
          alert(`${this.componentType}되었습니다.`);
          this.$router.push("/board/promotion/" + res.data.id);
          })
        .catch(
          (error) => {
            if (error.response.status === 412) {
              alert("이미 진행중인 이벤트가 있습니다.")
            } else {
              alert("네트워크를 확인해 주세요");
            }
          }
        )
      }
    },
    destroyed () {
      window.removeEventListener('resize', () => {
        this.mobileFlag = window.innerWidth < 576;
      })
    },
    filters: {
      filterStore (id, storeList) {
        if ((id === null || id === '') || storeList.length === 0) {
          return ''
        } else {
          let store = storeList.find(
            value => value.shop_id === id
          )
          return  store ? store.name : '없음'
        }
      },
      shortenString (string) {
        if (string.length > 7) {
          return string.slice(0, 7) + '..'
        }
        return string
      }
    },
    created() {
      if(this.$session.get('userInfo').identity !== 4) {
        alert('점주가 아니면 게시물을 쓸 수 없습니다.');
        this.$router.go(-1)
      }

      this.mobileFlag = window.innerWidth < 576;
      window.addEventListener('resize', () => {
        this.mobileFlag = window.innerWidth < 576;
      });

      if(this.$route.path.split('/')[3] === 'register') {
        this.componentType = '등록'
        let today = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000);
        console.log('register')
        this.nickname = this.$session.get('userInfo').nickname;
        this.startDate = today.toISOString().slice(0, 10).replace(/-/g, '.');
        today.setDate(today.getDate() + 3);
        this.endDate = today.toISOString().slice(0, 10).replace(/-/g, '.');

        this.$store.dispatch('setMyStore',this.$session.get("token"))
          .then( data => {
              this.storeList = data.shops
            }
          )
      } else {
        this.componentType = '수정'
        console.log('adjust')
        if (this.$session.get("specificPromotionId") === undefined || this.$session.get("nowPromotionId") === null) {
          alert("선택된 글이 없습니다.")
          this.$router.push("/board/promotion")
          return
        }
        this.$store.dispatch('grantCheckPromotion', {
          "token": this.$session.get("token"),
          "articleId": this.$session.get("specificPromotionId"),
        }).then(async () => {
          await this.$store.dispatch('setMyStore',this.$session.get("token"))
            .then( data => {
              this.storeList = data.shops
              }
            )
          await this.$store.dispatch("setSpecificPromotion", {
            articleId: this.$session.get("specificPromotionId"),
            token: this.$session.get("token")
          }).then(data => {
            this.title = data.title;
            this.summary = data.event_title;
            this.storeId = data.shop_id;
            this.nickname = data.nickname;
            this.startDate = data.start_date;
            this.endDate = data.end_date;
            this.content = data.content;
            console.log('Setting Done.')
            console.log(this.startDate, this.endDate)
          })
        }, () => {
          alert("잘못된 접근입니다. 게시글 상세보기에서 수정을 눌러주세요.")
          this.$router.push("/market/sell");
        });
      }
    }
  }
</script>

<style scoped>
  .promotion--adjust {
    float: left;
    margin: 0 40px 161px 0;
    width: 834px;
  }

  .promotion--adjust .promotion__info {
    border-bottom: 1px solid #175c8e;
    padding: 14px 10px;
  }
  .promotion__title {
    display: flex;
    flex-direction: row;
  }

  .promotion__input {
    border: 0;
    font-family: NanumBarunGothic, serif;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    color: #252525;
  }
  .promotion__input::placeholder {
    color: #bec9d5;
    letter-spacing: -1px;
  }
  .promotion__input.promotion__input--title {
    font-size: 20px;
    width: 610px;
    height: 30px;
  }
  .promotion__input.promotion__input--summary {
    height: 26px;
    padding-left: 10px;
    font-size: 14px;
    flex: auto;
  }

  .promotion__store {
    width: 225px;
    height: 30px;
    order: 2;
    display: flex;
  }

  .promotion__label {
    font-family: NanumBarunGothic, serif;
    font-size: 14px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 2;
    letter-spacing: normal;
    text-align: left;
    color: #175c8e;
    flex: none;
  }
  .promotion__store .promotion__label {
    margin-right: 21px;
  }
  .promotion__summary .promotion__label {
    margin-right: 13px;
  }
  .promotion__dates .promotion__label {
    margin-right: 7px;
  }
  .promotion__author .promotion__label {
    margin-right: 32px;
    font-weight: normal;
    line-height: normal;
  }

  .promotion__dropdown {
    width: 149px;
    height: 30px;
    border-radius: 0;
    position: relative;
    display: flex;
    flex: none;
  }
  .promotion__dropdown::after {
    background-image:  url(https://static.koreatech.in/assets/img/ic_arrow%403x.png);
    background-size: 12px 12px;
    background-repeat: no-repeat;
    display: inline-block;
    width: 12px;
    height: 12px;
    position: absolute;
    top: 9px;
    right: 13px;
    content: "";
  }
  .promotion__dropdown__button {
    background-color: transparent;
    width: 100%;
    height: 100%;
    padding: 5px 25px 5px 11px;
    border: solid 1px #175c8e;
    font-family: SegoeUI;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: #252525;
    cursor: pointer;
  }
  .promotion__dropdown__list {
    border: 1px solid #175c8e;
    width: 147px;
    position: absolute;
    background-color: white;
    display: none;
    z-index: 1;
    max-height: 116px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .promotion__dropdown--active > .promotion__dropdown__list {
    display: block;
  }
  .promotion__dropdown__item {
    width: 111px;
    padding: 5px 25px 5px 11px;
    height: 18px;
    text-align: left;
    color: #252525;
    display: block;
    cursor: pointer;
  }
  .promotion__dropdown__item:hover,
  .promotion__dropdown__item.promotion__dropdown__item--active {
    color: #f7941e;
  }
  .promotion__dropdown__image {
    display: none;
  }

  .promotion__field {
    width: 763px;
    height: 28px;
    flex: none;
    border: 1px solid #175c8e;
    display: flex;
  }
  .popup__title {
    font-family: NanumBarunGothic;
    font-size: 13px;
    line-height: 1.46;
    letter-spacing: normal;
    text-align: left;
    color: #252525;
    margin-bottom: 13px;
  }

  .promotion__content {
    text-align: left;
    padding: 20px 5px 36px;
    font-family: NanumBarunGothic, serif;
    font-size: 15px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.73;
    letter-spacing: -0.8px;
    color: #555555;
    border-bottom: 1px solid #175c8e;
    overflow-x: scroll;
    overflow-y: hidden;
    -ms-overflow-style: none;
    height: 472px;
  }
  .promotion__editor {
    height: 425px;
  }

  .promotion__summary {
    margin-top: 20px;
    height: 30px;
    display: flex;
  }
  .promotion__dates {
    margin-top: 20px;
    height: 30px;
    display: flex;
    line-height: 2;
  }
  .promotion__author {
    margin-top: 20px;
    height: 15px;
    display: flex;
  }
  .promotion__warning {
    margin-top: 2px;
    opacity: 0.5;
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    line-height: 1.15;
    letter-spacing: normal;
    text-align: right;
    color: #f7941e;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
  }

  .promotion__badge {
    margin-right: 8px;
    width: 13px;
    height: 13px;
    border: 1px solid #f7941e;
    border-radius: 7px;
    font-family: SegoeUI;
    font-weight: 600;
    font-size: 11px;
    text-align: center;
    text-indent: 1px;
  }

  .promotion__nickname {
    opacity: 0.6;
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.15;
    letter-spacing: normal;
    text-align: left;
    color: #858585;
  }

  .promotion__footer {
    margin-top: 38px;
    display: flex;
    justify-content: center;
    position: relative;
  }
  .promotion__button {
    font-size: 13px;
    letter-spacing: -0.7px;
    color: white;
    background: #175c8e;
    margin: 0 5px;
    padding: 0;
    width: 74px;
    height: 30px;
    cursor: pointer;
    border: 1px solid #175c8e;
    flex: none;
  }
  .promotion__button.promotion__button--cancel {
    background: #909090;
    border: 1px solid #909090;
    flex: none;
  }
  .promotion__button.promotion__button--home {
    position: absolute;
    right: 0;
    margin: 0;
  }

  .quill-editor{
    height: 352px;
    margin-bottom: 20px;
    color: black;
    font-weight: 400;
  }

  .promotion__content::-webkit-scrollbar {
    display: none;
  }

  .mobile {
    display: none;
  }

  .popup__image {
    display: block;
    width: 100%;
    margin-top: 15px;
  }

  @media (max-width: 576px) {
    .promotion--adjust {
      margin: 0;
      width: 100%;
    }

    .promotion--adjust .promotion__info {
      border-bottom: 1px solid #e7e7e7;
      padding: 14px 0 16px;
    }
    .promotion__title {
      flex-direction: column;
      border-bottom: 1px solid #e7e7e7;
      padding: 0 16px;
    }

    .promotion__input {
      font-family: NanumSquareR;
      line-height: 1.13;
      letter-spacing: -0.8px;
    }
    .promotion__input.promotion__input--title {
      margin: 19px 0 20px;
      font-size: 16px;
      width: 100%;
      order: 2;
    }
    .promotion__input::placeholder {
      color: #e7e7e7;
    }
    .promotion__input.promotion__input--summary {
      font-size: 16px;
      height: 20px;
      padding: 0;
    }

    .promotion__store {
      width: 179px;
      order: 1;
    }

    .promotion__summary {
      padding: 0 16px 18px;
      height: 20px;
      border-bottom: 1px solid #e7e7e7;
    }
    .promotion__field {
      width: 100%;
      height: 20px;
      border: 0;
    }

    .promotion__dates {
      margin-top: 14px;
      justify-content: center;
    }

    .promotion__content {
      padding: 0;
      border: 0;
      height: auto;
    }

    .promotion__warning {
      font-size: 12px;
      position: absolute;
      top: 355px;
      width: 100%;
      text-align: center;
      justify-content: center;
      z-index: -1;
    }
    .promotion__badge {
      margin-right: 6px;
    }

    .promotion__footer {
      position: absolute;
      top: 0;
      width: 100%;
      height: 56px;
      margin: 0;
    }

    .promotion__button {
      margin: 0;
      padding: 0;
      width: auto;
      position: absolute;
      top: 14px;
      background-color: #175c8e;
      color: #ffffff;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.36;
      letter-spacing: -0.7px;
      border: 0;
    }
    .promotion__button.promotion__button--cancel {
      left: 16px;
      background-color: #175c8e;
      border: 0;
    }

    .promotion__button.promotion__button--update {
      right: 16px;
    }

    .promotion__dropdown {
      width: 179px;
    }
    .promotion__dropdown__list {
      width: 179px;
    }
    .promotion__dropdown__item {
      width: 100%;
      padding: 5px 0;
      text-align: center;
    }
    .promotion__dropdown__button {
      text-align: center;
      padding-right: 11px;
    }
    .promotion__dropdown__image {
      position: absolute;
      top: 5px;
      left: 12px;
      width: 20px;
      height: 20px;
      display: block;
    }
    .popup__image {
      width: 141px;
      margin-right: auto;
      margin-left: auto;
    }
  }

  @media (max-width: 442px) {
    .promotion__warning {
      top: 387px;
    }
  }
  @media (max-width: 360px) {
    .promotion__button.promotion__button--update {
      left: 310px;
      width: 40px;
    }
  }
</style>
