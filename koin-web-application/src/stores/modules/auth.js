import sha256 from "sha256";
import * as api from "../../api/api";

const defaultState = {
  token: "",
  userInfo: "",
  nicknameCheck: false,
  nickname: "",
  nicknameFlag: false
};

const actions = {
  refresh: (context, payload) => {
    return new Promise(
      (resolve, reject) => {
        api.refresh(payload.token).then((res)=> {
          console.log(res);
          context.commit("tokenUpdate", res.data.token);
          resolve(res.data.token);
        }, (err)=>{
          reject(false);
        })
      })
  },
  login: (context, payload) => {
    return new Promise(
      (resolve, reject) => {
        let body = {
          portal_account: payload.InputUserId,
          password: sha256(payload.InputUserPw)
        };
        api.login(body).then((res) => {
              context.commit("tokenUpdate", res.data.token);
              context.commit("userInfoUpdate", res.data.user);
              resolve([res.data.user, res.data.token])
            },
            (err) => {
              if (err.message.indexOf("401") !== -1) {
                alert("ID와 비밀번호를 확인해주세요");
                reject(401)
              } else if(err.message.indexOf("422") !== -1) {
                alert("계정명이 형식에 맞지 않습니다");
                reject(422);
              } else {
                alert("네트워크를 확인해주세요");
                reject(500)
              }
            }
          )
      })
  },
  logout: (context, payload) => {
    return new Promise(
      (resolve, reject) => {
        api.logout(payload.token)
          .then((res) => {
            if (res.status === 200) {
              context.commit("tokenUpdate", null);
              context.commit("userInfoUpdate", null);
              resolve(true)
            }
          },
          (error) => {
            context.commit("tokenUpdate", null);
            context.commit("userInfoUpdate", null);
            resolve(true)
        })
      })
  },
  nicknameCheck: (context, payload) => {
    return new Promise((resolve, reject) => {
      api.nicknameCheck(payload.nickname).then((res) => {
        if (res.status === 200) {
          alert("사용가능한 닉네임 입니다.")
          context.commit("nicknameCheckUpdate", true);
          context.commit("nicknameUpdate", payload.nickname);
          resolve(true);
        }
      }, (err) => {
        if(err.message.indexOf("409") != -1){
          alert("중복되는 닉네임 입니다.");
          context.commit("nicknameCheckUpdate", false);
          context.commit("nicknameUpdate", null);
          reject(false);
        }
      })
    })
  },
  signUp(context, payload) {
    if (payload.nickname === undefined || context.state.nicknameCheck) {
      let body = {
        portal_account: payload.portal_account,
        password: sha256(payload.password),
        name: payload.name,
        nickname: payload.nickname,
        gender: payload.gender,
        identity: payload.identity,
        is_graduated: payload.is_graduated,
        major: payload.major,
        student_number: payload.student_number,
        phone_number: payload.phone_number
      };
      return new Promise((resolve, reject)=> {
        api.signUp(body).then((res) => {
          resolve(res);
          alert("회원가입메일이 발송되었습니다.")
        }, (err) => {
          if(err.message.indexOf("409") != -1){
            reject(false)
            alert("이미 가입된 계정입니다.");
          }
          if(err.message.indexOf("412") != -1 || err.message.indexOf("422") != -1){
            reject(false)
            alert("입력한 형식이 맞지 않습니다.");
          }
        })
      })

    }
    else {
      alert("닉네임 중복확인을 해주세요");
    }
  },
  findPw(state, payload) {
    return new Promise((resolve, reject)=>{
      let body = {
        portal_account: payload.inputUserId
      };
      api.findPw(body).then((res) => {
        console.log(res);
        if (res.status === 200 || res.status === 201) {
          alert("아우누리 이메일로 비밀번호 메일을 보냈습니다. 확인부탁드립니다.")
          resolve(true);
        }
      }, (err) => {
        if (err.message.indexOf("422") != -1) {
          alert("계정명이 형식에 맞지 않습니다.")
        } else if (err.message.indexOf("404") != -1) {
          alert("유효하지 않은 아이디입니다.");
        }
        resolve(false);
      })
    });
  },
  adjustUserInfo(context, payload) {
    return new Promise(
      (resolve, reject) => {
        if (payload.nickname != undefined && payload.nickname != null && payload.nickname != ""){
          context.commit('nicknameFlagUpdate', false);
        }
        if (payload.nickname === undefined || context.state.nicknameCheck || (!context.state.nicknameCheck && payload.nickname === payload.nicknameSession)) {
          let body = {
            portal_account: payload.portal_account,
            name: payload.name,
            nickname: payload.nickname,
            gender: payload.gender,
            identity: payload.identity,
            is_graduated: payload.is_graduated,
            major: payload.major,
            student_number: payload.student_number,
            phone_number: payload.phone_number
          }
          if (payload.password != null && payload.password !== "") {
            body["password"] = sha256(payload.password)
          }
          api.adjustUserInfo(payload.token, body).then((res) => {
            alert("회원정보가 수정되었습니다.");
            context.commit("userInfoUpdate", res.data.userInfo);
            context.commit("nicknameCheckUpdate", false);
            resolve(res.data)
          }, (err)=>{
            alert("회원정보 수정에 문제가 발생했습니다.");
            reject(false)
          })
        }
        else {
          alert("닉네임 중복확인을 해주세요")
          reject(false)
        }
      })
  },
  userWithdrawal (context, payload) {
    return new Promise((resolve, reject) => {
      api.userWithdrawal(payload.token).then(res => {
        context.commit("tokenUpdate", null);
        context.commit("userInfoUpdate", null);
        resolve(true);
      }, error => {
        reject(false);
      })
    })

  },
  nicknameFlagCheck (context, payload) {
    return new Promise((resolve, reject) => {
      if(context.state.nicknameFlag == true){
        if(payload.nickname === null || payload.nickname === "" || payload.nickname === undefined) {
          resolve(true);
        } else {
          reject(false);
        }
      } else {
        context.commit('nicknameFlagUpdate', true);
      }
    })
  }
};

const mutations = {
  tokenUpdate: (state, data) => {
    state.token = data;
  },
  userInfoUpdate: (state, data) => {
    state.userInfo = data;
  },
  nicknameCheckUpdate: (state, data) => {
    state.nicknameCheck = data;
  },
  nicknameUpdate: (state, data) => {
    state.nickname = data;
  },
  nicknameFlagUpdate: (state, data) => {
    state.nicknameFlag = data;
  }
};

const getters = {
  token: state => state.token,
  userInfo: state => state.userInfo,
  nicknameCheck: state => state.nicknameCheck,
  nickname: state => state.nickname,
  nicknameFlag: state => state.nicknameFlag
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};

//인증용 vuex 모듈
// noinspection JSAnnotator
const Authentification = {
  state: {},
  getters: {},
  //TODO: session에 token userinfo 저장
  actions: {}
}
