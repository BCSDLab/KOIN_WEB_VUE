<template>
  <div class="main">
    <div class="register">
      <div class="header">
        <div class="title">
          {{ computedTitle }}
        </div>
      </div>
      <div class="form">
        <div class="left-form">
          <div class="title">
            <p>{{ state }}글 제목</p>
            <input
              class="input-title"
              type="text"
              v-model="title"
              placeholder="ex) 샘숭 노트북 팝니다!">
          </div>
          <div class="price">
            <p>{{ state }} 물품 가격</p>
            <input
              class="input-price"
              type="text"
              v-model="price"
              placeholder="가격을 입력해주세요!"
              @change="addComma"
            >
          </div>
          <div class="phone">
            <span class="title">{{ state }}자 연락처</span>
            <div class="checkboxs">
              <input
                type="radio"
                name="phone"
                :checked="phoneFlag"
              ><label @click="clickPhoneFlag(true)">공개</label>
              <input
                type="radio"
                name="phone"
                :checked="!phoneFlag"
              ><label @click="clickPhoneFlag(false)">비공개</label>
            </div>
            <div>
              <input
                class="input-phone"
                :disabled="!phoneFlag"
                type="text"
                placeholder="ex)010-1234-1234"
                v-model="phoneNumber">
            </div>
          </div>
        </div>
        <div class="right-form">
          <p class="dropbox-title">대표 이미지 등록</p>
          <div class="dropbox">
            <div v-if="!image">
              <input
                accept="image/*"
                enctype='multipart/form-data'
                class="input-file"
                type="file"
                name="myfile"
                @change="onFileChange"
                @drop="onFileChange"
              >
              <h2>해당 영역에 사진을 드래그하여 첨부해주세요.</h2>
              <button
                class="dropbox-btn">내 컴퓨터에서 선택
              </button>
            </div>
            <div
              v-else
              class="preview-container">
              <img
                class="preview"
                :src="image"
                alt="yourimage"/>
              <button @click="removeImage()">
                이미지 삭제
              </button>
            </div>

          </div>

        </div>
        <div class="mobile__form">
          <input
            class="mobile__item__title"
            v-model="title"
            placeholder="제목을 입력해주세요"
            type="text">
          <div class="mobile__price">
            <span>가격</span>
            <input
              class="mobile__item__price"
              v-model="price"
              placeholder="가격을 입력해주세요"
              type="text">
          </div>
          <div class="mobile__image">
            <span>대표이미지</span>
            <div
              v-if="!image"
              class="mobile__dropbox">
              <input
                accept="image/*"
                enctype='multipart/form-data'
                class="mobile__input__file"
                type="file"
                name="myfile"
                @change="onFileChange"
                @drop="onFileChange"
              >
              <button class="mobile__dropbox__button">
                이미지 첨부
              </button>
            </div>
            <div
              v-else
              class="mobile__preview">
              <img
                class="mobile__preview__image"
                :src="image"
                alt="yourimage"/>
              <button
                class="mobile__remove__image__button"
                @click="removeImage()">
                이미지 삭제
              </button>
            </div>
          </div>
          <div class="mobile__phone">
            <div class="mobile__open__toggle">
              <span>연락처</span>
              <div class="mobile__checkboxs">
                <input
                  type="radio"
                  name="mobile_phone"
                  :checked="phoneFlag"
                ><label @click="clickPhoneFlag(true)">공개</label>
                <input
                  type="radio"
                  name="mobile_phone"
                  :checked="!phoneFlag"
                ><label @click="clickPhoneFlag(false)">비공개</label>
              </div>
            </div>
            <input
              class="mobile__phone__input"
              :disabled="!phoneFlag"
              type="text"
              placeholder="연락처를 입력해주세요."
              v-model="phoneNumber">
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
          @click="cancel"
          type="button">취소
        </button>
        <button
          class="register-btn"
          type="button"
          @click="registerMarket">등록
        </button>
      </div>
      <div class="mobile">
        <button
          @click="cancel"
          class="mobile__cancel__button">
          취소
        </button>
        <button
          @click="registerMarket"
          class="mobile__register__button">
          등록
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from "../../../api/api";
  import {VueEditor, Quill} from "vue2-editor";

  export default {
    name: 'MarketRegister',
    components: {
      VueEditor
    },
    data() {
      return {
        image: "",
        title: "",
        content: "",
        price: "",
        phoneFlag: false,
        imageFlag: false,
        phoneNumber: "",
        files: [],
        tagFilter: /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig,
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
    methods: {
      addComma: function () {
        this.price = this.price.replace(/[^0-9]/g, '');
        this.price = this.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '원';
      },
      cancel: function () {
        this.$router.go(-1);
      },
      onFileChange(e) {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
          return;
        this.createImage(files[0]);
      },
      createImage(file) {
        var image = new Image();
        var reader = new FileReader();
        var vm = this;

        let formData = new FormData();
        formData.append('image', file);

        new Promise((resolve, reject) => {
          api.uploadThumbnailImage(this.$session.get("token"), formData).then(res => {
            this.files = new Array();
            this.imageFlag = true;
            this.files.push(res.data.url);
            console.log(this.files);
            resolve(true)
          }, err => {
            reject(err)
          })
        }).then((data) => {

        }, (err) => {
          if (err.message.indexOf("412") !== -1) {

          }
          else if (err.message.indexOf("413") !== -1 || err.message.indexOf("Network") !== -1) {
            alert("이미지의 크기가 너무 큽니다.")
          }
        });

        reader.onload = (e) => {
          vm.image = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      removeImage: function (e) {
        this.files = null;
        this.image = '';
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
      clickPhoneFlag: function (flag) {
        this.phoneFlag = flag
        if (flag) {
          if (this.$session.get("userInfo").phone_number === null || this.$session.get("userInfo").phone_number === undefined || this.$session.get("userInfo").phone_number === "") {
            alert("휴대폰 번호를 기입해주세요")
          }
          else {
            this.phoneNumber = this.$session.get("userInfo").phone_number
          }
        }
        else {
          this.phoneNumber = ""
        }
      },
      registerMarket: function () {
        if (this.title === "" || this.content === "") {
          alert("제목이나 내용을 추가해주세요");
          return;
        }
        if (this.title.length > 255) {
          alert(`제목 길이는 최대 255자 입니다. 지금 제목의 길이는 ${this.title.length}자 입니다.`);
          return;
        }
        if (this.content.replace(this.tagFilter, "").length > 10000) {
          alert(`내용 길이는 최대 10,000자 입니다. 지금 내용의 길이는 ${this.content.replace(this.tagFilter, "").length}자 입니다.`);
          return;
        }
        let regExp = /^\d{3}-\d{3,4}-\d{4}$/;
        if (this.phoneFlag && !regExp.test(this.phoneNumber)) {
          alert("잘못된 휴대폰 번호입니다. 010-1234-1234 양식을 지켜주세요.");
          return;
        }
        if (this.price >= 1000000000) {
          alert("가격이 너무 높습니다. 낮춰주세요.");
          return;
        }
        this.$store.dispatch('registerMarket', {
          title: this.title,
          content: this.content,
          marketId: this.$session.get("nowMarketId"),
          price: this.price.replace(/[^0-9]/g, ''),
          is_phone_open: this.phoneFlag ? 1 : 0,
          phone: this.phoneNumber,
          thumbnail: this.files,
          token: this.$session.get("token"),
        }).then((data) => {
          if (data.status) {
            this.$session.set("specificMarketId", data.data.id);

            switch (this.$session.get("nowMarketId")) {
              case 0:
                alert("판매등록되었습니다.")
                this.$router.push("/market/sell/" + data.data.id);
                break;
              case 1:
                alert("구매등록되었습니다.")
                this.$router.push("/market/buy/" + data.data.id);
                break;
            }
          }
          else {
            alert("게시물 등록에 실패하였습니다.")
          }
        }, (error) => {
          alert("네트워크를 확인하세요");
        })
      }
    },
    computed: {
      date: function () {
        let today = new Date();
        let year = today.getFullYear();
        let month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
        let date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        return year + ". " + month + ". " + date;
      },
      editor() {
        return this.$refs.myTextEditor.quill;
      },
      contentCode() {
        return hljs.highlightAuto(this.content).value;
      },
      computedTitle: function () {
        switch (this.$session.get("nowMarketId")) {
          case 0:
            return "팝니다";
          case 1:
            return "삽니다";
        }
      },
      state: function () {
        switch (this.$session.get("nowMarketId")) {
          case 0:
            return "판매";
          case 1:
            return "구매";
        }
      }
    },
    created() {
      if (this.$session.get("userInfo").nickname === null || this.$session.get("userInfo").nickname === undefined || this.$session.get("userInfo").nickname === "") {
        alert("닉네임이 필요합니다.");
        this.$store.dispatch('nicknameFlagCheck', {
          nickname: this.$session.get("userInfo").nickname
        });
        this.$router.replace('/changeinfo');
      }
      if (this.$session.get("userInfo").phone_number === null || this.$session.get("userInfo").phone_number === undefined || this.$session.get("userInfo").phone_number === "") {
        this.phoneFlag = false;
      }
      else {
        this.phoneFlag = true;
        this.phoneNumber = this.$session.get("userInfo").phone_number
      }
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

  .register {
    width: 1132px;
    margin-left: auto;
    margin-right: auto;
  }

  .form {
    width: 1132px;
    text-align: left;
    height: 305px;
  }

  .form .left-form {
    width: 546px;
    float: left;
    margin-right: 40px;
    height: 305px;
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
    width: 80px;
    margin-right: 41px;
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

  .dropbox h2 {
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
  }

  .detail p {
    letter-spacing: -0.8px;
    text-align: left;
    color: #252525;
    font-size: 15px;
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

  .form .mobile__form {
    display: none;
  }

  .mobile {
    display: none;
  }

  @media (max-width: 576px) {
    .main {
      border-top: none;
    }

    .register {
      width: 100%;
    }

    .header {
      display: none;
    }

    .form {
      width: 100%;
      height: 100%;
    }

    .form .left-form, .form .right-form {
      display: none;
    }

    .form .mobile__form {
      display: block;
    }

    .mobile__item__title {
      width: calc(100% - 32px);
      padding: 15px 16px 17px 16px;
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
      border: none;
      border-bottom: 1px solid #ececec;
    }

    .mobile__price {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ececec;
      width: calc(100% - 32px);
      padding: 15px 16px 17px 16px;
    }

    .mobile__price span {
      width: 30%;
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
    }

    .mobile__price .mobile__item__price {
      width: 70%;
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
      border: none;
    }

    .mobile__image {
      border-bottom: 1px solid #ececec;
      padding: 0 16px;
      height: 57px;
      display: flex;
      align-items: center;
    }
    .mobile__image span {
      width: 30%;
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
    }

    .mobile__dropbox {
      width: 70%;
      position: relative;
    }

    .mobile__dropbox .mobile__input__file {
      opacity: 0;
      width: 100%;
      height: 100%;
      position: absolute;
    }

    .mobile__dropbox__button {
      border: 1px solid #a1a1a1;
      font-size: 12px;
      font-weight: normal;
      line-height: 1.42;
      letter-spacing: -0.6px;
      color: #252525;
      background-color: #ffffff;
      padding: 6px 9.4px 5.7px 10px;
      height: 30px;
    }

    .mobile__preview {
      display: flex;
      align-items: center;
    }

    .mobile__preview__image {
      width: 55px;
      height: 55px;
      margin-right: 10px;
    }

    .mobile__remove__image__button {
      border: 1px solid #ececec;
      font-size: 12px;
      font-weight: normal;
      line-height: 1.42;
      letter-spacing: -0.6px;
      color: #252525;
      background-color: #ffffff;
      padding: 5px 9px;
      height: 30px;
    }

    .mobile__phone {
      border-bottom: 1px solid #ececec;
      width: calc(100% - 32px);
      padding: 18px 16px 17.5px 16px;
    }

    .mobile__phone .mobile__open__toggle {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }

    .mobile__phone .mobile__open__toggle span {
      width: 30%;
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
    }

    .mobile__phone .mobile__open__toggle .mobile__checkboxs {
      display: inline-block;
      width: 70%;
    }

    .mobile__phone__input {
      margin-left: 30%;
      width: 70%;
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
      border: none;
    }

    input[type=radio] + label {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
      padding-left: 32px;
      width: auto;
      margin-right: 15px;
      padding-top: 2px;
    }

    input[type=radio] + label:before {
      content: "";
      border: none;
      width: 24px;
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

    .form input::placeholder {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: rgba(227, 227, 227, 0.87);
    }

    .detail {
      margin: 0;
    }

    .detail p {
      display: none;
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

    .mobile__register__button {
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
  @media (max-width: 360px) {
    .mobile__register__button {
      left: 310px;
      width: 40px;
    }
  }

</style>
