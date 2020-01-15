<template>
  <div>
    <board-input-base
      @clickGoList="goUpperCategoryBoardList($session.get('nowBoardId'))"
      @clickAdjustButton="registerBoard"
      type="등록"
      :createdAt="new Date()"
      :nickname="$session.get('nowBoardId') !== -1 ? $session.get('userInfo').nickname : ''">
    </board-input-base>
  </div>
</template>

<script>
  import BoardInputBase from '../BoardSharedComponent/BoardInputBase'
  import BoardHeaderTitle from '../BoardSharedComponent/BoardHeaderTitle'
  import BoardMixin from '../BoardMixins/boardMixin'

  export default {
    name: 'BoardRegister',
    components: {
      boardHeaderTitle: BoardHeaderTitle,
      boardInputBase: BoardInputBase
    },
    mixins: [BoardMixin],
    data() {
      return {
      }
    },
    methods: {
      registerBoard: function (inputData) {
        // 내용 유효성 체크
        if (!this.checkInputValid(inputData.title, "제목", 500)) {
          return;
        }

        // 내용 유효성 체크
        if(this.checkOnlyNullCheck(inputData.content) && inputData.isImageUpload) {

        }
        else {
          if (!this.checkInputValid(inputData.content, "내용", 55000)) {
            return;
          }
        }

        // 익게 닉네임 유효성 체크
        if(this.$session.get("nowBoardId") == -1 && (inputData.tempNick !== undefined || inputData.tempNick !== null || inputData.tempNick !== "")) {
          if (!this.checkInputValid(inputData.tempNick, "익명 닉네임", 5000)) {
            return;
          }
        }

        // 익게 비번 유효성 체크
        if(this.$session.get("nowBoardId") == -1 && (inputData.tempPw !== undefined || inputData.tempPw !== null || inputData.tempPw !== "")) {
          if (!this.checkInputValid(inputData.tempPw, "익명 비밀번호", 5000)) {
            return;
          }
        }


        this.$store.dispatch('registerBoard', {
          token: this.$session.get("token"),
          articleId: this.$session.get("specificBoardId"),
          boardId: this.$session.get("nowBoardId"),
          title: inputData.title,
          content: inputData.content,
          tempPw: inputData.tempPw,
          tempNick: inputData.tempNick,
        }).then((data) => {
          alert("등록되었습니다.")
          this.goUpperCategoryBoardList(this.$session.get("nowBoardId"));
        })
      },
    },
    computed: {
      contentCode() {
        return hljs.highlightAuto(this.content).value;
      },
    },
    mounted() {

    },
    created() {
      if(this.$session.get("nowBoardId")!==-1) {
        if (this.$session.get("userInfo").nickname === undefined || this.$session.get("userInfo").nickname === "" || this.$session.get("userInfo").nickname === null) {
          alert("닉네임이 필요합니다.");
          this.$store.dispatch('nicknameFlagCheck', {
            nickname: this.$session.get("userInfo").nickname
          });
          this.$router.replace('/changeinfo');
        }
      }
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

  .register {
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
  .quill-editor{
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

  .temp-pw-input {
    border: none;
    margin-right: 20px;
    font-size: 13px;
    width: 130px;
    position: relative;
    bottom: 2px;
  }

  .temp-nick-input::placeholder {
    color: #bec9d5;
  }

  .temp-pw-input::placeholder {
    color: #bec9d5;
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

    .register {
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

    .mobile__register__button {
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
    .mobile__register__button {
      left: 310px;
      width: 40px;
    }
  }
</style>
