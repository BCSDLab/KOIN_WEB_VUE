<template>
  <div class="container">
    <div v-if="loadingFlag">
      <v-loading-bar></v-loading-bar>
    </div>
    <div
      v-if="!loadingFlag"
      class="store">
      <div
        @click="goList()"
        class="header">
        주변 상점
      </div>
      <div class="store-detail">
        <div class="store-info-card">
          <div class="info-text">
            <div class="store-info">
              <div class="store-name">
                {{ specificStore.name }}
                <template v-if="specificStore.event_articles.length">
                  <div
                    class="event">
                    {{ convertDday(specificStore.event_articles[0].end_date) | formatDateString }}
                  </div>
                </template>
              </div>
              <div class="store-phone-number info">
                <span class="title">전화번호</span>
                <span class="content">{{ specificStore.phone }}</span>
              </div>
              <div class="store-operating-hours info">
                <span class="title">운영시간</span>
                <span
                  class="content"
                  v-if="specificStore.open_time!==null">
                  {{ specificStore.open_time }} ~ {{ specificStore.close_time }}
                </span>
                <span
                  class="content"
                  v-if="specificStore.open_time===null">
                  -
                </span>
              </div>
              <div class="store-address info">
                <span class="title">주소정보</span>
                <span class="content">
                  {{ specificStore.address }}
                </span>
              </div>
              <div class="store-delivery-price info">
                <span class="title">배달요금</span>
                <span class="content">
                  {{ specificStore.delivery_price.toLocaleString() }}원
                </span>
              </div>
              <div class="store-description info">
                <span class="title">기타정보</span>
                <span
                  v-html="specificStore.description.replace(/(?:\\r\\n|\\r|\\n|\r|\n|\r\n)/g, '<br />')"
                  v-if="specificStore.description"
                  class="content">
                </span>
                <span
                  v-else
                  class="content">
                  -
                </span>
              </div>
            </div>
            <div class="sub-info-tag">
              <button
                v-if="specificStore.delivery"
                class="tag delivery-tag">
                #배달가능
              </button>
              <button
                v-if="specificStore.pay_card"
                class="tag card-tag">
                #카드가능
              </button>
              <button
                v-if="specificStore.pay_bank"
                class="tag account-tag">
                #계좌이체가능
              </button>
              <div class="btn-groups">
                <a :href="tel">
                  <button
                    class="call">
                    전화하기
                  </button>
                </a>
                <button
                  @click="goList"
                  class="go-back">
                  상점목록
                </button>
              </div>
            </div>
          </div>
          <div
            v-if="specificStore.image_urls !== null"
            class="info-image">
            <!-- pc web -->
            <img
              v-img-orientation-changer
              class="store-poster"
              v-if="width > 576"
              :src="specificStore.image_urls[0]"
              @click="$store.commit('darkenBackGround', true), posterActive = true"
              alt="">
            <!-- mobile web -->
            <img
              v-img-orientation-changer
              class="store-poster"
              v-for="(image, index) in specificStore.image_urls"
              v-else
              :key="index"
              @click="$store.commit('darkenBackGround', true), posterActive = true, imageIndex = index"
              :src="specificStore.image_urls[index]">
            <img
              class="more"
              v-if="specificStore.image_urls !== null && specificStore.image_urls.length >= 2"
              src="http://static.koreatech.in/assets/img/1.png" alt="">
          </div>
        </div>
        <div
          v-if="specificStore.is_event"
          class="event">
          <p class="title">
            EVENT
          </p>
          <p
            class="content"
            v-html="addBr(specificStore.remarks)">
          </p>
        </div>

        <store-banner
          v-if="specificStore.event_articles.length"
          :start-date="specificStore.event_articles[0].start_date"
          :end-date="specificStore.event_articles[0].end_date"
          :second-color="Math.random() >= 0.5"
          @click="$router.push('/board/promotion/' + specificStore.event_articles[0].id)">
          <template #title>
            {{ specificStore.event_articles[0].title }}
          </template>
          {{ specificStore.event_articles[0].event_title }}
        </store-banner>
        <div
          v-if="this.menus.length !== 0"
          class="menu">
          <div class="title">
            MENU
          </div>
          <div class="menu-container">
            <div
              class="card"
              :key="menu.id"
              v-for="( menu, index ) in menus"
              :class="{'odd': index%2===0}">
              <div
                :class="{'two-line' : menu.name.length > 34, 'name': menu.name.length <=34}">
                {{ menu.name }}
                <span v-if="menu.size!=='기본'">{{ menu.size }}</span>
              </div>
              <div class="price">
                {{ menu.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <store-poster
      v-if="posterActive"
      :posterImages="specificStore.image_urls"
      :imageIndex="imageIndex"
      @close="close"
    />
  </div>
</template>
<script>
import StorePoster from '../Components/StorePoster';
import { mapGetters } from 'vuex';
import StoreBanner from "../Components/StoreBanner";
  export default {
    name: 'StoreDetail',
    components: {
      'store-poster': StorePoster,
      'store-banner': StoreBanner

    },
    computed: {
      ...mapGetters({
        specificStore: 'specificStore'
      })
    },
    data() {
      return {
        tel: '',
        menus: [],
        twoLine: {
          'line-height': '1.5'
        },
        width: 1131,
        posterActive: false,
        imageIndex: 0,
        loadingFlag: false
      }
    },
    methods: {
      addBr: function (val) {
        if (val !== null && val !== undefined) {
          let tmp = val.replace(/(?:\r\n|\r|\n)/g, '<br />');
          return tmp;
        }
      },
      goList() {
        this.$router.push("/store");
      },
      close() {
        this.posterActive = false;
        this.$store.commit("darkenBackGround", false);
      },
      convertDday (endDate) {
        let nowTime = Date.now();
        let endTime = new Date(endDate).getTime();

        return Math.floor((endTime - nowTime) / (1000 * 3600 * 24))
      }
    },
    filters: {
      formatDateString(date) {
        if(date > 7) {
          return '진행중'
        } else {
          return `마감 D-${date}`
        }
      }
    },
    created: function () {
      this.width = window.innerWidth;
      window.addEventListener('resize', () => {
        this.width = window.innerWidth;
      })
      this.$session.set("storeNewFlag", false);
      let path = this.$router.history.current.path.split('/');
      this.loadingFlag = true;
      this.$store.dispatch('setSpecificStore', {
        specificStoreId: path[2]
      }).then((result) => {
        this.loadingFlag = false;
        this.tel = `tel:${this.specificStore.phone}`

        this.menus = [];
        for (let i = 0; i < this.specificStore.menus.length; i++) {
          for (let j = 0; j < this.specificStore.menus[i].price_type.length; j++) {
            this.menus.push({
              'name': this.specificStore.menus[i].name,
              'size': this.specificStore.menus[i].price_type[j].size,
              'price': this.specificStore.menus[i].price_type[j].price,
            })
          }
        }
      }, (error) => {
        alert("더 이상 데이터를 불러올 수 없습니다.");
      })
    },
    destroyed() {
      this.$store.commit("darkenBackGround", false);
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    border-top: #f7941e 5px solid;
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 84px);
  }

  .store {
    width: 1131px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 63px;
    height: 120%;
    min-height: 700px;
    display: inline-block;
  }

  .header {
    height: 52px;
    text-align: left;
    border-bottom: 2px #175c8e solid;
    font-size: 30px;
    font-family: NanumSquare, serif;
    font-weight: 800;
    color: #175c8e;
    letter-spacing: -1.5px;
    cursor: pointer;
  }

  .store-detail {
    width: 1131px;
  }

  .store-info-card {
    width: 1131px;
    text-align: left;
    height: 407px;
    padding: 38.5px 0;
    box-sizing: border-box;
    border-bottom: solid 1px #ececec;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .info-text {
    height: 330px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .info-image {
    position: relative;
    width: 330px;
    height: 330px;
  }

  .no-image {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background: #787878;
  }

  .info-image .store-poster {
    width: 330px;
    height: 330px;
    cursor: pointer;
    image-orientation: from-image;
  }

  .more {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 24px;
    height: 24px;
  }

  .store-info {
    margin-bottom: 30px;
  }

  .store-name {
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 0.8;
    letter-spacing: -1.5px;
    color: #252525;
    margin-bottom: 18px;
  }
  .event {
    display: inline-block;
    font-family: NanumBarunGothic;
    font-size: 10px;
    margin-left: 14px;
    border: solid 1px #f7941e;
    padding: 0 10px;
    height: 14px;
    border-radius: 7px;
    line-height: 1.6;
    letter-spacing: normal;
    color: #f7941e;
  }
  .event::before {
    content: "이벤트"
  }
  .info {
    display: flex;
  }
  .title {
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.69;
    letter-spacing: -0.7px;
    color: #252525;
    margin-right: 17px;
  }

  .content {
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.69;
    letter-spacing: -0.7px;
    color: #858585;
  }

  .tag {
    border: 1px #f7941e solid;
    font-size: 11px;
    border-radius: 20px;
    padding: 4px 12px;
    background: #f7931e;
    color: white;
  }

  .btn-groups {
    margin-top: 24px;
  }
  .btn-groups a {
    text-decoration: none;
  }
  .call {
    background-color: #175c8e;
    color: #ffffff;
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.73;
    letter-spacing: -0.8px;
    text-align: center;
    padding: 9px 30px;
    cursor: pointer;
    border: 1px solid #175c8e;
  }

  .go-back {
    background-color: #858585;
    color: #ffffff;
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.73;
    letter-spacing: -0.8px;
    text-align: center;
    padding: 9px 30px;
    cursor: pointer;
    border: 1px solid #858585;
  }

  .store-operating-hours {
    margin-top: 1px;
  }

  .event .title {
    text-align: left;
    font-size: 20px;
    letter-spacing: -1px;
    color: #252525;
    margin-bottom: 12px;
    font-weight: 700;
  }

  .event .content {
    text-align: left;
    line-height: 1.7;
    letter-spacing: -0.7px;
    color: #858585;
    font-size: 13px;
  }

  .store-banner {
    margin: 24px 0 64px;
  }
  .menu {
    margin: 24px 0;
    text-align: left;
    height: 100%;
  }

  .menu .title {
    text-align: left;
    font-size: 20px;
    letter-spacing: -1px;
    color: #252525;
    margin-bottom: 12px;
    font-weight: 700;
  }

  .menu-container {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .menu .card {
    width: 497px;
    height: 72px;
    background-color: #f2f2f2;
    border: solid 1px #d7d7d7;
    padding-left: 29px;
    padding-right: 30px;
    margin-bottom: 11px;
    user-select: text;
  }

  .menu .name {
    display: inline-block;
    line-height: 72px;
    vertical-align: middle;
    text-align: left;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.8px;
    color: #252525;
    width: 430px;
    word-wrap: break-word;

    float:left;
  }

  .menu .price {
    float: right;
    line-height: 68px;
    font-size: 15px;
    font-weight: bold;
    font-family: Verdana, NanumSquare;
    letter-spacing: -0.8px;
    color: #175c8e;
    float: right;
  }

  .odd {
    margin-right: 14px;
  }

  .two-line {
    line-height: 1.5;
    text-align: left;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.8px;
    color: #252525;
    width: 430px;
    margin-top: 12px;
    word-wrap: break-word;
    display: inline-block;
    float:left;
  }


  @media (max-width: 576px) {
    .container {
      border-top: none;
      width: 100%;
    }

    .store {
      width: calc(100% - 32px);
      margin: 30px auto;
      font-size: 20px;
    }

    .store-detail {
      width: 100%;
      height: 100%;
    }

    .store-info-card {
      width: 100%;
      height: auto;
      padding: 0 0 30px 0;
      display: block;
    }

    .store-name {
      font-weight: bold;
      letter-spacing: normal;
    }
    .event {
      margin-left: 12px;
      padding: 0 5px;
    }
    .event-flag {
      display: inline-block;
      width: 11px;
      margin-left: 6px;
      position: relative;
      top: 2px;
    }
    .info-text {
      height: auto;
    }

    .info-image {
      width: calc(100% + 16px);
      height: 159px;
      cursor: initial;
      overflow-x: scroll;
      overflow-y: hidden;
      white-space: nowrap;
      margin-top: 25px;
    }

    .info-image .store-poster {
      width: 159px;
      height: 159px;
      cursor: pointer;
    }

    .store-poster + .store-poster {
      margin-left: 10px;
    }

    .menu-container .card {
      width: calc(100% - 24px);
      padding: 0px 12px;
      height: 60px;
      line-height: 1;
    }

    .card .name {
      width: 250px;
      height: 60px;
      line-height: 60px;
      font-size: 13px;
    }

    .two-line {
      width: 250px;
      height: 60px;
      line-height: 60px;
      font-size: 13px;
      margin: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .card .price {
      height: 60px;
      line-height: 60px;
      font-size: 13px;
    }

    .header {
      display: none;
    }

    .info .title {
      margin-right: 5px;
    }

    .store-phone-number {
      height: 17px;
    }

    .store-info {
      margin-bottom: 17px;
    }

    .tag {
      height: 25px;
      font-size: 12px;
    }
    .call {
      display: block;
      padding: 3px 12px;
      margin-right: 5px;
    }

    .go-back {
      display: block;
      padding: 3px 11px;
    }

    .btn-groups {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
      width: 100%;
    }

    .menu {
      margin: 30px 0 0 0;
      height: 100%;
    }

    .menu .title {
      width: 100%;
    }

    .menu-container {
      display: block;
    }

    .menu-container .card:last-child {
      margin-bottom: 0;
    }
    .more {
      display: none;
    }
  }
</style>
