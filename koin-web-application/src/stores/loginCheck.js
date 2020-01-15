import * as api from "../api/api";
import {store} from './store'

export function loginCheck(token, type = "") {
  return new Promise(
    (resolve) => {
      // token이 session에 올라와 있는 경우
      // 즉 로그아웃, 세션끊킴이 없어서 토큰이 세션에 유지되있는 경우
      // true  resolve 시 토큰 유효함
      // false resolve 시 토큰 갱신을 위한 로그인으로 이동
      if (token !== undefined) {
        // 토큰 유효성 검사
        api.loginCheck(token)
          .then((res) => {
              // 토큰 유효한 경우 true를 resolve
              if (res.status === 200) {
                let sessionStorage = JSON.parse(window.sessionStorage.getItem(window.sessionStorage.getItem('sessionKey')));
                let tokenCookie = document.cookie.match('(^|;) ?' + 'token' + '=([^;]*)(;|$)');
                let token = tokenCookie ? tokenCookie[2] : null;
                if(token !== null && token !==undefined && token !== ''){
                  sessionStorage['token'] = token;
                  sessionStorage['userInfo'] = res.data;
                  store.state.Authentification.token = token;
                  window.sessionStorage.setItem(window.sessionStorage.getItem('sessionKey'), JSON.stringify(sessionStorage));
                }
                resolve(true);
              }
              // 토큰이 유효하지 않은 경우 401 error
            }, (error) => {
              // 토큰 갱신을 위해 로그인 유도
              resolve(false);
            }
          )
      }
      // token이 세션에 안 올라온 경우
      // 즉 로그아웃을 했거나(세션스토리지 클린한상태) 아예 새로운 세션으로 접속한 경우
      else {
        // 토큰이 세션에 없는 경우 로그인을 하려고 할 때를 위해 type을 사용
        if (type !== "login") {
          resolve(false);
        }
      }
    })
}

