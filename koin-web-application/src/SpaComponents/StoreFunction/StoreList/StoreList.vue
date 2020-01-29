<template>
  <div class="container">
    <div v-if="!loadingFlag">
      <v-loading-bar></v-loading-bar>
    </div>
    <div
      v-if="loadingFlag"
      class="stores">
      <div class="category">
        <v-store-category></v-store-category>
      </div>
      <store-banner
        v-if="specificPromotion !== undefined && specificPromotion !== null && specificPromotion !== ''"
        class="list-banner"
        :start-date="specificPromotion.start_date"
        :end-date="specificPromotion.end_date"
        :second-color="isSecondColor"
        :to="'/board/promotion/' + specificPromotion.id">
        <template #title>
          {{ specificPromotion.title }}
        </template>
        {{ specificPromotion.event_title }}
      </store-banner>
      <div class="category-sub">
        <span class="counter">
          총 <span class="bold">{{ storeDisplayList.length }}개의 업체</span>가 있습니다.
        </span>
        <div class="check">
          <input
            @click="clickBankCheck()"
            class="checkbox"
            id="bank"
            name="bank"
            :checked="bank"
            type="checkbox">
          <label for="bank">계좌이체 가능</label>
        </div>
        <div class="check">
          <input
            @click="clickCardCheck()"
            class="checkbox"
            id="card"
            name="card"
            :checked="card"
            type="checkbox">
          <label for="card">카드결제 가능</label>
        </div>
        <div class="check">
          <input
            @click="clickDeliveryCheck()"
            class="checkbox"
            id="delivery"
            name="delivery"
            :checked="delivery"
            type="checkbox">
          <label for="delivery">배달 가능</label>
        </div>
      </div>
      <div class="list">
        <div
          v-for="store of storeDisplayList"
          @click="clickStore(store.permalink, store.id)"
          :key="store.id"
          class="card">
          <div class="title">
            {{ store.name }}
          </div>
          <template v-if="store.event_articles.length">
            <div
              class="date"
              v-if="!mobileFlag">
              {{ convertDday(store.event_articles[0].end_date) | formatDateString }}
            </div>
            <img
              v-else
              class="date-img"
              src="https://stage-static.koreatech.in/upload/8c621c1a7b4e016debf3a1164b51d96b.png"
              alt="event">
          </template>
          <div class="phone">
            <div class="desc">전화번호</div>
            <div class="desc2">{{ store.phone }}</div>
          </div>
          <div class="time">
            <div class="desc">운영시간</div>
            <div
              v-if="store.open_time!==null"
              class="desc2">{{ store.open_time }} ~ {{ store.close_time }}
            </div>
            <div
              v-if="store.open_time===null"
              class="desc2"> -
            </div>
          </div>
          <div
            v-if="!mobileFlag"
            class="options">
            <span
              class="option-delivery"
              v-if="store.delivery"/>
            <span
              class="option-card"
              v-if="store.pay_card"/>
            <span
              class="option-bank"
              v-if="store.pay_bank"/>
          </div>
          <div
            v-else
            class="options--mobile">
            <span :class="{'option-delivery':true, 'option--disabled': !store.delivery}"/>
            <span :class="{'option-card':true, 'option--disabled': !store.pay_card}"/>
            <span :class="{'option-bank':true, 'option--disabled': !store.pay_bank}"/>
          </div>
          <div
            class="event-link"
            v-if="store.event_articles.length && !mobileFlag"
            @click="clickPromotion($event, store.event_articles[0].id)">
            이벤트 확인하러 가기 >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as FILTERTABLE from '../../../static/storeFilterTag';
  import {mapGetters} from 'vuex';
  import StoreBanner from "../Components/StoreBanner";

  export default {
    name: 'StoreList',
    data() {
      return {
        filterTable: FILTERTABLE.default,
        card: false, //true인 경우 전체보기 false인 경우 가능만 보기
        bank: false,
        delivery: false,
        tag: "",
        flag: true,
        loadingFlag: false,
        isSecondColor: false,
        mobileFlag: false,
        changeColorInterval: null
      }
    },
    computed: {
      ...mapGetters({
        storeList: 'storeList',
        storeDisplayList: 'storeCategoryList',
        specificPromotion: 'storePromotion'
      })
    },
    components: {
      'store-banner': StoreBanner
    },
    created() {
      // store-detail로 바로 접근해서 store-list로 넘어온 경우
      if (this.storeList.length === 0 && this.$session.get("storeNewFlag") === false) this.$session.set("storeNewFlag", true);
      this.bank = this.$session.get("storeCheckBoxs")[0] === null ? false : this.$session.get("storeCheckBoxs")[0];
      this.card = this.$session.get("storeCheckBoxs")[1] === null ? false : this.$session.get("storeCheckBoxs")[1];
      this.delivery = this.$session.get("storeCheckBoxs")[2] === null ? false : this.$session.get("storeCheckBoxs")[2];
      this.$store.dispatch('setStoreList', {
        tag: this.$session.get("storeNewFlag")
      }).then((data) => {
        this.$store.dispatch('setCategoryStoreList', {
          tag: this.$session.get("storeTag") === undefined ? data : this.$session.get("storeTag"),
          bank: this.bank,
          card: this.card,
          delivery: this.delivery
        }).then(async () => {
          this.mobileFlag = window.innerWidth < 576;
          await this.$store.dispatch("setStorePromotion")
          this.changeColorInterval = setInterval(
            () => {
              this.$store.dispatch("setStorePromotion").then(
                () => {
                  this.isSecondColor = !this.isSecondColor;
                }
              )
            },
            5000
          )

          this.loadingFlag = true;
          });

        this.$nextTick(() => {
          window.addEventListener('resize', () => {
            this.mobileFlag = window.innerWidth < 576;
          })
        })
        this.$session.set("storeNewFlag", true);
      });
    },
    destroyed() {
      clearInterval(this.changeColorInterval)
      window.removeEventListener('resize', () => {
        this.mobileFlag = window.innerWidth < 576;
      })
    },
    methods: {
      clickStore: function (link, id) {
        this.$router.push("store/" + link);
        this.$session.set('specificStoreId', id)
      },
      clickCardCheck() {
        this.card = !this.card;
        this.$session.set("storeCheckBoxs", [this.bank, this.card, this.delivery]);
        this.$store.dispatch('setCategoryStoreList', {
          tag: this.$session.get("storeTag") === undefined ? '-1' : this.$session.get("storeTag"),
          bank: this.bank,
          card: this.card,
          delivery: this.delivery
        })
      },
      clickBankCheck() {
        this.bank = !this.bank;
        this.$session.set("storeCheckBoxs", [this.bank, this.card, this.delivery]);
        this.$store.dispatch('setCategoryStoreList', {
          tag: this.$session.get("storeTag") === undefined ? '-1' : this.$session.get("storeTag"),
          bank: this.bank,
          card: this.card,
          delivery: this.delivery
        })
      },
      clickDeliveryCheck() {
        this.delivery = !this.delivery;
        this.$session.set("storeCheckBoxs", [this.bank, this.card, this.delivery]);
        this.$store.dispatch('setCategoryStoreList', {
          tag: this.$session.get("storeTag") === undefined ? '-1' : this.$session.get("storeTag"),
          bank: this.bank,
          card: this.card,
          delivery: this.delivery
        })
      },
      convertDday (endDate) {
        let nowTime = Date.now();
        let endTime = new Date(endDate).getTime();

        return Math.ceil((endTime - nowTime) / (1000 * 3600 * 24))
      },
      clickPromotion (event, promotion) {
        event.stopPropagation();
        this.$router.push(`/board/promotion/${promotion}`)
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
    beforeRouteUpdate(to, from, next) {
      console.log(from.path)
      next();
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    border-top: #f7941e 5px solid;
    width: 100%;
  }

  .stores {
    width: 1131px;
    margin-top: 63px;
    margin-left: auto;
    margin-right: auto;
  }

  .category {
    height: 202px
  }

  .list-banner {
    margin: 18px 0 3px;
    cursor: pointer;
  }
  .category-sub {
    margin-top: 20px;
    height: 25px;
  }

  .category-sub .counter {
    float: left;
    color: #858585;
    font-size: 12px;
    letter-spacing: -0.6px;
  }

  .category-sub .counter .bold {
    font-weight: 700;
  }

  .category-sub .check {
    margin-left: 25px;
    color: #175c8e;
    letter-spacing: -0.6px;
    font-size: 12px;
    float: right;
    margin-right: 8px;
  }

  /* 체크박스 커스텀 */
  input[type=checkbox] {
    display: none;
  }

  input[type=checkbox] + label {
    display: inline-block;
    cursor: pointer;
    position: relative;
    padding-left: 15px;
    width: 100%;
  }

  input[type=checkbox] + label:before {
    content: "";
    width: 12px;
    height: 12px;
    position: absolute;
    left: 0;
    bottom: 1px;
    background-color: #ffffff;
    border: 1px solid #d2dae2;
    line-height: 13px;
  }

  input[type=checkbox]:checked + label:before {
    content: "";
    background-image: url("https://static.koreatech.in/assets/img/check.png");
    background-size: cover;
  }

  .list {
    width: 1131px;
    min-height: 58vh;
    margin-top: 15px;
    margin-bottom: 30px;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 358px);
    grid-column-gap: 29px;
    grid-row-gap: 30px;
    grid-auto-rows: 176px;
  }
  .stores .list-banner {
    margin: 18px 0 3px;
    cursor: pointer;
  }

  .card {
    border: 1px #175c8e solid;
    padding: 22px 27px;
    cursor: pointer;
    position: relative;

  }

  .card:hover {
    border: 1px #f7941e solid;
  }

  .card:hover .title {
    color: #f7941e;
  }

  .card .title {
    text-align: left;
    font-size: 20px;
    height: 39px;
    width: 100%;
    letter-spacing: -1px;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    overflow: hidden;
  }
  .card .date {
    position: absolute;
    top: 0;
    right: 0;
    padding: 4px 11px;
    font-family: NanumBarunGothic;
    font-size: 11px;
    line-height: 1.09;
    letter-spacing: normal;
    color: #ffffff;
    background-color: #175c8e;
    text-align: center;
  }
  .card:hover .date {
    background-color: #f7941e;
  }
  .card .date::before {
    content: "이벤트"
  }

  .card .phone {
    text-align: left;
    font-size: 13px;
    height: 22px;
    width: 100%;
    letter-spacing: -0.7px;
  }

  .card .phone .desc, .card .time .desc {
    float: left;
    width: 61px;
  }

  .card .phone .desc2, .card .time .desc2 {
    float: left;
    color: #858585;
  }

  .card .time {
    text-align: left;
    font-size: 13px;
    height: 32px;
    letter-spacing: -0.7px;
  }

  .card .options {
    text-align: left;
    height: 20px;
  }

  .card .options span {
    border: 1px #f7941e solid;
    font-size: 11px;
    border-radius: 20px;
    padding: 5px 10px;
    background: #f7931e;
    color: white;
  }
  .card .options .option-delivery::before {
    content: "#배달가능"
  }
  .card .options .option-card::before {
    content: "#카드가능"
  }
  .card .options .option-bank::before {
    content: "#계좌이체가능"
  }
  .card .event-link {
    position: absolute;
    bottom: 11px;
    right: 11px;
    font-family: NanumBarunGothic;
    font-size: 11px;
    color: #175c8e;
    line-height: 1.36;
    letter-spacing: normal;
  }
  .card:hover .event-link {
    color: #f7941e;
  }

  .event-flag {
    width: 13px;
    margin-left: 3px;
    position: relative;
    top: 2px;
  }

  @media (max-width: 576px) {
    .list {
      margin-left: auto;
      margin-right: auto;
      width: calc(100% - 32px);
      grid-template-columns: repeat(1, 1fr);
      grid-auto-rows: 60px;
      grid-row-gap: 14px
    }
    .stores .list-banner {
      margin: 24px 16px;
    }

    .card {
      width: auto;
      height: auto;
      padding: 0 16px;
      box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1);
      border: solid 1px #d2dae2;
      display: flex;
      align-items: center;
      flex: none;
    }
    .card:hover {
      border: 1px #f7941e solid;
    }
    .card .title {
      height: auto;
      width: auto;
      max-width: 120px;
      word-break: break-all;
      text-overflow: unset;
      overflow: unset;
      white-space: unset;
      font-family: NotoSansCJKKR;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.33;
      letter-spacing: normal;
      text-align: left;
      color: #252525;
    }
    .card:hover .title {
      color: #202020;
    }

    .card .date-img {
      width: 11px;
      margin-left: 10px;
    }

    .card .phone {
      display: none;
    }
    .card .time {
       display: none;
     }

    .card .options--mobile {
      margin-left: auto;
    }
    .card .options--mobile span {
      font-size: 11px;
      background: transparent;
      color: #f7931e;
      margin: 0 3px;
      padding: 0;
      border: 0;
    }
    .card .options--mobile span.option--disabled {
      color: #d2dae2;
    }

    .card .options--mobile .option-delivery::before {
      content: "배달"
    }
    .card .options--mobile .option-card::before {
      content: "카드결제"
    }
    .card .options--mobile .option-bank::before {
      content: "계좌이체"
    }
    .container {
      border-top: none;
    }

    .stores {
      width: 100%;
      margin-top: 30px;
    }

    .category {
      height: 221px;
    }

    .category-sub {
      margin-top: 15px;
      margin-left: auto;
      margin-right: auto;
      width: calc(100% - 32px);
    }

    .counter {
      width: 100%;
      margin-bottom: 33px;
      text-align: left;
    }

    .check {
      margin-bottom: 15px;
    }
  }
</style>

