<template>
  <!--navigation margin size control container-->
  <transition
    key="total"
    name="slide-fade-down">
    <div
      id="navigation"
      slide-fade-down-transition
      v-show="!(nowRoutingPath==='login' || nowRoutingPath==='singup' || nowRoutingPath==='findpw' || nowRoutingPath==='changeinfo')"
      class="nav__container primary">
      <!--main navigation start-->
      <div
        :class="{'fixed': mobileMenuFlag}"
        class="nav primary">
        <transition
          fade-3-transition
          mode="out-in"
          name="fade-3">
          <img
            @click="clickMobileMenu()"
            src="https://static.koreatech.in/assets/img/menu.png"
            v-if="!mobileMenuFlag && !searchBarFlag"
            class="nav__menu__btn">
          <img
            @click="clickMobileMenu()"
            src="https://static.koreatech.in/assets/img/back-menu.png"
            v-if="mobileMenuFlag || searchBarFlag"
            class="nav__menu__btn">
        </transition>
        <!--navigation logo-->
        <transition
          fade-2-transition
          mode="out-in"
          :class="{'fixed': mobileMenuFlag}"
          name="fade-2">
          <img
            v-if="showMobileLogo"
            class="nav__logo"
            src="https://static.koreatech.in/assets/img/logo_white.png"
            @click="clickLogo">
          <div
            v-if="!mobileMenuFlag"
            class="nav__menu__top-service">
            {{ title }}
          </div>
          <div
            class="nav__menu__top-service"
            v-if="mobileMenuFlag">
            전체 서비스
          </div>
        </transition>
        <div
            class="nav__menu__mobile-search-bar"
            v-if="searchBarFlag && !mobileMenuFlag && nowRoutingPath === 'search'">
            <search-bar></search-bar>
        </div>
        <transition
          fade-3-transition
          mode="out-in"
          name="fade-3">
          <img
            src="http://static.koreatech.in/assets/img/ic-search.png"
            class="nav__menu__search"
            v-if="(!mobileMenuFlag) && nowRoutingPath === 'index'"
            @click="$router.push('/search'); openSearchBar()">
        </transition>
        <!--mega-menu start-->
        <div class="mega-menu">

          <!--mega-menu top btn-->
          <button
            class="mega-menu__top-btn"
            v-for="category in categoryList"
            :key="category.id"
            @mouseover="selectedCategory = category.title">
            {{ category.title }}

            <!--mega menu top btn's new logo-->
            <div
              class="mega-menu__new-logo"
              v-if="category.newFlag">
              N
            </div>
          </button>

          <!--mega-menu pane's conntainer(about background)-->
          <div class="mega-menu__pane-container">

            <!--mega-menu__pane-container pane-->
            <div class="mega-menu__pane">

              <!--mega-menu__pane-content-->
              <div class="mega-menu__pane-content">

                <!--mega-menu-content's menu column-->
                <div
                  class="mega-menu__pane-content__menus weak-font"
                  v-for="(menu, index) in setMenu"
                  :style="menuStyle(index)"
                  :key="menu.id">


                  <!--mega-menu-content's specific menu-->
                  <a
                    @click="clickTopnav(menu.link, menu.tag, menu.planFlag, menu.title)"
                    :key="menu.id">
                    {{ menu.title }}

                    <!--mega-menu-content's specific menu's new logo-->
                    <div
                      v-if="menu.newFlag"
                      class="mega-menu__pane-content__menu__new-logo">
                      N
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="search-bar__section"
          v-if="searchBarFlag">
          <search-bar>
          </search-bar>
        </div>

        <a
          class="weak-font nav__user nav__user--second-item"
          @click="clickRightTopnav('login')"
          v-if="token==null || token===''">로그인</a>
        <a
          class="weak-font nav__user nav__user--second-item"
          @click="logout()"
          v-if="token!=null && token!==''">로그아웃</a>
        <a class="nav__user--border"></a>
        <a
          class="weak-font nav__user nav__user--first-item"
          @click="clickRightTopnav('signup')"
          v-if="token==null || token===''">회원가입</a>

        <a
          class="weak-font nav__user nav__user--first-item"
          @click="clickRightTopnav('changeinfo')"
          v-if="token!=null && token!==''">정보수정</a>
        <img
          src="http://static.koreatech.in/assets/img/ic-search.png"
          class="nav__user search-icon"
          @click="openSearchBar()"/>
        <!-- <img
          src="http://static.koreatech.in/assets/img/ic-time-table.png"
          class="nav__user timetable-icon"
          v-if="token!=null && token!==''"
          @mouseover="timetableFlag = true"
          @mouseleave="timetableFlag = false" /> -->
      </div>

      <transition
        key="only-mobile"
        name="slide-fade">
        <div
          v-if="mobileMenuFlag"
          class="mobile__menu">
          <topnav-mobile @childs-event="clickMobileCategory"></topnav-mobile>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
  import * as CATEGORY from '../../static/category.js'
  import {mapGetters} from 'vuex';
  import TopnavMobile from './TopnavMobile';
  import SearchBar from './Components/SearchBar';
  export default {
    name: 'Topnav',
    components: {
      'topnav-mobile' : TopnavMobile,
      'search-bar': SearchBar
    },
    data() {
      return {
        categoryList: CATEGORY.default,
        mobileMenuFlag: false,
        mobileLogoFlag: false,
        name: '',
        path: undefined,
        title: '',
        routeInfo: [
          { path: 'bus', title: '버스/교통' },
          { path: 'store', title: '주변상점' },
          { path: 'diet', title: '식단' },
          { path: 'circle', title: '동아리' },
          { path: 'faq', title: 'FAQ' },
          { path: 'room', title: '복덕방' },
          { path: 'lost', title: '분실물' },
          { path: 'market/sell', title: '팝니다' },
          { path: 'market/buy', title: '삽니다' },
          { path: 'board/free', title: '자유게시판' },
          { path: 'board/job', title: '취업게시판' },
          { path: 'board/anonymous', title: '익명게시판' },
          { path: 'board/question',  title: '질문게시판' },
          { path: 'board/notice', title: '공지사항' },
          { path: 'board/promotion', title: '홍보게시판' },
          { path: 'timetable', title: '시간표' },
          { path: 'search', title: '검색결과' },
        ],
        selectedCategory: '',
        authBoxFlag: false,
        timetableFlag: false,
        searchWord: ''
      }
    },
    computed: {
      ...mapGetters({
        token: 'token',
        userInfo: 'userInfo',
        nowRoutingPath: "nowRoutingPath",
        footerCategoryFlag: "footerCategoryFlag",
        searchBarFlag: "searchBarFlag",
        recentSearchWords: "recentSearchWords"
      }),
      showMobileLogo () {
        if (!this.mobileMenuFlag && this.mobileLogoFlag && (this.name === 'NotFound' || this.name === 'Index2')) {
          return true;
        } else if (!this.mobileMenuFlag && !this.mobileLogoFlag) {
          return true;
        } else {
          return false;
        }
      },
      setMenu () {
        for(let category of this.categoryList) {
          if (category.title === this.selectedCategory) {
            return category.submenu;
          }
        }
      },
      displayNickname () {
        if (this.userInfo.nickname === undefined || this.userInfo.nickname === null) {
          return this.userInfo.portal_account;
        } else {
          return this.userInfo.nickname
        }
      }
    },
    watch: {
      footerCategoryFlag: function() {
        // 닫혀 있는 경우
        console.log("DMFLkml")
        if(!this.mobileMenuFlag) {
          //mobile sidenav display decision
          this.mobileMenuFlag = true;
          this.$store.dispatch("setNowFooterCategory", {
            footerCategoryIndex: 1
          });
          console.log(1)
          if(window.innerWidth < 576 && (this.nowRoutingPath==='login' || this.nowRoutingPath==='singup' || this.nowRoutingPath==='findpw' || this.nowRoutingPath==='changeinfo')) {
            document.getElementById('navigation').style.display="block";
            console.log(2)
          }
        }
        // 열려 있는 경우
        else {
          console.log("this.nowRoutingPath" ,this.nowRoutingPath)
          console.log("this.$router.currentRoute.path", this.$router.currentRoute.path)
          console.log(3)
          this.mobileMenuFlag = false;
          if(this.$router.currentRoute.path === '/') {
            console.log(4)
            this.$store.dispatch("setNowFooterCategory", {
              footerCategoryIndex: 0
            });
          }
          else if (this.$router.currentRoute.path === '/changeinfo'){
            console.log(5)
            this.$store.dispatch("setNowFooterCategory", {
              footerCategoryIndex: 2
            });
          }
          else if (this.$router.currentRoute.path === '/login'){
            console.log(6)
            this.$store.dispatch("setNowFooterCategory", {
              footerCategoryIndex: 1
            });
          }
          else {
            console.log(7)
            this.$store.dispatch("setNowFooterCategory", {
              footerCategoryIndex: -1
            });
          }


          console.log(window.innerWidth)
          // 정보수정 창에서 닫힐 때
          if(window.innerWidth < 576 &&(this.nowRoutingPath==='login' || this.nowRoutingPath==='singup' || this.nowRoutingPath==='findpw' || this.nowRoutingPath==='changeinfo')) {
            console.log(7)
            if(this.$router.currentRoute.path === '/') {
              this.$store.dispatch("setNowFooterCategory", {
                footerCategoryIndex: 0
              });
            }
            else if (this.$router.currentRoute.path === '/changeinfo'){
              this.$store.dispatch("setNowFooterCategory", {
                footerCategoryIndex: 2
              });
            }
            else if (this.$router.currentRoute.path === '/login'){
              console.log("dflmlkm")
              this.$store.dispatch("setNowFooterCategory", {
                footerCategoryIndex: -1
              });
            }
            else {
              this.$store.dispatch("setNowFooterCategory", {
                footerCategoryIndex: -1
              });
            }
            console.log("fkmlakmfnasdlfkn")
            document.getElementById('navigation').style.display="none";
          }
        }
      },
      '$route.path'(newValue) {
        this.path = this.$router.history.current.path;
        this.name = this.$router.history.current.name;
        this.setTitle();
      },
      '$route.query.q'(newValue) {
        if (newValue !== undefined) {
          this.searchWord = newValue;
        } else {
          this.searchWord = '';
        }
      }
    },
    methods: {
      clickMobileCategory: function(msg) {
        this.mobileMenuFlag = false;
      },
      clickMobileMenu: function () {
        if (this.searchBarFlag) {
          this.openSearchBar();
          return ;
        }
        if(this.$router.currentRoute.path === '') {
          this.$store.dispatch("setNowFooterCategory", {
            footerCategoryIndex: this.mobileMenuFlag ? 0 : 1
          });
        }
        else if (this.$router.currentRoute.path === 'changeinfo'){
          this.$store.dispatch("setNowFooterCategory", {
            footerCategoryIndex: this.mobileMenuFlag ? 2 : 1
          });
        }
        else {
          this.$store.dispatch("setNowFooterCategory", {
            footerCategoryIndex: this.mobileMenuFlag ? -1 : 1
          });
        }

        this.mobileMenuFlag = !this.mobileMenuFlag;
      },
      clickLogo: function () {
        this.$router.push('/');
      },
      clickTopnav: function (link, tag, planFlag, title) {
        if (tag !== null) {
          this.$session.set("nowBoardPageNum", 1);
          this.$session.set("nowBoardId", tag);
          switch (tag) {
            case 4:
              this.$router.push('/board/notice');
              break;
            case 1:
              this.$router.push('/board/free');
              break;
            case 2:
              this.$router.push('/board/job');
              break;
            case 3:
              this.$router.push('/board/anonymous');
              break;
            case -1:
              this.$router.push('/board/anonymous');
              break;
            case 5:
              this.$router.push('/lost');
              break;
            case 6:
              this.$router.push('/board/promotion');
              break;
            case 10:
              this.$router.push('/board/question');
              break;
          }
        }
        else {
          if (planFlag === false && title !== null) {
            if (link === 'market/sell')
              this.$session.set("nowMarketId", 0)
            else
              this.$session.set("nowMarketId", 1)

            this.$router.push('/' + link);
            this.$session.set("nowMarketPageNum", 1);
          }
          else {
            alert("서비스 준비중 입니다.");
          }
        }
      },
      clickRightTopnav: function (link) {
        this.$router.push('/' + link);
      },
      logout: function () {
        this.$store.dispatch('logout', {
          token: this.$session.get("token")
        }).then((flag) => {
          if (flag) {
            alert("로그아웃이 안전하게 되었습니다.");
            this.$session.clear();
            this.$cookies.remove("token");
            this.$cookies.remove("userInfo");
            this.$router.replace(this.$route.query.redirect || '/');
          }
          else {
            alert("네트워크를 확인해주세요.")
          }
        })
        this.$store.dispatch("toggleSearchBarAction", false);
      },
      setTitle () {
        for(let obj of this.routeInfo) {
          if (this.path.includes(obj.path)) {
            this.title = obj.title;
          }
        }
      },
      openSearchBar () {
        this.searchBarFlag ? this.$store.dispatch("toggleSearchBarAction", false) : this.$store.dispatch("toggleSearchBarAction", true);
      },
      menuStyle(index) {
        if (index < 4) {
          return {
            position: 'absolute',
            top: `${index % 4 * 31.5}px`,
            left: '0px'
          }
        } else {
          return {
            position: 'absolute',
            top: `${index % 4 * 31.5}px`,
            left: '100px'
          }
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          if (window.innerWidth > 576) {
            this.mobileLogoFlag = false;
          } else {
            this.mobileLogoFlag = true;
          }
        })
      })
    },
    created() {
      this.path = this.$router.history.current.path;
      this.name = this.$router.history.current.name;
      window.innerWidth > 576 ? this.mobileLogoFlag = false : this.mobileLogoFlag = true;
      this.setTitle();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  /*mega-menu content's specific padding*/
  .padding {
    padding-left: 10px;
  }

  /*some routing path's topnav hidden */
  div .hidden {
    -webkit-animation: slide-down .7s ease-out;
    -moz-animation: slide-down .7s ease-out;
    animation-fill-mode: forwards;
  }

  /*some routing path's topnav hidden animation*/
  @-webkit-keyframes slide-down {
    100% {
      opacity: 0;
      visibility: hidden;
      -webkit-transform: translateY(-100%);
    }
    0% {
      opacity: 1;
      visibility: visible;
      -webkit-transform: translateY(0);
    }
  }

  @-moz-keyframes slide-down {
    100% {
      opacity: 0;
      visibility: hidden;
      -moz-transform: translateY(-100%);
    }
    0% {
      opacity: 1;
      visibility: visible;
      -moz-transform: translateY(0);
    }
  }

  /*topnav css*/
  .nav__container {
    /* overflow: hidden; */
    height: 80px;
    font-size: 12px;
    border-bottom: 1px solid #0000002b;
    font-family: "NanumSquare", serif;
    font-weight: 800;
    color: white;
  }

  .nav__container a {
    cursor: pointer;
  }

  /* Add a red background color to nav__container links on hover */
  .nav__container a:hover, .mega-menu:hover {
    font-weight: 800;
  }

  .nav {
    margin-left: auto;
    margin-right: auto;
    width: 1132px;
    height: 80px;
  }

  .nav__logo {
    color: white;
    float: left;
    width: 79.6px;
    height: 44px;
    padding: 18px 35px 18px 0;
    cursor: pointer;
  }

  .nav__user {
    float: right;
    text-align: right;
    text-decoration: none;
    font-family: 'NanumSquare', serif;
    line-height: 1.35;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    font-size: 15px;
    color: #a0d2f6;
    font-weight: normal;
    padding: 31.5px 20px 31.5px 20px;
    cursor: pointer;
  }

  .nav__user__nickname {
    color: #ffffff;
    display: flex;
    align-items: center;
    position: relative;
  }

  .nav__user--second-item {
    padding-right: 0;
  }
  .arrow-down-icon {
    margin-left: 9px;
  }

  .search-icon, .timetable-icon {
    width: 24px;
    height: 24px;
    margin: 28px 0;
    padding: 0 14px 0 0;
  }
  /* The dropdown container */
  .mega-menu {
    overflow: hidden;
    float: left;
    display: flex;
    align-items: center;
    height: 100%;
    color: white;
  }

  /* Dropdown button */
  .mega-menu__top-btn {
    border: none;
    outline: none;
    float: left;
    padding: 31px 0 30px 0;
    margin: 0 20px;
    font-weight: 700;
    font-size: 17px;
    text-align: left;
    display: block;
    font-family: 'NanumSquare', serif;
    line-height: 1;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    color: #ffffff;
    cursor: pointer;
    background-color: #175c8e;
  }

  .mega-menu__top-btn:hover {
    border-bottom: 2px solid #ffffff;
  }

  .mega-menu__pane-content__menus {
    line-height: 2;
    display: inline;
  }

  .mega-menu__pane-container {
    display: block;
    top: 80px;
    overflow: hidden;
    position: absolute;
    left: 0;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    min-width: 1132px;
    z-index: 4;
    height: 0;
    background: #15507a;
    -webkit-transition: height 0.2s, padding-top 0.4s, padding-bottom 0.4s, -webkit-transform 0.5s;
    transition: height 0.2s, padding-top 0.4s, padding-bottom 0.4s, transform 0.5s;
  }

  /* Dropdown content (hidden by default) */
  .mega-menu__pane {
    display: block;
    overflow: hidden;
    position: static;
    width: 1132px;
    height: 100%;
    z-index: 5;
    margin-top: 26px;
    margin-left: auto;
    margin-right: auto;
    -webkit-transition: height 0.2s, -webkit-transform 0.5s;
    transition: height 0.2s, transform 0.5s;
  }

  .mega-menu__pane-content {
    margin-left: 135px;
    height: 100%;
    padding: 0;
    width: 430px;
    display: block;
    position: relative;
  }

  /* Show the dropdown menu on hover */
  .mega-menu:hover .nav__container {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.16);
  }
  .mega-menu:hover .mega-menu__pane, .mega-menu:hover .mega-menu__pane-container {
    -webkit-transform: translateY(0px);
    transform: translateY(0px);
  }

  .mega-menu:hover .mega-menu__pane-container {
    display: block;
    height: 176px;
    box-sizing: border-box;
  }

  /* 세부카테고리 글자*/
  .mega-menu__pane a {
    color: #ffffff;
    display: block;
    font-size: 13px;
    padding-bottom: 10px;
    text-decoration: none;
    text-align: left;
    font-weight: 400;
  }

  /* Add a grey background color to dropdown links on hover */
  .mega-menu__pane a:hover {
    font-weight: 800;
  }

  .mega-menu__pane-content__menus a:hover, .nav__container a:hover {
    color: white;
  }

  .mega-menu__pane a:last-child {
    padding-bottom: 0;
  }

  .weak-font {
    color: #a0d2f6;
    font-weight: normal;
  }

  .nav__user--border {
    height: 17px;
    float: right;
    width: 0;
    margin-top: 31.5px;
    border-right: 1px #a0d2f6 solid;
  }

  /*new badge*/
  .new {
    padding: 2px 5px;
    background: white;
    color: #175c8e;
    border-radius: 15px;
    font-size: 11px;
    position: relative;
    bottom: 2px;
    font-weight: 700;
  }

  .new:hover {
    color: #175c8e;
    font-weight: 700;
  }

  .mega-menu__new-logo {
    width: 12px;
    height: 12.2px;
    position: relative;
    margin-left: 7px;
    top: 3px;
    font-size: 11px;
    font-family: Verdana, serif;
    background-color: #f7941e;
    padding: 1px;
    padding-left: 0.6px;
    line-height: 12px;
    text-align: center;
    font-stretch: normal;
    letter-spacing: normal;
    float: right;
  }

  /* topnav 내 inner category new badge */
  .mega-menu__pane-content__menu__new-logo {
    width: 12px;
    height: 12.2px;
    position: relative;
    margin-left: 28px;
    top: 5.5px;
    font-size: 11px;
    font-family: Verdana, serif;
    background-color: #f7941e;
    padding: 1px;
    padding-left: 0.6px;
    line-height: 12px;
    text-align: center;
    font-stretch: normal;
    letter-spacing: normal;
    font-weight: 700;
    color: white;
    float: right;
    left: -26px;
  }

  .nav__menu__btn {
    display: none;
  }

  .mobile__menu {
    display: none;
  }

  .nav__menu__top-service {
    display: none;
  }
  .nav__menu__mobile-search-bar {
    display: none;
  }
  .nav__menu__search {
    display: none;
  }
  .auth__box {
    position: absolute;
    top: 23px;
    right: 23px;
    width: 92px;
    height: 116px;
    border-radius: 2px;
    box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.3);
    background-color: #ffffff;
    padding: 15px 17px 18px 17px;
    box-sizing: border-box;
  }

  .auth__box__contents {
    font-family: NanumSquareB;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: left;
    color: #175c8e;
    cursor: pointer;
    margin-bottom: 16px;
  }

  .auth__box .auth__box__contents:last-child {
    margin-bottom: 0;
  }
  .search-bar__section {
    position: relative;
    width: 100%;
  }

  @media (max-width: 576px) {
    .fixed {
      z-index: 13;
      position: fixed;
    }
    .nav__container, .nav, .mega-menu__pane-container {
      width: 100%;
      min-width: 328px;
    }

    .nav {
      height: 56px;
      z-index: 12;
      width: calc(100% - 32px);
      padding-left: 16px;
      padding-right: 16px;
      text-align: center;
    }

    .nav__container {
      height: 56px;
    }

    .nav__logo {
      height: 32px;
      width: 58px;
      margin-top: -7px;
      margin-left: calc(50% - 53px);
      padding-right: 0px;
    }

    .mega-menu {
      display: none;
    }

    .nav__user {
      display: none;
    }

    .nav__menu__btn {
      display: block;
      float: left;
      height: 24px;
      width: 24px;
      margin-top: 16px;
    }

    .mobile__menu {
      min-width: 360px;
      z-index: 25;
      width: 100%;
      top: 55px;
      position: fixed;
      height: calc(100% - 153px);
      display: block;
      padding-bottom: 40px;
      background: #f7f7f7;
      box-shadow: rgba(0 0 0, 0.16);
      border-bottom: rgba(210, 218, 226, 0.5) 1px solid;
    }

    .nav__user--border {
      display: none;
    }

    .nav__menu__top-service {
      display: block;
      height: 56px;
      font-size: 16px;
      line-height: 56px;
      min-width: calc(100% - 32px);
      text-align: center;
      padding-right: 20px;
    }
    .nav__menu__mobile-search-bar {
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      width: 100%;
      height: 56px;
      z-index: 20;
    }
    .nav__menu__search {
      display: block;
      width: 24px;
      height: 24px;
      position: absolute;
      right: 16px;
      top: 16px;
    }
    .search-bar__section {
      display: none;
    }
  }
  .slide-fade-enter-active {
    transition: all .3s cubic-bezier(0, 0, 0.2, 1);
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(0, 0, 0.2, 1);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(-100%);
  }

  .slide-fade-down-enter-active {
    transition: all .3s cubic-bezier(0, 0, 0.2, 1);
    animation-name: zoom;
  }
  .slide-fade-down-leave-active {
    transition: all .3s cubic-bezier(0, 0, 0.2, 1);
    animation-name: zoom;
  }
  .slide-fade-down-enter, .slide-fade-down-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateY(-100%);
    margin-bottom: -60px;
  }

  .fade-3-enter-active, .fade-3-leave-active {
    transition: opacity .2s;
  }
  .fade-3-enter, .fade-3-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .fade-2-enter-active, .fade-2-leave-active {
    transition: opacity .2s;
  }
  .fade-2-enter, .fade-2-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
