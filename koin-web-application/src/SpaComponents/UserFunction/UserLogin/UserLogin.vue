<template>
  <div class="container-login">
    <div class="login">
      <img
        @click="go('/')"
        src="https://static.koreatech.in/assets/img/logo_primary.png">
      <div class="user-info">
        <form>
          <input
            id="user-text-field"
            type="text"
            name="username"
            v-model="inputUserId"
            placeholder=" 아이디를 입력하세요"
            autocomplete="username"
            ref="userId"
          />
          <input
            id="password-text-field"
            type="password"
            name="password"
            v-model="inputUserPw"
            placeholder=" 비밀번호를 입력하세요"
            autocomplete="current-password"
            @keyup="enter"
            ref="password"
          />
        </form>
      </div>
      <!-- <div class="id">
        <input
          id="user-text-field"
          type="email"
          v-model="inputUserId"
          placeholder=" 아이디를 입력하세요"
          autocomplete="username"
          ref="userId">
      </div>
      <div class="pw">
        <input
          id="password-text-field"
          type="password"
          v-model="inputUserPw"
          placeholder=" 비밀번호를 입력하세요"
          autocomplete="current-password"
          @keyup="enter">
      </div> -->
      <div class="btn">
        <button
          :disabled="loginFlag"
          class="login-btn"
          type="button"
          @click="login">
          <span v-if="!loginFlag">로그인</span>
          <div
            v-if="loginFlag"
            class="loading">
            <circle2
              stroke="3px"
              background="#ffffff"
              color="#175c8e"
              size="20px">
            </circle2>
          </div>
        </button>
      </div>
      <div class="row">
        <input
          id="auto"
          name="auto-login"
          class="auto-login-check"
          :checked="autoLoginFlag"
          type="checkbox">
        <label
          @click="clickAutoLogin()"
          class="auto-login">자동 로그인</label>
        <label
          for="auto"></label>
      </div>
      <div class="row select">
        <a
          class="border"
          target="_blank"
          href="https://portal.koreatech.ac.kr/kut/page/findUser.jsp">아이디 찾기</a>
        <a
          class="border"
          @click="go('/findpw')">비밀번호 찾기</a>
        <a @click="go('/signup')">회원가입</a>
      </div>
      <div class="footer-login">
        <span>COPYRIGHT ⓒ {{ today.getFullYear() }} BY <span class="bold">BCSDLab</span> ALL RIGHTS RESERVED.</span>
      </div>

    </div>
  </div>
</template>

<script>
  import * as LoginCheck from '../../../stores/loginCheck'
  import {Circle2} from 'vue-loading-spinner'

  export default {
    name: 'Login',
    components: {
      Circle2
    },
    data() {
      return {
        loginFlag: false,
        autoLoginFlag: false,
        inputUserId: "",
        inputUserPw: "",
        today: new Date(),
        emailLocalPartRegex: /^[a-z_0-9]{1,12}$/
      }
    },
    methods: {
      go: function (val) {
        this.$store.dispatch("setNowFooterCategory", {
          footerCategoryIndex: -1
        });
        this.$router.push(val)
      },
      clickAutoLogin: function () {
        this.autoLoginFlag = !this.autoLoginFlag;
      },
      login: function () {
        if (this.inputUserId.indexOf("@koreatech.ac.kr") != -1) {
          alert("@koreatech.ac.kr을 빼고 입력해주세요.")
          return;
        }
        this.inputUserId = this.inputUserId.trim();
        if (!this.emailLocalPartRegex.test(this.inputUserId)) {
          alert("아우누리 계정 형식에서 벗어났습니다.");
          return;
        }
        if (this.inputUserId === "") {
          alert("ID를 입력해주세요");
          return;
        }
        if (this.inputUserPw === "") {
          alert("패스워드를 입력해주세요");
          return;
        }
        this.loginFlag = true;
        this.$store.dispatch('login', {
          InputUserId: this.inputUserId,
          InputUserPw: this.inputUserPw
        }).then((data) => {
          if(this.autoLoginFlag){
            this.$cookies.remove("autoLoginFlag");
            this.$cookies.set("autoLoginFlag", true, -1);
            let expireTime = new Date();
            expireTime.setDate(expireTime.getDate()+3);
            expireTime.setHours(expireTime.getHours()+9)
            this.$cookies.set("token", data[1], expireTime);
            this.$cookies.set("tokenExpireTime", expireTime.getTime(), expireTime);
          }
          else {
            this.$cookies.remove("autoLoginFlag");
            this.$cookies.set("autoLoginFlag", false);
            this.$cookies.remove("token");
          }
          this.$session.set("userInfo", data[0]);
          this.$session.set("token", data[1]);
          this.loginFlag = false;
          if(this.$session.get("destinationPath")!==undefined && this.$session.get("destinationPath")!==null){
            this.$router.push(this.$session.get("destinationPath"));
            this.$session.remove("destinationPath");
            return;
          }
          if(window.sessionStorage.getItem('destinationPath')!==undefined && window.sessionStorage.getItem('destinationPath') !== null){
            this.$router.push(window.sessionStorage.getItem("destinationPath"));
            window.sessionStorage.removeItem("destinationPath");
            return;
          }
          if (window.history.length >= 2) {
            this.$router.go(-1);
          }
          else {
            this.$router.push('/');
          }

        }, (error) => {
          switch (error) {
            case 401:
              this.inputUserId = "";
              this.inputUserPw = "";
              break;
            case 422:
              this.inputUserId = "";
              this.inputUserPw = "";
              break;
            case 500:
              this.inputUserId = "";
              this.inputUserPw = "";
              break;
          }
          this.loginFlag = false;
          this.$refs.userId.focus();
        })
      },
      enter: function (e) {
        if (e.keyCode === 13)
          this.login();
      },
      clickFindPw: function () {
        this.$router.push('findpw')
      }
    },
    created() {
      this.$store.dispatch("toggleSearchBarAction", false);
      LoginCheck.loginCheck(this.$session.get("token"), 'login').then((flag) => {
        if (flag) {
          alert("이미 로그인한 상태입니다.");
          this.$router.go(-1);
        }
      });
      if( this.$cookies.get('autoLoginFlag')===null || this.$cookies.get('autoLoginFlag')===undefined || this.$cookies.get('autoLoginFlag')==="" ){
        this.autoLoginFlag = false;
      }
      else {
        if (this.$cookies.get("autoLoginFlag") === 'false')
          this.autoLoginFlag = false;
        else
          this.autoLoginFlag = true;
      }
    },
    mounted() {
      this.$store.dispatch("setNowRoutingPath", {
        path: "login"
      });
      this.$refs.userId.focus();
      this.$refs.password.addEventListener('change', (e) => {
        this.inputUserPw = e.target.value;
      })
    },
    destroyed() {
      this.$store.dispatch("setNowRoutingPath", {
        path: ""
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .row {
    width: 100%;
    height: 43px;
  }

  .container-login {
    width: 100%;
    height: calc(100vh - 224px);
    min-height: 800px;
  }

  .login {
    padding-left: 371px;
    padding-right: 371px;
    width: 390px;
    margin-left: auto;
    margin-right: auto;
  }

  .login img {
    margin-top: 230px;
    margin-bottom: 39px;
    width: 125px;
    cursor: pointer
  }

  input::placeholder {
    padding-left: 5px;
    color: #bec9d5;
  }

  .login .user-info input {
    border:#d2dae2 1px solid;
    font-size: 15px;
    width: 372px;
    height: 40px;
    margin-bottom: 12px;
    padding-left: 13px;
  }

  .login .user-info input::placeholder {
    font-size: 15px;
    letter-spacing: -0.8px;
    padding-left: 0;
  }

  .login .btn {

  }

  .auto-login-check {
    margin-top: 14px;
    float: left;
    border-radius: 0;
    margin-right: 10px;
    cursor: pointer;
  }

  .auto-login {
    margin-top: 14px;
    width: 80%;
    text-align: left;
    font-size: 12px;
    float: left;
    color: #858585;
    letter-spacing: -0.6px;
    cursor: pointer;
    margin-bottom: 18px;
  }

  .login .btn .login-btn {
    width: 390px;
    height: 47px;
    border-radius: 0;
    line-height: 1.3;
    background: #175c8e;
    color: white;
    font-size: 20px;
    letter-spacing: -1px;
    font-family: "NanumSquare", serif;
    font-weight: 700;
    cursor: pointer;
    border: 1px solid #175c8e;
  }

  .select {
    border-top: 1px #d2dae2 solid;
    width: 390px;
    padding-top: 18px;
    font-size: 12px;
    letter-spacing: -0.6px;
    color: #858585;
  }

  .select a {
    padding-left: 14px;
    padding-right: 15px;
    text-decoration: none;
    cursor: pointer;
    color: #858585;
    outline: none;
  }

  .select .border {
    border-right: 1px #d2dae2 solid;
    padding-right: 19px;
    width: 0;
  }

  .select a:visited, .select a:active, .select a:link {
    text-decoration: none;
    color: #858585;
  }

  .footer-login {
    margin-top: 15px;
    font-size: 13px;
    letter-spacing: -0.7px;
    color: #7d7d7d;
    font-weight: 500;
  }

  .bold {
    color: #acabab;
    font-weight: 800;
  }

  input[type="checkbox"] {
    border-radius: 0;
  }

  .login .find-pw a,
  .login .find-pw a:hover,
  .login .find-pw a:visited,
  .login .find-pw a:active,
  .login .find-pw a:link {
    text-decoration: none;
    color: black;
  }

  .login .find-pw a:hover {
    color: #1a4766
  }

  .loading {
    padding-left: 47%;
    padding-right: 50%;
  }

  body {
    outline: none;
  }

  /* 체크박스 커스텀 */
  input[type=checkbox] {
    display: none;
  }

  input[type=checkbox] + label {
    display: inline-block;
    cursor: pointer;
    position: relative;
    padding-left: 24px;
  }

  input[type=checkbox] + label:before {
    content: "";
    width: 14px;
    height: 14px;
    position: absolute;
    left: 0;
    top: -2px;
    background-color: #ffffff;
    border: 1px solid #d2dae2;
    line-height: 13px;
  }

  input[type=checkbox]:checked + label:before {
    content: "";
    background-image: url("https://static.koreatech.in/assets/img/check.png");
    background-size: cover;
  }

  @media (max-width: 576px) {
    .container-login {
      width: 100%;
      min-height: 100%;
      height: 100%;
    }

    .login {
      width: 336px;
      padding-left: 8px;
      padding-right: 8px;
      padding-bottom: 200px;
    }

    .login .user-info input {
      width: calc(100% - 40px);
      height: 32px;
    }

    .login .btn .login-btn {
      width: calc(100% - 24px);
      padding: 0;
      height: 34px;
      font-size: 15px;
    }

    .row {
      width: calc(100% - 24px);
      text-align: center;
      margin-left: 12px;
      margin-right : 12px;
      height: 52px
    }

    .auto-login {
      width: 100%;
      margin-top: 18px;
      margin-bottom: 40px;
    }

    .login img {
      margin-top: 90px;
      width: 105px;
      margin-right: 17px;
      margin-bottom: 60px;
    }

    .footer-login {
      font-size: 11px;
      margin-top: 8px;
    }

  }
</style>
