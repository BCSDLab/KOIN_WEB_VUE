<template>
  <div class="container">
    <div v-if="!loadingFlag">
      <v-loading-bar></v-loading-bar>
    </div>
    <div
      v-if="loadingFlag"
      class="list">
      <div class="header">
        <div class="header-name">
          동아리 안내
        </div>
        <button
          @click="navigateByUrl('/circle')"
          class="go-list">
          목록으로
        </button>
      </div>

      <div class="content-header">
        <div
          class="no-logo"
          v-if="specificCircle.logo_url === null || specificCircle.logo_url === undefined">
        </div>
        <img
          class="logo"
          v-if="specificCircle.logo_url !== null && specificCircle.logo_url !== undefined"
          :src="specificCircle.logo_url">
        <div class="title">
          {{ specificCircle.name }}
        </div>
        <div class="desc">
          {{ specificCircle.line_description }}
        </div>
      </div>

      <div class="content">
        <div class="logo-container">
          <div
            class="no-logo"
            v-if="specificCircle.logo_url === null || specificCircle.logo_url === undefined">
            no image
          </div>
          <img
            class="logo"
            v-if="specificCircle.logo_url !== null && specificCircle.logo_url !== undefined"
            :src="specificCircle.logo_url">
        </div>
        <div class="detail">
          <table>
            <tr>
              <td class="first">동아리방</td>
              <td class="second">{{ changeNoInformation(specificCircle.location) }}</td>
            </tr>
            <tr>
              <td class="first">주요활동</td>
              <td class="second">{{ changeNoInformation(specificCircle.major_business) }}</td>
            </tr>
            <tr>
              <td class="first">지도교수</td>
              <td class="second">{{ changeNoInformation(specificCircle.professor) }}</td>
            </tr>
            <tr>
              <td class="first">홈페이지</td>
              <td class="second">
                <a
                  class="second-link"
                  target="_blank"
                  v-if="changeNoInformation(specificCircle.introduce_url)!=='정보없음'"
                  :href="changeNoInformation(specificCircle.introduce_url)">{{ changeNoInformation(specificCircle.introduce_url) }}</a>
                <span
                  v-if="changeNoInformation(specificCircle.introduce_url)==='정보없음'">
                  {{ changeNoInformation(specificCircle.introduce_url) }}</span>
              </td>
            </tr>
          </table>

          <div
            class="detail-desc"
            v-html="addBr(specificCircle.description)">
          </div>

          <div class="link">
            <button
              v-for="link in specificCircle.link_urls"
              :key="link.id"
              :class="{ 'facebook-link': link.type === 'facebook', 'cyworld-link': link.type === 'cyworld', 'naver-link': link.type ==='naver'}"
              @click="navigateByLink(link.link)"
              class="facebook-link">{{ returnLinkName(link.type) }} 바로가기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'CircleDetail',
    data() {
      return {
        loadingFlag: false,
      }
    },
    created() {
      this.loadingFlag = false;
      let path = this.$router.history.current.path.split('/');
      this.$store.dispatch('setSpecificCircle', {
        "specificCircleId": path[2]
      }).then((data)=> {
        if(data){
          this.loadingFlag = true;
        }
        else{
          alert("잘못된 접근입니다.");
          this.$router.go(-1);
        }
      });
    },
    computed: {
      ...mapGetters({
        specificCircle: 'specificCircle',
      })
    },
    methods: {
      addBr: function (val) {
        if(val !== null && val !== undefined){
          let tmp = val.replace(/(?:\r\n|\r|\n)/g, '<br />');
          return tmp;
        }
      },
      changeNoInformation: function(val) {
        if(val!==null && val!==undefined){
          return val;
        }
        else {
          return "정보없음";
        }
      },
      navigateByUrl: function(url){
        this.$router.push(url);
      },
      navigateByLink: function(url){
        if(url !== ""){
          window.open(url, '_blank')
        }
        else {
          alert("페이지 준비중 입니다.");
        }
      },
      returnLinkName: function(type){
        switch(type){
          case "facebook":
            return "페이스북";
          case "cyworld":
            return "싸이월드";
          case "naver":
            return "네이버 블로그";

        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    border-top: #f7941e 5px solid;
    width: 100%;
  }

  .list {
    width: 1132px;
    margin-top: 63px;
    margin-left: auto;
    margin-right: auto;
    height: 100%;
    margin-bottom: 200px;
  }

  .header {
    width: 1132px;
    height: 52px;
    border-bottom: #175c8e 2px solid;
  }

  .header .header-name {
    float: left;
    width: 200px;
    font-family: NanumSquare, serif;
    font-size: 30px;
    font-weight: 800;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -1.5px;
    color: #175c8e;
    text-align: left;
    height: 32px;
    margin-bottom: 21px;
  }
  .header .go-list {
    float: right;
    width: 73px;
    height: 33px;
    background-color: #175c8e;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: -0.6px;
    text-align: center;
    color: #ffffff;
    border: 1px #175c8e solid;
    position: relative;
    bottom: 1px;
  }

  .content-header {
    width: 1132px;
    height: 123px;
    border-bottom: 1px #ececec solid;
  }

  .content-header .logo {
    float: left;
    width: 58px;
    height: 58px;
    margin-top: 28px;
    border: 1px #d8d8d8 solid;
    border-radius: 32px;
  }

  .content-header .no-logo {
    float: left;
    width: 58px;
    height: 58px;
    margin-top: 28px;
    border: 1px #d8d8d8 solid;
    background-color: #d8d8d8;
    border-radius: 30px;
  }

  .content-header .title {
    padding-top: 39px;
    padding-left: 80px;
    letter-spacing: -1px;
    text-align: left;
    font-size: 20px;
    color: #252525;
  }

  .content-header .desc {
    text-align: left;
    padding-left: 80px;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.69;
    letter-spacing: -0.7px;
    color: #c4c4c4;
  }
  .content .logo-container {
    width: 278px;
    float: left;
  }

  .content .logo-container .logo {
    margin-top: 37px;
    width: 278px;
    height: auto;
  }

  .content .logo-container .no-logo {
    margin-top: 33px;
    font-size: 13px;
    letter-spacing: -0.7px;
    color: #999999;
    line-height: 200px;
    width: 278px;
    height: 200px;
    background: #cacaca;
  }

  .content .detail {
    margin-top: 33px;
    margin-left: 18px;
    width: 834px;
    float: left;
  }

  .content table {
    font-size: 13px;
    letter-spacing: -0.7px;
  }

  table td {
    height: 18px;
  }

  table .first {
    letter-spacing: -0.7px;
    text-align: left;
    color: #252525;
  }

  table .second {
    letter-spacing: -0.7px;
    text-align: left;
    color: #858585;
    padding-left: 14px;
  }

  .second-link {
    text-decoration: none;
    outline: none;
    color: #858585;
  }

  .second-link:visited, .second-link:link, .second-link:hover {
    text-decoration: none;
    outline: none;
    color: #858585;
  }

  .content .detail-desc {
    text-align: left;
    margin-top: 43px;
    margin-left: 2px;
    color: #555555;
    font-size: 15px;
    letter-spacing: -0.8px;
    line-height: 1.75;
  }

  .content .link {
    margin-top: 35px;
    margin-left: 2px;
    float: left;
    margin-bottom: 100px;
  }

  .content .link button {
    padding: 8px 16px;
    letter-spacing: -0.6px;
    font-size: 12px;
    margin-right: 1px;
    color: white;
  }

  .link .facebook-link {
    background: #175c8e;
    border: 1px #175c8e solid;
  }

  .link .cyworld-link {
    background: #e85521;
    border: 1px #e85521 solid;
  }

  .link .naver-link {
    background: #00c73c;
    border: 1px #00c73c solid;
  }
  button {
    cursor: pointer;
  }

  @media (max-width: 576px) {
    .container {
      width: 100%;
      border-top: none;
    }

    .list {
      width: calc(100% - 32px);
      margin-top: 30px;
    }

    .header {
      display: none;
    }

    .content-header {
      width: 100%;
      height: 80px;
      border-bottom: 1px solid #d2dae2;
    }

    .content-header .logo {
      margin-top: 0;
      width: 50px;
      height: 50px;
    }

    .content-header .no-logo {
      margin-top: 0;
      width: 50px;
      height: 50px;
    }

    .content-header .title {
      padding-top: 5px;
      padding-left: 60px;
      font-size: 20px;
      font-weight: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: #252525;
    }

    .content-header .desc {
      padding-top: 4px;
      padding-left: 60px;
      font-size: 13px;
      font-weight: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: #c4c4c4;
    }

    .content .logo-container {
      margin: 30px 0;
      width: 100%;
      height: 184px;
    }

    .content .logo-container .logo {
      width: 182px;
      height: 182px;
      border: solid 1px #d8d8d8;
      margin: 0;
    }

    .content .logo-container .no-logo {
      width: 182px;
      height: 182px;
      border: solid 1px #cacaca;
      margin: auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .content .detail {
      width: 100%;
      margin: 0;
    }

    table .first {
      font-size: 13px;
      font-weight: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: #252525;
    }

    table .second {
      font-size: 13px;
      font-weight: normal;
      line-height: 1.15;
      letter-spacing: normal;
      color: #858585;
      padding-left: 18px;
    }

    .content .detail-desc {
      /* width: 100%; */
      margin-top: 30px;
      margin-left: 0;
      font-size: 15px;
      font-weight: normal;
      line-height: 1.6;
      letter-spacing: normal;
      text-align: left;
      color: #555555;
    }

    .content .link {
      margin-top: 30px;
      margin-bottom: 50px;
      margin-left: 0;
      width: 100%;
      float: none;
    }

    .content .link button {
      width: 100%;
      font-size: 14px;
      font-weight: normal;
      color: #ffffff;
      line-height: 1.15;
      letter-spacing: normal;
      padding: 9px 0;
      margin-bottom: 10px;
    }

    .content .link button:last-child {
      margin-bottom: 0;
    }
  }
</style>
