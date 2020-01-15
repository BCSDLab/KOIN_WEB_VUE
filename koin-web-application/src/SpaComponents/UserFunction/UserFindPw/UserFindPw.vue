<template>
  <div class="container">
    <div class="findpw">
      <img
        @click="go('/')"
        src="https://static.koreatech.in/assets/img/logo_primary.png">
      <div class="id">
        <input
          type="text"
          v-model="inputUserId"
          placeholder="아우누리 ID를 입력해주세요."
          ref="userId">
      </div>
      <div class="btn">
        <button
          :disabled="findPwDoneFlag"
          class="find-btn"
          type="button"
          @click="findPw">
          <span
            v-if="!findPwFlag">비밀번호 찾기</span>
          <div
            v-if="findPwFlag"
            class="loading">
            <circle2
              stroke="3px"
              background="transparent"
              color="#ffffff"
              size="20px">
            </circle2>
          </div>
        </button>
      </div>
      <div class="desc">
        학교메일로 비밀번호 초기화 메일이 발송됩니다.
      </div>
      <div class="footer">
        COPYRIGHT ⓒ {{ today.getFullYear() }} BY BCSDLab ALL RIGHTS RESERVED.
      </div>
    </div>
  </div>
</template>

<script>
  import {Circle2} from 'vue-loading-spinner'

  export default {
    name: 'FindPw',
    components: {
      Circle2
    },
    data() {
      return {
        findPwDoneFlag: false,
        findPwFlag: false,
        inputUserId: "",
        today: new Date(),
        emailLocalPartRegex: /^[a-z_0-9]{1,12}$/,
      }
    },
    methods: {
      go: function (val) {
        this.$router.push(val)
      },
      findPw: function (e) {
        if (this.inputUserId.indexOf("@koreatech.ac.kr") != -1) {
          alert("@koreatech.ac.kr을 빼고 입력해주세요.");
          return;
        }
        this.inputUserId = this.inputUserId.trim();
        if (!this.emailLocalPartRegex.test(this.inputUserId)) {
          alert("아우누리 계정 형식에서 벗어났습니다.");
          return;
        }
        this.findPwFlag = true;
        this.$store.dispatch('findPw', {
          inputUserId: this.inputUserId
        }).then((data)=>{
          if(data){
            this.findPwFlag = false;
            this.findPwDoneFlag = true
          }
          else{
            this.findPwFlag = false;
          }
        });
      }
    },
    mounted() {
      this.$store.dispatch("setNowRoutingPath", {
        path: "findpw"
      });
      this.$refs.userId.focus();
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
  .container {
    min-height: 700px;
  }

  .findpw {
    margin-top: 13vh;
    margin-left: auto;
    margin-right: auto;
    width: 430px;
    padding-top: 6%;
    padding-bottom: 18.5%;
    border-radius: 5px;
  }

  .findpw img {
    margin-bottom: 40px;
    width: 125px;
    cursor: pointer;
  }

  .findpw .id input {
    width: 368px;
    height: 39px;
    font-size: 15px;
    padding-left: 17px;
    border:#d2dae2 1px solid;
  }
  .findpw .id input::placeholder {
    font-size: 15px;
    letter-spacing: -0.8px;
    text-align: left;
    color: #bec9d5;
  }
  .findpw .btn .find-btn {
    width: 389px;
    height: 45px;
    border: 1px solid #175c8e;
    background: #175c8e;
    color: white;
    margin-top: 12px;
    font-family: NanumSquare;
    font-size: 20px;
    font-weight: 700;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.3;
    letter-spacing: -1px;
  }

  .desc {
    margin-top: 17px;
    letter-spacing: -0.6px;
    font-size: 12px;
    color: #858585;
  }

  .footer {
    margin-top: 28px;
    color: #7d7d7d;
    letter-spacing: -0.7px;
    font-size: 13px;
  }

  .loading {
    padding-left: 47%;
    padding-right: 50%;
  }
  .findpw .btn .find-btn:disabled {
    background: #e5eaf0;
    color: #d2dae2;
    border: solid 1px #d2dae2;
  }

  @media (max-width: 576px) {
    .container {
      width: 100%;
      height: 100%;
    }

    .findpw {
      width: 336px;
      padding-left: 8px;
      padding-right: 8px;
    }

    .findpw .id input {
      width: calc(100% - 40px);
      height: 34px;
    }

    .findpw .pw input {
      width: calc(100% - 40px);
      height: 32px;
    }

    .findpw .btn .find-btn {
      width: calc(100% - 20px);
      padding: 0;
      height: 34px;
      font-size: 15px;
    }


    .findpw img {
      margin-top: 90px;
      width: 105px;
      margin-right: 17px;
      margin-bottom: 60px;
    }
    .desc {
      margin-top: 20px !important;
    }
    .footer, .desc {
      font-size: 11px;
      margin-top: 8px;
    }

  }
</style>
