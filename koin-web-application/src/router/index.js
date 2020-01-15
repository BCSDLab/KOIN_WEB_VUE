import Vue from 'vue'
import Router from 'vue-router'
import VueSessionStorage from 'vue-sessionstorage'

import Test from '@/SpaComponents/Test'

import Login from '@/SpaComponents/UserFunction/UserLogin/UserLogin'
import SignUp from '@/SpaComponents/UserFunction/UserSignUp/UserSignUp'
import FindPw from '@/SpaComponents/UserFunction/UserFindPw/UserFindPw'
import ChangeInfo from '@/SpaComponents/UserFunction/UserChangeInfo/UserChangeInfo'
import Index from '@/SpaComponents/IndexFunction/Index'
import BoardPlate from '@/SpaComponents/BoardFunction/BoardPlate'
import BoardList from '@/SpaComponents/BoardFunction/BoardList/BoardList'
import BoardDetail from '@/SpaComponents/BoardFunction/BoardDetail/BoardDetail'
import BoardRegister from '@/SpaComponents/BoardFunction/BoardRegister/BoardRegister'
import BoardAdjust from '@/SpaComponents/BoardFunction/BoardAdjust/BoardAdjust'
import Bus from '@/SpaComponents/BusFunction/Bus'
import Diet from '@/SpaComponents/DietFunction/Diet'
import Faq from '@/SpaComponents/FaqFunction/Faq'
import RoomList from '@/SpaComponents/RoomFunction/RoomList/RoomList'
import RoomDetail from '@/SpaComponents/RoomFunction/RoomDetail/RoomDetail'
import StoreList from '@/SpaComponents/StoreFunction/StoreList/StoreList'
import StoreDetail from '@/SpaComponents/StoreFunction/StoreDetail/StoreDetail'
import UsedMarketList from '@/SpaComponents/UsedMarketFunction/UsedMarketList/UsedMarketList'
import UsedMarketDetail from '@/SpaComponents/UsedMarketFunction/UsedMarketDetail/UsedMarketDetail'
import UsedMarketRegister from '@/SpaComponents/UsedMarketFunction/UsedMarketRegister/UsedMarketRegister'
import UsedMarketAdjust from '@/SpaComponents/UsedMarketFunction/UsedMarketAdjust/UsedMarketAdjust'
import CircleList from '@/SpaComponents/CircleFunction/CircleList/CircleList'
import CircleDetail from '@/SpaComponents/CircleFunction/CircleDetail/CircleDetail'
import LostItemList from '@/SpaComponents/LostFunction/LostItemList/LostItemList'
import LostItemDetail from '@/SpaComponents/LostFunction/LostItemDetail/LostItemDetail'
import LostItemRegister from '@/SpaComponents/LostFunction/LostItemRegister/LostItemRegister'
import LostItemAdjust from '@/SpaComponents/LostFunction/LostItemAdjust/LostItemAdjust'
import TimeTable from '@/SpaComponents/TimeTableFunction/TimeTable'
import Index2 from '@/SpaComponents/IndexFunction/Index2'
import PrivacyPolicy from '@/SpaComponents/PrivacyPolicy';
import NotFound from '@/SpaComponents/404'
import SearchResult from '@/SpaComponents/SearchFunction/SearchResult'
// TODO: 게시판, 버스, 식단, faq, 상점 컴포넌트화

Vue.use(Router)
Vue.use(VueSessionStorage)

export var router = new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '*', component: NotFound,
      name: 'NotFound'
    },
    {
      path: '/test', component: Test,
      name: 'Test'
    },
    //메인화면
    {
      path: '', component: Index2,
      name: 'Index2'
    },
    //유저
    {
      path: '/login', component: Login,
      name: 'Login',
    },
    {
      path: '/signup', component: SignUp,
      name: 'SignUp'
    },
    {
      path: '/findpw', component: FindPw,
      name: 'FindPw'
    },
    {
      path: '/changeinfo', component: ChangeInfo,
      name: 'ChangeInfo'
    },
    //버스
    {
      path: '/bus', component: Bus,
      name: 'Bus'
    },
    //식단
    {
      path: '/diet', component: Diet,
      name: 'Diet'
    },
    //faq
    {
      path: '/faq', component: Faq,
      name: 'Faq'
    },
    //복덕방
    {
      path: '/room', component: RoomList,
      name: 'RoomList'
    },
    {
      path: '/room/:id', component: RoomDetail,
      name: 'RoomDetail'
    },
    //상점
    {
      path: '/store', component: StoreList,
      name: 'StoreList'
    },
    {
      path: '/store/:store_id', component: StoreDetail,
      name: 'StoreDetail'
    },
    //게시판
    {
      path: '/board',
      component: BoardPlate,
      name: 'BoardPlate',
      children: [
        // 각 게시판 리스트
        {
          path: 'notice',
          component: BoardList
        },
        {
          path: 'free',
          component: BoardList
        },
        {
          path: 'job',
          component: BoardList
        },
        {
          path: 'anonymous',
          component: BoardList
        },
        {
          path: 'question',
          component: BoardList
        },
        // 각 게시판 등록
        {
          path: 'notice/register',
          component: BoardRegister,
        },
        {
          path: 'free/register',
          component: BoardRegister,
        },
        {
          path: 'job/register',
          component: BoardRegister,
        },
        {
          path: 'anonymous/register',
          component: BoardRegister,
        },
        {
          path: 'question/register',
          component: BoardRegister,
        },
        // 각 게시판 수정
        {
          path: 'notice/adjust',
          component: BoardAdjust,
        },
        {
          path: 'free/adjust',
          component: BoardAdjust,
        },
        {
          path: 'job/adjust',
          component: BoardAdjust,
        },
        {
          path: 'anonymous/adjust',
          component: BoardAdjust,
        },
        {
          path: 'question/adjust',
          component: BoardAdjust,
        },
        // 각 게시판 상세
        {
          path: 'notice/:id',
          component: BoardDetail,
        },
        {
          path: 'free/:id',
          component: BoardDetail,
        },
        {
          path: 'job/:id',
          component: BoardDetail,
        },
        {
          path: 'anonymous/:id',
          component: BoardDetail,
        },
        {
          path: 'question/:id',
          component: BoardDetail,
        },
      ]
    },
    /*{
      path: '/board/free', component: BoardList,
      name: 'BoardList',
      children: [
        {
          path: '/board/notice',
          component: BoardList
        },
        {
          path: '/board/free',
          component: BoardList
        },
        {
          path: '/board/job',
          component: BoardList
        },
        {
          path: '/board/anonymous',
          component: BoardList
        },
        {
          path: '/board/question',
          component: BoardList
        }
      ]
    },
    {
      path: '/board/free/:id', component: BoardDetail,
      name: 'BoardDetail',
      children: [
        {
          path: '/board/notice/:id',
          component: BoardDetail,
        },
        {
          path: '/board/free/:id',
          component: BoardDetail,
        },
        {
          path: '/board/job/:id',
          component: BoardDetail,
        },
        {
          path: '/board/anonymous/:id',
          component: BoardDetail,
        },
        {
          path: '/board/question/:id',
          component: BoardDetail,
        }
      ]
    },
    {
      path: '/board/register/', component: BoardRegister,
      name: 'BoardRegister'
    },
    {
      path: '/board/adjust', component: BoardAdjust,
      name: 'BoardAdjust'
    },*/
    //중고장터
    {
      path: '/market', component: UsedMarketList,
      name: 'UsedMarketList',
      children: [
        {
          path: '/market/sell',
          component: UsedMarketList,
        },
        {
          path: '/market/buy',
          component: UsedMarketList
        }
      ]
    },
    {
      path: '/market/detail/:id', component: UsedMarketDetail,
      name: 'UsedMarketDetail',
      children: [
        {
          path: '/market/sell/:id',
          component: UsedMarketDetail,
        },
        {
          path: '/market/buy/:id',
          component: UsedMarketDetail,
        },
      ]
    },
    {
      path: '/market/register', component: UsedMarketRegister,
      name: 'UsedMarketRegister',
      meta: {authRequired: true},
    },
    {
      path: '/market/adjust', component: UsedMarketAdjust,
      name: 'UsedMarketAdjust',
      meta: {authRequired: true},
    },
    //동아리
    {
      path: '/circle', component: CircleList,
      name: 'CircleList'
    },
    {
      path: '/circle/:circle_id', component: CircleDetail,
      name: 'CircleDetail'
    },
    // 분실물
    {
      path: '/lost', component: LostItemList,
      name: 'LostItemList'
    },
    {
      path: '/lost/detail/:id', component: LostItemDetail,
      name: 'LostItemDetail',
    },
    {
      path: '/lost/register', component: LostItemRegister,
      name: 'LostItemRegister',
      meta: {authRequired: true}
    },
    {
      path: '/lost/adjust', component: LostItemAdjust,
      name: 'LostItemAdjust',
      meta: {authRequired: true}
    },
    {
      path: '/timetable', component: TimeTable,
      name: 'TimeTable'
    },
    {
      path: '/privacy-policy', component: PrivacyPolicy,
      name: 'PrivacyPolicy'
    },
    {
      path: '/search', component: SearchResult,
      props: (route) => ({ query: route.query.q }),
      name: 'SearchResults'
    }
  ]
});
import * as LoginCheck from '../stores/loginCheck'
import {store} from "../stores/store";
import * as api from "../api/api";

router.beforeEach(function (to, from, next) {
    // to: 이동할 url에 해당하는 라우팅 객체
    let destination = to.path;
    if (to.matched.some(function (routeInfo) {
      return routeInfo.meta.authRequired;
    })) {
      //쿠키의 autoLoginFlag 확인
      let autoLoginFlagCookie = document.cookie.match('(^|;) ?' + 'autoLoginFlag' + '=([^;]*)(;|$)');
      let autoLoginFlag = autoLoginFlagCookie ? autoLoginFlagCookie[2] : null;
      let tokenCookie = document.cookie.match('(^|;) ?' + 'token' + '=([^;]*)(;|$)');
      let token = tokenCookie ? tokenCookie[2] : null;
      let sessionStorage = JSON.parse(window.sessionStorage.getItem(window.sessionStorage.getItem('sessionKey')));
      //자동로그인을 한적이 있는 경우 === 쿠키에 토큰이 존재하는경우
      if (token !== null && token !== undefined && token !== "" && token !== 'null') {
        LoginCheck.loginCheck(token).then((authFlag) => {
          //토큰 유효한 경우
          if (authFlag) {
            let today = new Date();
            today.setHours(today.getHours()+9);
            //토큰 기한이 24시간 보다 적은 경우
            if(Math.floor((window.$cookies.get("tokenExpireTime")-today.getTime())/1000/60/60) < 24){
              api.refresh(token).then((res)=> {
                let expireTime = new Date();
                expireTime.setDate(expireTime.getDate()+3);
                expireTime.setHours(expireTime.getHours()+9)

                window.$cookies.set("token",res.data.access_token, expireTime);
                window.$cookies.set("tokenExpireTime", expireTime.getTime(), expireTime);
                sessionStorage['token'] = res.data.access_token;
                window.sessionStorage.setItem(window.sessionStorage.getItem('sessionKey'), JSON.stringify(sessionStorage));
                store.state.Authentification.token = res.data.access_token;
                next()
              }, (err)=>{
                if (confirm("로그인이 만료되었습니다. 로그인 하시겠습니까?") === true) {
                  sessionStorage['destinationPath'] = destination;
                  window.sessionStorage.setItem(window.sessionStorage.getItem('sessionKey'), JSON.stringify(sessionStorage));
                  router.push('/login');
                }
                else {
                  delete sessionStorage['token'];
                  delete sessionStorage['userInfo'];
                  store.state.Authentification.token = null;
                  window.$cookies.remove("token");
                  window.sessionStorage.setItem(window.sessionStorage.getItem('sessionKey'), JSON.stringify(sessionStorage));
                  router.push('/')
                }
              })
            }
            else{
              next();
            }
          }
          //토큰 유효하지 않은 경우
          else {
            if (confirm("로그인이 만료되었습니다. 로그인 하시겠습니까?") === true) {
              sessionStorage['destinationPath'] = destination;
              window.sessionStorage.setItem(window.sessionStorage.getItem('sessionKey'), JSON.stringify(sessionStorage));
              router.push('/login');
            }
            else {
              delete sessionStorage['token'];
              delete sessionStorage['userInfo'];
              store.state.Authentification.token = null;
              window.$cookies.remove("token");
              window.sessionStorage.setItem(window.sessionStorage.getItem('sessionKey'), JSON.stringify(sessionStorage));
              router.push('/')
            }
          }
        })
      }
      //자동로그인을 해제한 경우
      else {
        let sessionStorage = JSON.parse(window.sessionStorage.getItem(window.sessionStorage.getItem('sessionKey')));
        //로그인을 아예 안한상태(토큰이 없는경우)
        if (sessionStorage === null || sessionStorage.token === undefined) {
          if (confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?") === true) {
            // 세션스토리지가 활성화된경우
            if (sessionStorage !== null) {
              sessionStorage['destinationPath'] = destination;
              window.sessionStorage.setItem(window.sessionStorage.getItem('sessionKey'), JSON.stringify(sessionStorage));
            }
            // 세션스토리지가 활성화 안된경우
            else {
              window.sessionStorage.setItem('destinationPath', destination);
            }
            router.push('/login');
          }
          else {
            //아예 새로 들어온 경우
            if (sessionStorage === null) {
              router.push('')
            }
          }
          return;
        }
        //로그인을 해서 토큰이 있는 경우
        if (sessionStorage.token !== undefined || sessionStorage.token !== null || sessionStorage.token !== "") {
          //토큰 유효성 검증
          LoginCheck.loginCheck(sessionStorage.token).then((authFlag) => {
              //토큰 유효한 경우
              if (authFlag) {
                //TODO: 토큰 유효하지만 refresh를 시켜야하는 경우
                next()
              }
              //토큰 유효하지 않은 경우
              else {
                if (confirm("로그인이 만료되었습니다. 로그인 하시겠습니까?") === true) {
                  sessionStorage['destinationPath'] = destination;
                  window.sessionStorage.setItem(window.sessionStorage.getItem('sessionKey'), JSON.stringify(sessionStorage));
                  router.push('/login');
                }
                else {
                  delete sessionStorage['token'];
                  delete sessionStorage['userInfo'];
                  window.$cookies.remove("token");
                  store.state.Authentification.token = null;
                  window.sessionStorage.setItem(window.sessionStorage.getItem('sessionKey'), JSON.stringify(sessionStorage));
                  router.push('/');
                }
              }
            }
          )
        }
      }


    }
    else {
      next(); // 페이지 전환
    }
    ;
  }
)
;

