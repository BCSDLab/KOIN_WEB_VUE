<template>
  <div
    id="app"
    :style="{ 
      overflow: nowFooterCategory === 1 ? 'hidden' : 'initial',
      maxHeight: nowFooterCategory === 1 ? '600px' : '100%',
      position: darkBackGround ? 'relative' : 'static'}">
    <div
      v-if="darkBackGround"
      class="dark-bg">
    </div>
    <app-topnav></app-topnav>
    <div
      :style="{ position: searchBarFlag ? 'relative' : 'static' }">
      <div
        v-if="searchBarFlag"
        @click="closeSearchBar"
        class="dark-bg2">
      </div>
      <div class="main">
        <router-view/>
        <vue-progress-bar></vue-progress-bar>
      </div>
      <div class="footer__menu">
        <app-footer-menu></app-footer-menu>
      </div>
      <div class="footer">
        <app-footer></app-footer>
      </div>
    </div>
  </div>
</template>

<script>
  import Topnav from './SharedComponents/Topnav/Topnav'
  import Footer from './SharedComponents/Footer/Footer'
  import FooterMenu from './SharedComponents/FooterMenu/FooterMenu'
  import Copyright from './SharedComponents/CopyRight/CopyRight'
  import { mapGetters } from 'vuex'
  import { closeSearchBarAction } from './mixins/index'
  import * as LoginCheck from './stores/loginCheck'

  export default {
    name: 'App',
    mixins:[closeSearchBarAction],

    data() {
      return {
        navFlag: false,
      }
    },
    components: {
      'app-topnav': Topnav,
      'app-footer': Footer,
      'app-footer-menu': FooterMenu,
      'app-copyright': Copyright
    },
    computed: {
      ...mapGetters({
        nowFooterCategory: "nowFooterCategory",
        darkBackGround: "darkBackGround",
        searchBarFlag: "searchBarFlag"
      })
    },
    created() {
      if(this.$cookies.get("token")!==null && this.$cookies.get("token")!==undefined && this.$cookies.get("token")!==""){
        this.$session.set("token",this.$cookies.get("token"));
        LoginCheck.loginCheck(this.$session.get("token"), 'login');
      }
      this.$session.set("storeCheckBoxs",[false,false,false]);
      this.$session.set("storeTag",undefined)
      this.$session.set("storeNewFlag",true)
      this.$store.commit('userInfoUpdate', this.$session.get("userInfo"));
      this.$store.commit('tokenUpdate', this.$session.get("token"));
    }
  }
</script>

<style>
  .footer__menu {
    display: none;
  }
  #app {
    font-family: "NanumBarunGothic", serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    -webkit-touch-callout: none;
    user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -webkit-user-select: none;
    min-width: 1148px;
  }

  .dark-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000000;
    opacity: 0.7;
    z-index: 1;
  }
  .dark-bg2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: -webkit-fill-available;
    height: 100%;
    background-color: #252525;
    opacity: 0.5;
    z-index: 15;
  }
  @media (max-width: 576px) {
    .footer__menu {
      display: block;
    }

    .footer {
      margin-bottom: 58px;
    }

    #app {
      max-width: 576px;
      min-width: 360px;
      height: 100%;
    }
    .main {
      height: calc(100% - 130px)!important;
      min-height: calc(100% - 130px)!important;
    }

    .dark-bg2 {
      display: none;
    }
  }
  .main {
    min-height: calc(100vh - 84px);
  }

  .primary-yellow {
    background-color: #fbcb98;
  }

  .primary-bright {
    background-color: #0284e2;
    color: white;
  }

  .primary {
    background-color: #175c8e;
    color: white;
  }

  .primary-bold {
    background-color: #194562;
    color: white;
  }

  .primary-yellow {
    background-color: #f7931e;
  }

  * {
    outline: none;
  }

  .elip {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  @font-face {
    font-family: "NanumBarunGothic";
    src: url('https://static.koreatech.in/assets/font/NanumBarunGothic.eot');
    src: url('https://static.koreatech.in/assets/font/NanumBarunGothic.eot?#iefix') format('embedded-opentype'),
    url('https://static.koreatech.in/assets/font/NanumBarunGothic.woff') format('woff'),
    url('https://static.koreatech.in/assets/font/NanumBarunGothic.ttf') format('truetype'),
    url('https://static.koreatech.in/assets/font/NanumBarunGothic.svg#NanumGothic') format('svg');
    src:local(※), url('https://static.koreatech.in/assets/font/NanumBarunGothic.woff') format('woff');
  }

  @font-face {
    font-family: "NanumSquare";
    src: url('https://static.koreatech.in/assets/font/NanumSquareR.eot');
    src: url('https://static.koreatech.in/assets/font/NanumSquareR.eot?#iefix') format('embedded-opentype'),
    url('https://static.koreatech.in/assets/font/NanumSquareR.woff') format('woff'),
    url('https://static.koreatech.in/assets/font/NanumSquareR.ttf') format('truetype'),
    url('https://static.koreatech.in/assets/font/NanumSquareR.svg#NanumGothic') format('svg');
    src:local(※), url('https://static.koreatech.in/assets/font/NanumSquareR.woff') format('woff');
  }

</style>
