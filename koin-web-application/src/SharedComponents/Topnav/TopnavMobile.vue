<template>
  <div class="container">
    <div class="mobile__user">
      <span 
        class="nav__user nav__user__nickname">
        {{ displayNickname }}
      </span>
      <a
        class="weak-font nav__user"
        @click="clickRightTopnav('login')"
        v-if="token==null || token===''">로그인</a>
      <a
        v-if="token==null || token===''"
        class="nav__user--border"></a>
      <a
        class="weak-font nav__user nav__user--first-item"
        @click="clickRightTopnav('signup')"
        v-if="token==null || token===''">회원가입</a>
      <a
        class="weak-font nav__user"
        @click="logout()"
        v-if="token!=null && token!==''">로그아웃</a>
      <a
        v-if="token!=null && token!==''"
        class="nav__user--border"></a>
      <a
        class="weak-font nav__user nav__user--first-item"
        @click="clickRightTopnav('changeinfo')"
        v-if="token!=null && token!==''">정보수정</a>
    </div>
    <div
      :key="category.id"
      v-for="category in categoryList"
      class="mobile__nav__menu">
      <div class="title">
        {{ category.title }}
      </div>
      <div
        :key="subCategory.id"
        v-for="subCategory in category.submenu"
        @click="clickTopnav(subCategory.link, subCategory.tag, subCategory.planFlag, subCategory.title)"
        class="mobile__nav__sub__menu__content"
        :class="{ 'active': $router.history.current.path.indexOf(subCategory.link) !== -1}">
        {{ subCategory.title }}
      </div>
      <div
        v-if="category.submenu.length % 5 ===0"
        class="mobile__nav__sub__menu__content blank">
      </div>
    </div>
  </div>
</template>

<script>
  import * as CATEGORY from '../../static/category.js'
  import { mapGetters } from 'vuex';
  export default {
    name: 'TopnavMobile',
    data() {
      return {
        categoryList: [],
        token: this.$session.get("token")
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'userInfo'
      }),
      displayNickname () {
        if (this.userInfo === null || this.userInfo === undefined) {
          return null;
        } else {
          if (this.userInfo.nickname === undefined || this.userInfo.nickname === null) {
            return this.userInfo.portal_account;
          } else {
            return this.userInfo.nickname
          }
        }
        
      }
    },
    created() {
      console.log(this.$router.history.current.path);
      console.log(CATEGORY.default);
      this.categoryList = CATEGORY.default;
    },
    methods: {
      clickTopnav: function(link, tag, planFlag, title) {
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
            case 10:
              this.$router.push('/board/question');
              break;
            case 5:
              this.$router.push('/lost');
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
        this.$store.dispatch("setNowFooterCategory", {
          footerCategoryIndex:  -1
        });
        this.$emit('childs-event', 'clicked')
      },
      clickRightTopnav: function (link) {
        console.log(link)
        this.$store.dispatch("setNowFooterCategory", {
          footerCategoryIndex: link==="changeinfo" ?  2 : -1
        });
        document.getElementById('navigation').style.display="none";
        this.$router.push('/' + link);
        this.$emit('childs-event', 'clicked')
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
            this.token = this.$session.get("token");
            this.$store.dispatch("setFooterCategory");
          }
          else {
            alert("네트워크를 확인해주세요.")
          }
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    height: 100%;
    min-width: 360px;
  }
  .mobile__user {
    height: 41px;
    text-align: right;
    color: #175c8e;
    width: calc(100% - 40px);
    padding-right: 20px;
    padding-left: 20px;
    font-size: 14px;
    font-family: NanumSquare;
    background: white;
    border-collapse: collapse;
  }

  .mobile__nav__menu {

    min-width: 360px;
    width: 100%;
  }

  .mobile__nav__menu .title{
    height: 16px;
    padding-top: 24px;
    text-align: left;
    padding-left: 20px;
    color: #858585;
    font-size: 14px;
    padding-bottom: 10px;
    float: left;
    width: calc(100% - 32px);
    min-width: 328px;
  }

  .mobile__nav__sub__menu {
    height: 100%;
  }
  .mobile__nav__sub__menu__content {
    background: white;
    border: 0.5px rgba(210, 218, 226, 0.5) solid;
    width: calc(50% - 40.5px);
    float: left;
    font-family: NanumSquare;
    font-size: 16px;
    color: #252525;
    text-align: left;
    padding: 11px 20px;
    font-weight: 300;
    height: 18px;
    border-collapse: collapse;
    cursor: pointer;
    margin-right: -1px;
    margin-bottom: -1px;
  }

  .mobile__nav__sub__menu__content.active {
    color: #f7941e;
  }

  .mobile__nav__sub__menu__content:hover, .mobile__nav__sub__menu__content:focus {
    font-weight: 700;
    color: #f7941e;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .blank:hover, .blank:focus, .blank:active {
    background: white;
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  .nav__user--border {
    height: 12px;
    float: right;
    width: 0;
    border-right: 1px #175c8e solid;
    margin-top: 16px;
    padding-left: 9px;
  }

  .nav__user {
    float: right;
    text-align: right;
    text-decoration: none;
    font-family: 'NanumSquare', serif;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    margin-top: 14px;
    padding-left: 9px;
    padding-right: 0px;
    cursor: pointer;
  }

  .nav__user__nickname {
    margin-top: 12px;
    font-size: 16px;
    float: left;
    padding-left: 0;
  }

</style>
