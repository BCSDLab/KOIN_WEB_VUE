<template>
  <div class="container">
    <div class="change-info">
      <img src="https://static.koreatech.in/upload/7fb830175c27b396c65d30952c606320.png">
      <div class="id">
        <input
          type="text"
          v-model="userId"
          disabled>
      </div>
      <div class="help-desc">ID는 변경하실 수 없습니다.</div>
      <div class="pw">
        <input
          type="password"
          :style="{ border: passwordFirst!==''&&passwordFirst===passwordSecond ? '2px solid #1aa54f' : passwordFirst!=''&&passwordFirst!=passwordSecond ? '2px solid red' : ''}"
          v-model="passwordFirst"
          placeholder="비밀번호 (필수)"
          ref="password">
      </div>
      <div class="help-desc">비밀번호는 특수문자, 숫자를 포함한 6자 이상 18자 이하여야 합니다.</div>
      <div class="pw-check">
        <input
          type="password"
          :style="{ border: passwordFirst!==''&&passwordFirst===passwordSecond ? '2px solid #1aa54f' : passwordFirst!=''&&passwordFirst!=passwordSecond ? '2px solid red' : ''}"
          v-model="passwordSecond"
          placeholder="비밀번호 확인 (필수)">
      </div>
      <div class="name">
        <input
          type="text"
          v-model="name"
          placeholder="이름 (선택)">
      </div>
      <div class="nickname">
        <input
          type="text"
          v-model="nickname"
          :style="{ border: nicknameInputStyle }"
          placeholder="닉네임 (선택)">
        <button
          class="nickname-button"
          @click="nicknameCheck">
          중복확인
        </button>
      </div>
      <div v-if="signUpIdentity === 0 || signUpIdentity === 1">
        <div class="student-number">
          <input
            type="text"
            v-model="studentNumber"
            placeholder="학번 (선택)"
            :disabled="this.$session.get('userInfo').student_number !== null">
        </div>
      </div>
      <div v-else-if="signUpIdentity === 4">
        <div class="email">
          <input
            type="email"
            v-model="email"
            placeholder="이메일 등록">
          <div class="help-desc">이메일은 비밃번호를 찾을 시에 필요하니 등록하시길 바랍니다.</div>
        </div>
      </div>

      <div class="phone-number">
        <input
          type="text"
          v-model="phoneNumber"
          placeholder="전화번호 (Ex: 010-0000-0000) (선택)">
      </div>
      <div v-if="signUpIdentity === 0 || signUpIdentity === 1">
        <div class="select-list">
          <div class="select-major">
            <div class="dropdown">
              <button
                class="drop-btn"
                type="button"
                value="signUpMajor"
                :style="{ backgroundColor: signUpMajor===undefined ? '#ffffff' : '#175c8e', color: signUpMajor===undefined ? '#bec9d5' : '#b5c1cd' }"
                :disabled="this.$session.get('userInfo').major !== null">
                {{ signUpMajor === undefined ? selectMajorValue : signUpMajor }}
              </button>
            </div>
          </div>
          <div class="select-gender">
            <div class="dropdown">
              <button
                class="drop-btn gender-drop-btn"
                type="button"
                @click="clickSelectGenderBtn"
                :style="{ backgroundColor: gender===undefined ? '#ffffff' : '#175c8e', color: gender===undefined ? '#252525' : '#b5c1cd' }"
                :disabled="this.$session.get('userInfo').gender!==null">
                {{ gender === undefined ? selectGenderValue : gender }}
                <img src="https://static.koreatech.in/assets/img/bus_dropdown.png">
              </button>
              <div
                id="select-gender-dropdown"
                class="dropdown-list gender-list">
                <a
                  v-for="gender in genderList"
                  :key="gender.id"
                  @click="clickGender(gender)">
                  {{ gender }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        :disabled="changeInfoFlag"
        class="change-info-button"
        @click="adjustUserInfo">
        <span v-if="!changeInfoFlag">정보수정</span>
        <div
          v-if="changeInfoFlag"
          class="loading">
          <circle2
            stroke="3px"
            background="#ffffff"
            color="#175c8e"
            size="20px">
          </circle2>
        </div>
      </button>
      <button
        class="user-withdraw-button"
        @click="withdraw">
        회원 탈퇴
      </button>
      <span class="footer">
        COPYRIGHT ⓒ {{ today.getFullYear() }} BY <span class="bold">BCSDLab</span> All RIGHTS RESERVED.
      </span>
    </div>
  </div>
</template>

<script>
  import * as LoginCheck from '../../../stores/loginCheck'
  import {mapGetters} from 'vuex';
  import {Circle2} from 'vue-loading-spinner'

  export default {
    name: 'UserChangeInfo',
    components: {
      Circle2
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        let path = from.path.split('/')[1];
        if((from.name === 'BoardRegister' || path === 'free-board' || path === 'job-board' || path === 'anonymous-board') && vm.nicknameFlag === true){
          vm.nicknameInputStyle = '1px solid red';
          vm.$router.replace('/changeInfo');
        }
      });
    },
    data() {
      return {
        today: new Date(),
        changeInfoFlag: false,
        userInfo: null,
        userId: "",
        passwordFirst: "",
        passwordSecond: "",
        name: undefined,
        nickname: undefined,
        gender: undefined,
        signUpIdentity: 0,
        isGraduated: undefined,
        signUpMajor: undefined,
        studentNumber: undefined,
        phoneNumber: undefined,
        selectMajorValue: "학부 (학번 입력시 자동입력)",
        nicknameCheckFlag: false,
        nicknameInputStyle: '',
        nicknameChecker: /admin|관리자/,
        passwordChecker: /[`₩~!@#$%<>^&*()\-=+_?<>:;"',.{}|[\]\/\\]/g,
        majorList: ["기계공학부","메카트로닉스공학부","전기전자통신공학부","컴퓨터공학부","디자인건축공학부","에너지신소재화학공학부","산업경영학부"],
        majorCode: ["120", "140", "161", "135", "136", "151", "174", "180"],
        genderList: ["남", "여"],
        selectGenderValue: "성별",
        phoneNumberChecker: /^\d{3}-\d{3,4}-\d{4}$/,
        //점주 계정
        emailChecker: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        email: '',
      }
    },
    methods: {
      adjustUserInfo: function (e) {
        if (this.name === "") {
          this.name = undefined;
        }
        if (this.nickname === "") {
          this.nickname === undefined;
        }
        if (this.passwordFirst === '' && this.passwordFirst === this.passwordSecond) {
          alert("기존 비밀번호가 그대로 사용됩니다.");
        } else {
          if (this.passwordFirst !== this.passwordSecond) {
            alert("입력하신 비밀번호가 일치하지 않습니다.");
            return;
          }
          if(this.passwordFirst.length < 6 || this.passwordFirst.length > 18){
            alert("비밀번호는 6자 이상 18자 이하여야 합니다.");
            return;
          }
          if (!this.passwordChecker.test(this.passwordFirst)) {
            alert("비밀번호는 하나 이상의 특수문자를 포함해야 합니다.");
            return;
          }
        }
        if (this.studentNumber === "") {
          this.studentNumber = undefined;
        }
        if(this.studentNumber != undefined && this.studentNumber != "") {
          let majorCode = this.studentNumber.substring(4, 7);
          let cnt = 0;
          if(this.studentNumber.length != 10) {
            alert("학번은 10자리 숫자여야 합니다.");
            return;
          }
          if(this.studentNumber.substring(0, 4) < 1992 || this.studentNumber.substring(0, 4) > new Date().getFullYear()){
            alert("올바른 입학년도가 아닙니다.");
            return;
          }
          for (let i = 0; i < this.majorCode.length; i++) {
            if (majorCode !== this.majorCode[i]) cnt++;
            if (cnt === 8) {
              alert('올바른 학부코드가 아닙니다.');
              return;
            }
          }
        }
        this.phoneNumber = this.phoneNumber === "" ? undefined : this.phoneNumber;
        if(this.phoneNumber !== undefined && !this.phoneNumberChecker.test(this.phoneNumber)) {
          alert("전화번호 양식을 지켜주세요. (Ex: 010-1234-5678)");
          return;
        }
        if(this.identity === 4 && (this.email === ' ' || this.emailChecker.test(this.email))) {
          alert("이메일 양식을 지켜주세요.")
          return;
        }
        if((this.nickname === undefined || this.nickname == this.$session.get("userInfo").nickname) || this.nicknameCheckFlag) {
          this.changeInfoFlag = true;
          this.$store.dispatch('adjustUserInfo', {
            token: this.$session.get("token"),
            portal_account: this.userId,
            password: this.passwordFirst,
            name: this.name,
            nickname: this.nickname,
            nicknameSession: this.$session.get("userInfo").nickname,
            gender: this.gender === "남" ? 0 : (this.gender === "여" ? 1 : undefined),
            identity: this.signUpIdentity,
            is_graduated: this.signUpIdentity == 4 ? true : false,
            major: this.signUpMajor,
            student_number: this.studentNumber,
            phone_number: this.phoneNumber,
            email: this.email
          }).then((data) => {
              this.changeInfoFlag = false;
              this.$session.set("userInfo", data);
              this.$router.go(-1);
          }, (error) => {
            if(!error) {
              this.changeInfoFlag = false;
            }
          });
        } else {
          alert("닉네임 중복확인을 해주세요.");
        }
      },
      nicknameCheck: function (e) {
        if(this.nicknameChecker.test(this.nickname)){
          alert("사용할 수 없는 닉네임입니다");
          return;
        }
        if(this.nickname === undefined || this.nickname === ""){
          alert("닉네임을 입력하여주세요.");
          return;
        }
        if(this.nickname ===this.$session.get("userInfo").nickname) {
          alert("기존에 등록된 닉네임입니다.");
          return;
        }
        this.$store.dispatch('nicknameCheck', {
          nickname: this.nickname
        }).then(() => {
          this.nicknameCheckFlag = true;
        })
      },
      nicknameInputChangeCheck() {
        this.nicknameCheckFlag = false;
      },
      clickSelectGenderBtn() {
        if (document.getElementById("select-gender-dropdown").style.display === 'none' || document.getElementById("select-gender-dropdown").style.display === '')
          document.getElementById("select-gender-dropdown").style.display = 'block';
        else
          document.getElementById("select-gender-dropdown").style.display = 'none';
      },
      clickGender(gender) {
        this.gender = gender;
        this.selectGenderValue = gender;
        document.getElementById("select-gender-dropdown").style.display = 'none';
        document.getElementsByClassName("drop-btn")[1].style.backgroundColor = '#175c8e';
        document.getElementsByClassName("drop-btn")[1].style.color = '#ffffff';
      },
      withdraw() {
        if(confirm("정말 탈퇴하시겠습니까? 탈퇴 후 데이터 복구는 불가능합니다.")) {
          this.$store.dispatch('userWithdrawal', {
            token: this.$session.get("token")
          }).then(flag => {
            if(flag) {
              alert("성공적으로 탈퇴되었습니다.");
              this.$session.clear();
              // this.$router.push('/');
              this.$router.replace(this.$route.query.redirect || '/');
            }
            else {
              alert("탈퇴에 실패했거나 이미 탈퇴한 계정입니다.");
            }
          })
        }
      },
      setMajorByStudentNumber () {
        let majorCode;
        if(this.studentNumber !== undefined)
          majorCode = this.studentNumber.substring(4, 7);
        if(majorCode === '120') {
          this.signUpMajor = '기계공학부';
          this.selectMajorValue = '기계공학부';
        } else if(majorCode === '140') {
          this.signUpMajor = '메카트로닉스공학부';
          this.selectMajorValue = '메카트로닉스공학부';
        } else if(majorCode === '161') {
          this.signUpMajor = '전기전자통신공학부';
          this.selectMajorValue = '전기전자통신공학부';
        } else if(majorCode === '136' || majorCode === '135') {
          this.signUpMajor = '컴퓨터공학부';
          this.selectMajorValue = '컴퓨터공학부';
        } else if(majorCode === '151') {
          this.signUpMajor = '디자인건축공학부';
          this.selectMajorValue = '디자인건축공학부';
        } else if(majorCode === '174') {
          this.signUpMajor = '에너지신소재화학공학부';
          this.selectMajorValue = '에너지신소재화학공학부';
        } else if(majorCode === '180') {
          this.signUpMajor = '산업경영학부';
          this.selectMajorValue = '산업경영학부';
        } else {
          this.signUpMajor = undefined;
          this.selectMajorValue = '학부 (학번 입력시 자동입력)';
        }
      }
    },
    computed: {
      ...mapGetters({
        nicknameFlag: 'nicknameFlag'
      })
    },
    created: function () {
      this.$store.dispatch("toggleSearchBarAction", false);
      console.log(this.$session.get("userInfo"));
      LoginCheck.loginCheck(this.$session.get("token")).then((flag) => {
          if (!flag){
            if( confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?"))
              this.$router.push('/login');
            else {
              this.$router.push('/');
            }
          }
          else {
            this.userInfo = this.$session.get("userInfo");
            this.userId = this.userInfo.portal_account;
            this.name = this.userInfo.name === null ? undefined : this.userInfo.name;
            this.nickname = this.userInfo.nickname === null ? undefined : this.userInfo.nickname;
            this.gender = this.userInfo.gender === 0 ? "남" : (this.userInfo.gender === 1 ? "여" : undefined);
            this.signUpIdentity = this.userInfo.identity;
            this.isGraduated = this.userInfo.is_graduated;
            this.signUpMajor = this.userInfo.major === null ? undefined : this.userInfo.major;
            this.studentNumber = this.userInfo.student_number === null ? undefined : this.userInfo.student_number;
            this.phoneNumber = this.userInfo.phone_number === null ? undefined : this.userInfo.phone_number;
            this.email = this.userInfo.email === null ? '': this.userInfo.email;
            console.log(this.userInfo)
          }
        }
      )
    },
    updated () {
      this.setMajorByStudentNumber();
    },
    mounted() {
      this.$store.dispatch("setNowRoutingPath", {
        path: "changeinfo"
      });
      this.$refs.password.focus();
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
    width: 390px;
    margin: 83px auto 53px auto;
  }

  .change-info img {
    width: 125px;
    margin-bottom: 43px;
  }

  input::placeholder {
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: -0.8px;
    text-align: left;
    color: #bec9d5;
  }

  .change-info .id input, .change-info .pw input {
    border:#d2dae2 1px solid;
    width: 366px;
    height: 41px;
    margin-bottom: 9px;
    padding-left: 20px;
    font-size: 15px;
  }

  .change-info input:disabled {
    background-color: #e5eaf0;
    border: solid 1px #d2dae2;
    color: #b5c1cd;
  }

  .change-info .pw-check input, .change-info .name input, .change-info .student-number input, .change-info .phone-number input, .change-info .email input {
    border:#d2dae2 1px solid;
    width: 366px;
    height: 41px;
    margin-bottom: 12px;
    padding-left: 20px;
    font-size: 15px;
  }

  .change-info .nickname {
    display: flex;
  }

  .change-info .nickname input {
    border:#d2dae2 1px solid;
    width: 281px;
    height: 41px;
    margin-bottom: 12px;
    margin-right: 6px;
    padding-left: 20px;
    font-size: 15px;
  }

  .nickname-button {
    width: 79px;
    height: 45px;
    background-color: #175c8e;
    color: #ffffff;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 2.17;
    letter-spacing: -0.6px;
    text-align: center;
    border: 1px solid #175c8e;
    font-size: 12px;
    cursor: pointer;
  }

  .help-desc {
    height: 12px;
    font-size: 12px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: -0.6px;
    text-align: left;
    color: #858585;
    margin-bottom: 16px;
    margin-left: 5px;
  }

  .select-list {
    width: 390px;
    display: flex;
    padding-bottom: 24px;
    margin-bottom: 15px;
    justify-content: center;
    border-bottom: 1px solid #d2dae2;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .drop-btn {
    width: 192px;
    margin: 0;
    height: 45px;
    border: 1px solid #d2dae2;
    cursor: pointer;
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.8px;
    text-align: center;
    color: #252525;
    text-align: left;
    padding-left: 19px;
  }

  .select-major .drop-btn {
    margin-right: 6px;
    cursor: default;
  }

  .drop-btn:disabled {
    background-color: #e5eaf0!important;
    border: solid 1px #d2dae2;
    color: #b5c1cd;
  }

  .dropdown-list {
    display: none;
    position: absolute;
    background-color: #ffffff;
    border: 1px solid #d2dae2;
    z-index: 1;
    width: 190px;
    margin: 0;
  }

  .dropdown-list a {
    color: black;
    font-size: 14px;
    padding: 10px 16px;
    text-decoration: none;
    display: block;
    border-bottom: 1px solid #d2dae2;
    cursor: pointer;
  }

  .dropdown-list a:hover {
    background-color: #175c8e;
    color: #ffffff;
  }

  .dropdown-list a:last-child {
    border-bottom: none;
  }

  .dropdown:active .dropdown-list {
    display: block;
  }

  .change-info-button {
    width: 390px;
    height: 45px;
    background-color: #175c83;
    border: 1px solid #175c8e;
    font-family: NanumSquare;
    color: #ffffff;
    font-size: 20px;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.3;
    letter-spacing: -1px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 6px;
    cursor: pointer;
    font-weight: 700;
  }

  .user-withdraw-button {
    width: 390px;
    height: 45px;
    background-color: #b6b6b6;
    border: 1px solid #b6b6b6;
    font-family: NanumSquare;
    color: #ffffff;
    font-size: 20px;
    font-weight: 700;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.3;
    letter-spacing: -1px;
    text-align: center;
    margin-top: 5px;
    margin-bottom: 19px;
    cursor: pointer;
  }

  .line {
    border-top: 1px solid #d2dae2;
  }

  .footer {
    height: 13px;
    font-family: NanumBarunGothic;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    text-align: center;
    color: #7d7d7d;
  }

  .footer .bold {
    color: #acabab;
    font-weight: 800;
  }

  .loading {
    padding-left: 47%;
    padding-right: 50%;
  }
  .gender-drop-btn{
    padding-top: 12px;
  }
  .select-gender img{
    width: 17px;
    float: right;
    padding-top: 3px;
    margin-right: 11px;
    opacity: 0.2;
  }

  @media (max-width: 576px) {
    .container {
      width: 100%;
      margin-top: 28px;
    }

    .change-info {
      width: 344px;
      padding-left: 8px;
      padding-right: 8px;
      margin-left: auto;
      margin-right: auto;
      padding-bottom: 100px;
    }

    .change-info-button {
      width: calc(100% - 8px);
      padding: 0;
      height: 34px;
      font-size: 15px;
    }

    .login img {
      margin-top: 30px;
      width: 105px;
      margin-right: 17px;
      margin-bottom: 60px;
    }

    .footer {
      font-size: 11px;
      margin-top: 8px;
    }

    * input {
      width: calc(100% - 22px) !important;
      padding-left: 10px !important;
      height: 32px !important;
      font-size :14px !important;
    }

    .change-info .nickname input {
      width: 232px !important;
      margin-right: 10px;
    }

    .change-info .nickname {
      margin-left: 5px;
    }
    .drop-btn {
      width: 162px;
    }

    .select-major .drop-btn {
      margin-right: 11px;
      padding-left: 5px;
      font-size :14px;
    }

    textarea {
      width: calc(100% - 50px);
      height: 90px;
    }

    .select-list, .access-terms{
      margin-left: 5px;
      margin-right: 5px;
      font-size: 15px;
    }
    .help-desc {
      margin-bottom: 12px;
    }
    .show-personal-data-terms, .show-koin-terms {
      margin-left: 5px;
      margin-right: 5px;
    }

    .nickname-button {
      height: 36px;
    }

    .change-info img {
      margin-top: 60px;
      width: 104px;
      margin-right: 15px;
      margin-bottom: 64px;
    }
    .drop-btn img {
      width: 17px;
      height: 12px;
      float: right;
      margin-top: 4px;
      margin-right: 5px;
    }
    .dropdown-list {
      width: 160px;
    }
    .dropdown-list a {
      width: 128px;
    }

    .user-withdraw-button {
      width: calc(100% - 8px);
      height: 32px;
      font-size: 15px;
    }

    .select-list {
      width: calc(100% - 24px);
      padding-left: 7px;
    }
  }
</style>
