<template>
  <div class="main">
    <div class="adjust">
      <div class="header">
        <div class="title">
          {{ computedTitle }}
        </div>
      </div>
      <div class="type-header">
        <div class="title">
          {{ state }}상태변경
        </div>
        <div class="types">
          <input
            type="radio"
            name="type"
            :checked="this.type === 0">
          <label
            class="type-zero"
            @click="typeCheck(0)">{{ state }}중</label>
          <input
            type="radio"
            name="type"
            :checked="this.type === 1">
          <label
            class="type-one"
            @click="typeCheck(1)">{{ state }}중지</label>
          <input
            type="radio"
            name="type"
            :checked="this.type === 2">
          <label
            class="type-two"
            @click="typeCheck(2)">{{ state }}완료</label>
        </div>
      </div>
      <div class="form">
        <div class="left-form">
          <div class="title">
            <p>{{ state }}글 제목</p>
            <input
              accept="image/*"
              class="input-title"
              type="text"
              v-model="title"
              :placeholder="computedPlaceholder">
          </div>
          <div class="price">
            <p>{{ state }} 물품 가격</p>
            <input
              class="input-price"
              type="number"
              v-model="price"
              placeholder="가격을 입력해주세요!"
            >
          </div>
          <div class="phone">
            <span class="title">{{ state }}자 연락처</span>
            <div class="checkboxs">
              <input
                type="radio"
                name="phone"
                :checked="this.phoneFlag"
              >
              <label
                @click="clickPhoneFlag(true)">공개</label>
              <input
                type="radio"
                name="phone"
                :checked="!this.phoneFlag">
              <label
                @click="clickPhoneFlag(false)">비공개</label>
            </div>
            <div>
              <input
                class="input-phone"
                :disabled="!phoneFlag"
                type="text"
                v-model="phoneNumber"
                placeholder="ex)010-1234-1234"
              >
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
            accept="image/*"
            class="mobile__item__title"
            type="text"
            v-model="title"
            :placeholder="computedPlaceholder"
          >
          <div class="mobile__price">
            <span>가격</span>
            <input
              class="mobile__item__price"
              type="number"
              v-model="price"
              placeholder="가격을 입력해주세요"
            >
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
                  :checked="this.phoneFlag"
                >
                <label
                  @click="clickPhoneFlag(true)">
                  공개
                </label>
                <input
                  type="radio"
                  name="mobile_phone"
                  :checked="!this.phoneFlag"
                >
                <label
                  @click="clickPhoneFlag(false)">
                  비공개
                </label>
              </div>
            </div>
            <input
              class="mobile__phone__input"
              :disabled="!phoneFlag"
              type="text"
              v-model="phoneNumber"
              placeholder="ex)010-1234-1234"
            >
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
          class="adjust-btn"
          type="button"
          @click="adjustMarket">수정완료
        </button>
      </div>
      <div class="mobile">
        <button
          @click="cancel"
          class="mobile__cancel__button">
          취소
        </button>
        <button
          @click="adjustMarket"
          class="mobile__register__button">
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
    name: 'MarketAdjust',
    components: {
      VueEditor
    },
    data() {
      return {
        image: "",
        VUEX_market_STATE: store.state,
        phoneFlag: 0,
        phoneNumber: "",
        content: "",
        title: "",
        price: "",
        type: 0,
        imageFlag: false,
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
    computed: {
      computedSpecificmarket: function () {
        return this.VUEX_market_STATE.Market.specificmarket
      },
      computedPlaceholder: function () {
        switch (this.$session.get("nowMarketId")) {
          case 0:
            return "ex) 샘숭 노트북 팝니다!";
          case 1:
            return "ex) 샘숭 노트북 삽니다!";
        }
      },
      state: function () {
        switch (this.$session.get("nowMarketId")) {
          case 0:
            return "판매";
          case 1:
            return "구매";
        }
      },
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
      }
    },
    methods: {
      typeCheck: function (val) {
        this.type = val;
      },
      cancel: function () {
        this.$router.go(-1);
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
      setSpecificMarket: function () {
        this.$store.dispatch("setSpecificMarket", {
          specificMarketId: this.$session.get("specificMarketId"),
          token: this.$session.get("token")
        })
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
        this.image = '';
        this.files = null;
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
      adjustMarket: function () {
        if (this.title === "" || this.content === "") {
          alert("제목이나 내용을 채워주세요");
          return;
        }
        if (this.title.length > 255) {
          alert(`제목 길이는 최대 255자 입니다. 지금 제목의 길이는 ${this.computedSpecificBoard.market.length}자 입니다.`);
          return;
        }
        if (this.content.replace(this.tagFilter, "").length > 10000) {
          alert(`내용 길이는 최대 10,000자 입니다. 지금 내용의 길이는 ${this.computedSpecificmarket.content.replace(this.tagFilter, "").length}자 입니다.`);
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
        console.log("files : ", this.files);
        let payload = {
          state: this.type,
          title: this.title,
          content: this.content,
          price: this.price,
          is_phone_open: this.phoneFlag,
          phone: this.phoneNumber,
          token: this.$session.get("token"),
          specificMarketId: this.$session.get("specificMarketId"),
        };

        if(this.files.length !== 0) {
          payload["thumbnail"] = this.files;
        }

        this.$store.dispatch('adjustMarket', payload).then((data) => {
          alert("수정되었습니다.")
          switch (this.$session.get("nowMarketId")) {
            case 0:
              this.$router.push("/market/sell/" + this.$session.get("specificMarketId"));
              break;
            case 1:
              this.$router.push("/market/buy/" + this.$session.get("specificMarketId"));
              break;
          }
        }, (error) => {
          alert("네트워크를 확인해 주세요");
        })
      }
    },
    created() {
      if (this.$session.get("specificMarketId") === undefined || this.$session.get("nowMarketId") === null) {
        alert("선택된 글이 없습니다.")
        this.$router.push("/market/sell")
        return
      }
      this.$store.dispatch('grantCheckMarket', {
        "token": this.$session.get("token"),
        "articleId": this.$session.get("specificMarketId"),
      }).then((data) => {
        this.$store.dispatch("setSpecificMarket", {
          specificMarketId: this.$session.get("specificMarketId"),
          token: this.$session.get("token")
        }).then(data => {
          this.phoneFlag = this.computedSpecificmarket.is_phone_open;
          this.image = this.computedSpecificmarket.thumbnail === null ? "" : this.computedSpecificmarket.thumbnail;
          this.phoneNumber = this.computedSpecificmarket.phone;
          this.title = this.computedSpecificmarket.title;
          this.content = this.computedSpecificmarket.content;
          this.price = this.computedSpecificmarket.price;
          this.type = this.computedSpecificmarket.state;
          this.imageFlag = this.computedSpecificmarket.thumbnail !== null ? true : false;
        })
      }, (fail) => {
        alert("잘못된 접근입니다. 게시글 상세보기에서 수정을 눌러주세요.")
        this.$router.push("/market/sell");
      });
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

  .type-header {
    text-align: left;
    padding-top: 28px;
    height: 85px;
  }

  .type-header .title {
    font-size: 15px;
    letter-spacing: -0.8px;
    padding-bottom: 10px;
  }

  .type-header .types {
    border-bottom: 1px #e0e0e0 solid;
    padding-bottom: 50px;
  }

  .type-header .types label {
    width: 59px;
    float: left;
    position: relative;
    font-size: 12px;
    letter-spacing: -0.6px;
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

  .adjust {
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
    z-index: 2;
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
    height: 529px;
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
    margin-left: 22px;
    margin-right: 6px;
    background: #909090;
    border: 1px solid #909090;
  }

  .footer .adjust-btn {
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

  .type-zero {
    color: #175c8e;
  }

  input[type=radio] + .type-zero:before {
    top: 1px;
    width: 14px;
    height: 14px;
    border: 1px solid #175c8e;
  }

  input[type=radio]:checked + .type-zero:before {
    content: "";
    background-image: url("https://static.koreatech.in/assets/img/check.png");
    background-size: cover;
  }

  .type-one {
    color: #ff2929;
  }

  input[type=radio] + .type-one:before {
    top: 1px;
    width: 14px;
    height: 14px;
    border: 1px solid #ff2929;
  }

  input[type=radio]:checked + .type-one:before {
    content: "";
    background-image: url("https://static.koreatech.in/upload/88cd3530e535c023230c2ded38506bbe.png");
    background-size: cover;
  }

  .type-two {
    color: #858585;
  }

  input[type=radio] + .type-two:before {
    top: 1px;
    width: 14px;
    height: 14px;
    border: 1px solid #858585;
  }

  input[type=radio]:checked + .type-two:before {
    content: "";
    background-image: url("https://static.koreatech.in/upload/6c394b1918ae1ac29533fd151187e21b.png");
    background-size: cover;
  }

  button {
    cursor: pointer;
  }

  .mobile__form {
    display: none;
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
      margin: 0;
    }

    .header, .type-header, .footer {
      display: none;
    }

    .form .left-form, .form .right-form {
      display: none;
    }

    .form {
      width: 100%;
      height: 100%;
    }

    .form .mobile__form {
      display: block;
    }

    .form input::placeholder {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: rgba(227, 227, 227, 0.87);
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
      width: auto;
      padding-left: 32px;
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
