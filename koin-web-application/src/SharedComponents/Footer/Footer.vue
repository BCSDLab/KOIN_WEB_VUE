<template>
  <!--footer container-->
  <div
    :class="{'hidden': nowRoutingPath==='login' || nowRoutingPath==='singup' || nowRoutingPath==='findpw' || nowRoutingPath==='changeinfo' || nowRoutingPath=== 'notfound' || nowRoutingPath=== 'timetable'}"
    class="footer__container">

    <!--footer start-->
    <div class="footer">
      <div class="footer__nav">
        <div
          class="footer__nav-section"
          v-for="(category, index) in categoryList"
          :key="index">
          <div class="footer__nav-section-title">
            {{ category.title }}
          </div>
          <div class="footer__nav-link">
            <div
              class="nav-link"
              :class="{ right: index >= 4 }"
              v-for="(menu, index) in category.submenu"
              :key="menu.id"
              @click="clickMenu(menu.link, menu.tag, menu.planFlag, menu.title)">
              {{ menu.title }}
            </div>
          </div>

        </div>
      </div>
      <div class="footer__link">
        <div class="footer__logo__container">
          <img
            src="https://static.koreatech.in/assets/img/logo_white.png"
            class="footer__logo"
            @click="clickItem('/')">
        </div>
        <div class="footer__link-button-list">
          <button
            class="link-button"
            @click="clickItem('https://bcsdlab.com')">
            BCSD Lab 바로가기
          </button>
          <button
            class="link-button"
            @click="clickItem('https://koreatech.ac.kr')">
            코리아텍 바로가기
          </button>
          <button
            class="link-button"
            @click="clickItem('https://portal.koreatech.ac.kr')">
            아우누리 바로가기
          </button>
          <button
            class="link-button"
            @click="clickItem('/privacy-policy')">
            개인정보 처리방침
          </button>
        </div>
        <div>
          <img
            class="footer__link__facebook"
            @click="clickItem('https://www.facebook.com/koreatech.in/')"
            src="https://static.koreatech.in/upload/fead6221d535ff547d4801081ee8f2e3.png">
          <img
            class="footer__link__home"
            @click="clickItem('/')"
            src="https://static.koreatech.in/upload/1aae9a021f0338527c28e5c3d0518fa1.png">
        </div>
      </div>
      <div class="footer__copyright">
        COPYRIGHT ⓒ {{ today.getFullYear() }} BY BCSDLab ALL RIGHTS RESERVED.
      </div>
    </div>
    <div class="mobile-footer">
      <div class="mobile-footer__link">
        <span
          class="link-text"
          @click="clickItem('https://koreatech.ac.kr')">
          코리아텍 바로가기
        </span>
        &nbsp; | &nbsp;
        <span
          class="link-text"
          @click="clickItem('https://portal.koreatech.ac.kr')">
          아우누리 바로가기
        </span>
      </div>
      <div class="mobile-footer__link">
        <span
          class="link-text"
          @click="clickItem('https://bcsdlab.com')">
          BCSD Lab 바로가기
        </span>
        &nbsp; | &nbsp;
        <span
          class="link-text"
          @click="clickItem('/privacy-policy')">
          개인정보 처리방침
        </span>
      </div>
      <div class="mobile-footer__link">
        <img
          src="https://static.koreatech.in/assets/img/logo_white.png"
          class="mobile-footer__logo"
          @click="clickItem('/')">
        <span class="mobile-footer__copyright">COPYRIGHT © {{ today.getFullYear() }} BCSD LAB ALL RIGHTS RESERVED.</span>
        <img
          class="mobile-footer__link__facebook"
          @click="clickItem('https://www.facebook.com/koreatech.in/')"
          src="https://static.koreatech.in/upload/fead6221d535ff547d4801081ee8f2e3.png">
        <img
          class="mobile-footer__link__home"
          @click="clickItem('/')"
          src="https://static.koreatech.in/upload/1aae9a021f0338527c28e5c3d0518fa1.png">
      </div>
    </div>
  </div>
</template>

<script>
  import * as CATEGORY from '../../static/category.js'
  import {mapGetters} from 'vuex';

  export default {
    name: 'Footer',
    data() {
      return {
        categoryList: CATEGORY.default,
        today: new Date(),
      }
    },
    computed: {
      ...mapGetters({
        nowRoutingPath: "nowRoutingPath"
      })
    },
    methods: {
      clickItem: function (path) {
        if (path === '/') {
          this.$router.push(path);
        } else if (path === '/privacy-policy') {
          this.$store.dispatch("setNowFooterCategory", {
            footerCategoryIndex: -1
          });
          this.$router.push(path);
        } else {
          window.open(path);
        }
      },
      clickMenu (link, tag, planFlag, title) {
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
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*speicific routing path footer hidden */
  div .hidden {
    -webkit-animation: slide-down .5s ease-in;
    -moz-animation: slide-down .5s ease-in;
    animation-fill-mode: forwards;
    display: none;
  }

  @-webkit-keyframes slide-down {
    100% {
      opacity: 0;
      visibility: hidden;
      -webkit-transform: translateY(100%);
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
      -moz-transform: translateY(100%);
    }
    0% {
      opacity: 1;
      visibility: visible;
      -moz-transform: translateY(0);
    }
  }

  .footer__container {
    width: 100%;
    background-color: #3e3e3e;
    color: white;
    display: table;
    position: relative;
    bottom: 0;
    font-size: 13px;
    border: none;
    height: 288px;
    vertical-align: middle;
  }

  .footer {
    width: 1132px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 29px;
    padding-bottom: 30px;
  }
  .footer__nav {
    display: flex;
    justify-content: center;
    margin: 0 65px 36px auto;
  }
  .footer__nav-section {
    height: 130px;
    box-sizing: border-box;
  }
  .footer__nav .footer__nav-section:first-child {
    width: 200px;
  }

  .footer__nav .footer__nav-section:nth-child(2) {
    padding: 0 0 0 51px;
  }
  .footer__nav .footer__nav-section:last-child {
    padding-left: 51px;
    padding-right: 0;
    border: none;
  }
  .footer__nav-section-title {
    font-family: "NanumSquare";
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: -.3px;
    text-align: left;
    color: #ffffff;
    margin-bottom: 24px;
  }

  .footer__nav-link {
    border-right: 1px solid #666666;
    width: auto;
    height: 89px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .nav-link {
    font-family: NanumSquareR;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.7;
    letter-spacing: .8px;
    text-align: left;
    color: #9fa9b3;
    cursor: pointer;
    margin-right: 39px;
  }

  .nav-link.right {
    margin-right: 0;
  }
  .footer__nav .footer__nav-section:first-child .footer__nav-link {
    /* width: 258px; */
    padding-right: 74.5px;
  }
  .footer__nav .footer__nav-section:nth-child(2) .footer__nav-link {
    width: 150px;
    padding-right: 51px;
  }
  .footer__nav .footer__nav-section:nth-child(2) .nav-link {
    margin-right: 32px;
  }
  .footer__nav .footer__nav-section:last-child .footer__nav-link {
    width: 75px;
    border-right: none;
  }
  .footer__nav .footer__nav-section:last-child .nav-link {
    margin-right: 0;
  }
  .footer__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .footer__link-button-list {
    display: flex;
    margin-right: 59px;
  }
  .link-button {
    height: 30px;
    box-sizing: border-box;
    border-radius: 28px;
    font-family: NanumSquare;
    border: solid 1px #9fa9b3;
    font-size: 15px;
    font-weight: normal;
    letter-spacing: -0.1px;
    text-align: center;
    color: #c9c9c9;
    padding: 6.5px 15px;
    background-color: transparent;
    margin-right: 25px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .footer__logo__container {
    /* float: left; */
    height: 100%;
    text-align: left;
    margin-right: 79px;
  }

  .footer__logo {
    width: 72.4px;
    height: 40px;
    cursor: pointer;
  }

  .footer__copyright {
    font-family: NanumSquareR;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.08;
    letter-spacing: 0.15px;
    text-align: center;
    color: #b5b5b5;
  }

  .footer__link__facebook {
    width: 14px;
    margin-right: 30px;
    cursor: pointer;
  }

  .footer__link__home {
    width: 25px;
    cursor: pointer;
  }

  a {
    color: white;
    cursor: hand;
  }

  a:hover, a:visited, a:active, a:link {
    text-decoration: none;
  }

  .mobile-footer {
    display: none;
  }
  @media (max-width: 576px) {
    .footer__container {
      height: 110px;
    }

    .footer {
      display: none;
    }
    .mobile-footer {
      display: block;
      padding: 21px 16px 18px 16px;
    }

    .mobile-footer__link {
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: NanumSquareR;
      font-size: 10px;
      font-weight: normal;
      line-height: 1.2;
      letter-spacing: normal;
      color: #c9c9c9;
    }

    .mobile-footer .mobile-footer__link:first-child {
      margin-bottom: 10px;
    }

    .mobile-footer .mobile-footer__link:nth-child(2) {
      margin-bottom: 13px;
      margin-right: 6px;
    }

    .mobile-footer__logo {
      width: 35px;
      margin-right: 20px;
    }
    .mobile-footer__copyright {
       font-family: NanumSquareR;
      font-size: 9px;
      font-weight: normal;
      line-height: 1.11;
      letter-spacing: -.57px;
      text-align: left;
      color: #7d7d7d;
      margin-right: 17px;
    }
    .mobile-footer__link__facebook {
      width: 9px;
      margin-right: 16px;
    }

    .mobile-footer__link__home {
      width: 15px;
    }

  }

</style>
