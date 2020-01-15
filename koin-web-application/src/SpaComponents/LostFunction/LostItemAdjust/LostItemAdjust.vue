<template>
  <div class="main">
    <div class="adjust">
      <div class="header">
        <div class="title">
          분실물
        </div>
        <div style="padding-top:63px">
          <button
            class="go-list"
            type="button"
            @click="goList">목록으로
          </button>
        </div>
      </div>
      <div class="form">
        <div class="board-head">
          <div class="board-title">
            <input
              type="text"
              v-model="title">
          </div>
          <div class="board-info">
            <div class="author">{{ this.$session.get('userInfo').nickname }}</div>
            <div class="createdAt">{{ setDate(created_at) }}</div>
          </div>
        </div>
        <div class="state-select">
          <p>상태 변경</p>
          <div class="checkboxs">
            <input
              type="radio"
              :checked="type === 0">
            <label @click="setType(0)">분실물 습득</label>
            <input
              type="radio"
              :checked="type === 1">
            <label @click="setType(1)">분실물 찾기</label>
          </div>
        </div>
        <div class="left-form">
          <div class="title">
            <p>
              <span v-if="type === 0">습득일</span>
              <span v-if="type === 1">분실일</span>
            </p>
            <input
              class="input-title"
              type="date"
              v-model="date">
          </div>
          <div class="price">
            <p>
              <span v-if="type === 0">습득 장소</span>
              <span v-if="type === 1">분실 장소</span>
            </p>
            <input
              class="input-price"
              type="text"
              v-model="location">
          </div>
          <div class="phone">
            <span class="title">연락처</span>
            <div class="checkboxs">
              <input
                type="radio"
                name="phone"
                :checked="phoneFlag">
              <label @click="clickPhoneFlag(true)">공개</label>
              <input
                type="radio"
                name="phone"
                :checked="!phoneFlag">
              <label @click="clickPhoneFlag(false)">비공개</label>
            </div>
            <div>
              <input
                type="text"
                class="input-phone"
                v-model="phoneNumber"
                :disabled="!phoneFlag"
                placeholder="ex)010-1234-1234">
            </div>
          </div>

        </div>
      </div>
      <div class="detail">
        <p>상세정보 입력</p>
        <vue-editor
          id="editor"
          class="editor"
          v-model="content"
          :editor-options="editorOption"
          use-custom-image-handler
          @imageAdded="imageUpload">
        </vue-editor>
      </div>
      <div class="footer">
        <button
          class="cancel-btn"
          type="button"
          @click="cancel">취소
        </button>
        <button
          class="register-btn"
          type="button"
          @click="adjustLostItem">수정
        </button>
        <button
          class="go-list"
          type="button"
          @click="goList">목록으로
        </button>
      </div>
      <div class="mobile">
        <button
          @click="cancel"
          class="mobile__cancel__button">
          취소
        </button>
        <button
          @click="adjustLostItem"
          class="mobile__update__button">
          수정
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import {store} from '../../../stores/store'
  import * as api from "../../../api/api";
  import {VueEditor, Quill} from "vue2-editor";

  export default {
    name: 'LostItemAdjust',
    components: {
      VueEditor
    },
    data() {
      return {
        title: '',
        type: '',
        content: '',
        created_at: '',
        date: '',
        location: '',
        phoneNumber: '',
        phoneFlag: '',
        tagFilter: /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig,
        VUEX_ITEM_STATE: store.state,
        editorOption: {
          placeholder: "",
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              // ['blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              // [{'size': ['small', false, 'large', 'huge']}],
              [{'header': [1, 2, 3, 4, 5, 6, false]}],
              [{'color': []}, {'background': []}],
              // [{'align': []}],
              ['image', 'video']
            ]
          }
        }
      }
    },
    computed: {
      computedSpecificItem () {
        return this.VUEX_ITEM_STATE.Lost.specificItem
      },
      editor() {
        return this.$refs.myTextEditor.quill;
      },
    },
    methods: {
      getLostItem () {
        this.$store.dispatch('getSpecificLostItem', {
          token: this.$session.get('token'),
          id: this.$session.get('specificItemId')
        })
      },

      changeTime: function (time) {
        let times = time.split(" ");
        let date = times[0].split("-");
        let tim = times[1].split(":");
        let created = new Date();
        created.setFullYear(date[0]);
        created.setMonth(date[1] - 1);
        created.setDate(date[2]);
        created.setHours(tim[0]);
        created.setMinutes(tim[1]);
        created.setSeconds(tim[2]);
        return created;
      },

      setDate: function (time) {
        let today = this.changeTime(time);
        let year = today.getFullYear();
        let month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
        let date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        return year + ". " + month + ". " + date;
      },

      cancel () {
        this.$router.go(-1);
      },

      goList () {
        this.$router.push('/lost');
      },

      adjustLostItem () {
        console.log(this.date);
        if (this.computedSpecificItem.title === '' || this.computedSpecificItem.content === '') {
          alert('제목이나 내용을 채워주세요.');
          return ;
        }

        if (this.computedSpecificItem.title.length > 255) {
          alert(`제목 길이는 최대 255자입니다. 지금 제목의 길이는 ${this.computedSpecificItem.title.length}자 입니다.`);
          return ;
        }

        if (this.computedSpecificItem.content.length > 10000) {
          alert(`내용 길이는 최대 10,000자입니다. 지금 내용의 길이는 ${this.computedSpecificItem.content.length}자 입니다.`);
          return ;
        }
        if (this.location === null || this.location === '') this.location = undefined;
        if (this.phoneNumber === null || this.phoneNumber === '') this.phoneNumber = undefined;
        if (this.date === '' || this.date === undefined) this.date = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`;
        this.$store.dispatch('adjustLostItem', {
          token: this.$session.get('token'),
          id: this.$session.get('specificItemId'),
          title: this.title,
          type: this.type,
          location: this.location,
          date: this.date,
          content: this.content,
          is_phone_open: this.phoneFlag,
          phoneNumber: this.phoneNumber
        }).then(data => {
          alert('수정되었습니다.');
          this.$router.push(`/lost/detail/${this.$session.get('specificItemId')}`);
        })
      },
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

      setType (type) {
        this.type = type;
      },

      clickPhoneFlag (flag) {
        this.phoneFlag = flag;
        if (flag) {
          if (this.$session.get("userInfo").phone_number === null || this.$session.get("userInfo").phone_number === undefined || this.$session.get("userInfo").phone_number === "") {
            alert("휴대폰 번호를 기입해주세요")
          } else {
            this.phoneNumber = this.$session.get("userInfo").phone_number
          }
        } else {
          this.phoneNumber = ""
        }
      }
    },
    created () {
      if (this.$session.get('specificItemId') === undefined || this.$session.get('specificItemId') === null) {
        alert("선택된 게시글이 없습니다.");
        this.$router.push('/lost');
        return ;
      }
      this.$store.dispatch('grantCheckLost', {
        token: this.$session.get('token'),
        id: this.$session.get('specificItemId')
      }).then(data => {
        this.$store.dispatch('getSpecificLostItem', {
          token: this.$session.get('token'),
          specificItemId: this.$session.get('specificItemId')
        }).then(data => {
          this.title = this.computedSpecificItem.title;
          this.content = this.computedSpecificItem.content;
          this.created_at = this.computedSpecificItem.created_at;
          this.phoneNumber = this.computedSpecificItem.phone;
          this.phoneFlag = this.computedSpecificItem.is_phone_open;
          this.type = this.computedSpecificItem.type;
          this.location = this.computedSpecificItem.location;
          this.date = this.computedSpecificItem.date;
        })
      }, fail => {
        alert('잘못된 접근입니다. 게시글 상세보기에서 수정을 눌러주세요.');
        this.$router.push('/lost');
      });
      console.log(this.VUEX_ITEM_STATE);
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main {
    width: 100%;
    border-top: #f7941e 5px solid;
  }

  .header {
    height: 116px;
    border-bottom: #175c8e 2px solid;
  }

  .header .title {
    float: left;
    font-size: 30px;
    font-family: NanumSquare, serif;
    font-weight: 800;
    letter-spacing: -1.5px;
    padding-top: 63px;
    color: #175c8e;
  }

  .header .go-list {
    float: right;
    padding: 6px 13px;
    color: white;
    background-color: #175c8e;
    border: 1px #175c8e solid;
    font-size: 13px;
    cursor: pointer;
  }

  .adjust {
    width: 1132px;
    margin-left: auto;
    margin-right: auto;
  }

  .form {
    width: 1132px;
    text-align: left;
    height: 505px;
  }

  .board-head {
    border-top: 2px solid #175c8e;
    border-bottom: 1px solid #175c8e;
    width: 100%;
    text-align: left;
  }

  .board-title input{
    font-family: NanumBarunGothic, serif;
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -1px;
    color: #252525;
    padding-top: 26px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 7px;
    width: 794px;
    border: 0px white solid;
    word-wrap: break-word;
  }
  .board-title input::placeholder {
    color: #bec9d5;
  }
  .board-info {
    display: flex;
    padding-bottom: 27px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .board-info .author {
    font-family: NanumBarunGothic,serif;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #175c8e;
    margin-right: 16px;
  }

  .board-info .createdAt {
    font-family: NanumBarunGothic;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #858585;
  }

  .state-select {
    height: 104px;
    width: 1082px;
    margin: 0 25px;
    border-bottom: 1px solid #e0e0e0;
  }

  .state-select p {
    margin-top: 0;
    padding-top: 26px;
    color: #252525;
    letter-spacing: -0.8px;
    font-size: 15px;
  }
  .state-select .checkboxs {
    width: 100%;
  }

  .state-select .checkboxs label {
    width: 64px;
    margin-right: 20px;
  }
  .form .left-form {
    width: 546px;
    float: left;
    margin-right: 40px;
    height: 305px;
    margin-left: 25px;
  }

  .left-form p {
    color: #252525;
    letter-spacing: -0.8px;
    font-size: 15px;
    height: 15px;
    width: 546px;
    padding-top: 13px;
  }

  .left-form .input-title, .left-form .input-price, .left-form .input-phone {
    width: 506px;
    height: 41px;
    font-size: 15px;
    padding-left: 19px;
    padding-right: 19px;
    background-color: #ffffff;
    border: solid 1px #d2dae2;
  }

  .left-form input::placeholder {
    width: 187px;
    height: 15px;
    font-size: 15px;
    letter-spacing: -0.8px;
    text-align: left;
    color: #bec9d5;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .phone {
    padding-top: 26px;
  }

  .phone .title {
    color: #252525;
    letter-spacing: -0.8px;
    font-size: 15px;
    height: 15px;
    width: 60px;
    float: left;
    margin-bottom: 15px;
  }

  .checkboxs {
    float: left;
  }

  .checkboxs span {

  }

  .checkboxs input {
    margin-right: 10px;
  }

  .form .right-form {
    width: 546px;
    float: left;
  }

  .dropbox-title {
    font-size: 15px;
    margin-top: 28px;
    margin-bottom: 0px;
    letter-spacing: -0.8px;
    text-align: left;
  }

  .dropbox {
    outline: 1px dashed #d2dae2;
    background: transparent;
    width: 544px;
    height: 247px;
    position: relative;
    margin: 13px auto 0;
    z-index: 0;
    cursor: pointer;
  }

  .dropbox > h2 {
    text-align: center;
    position: absolute;
    top: 90px;
    left: 146px;
    letter-spacing: -0.8px;
    font-size: 15px;
    color: #175c8e;
  }

  .dropbox-btn {
    position: absolute;
    top: 129px;
    letter-spacing: -0.8px;
    font-size: 13px;
    background: #175c8e;
    left: 211px;
    padding: 6px 14px;
    color: white;
    cursor: pointer;
    border: 1px solid #175c8e;
  }

  .input-file {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 3;
    cursor: pointer;
  }

  .preview-container {
    float: left;
    width: 546px;
    height: 249px;
    overflow: hidden;
  }

  .preview {
    width: 546px;
    height: auto;
    background: black;
    opacity: 0.6;
  }

  .preview-container button {
    position: absolute;
    top: 115px;
    left: 228px;
    padding: 6px 14px;
    font-size: 13px;
    background: #ff2929;
    color: white;
    z-index: 4;
    border: 1px solid #ff2929;
  }

  .detail {
    text-align: left;
    margin-top: 26px;
    height: 522px;
    border-bottom: 1px #175c8e solid;
  }

  .detail .editor {
    height: 400px;
    margin: 0 25px;
  }

  .detail p {
    letter-spacing: -0.8px;
    text-align: left;
    color: #252525;
    font-size: 15px;
    margin-left: 25px;
  }

  .footer {
    margin-top: 23px;
    height: 157px;
  }

  .footer button {
    font-size: 13px;
    color: white;
    letter-spacing: -0.7px;
    padding: 5px 26px;
  }

  .footer .cancel-btn {
    margin-right: 6px;
    background: #909090;
    border: 1px solid #909090;
  }

  .footer .register-btn {
    background: #175c8e;
    border: 1px solid #175c8e;
  }

  .footer .go-list {
    float: right;
    padding: 6px 13px;
    color: white;
    background-color: #175c8e;
    border: 1px #175c8e solid;
    font-size: 13px;
    cursor: pointer;
  }

  /* 체크박스 커스텀 */
  input[type=radio] {
    display: none;
  }

  input[type=radio] + label {
    float: left;
    display: inline-block;
    cursor: pointer;
    position: relative;
    padding-left: 24px;
    width: 40px;
    font-size: 12px;
    line-height: 20px;
    cursor: pointer;
  }

  input[type=radio] + label:before {
    content: "";
    width: 16px;
    height: 16px;
    position: absolute;
    left: 0;
    top: 0px;
    background-color: #ffffff;
    border: 1px solid #d2dae2;
    line-height: 13px;
  }

  input[type=radio]:checked + label:before {
    content: "";
    background-image: url("https://static.koreatech.in/assets/img/check.png");
    background-size: cover;
  }

  button {
    cursor: pointer;
  }

  .mobile {
    display: none;
  }
  @media (max-width: 576px) {
    .main {
      border-top: none;
    }

    .adjust {
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    .header {
      display: none;
    }

    .form {
      width: 100%;
      height: 100%;
    }

    .form input::placeholder {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: rgba(227, 227, 227, 0.87);
    }

    .board-head {
      height: 56.5px;
      border: none;
    }

    .board-title {
      border-bottom: 1px solid #ececec;
    }

    .board-title input {
      width: calc(100% - 32px);
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      padding-top: 15px;
      padding-bottom: 17.5px;
      padding-right: 16px;
      padding-left: 16px;
    }

    .board-info {
      display: none;
    }

    .state-select {
      margin: 0;
      width: calc(100% - 32px);
      height: 57px;
      border-bottom: 1px solid #ececec;
      padding: 0 16px 0 16px;
      display: flex;
      align-items: center;
    }

    .state-select p {
      display: none;
    }

    .state-select .checkboxs label {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
      width: auto;
      padding-left: 30px;
      margin-right: 30px;
      padding-top: 2px;
    }

    input[type=radio] + label:before {
      content: "";
      border: none;
      width:24px;
      height: 24px;
      background-image: url("https://static.koreatech.in/assets/img/mobile__unchecked.png");
      background-size: cover;
    }

    input[type=radio]:checked + label:before {
      content: "";
      border: none;
      width: 24px;
      height: 24px;
      background-image: url("https://static.koreatech.in/assets/img/mobile__checked.png");
    }

    .form .left-form {
      width: 100%;
      height: 209px;
      margin-left: 0;
    }

    .left-form .title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: calc(100% - 32px);
      height: 57px;
      border-bottom: 1px solid #ececec;
      padding: 0 16px 0 16px;
    }

    .left-form p {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
      padding: 0;
      margin: 0;
      height: auto;
      width: 30%;
    }

    .left-form .input-title {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
      border: none;
      padding: 0;
      width: initial;
      height: initial;
    }

    .left-form .price {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: calc(100% - 32px);
      height: 57px;
      border-bottom: 1px solid #ececec;
      padding: 0 16px 0 16px;
    }

    .left-form .input-price {
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
      border: none;
      padding: 0;
      width: initial;
      height: initial;
    }

    .left-form .phone {
      border-bottom: 1px solid #ececec;
      padding: 0 16px 0 16px;
      height: 92px;
      /* display: flex; */
    }

    .phone .title {
      margin-bottom: 0;
      padding: 0;
      border: none;
      width: 30%;
      justify-content: flex-start;
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
    }

    .phone .checkboxs {
      display: inline-block;
      width: auto;
      margin-top: 15px;
    }

    input[type=radio] + label {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
      width: auto;
      margin-right: 15px;
      padding-left: 30px;
      padding-top: 2px;
    }

    .left-form .input-phone {
      padding: 0;
      width: 70%;
      height: 22px;
      margin-left: 30%;
      border: none;
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
    }

    .detail {
      margin-top: 0;
      height: 100%;
    }

    .detail p {
      display: none;
    }

    .detail .editor {
      margin: 0;
      /* margin: 0 16px; */
    }

    .footer {
      display: none;
    }

    .mobile {
      display: block;
    }

    .mobile__cancel__button {
      position: absolute;
      top: 20px;
      left: 16px;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.36;
      letter-spacing: -0.7px;
      text-align: left;
      color: #ffffff;
      background-color: #175c8e;
      border: none;
      padding-left: 0;
    }

    .mobile__update__button {
      position: absolute;
      top: 20px;
      right: 16px;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.36;
      letter-spacing: -0.7px;
      text-align: left;
      color: #ffffff;
      background-color: #175c8e;
      border: none;
      padding-right: 0;
    }
  }
</style>
