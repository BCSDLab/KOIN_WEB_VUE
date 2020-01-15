<template>
  <div class="list">
    <div class="header">
      <board-header-title
        :boardId="$session.get('nowBoardId')">
      </board-header-title>
      <div>
        <button
          class="go-list"
          type="button"
          @click="goList()">목록으로
        </button>
      </div>
    </div>

    <!-- 상단 파란 두줄 사이 -->
    <div
      class="board-head"
      :style="{ height: boardHeadHeight}">

      <!-- 제목 입력 -->
      <div class="board-title">
        <input
          type="text"
          v-model="inputTitle"
          placeholder="제목을 입력해주세요.">
      </div>

      <!-- 제목 아래 하단 정보 : 모바일은 미출력 -->
      <div
        class="board-info"
        :style="{ display: boardInfoDisplay}">
        <!-- 일반게시판 일 경우 미출력 : 3은 이전 익게, 1은 현재 익게-->
        <!-- 닉네임 -->
        <div
          v-if="this.$session.get('nowBoardId') !== -1"
          class="author">
          {{ nickname }}
        </div>

        <!--익명 이전 게시판용-->
        <!--<div-->
        <!--v-if="this.$session.get('nowBoardId') === 3"-->
        <!--class="author">-->
        <!--{{ this.$session.get("userInfo").anonymous_nickname }}-->
        <!--</div>-->

        <!--익명 현재 게시판용-->
        <div
          v-if="this.$session.get('nowBoardId') === -1"
          class="author">
          <div v-if="componentType==='등록'">
            <input
              class="temp-nick-input"
              v-model="inputTempNick"
              type="text"
              autocomplete="off"
              placeholder="닉네임을 입력하세요">
            <input
              class="temp-pw-input"
              v-model="inputTempPw"
              type="password"
              autocomplete="new-password"
              placeholder="비밀번호를 입력하세요">
          </div>

          <div v-if='componentType==="수정"'>
            <span class="temp-nick">{{ tempNick }}</span>
            <span class="pw-desc">비밀번호</span>
            <input
              class="temp-pw-input"
              v-model="inputTempPw"
              type="password"
              placeholder="비밀번호를 입력해주세요">
          </div>
        </div>
        <div class="createdAt">{{ computedOnlyDateByDateType(createdAt) }}</div>
      </div>
    </div>


    <!-- 내용 입력 -->
    <div class="board-content">
      <vue-editor
        id="editor"
        class="editor"
        v-model="inputContent"
        :editor-options="editorOption"
        use-custom-image-handler
        @imageAdded="imageUpload">
      </vue-editor>
    </div>
    <div class="footer">
      <div>
        <button
          class="cancel"
          type="button"
          @click="clickCancel">취소
        </button>
        <button
          class="write"
          type="button"
          @click="clickAdjust"> {{ componentType }}
        </button>
        <button
          class="go-list"
          type="button"
          @click="clickGoList">목록으로
        </button>
      </div>
    </div>
    <div class="mobile">
      <button
        class="mobile__cancel__button"
        @click="clickCancel">
        취소
      </button>
      <button
        class="mobile__update__button"
        @click="clickAdjust">
        {{ componentType }}
      </button>
    </div>
  </div>
</template>

<script>
  import {VueEditor} from "vue2-editor";
  import * as api from "../../../api/api";
  import BoardHeaderTitle from '../BoardSharedComponent/BoardHeaderTitle'
  import BoardMixin from '../BoardMixins/boardMixin'

  export default {
    name: 'BoardInputBase',
    components: {
      VueEditor,
      boardHeaderTitle: BoardHeaderTitle,
    },
    mixins: [BoardMixin],
    props: {
      title: {
        type: String,
        default: ""
      },
      content: {
        type: String,
        default: ""
      },
      created_at: {
        type: String,
        default: ""
      },
      nickname: {
        type: String,
        default: ""
      },
      tempNick: {
        type: String,
        default: ""
      },
      tempPw: {
        type: String,
        default: ""
      },
      componentType: {
        type: String,
        default: "등록"
      },
      createdAt: {
        type: Date,
        default: ""
      }
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
        boardHeadHeight: null,
        boardInfoDisplay: null,
        inputContent: this.content,
        inputTitle: this.title,
        inputTempPw: this.tempPw,
        inputTempNick: "",
        isImageUpload: false,
      }
    },
    methods: {
      clickGoList() {
        this.$emit("clickGoList");
      },

      clickCancel() {
        this.$router.go(-1);
      },

      clickAdjust() {
        this.$emit("clickAdjustButton", {
          title: this.inputTitle,
          content: this.inputContent,
          isImageUpload: this.isImageUpload,
          tempPw: this.inputTempPw,
          tempNick: this.inputTempNick
        });
      },

      imageUpload(file, Editor, cursorLocation, resetUploader) {
        let formData = new FormData();
        formData.append('image[]', file);
        this.isImageUpload = false;
        console.log(this.$session.get("nowBoardId"));

        if (this.$session.get("nowBoardId") === -1) {
          api.uploadImageForAnonymousBoard(formData)
            .catch((error) => {
              alert("이미지의 크기가 너무 큽니다.");
              return;
            }).then(res => {
              this.isImageUpload = true;
              Editor.insertEmbed(cursorLocation, 'image', res.data.url[0]);
              resetUploader();
            })
        } else {
          api.uploadImage(this.$session.get("token"), formData)
            .catch((error) => {
              alert("이미지의 크기가 너무 큽니다.");
              return;
            }).then(res => {
            this.isImageUpload = true;
            Editor.insertEmbed(cursorLocation, 'image', res.data.url[0]);
            resetUploader();
          })
        }
        
      },

      getBoardHeadHeight() {
        this.boardHeadHeight = this.$session.get('nowBoardId') === -1
          ? (window.innerWidth < 576 ? '170.5px' : 'initial')
          : (window.innerWidth < 576 ? '56.5px' : 'initial')
      },

      getBoardInfoDisplay() {
        this.boardInfoDisplay = this.$session.get('nowBoardId') === -1
          ? (window.innerWidth < 576 ? 'block' : 'flex')
          : (window.innerWidth < 576 ? 'none' : 'flex')
      }
    },

    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          this.getBoardHeadHeight();
          this.getBoardInfoDisplay();
        })
      })
    },

    created: function () {
      this.getBoardHeadHeight();
      this.getBoardInfoDisplay();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main {
    border-top: #f7941e 5px solid;
    width: 100%;
  }

  .container {
    margin-top: 61px;
    width: 1132px;
    margin-left: auto;
    margin-right: auto;
  }

  .list {
    width: 834px;
    float: left;
    margin-right: 40px;
    margin-bottom: 20px;
  }

  .top {
    width: 258px;
    float: left;
    text-align: left;
    margin-bottom: 20px
  }

  .header {
    width: 100%;
    height: 55px;
  }

  .header .board-name {
    float: left;
    font-family: NanumSquare, serif;
    font-size: 30px;
    font-weight: 800;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -1.5px;
    margin-bottom: 20px;
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

  .board-head {
    border-top: 2px solid #175c8e;
    border-bottom: 1px solid #175c8e;
    width: 100%;
    text-align: left;
  }

  .board-title input {
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
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #175c8e;
    margin-right: 16px;
  }

  .createdAt {
    display: block;
    font-family: NanumBarunGothic;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #858585;
  }

  .quill-editor {
    height: 352px;
    margin-bottom: 20px;
    color: black;
    font-weight: 400;
  }

  .editor {
    height: 380px;
  }

  .board-content {
    text-align: left;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 22px;
    padding-bottom: 25px;
    height: 449px;
    font-family: NanumBarunGothic, serif;
    font-size: 15px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.73;
    letter-spacing: -0.8px;
    color: #555555;
    overflow: scroll;
    border-bottom: 1px solid #175c8e;
    -ms-overflow-style: none;
  }

  .board-content::-webkit-scrollbar {
    display: none;
  }

  .footer {
    border-top: 1px solid #edf0f3;
    margin-bottom: 171px;
  }

  .footer .go-list {
    float: right;
    padding: 6px 13px;
    color: white;
    background-color: #175c8e;
    border: 1px #175c8e solid;
    font-size: 13px;
    cursor: pointer;
    margin-top: 20px;
  }

  .footer .write {
    padding: 6px 25px;
    color: white;
    background-color: #175c8e;
    font-size: 13px;
    margin-top: 20px;
    cursor: pointer;
    margin-left: 6px;
    border: 1px solid #175c8e;
  }

  .footer .cancel {
    margin-left: 9.2%;
    padding: 6px 25px;
    color: white;
    background-color: #909090;
    font-size: 13px;
    margin-top: 20px;
    cursor: pointer;
    border: 1px solid #909090;
  }

  button {
    color: #858585;
  }


  .temp-nick-input {
    border: none;
    margin-right: 20px;
    font-size: 13px;
    width: 120px;
    position: relative;
    bottom: 2px;
  }

  .temp-nick-input::placeholder, .temp-pw-input::placeholder {
    color: #bec9d5;
  }

  .temp-pw-input {
    border: none;
    margin-right: 20px;
    font-size: 13px;
    width: 130px;
    position: relative;
    margin-left: 10px;
  }

  .pw-desc {
    margin-left: 50px;
  }

  .mobile {
    display: none;
  }

  @media (max-width: 576px) {
    .main {
      border-top: none;
    }

    .container {
      width: 100%;
      margin: 0;
    }

    .top {
      display: none;
    }

    .list {
      width: 100%;
      margin: 0;
    }

    .header {
      display: none;
    }

    .board-head {
      border: none;
    }

    .board-head input::placeholder {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: rgba(227, 227, 227, 0.87);
    }

    .board-title input {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      text-align: left;
      color: #252525;
      padding: 15px 16px 17.5px 16px;
      width: calc(100% - 32px);
      border-bottom: 1px solid #ececec;
    }

    .board-info {
      display: none;
      padding: 0;
    }

    .board-info .author {
      margin-right: 0;
      height: 114px;
    }

    .board-info .author .temp-nick {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      display: block;
      padding: 15px 16px 17.5px 16px;
      color: #252525;
    }

    .temp-nick-input, .temp-pw-input {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
      padding: 15px 16px 17.5px 16px;
      width: calc(100% - 32px);
      margin: 0;
      position: initial;
      bottom: 0;
      border-bottom: 1px solid #ececec;
    }

    .pw-desc {
      display: none;
    }

    .board-info .createdAt {
      display: none;
    }

    .board-content {
      padding: 0;
    }

    .footer {
      display: none;
    }

    .mobile {
      display: block;
    }

    .mobile__cancel__button {
      position: absolute;
      top: 19px;
      left: 16px;
      background-color: #175c8e;
      color: #ffffff;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.36;
      letter-spacing: -0.7px;
      border: none;
      padding-left: 0;
    }

    .mobile__update__button {
      position: absolute;
      top: 19px;
      right: 16px;
      background-color: #175c8e;
      color: #ffffff;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.36;
      letter-spacing: -0.7px;
      border: none;
      padding-right: 0;
    }
  }

  @media (max-width: 360px) {
    .mobile__update__button {
      left: 310px;
      width: 40px;
    }

    .main {
      border-top: none;
    }

    .container {
      width: 100%;
      margin: 0;
    }

    .top {
      display: none;
    }

    .list {
      width: 100%;
      margin: 0;
    }

    .header {
      display: none;
    }

    .board-head {
      border: none;
    }

    .board-head input::placeholder {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: rgba(227, 227, 227, 0.87);
    }

    .board-title input {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      text-align: left;
      color: #252525;
      padding: 15px 16px 17.5px 16px;
      width: calc(100% - 32px);
      border-bottom: 1px solid #ececec;
    }

    .board-info {
      padding: 0;
    }
    .board-info .author {
      margin-right: 0;
      height: 114px;
    }

    .board-info .createdAt {
      display: none;
    }

    .board-content {
      padding: 0;
    }

    .footer {
      display: none;
    }

    .mobile {
      display: block;
    }

    .mobile__cancel__button {
      position: absolute;
      top: 19px;
      left: 16px;
      background-color: #175c8e;
      color: #ffffff;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.36;
      letter-spacing: -0.7px;
      border: none;
      padding-left: 0;
    }
  }
</style>
