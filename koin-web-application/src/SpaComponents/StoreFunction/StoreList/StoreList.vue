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
          v-for="(store, index) of storeDisplayList"
          @click="clickStore(store.permalink, store.id)"
          :key="store.id"
          :class="{'second-card': index%3===1}"
          class="card">
          <div class="title">
            {{ store.name }}
            <img
              class="event-flag"
              v-if="store.is_event"
              src="https://stage-static.koreatech.in/upload/8c621c1a7b4e016debf3a1164b51d96b.png">
          </div>
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
          <div class="options">
            <span v-if="store.delivery">#배달가능</span>
            <span v-if="store.pay_card">#카드가능</span>
            <span v-if="store.pay_bank">#계좌이체가능</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as FILTERTABLE from '../../../static/storeFilterTag';
  import {mapGetters} from 'vuex';

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
        loadingFlag: false
      }
    },
    computed: {
      ...mapGetters({
        storeList: 'storeList',
        storeDisplayList: 'storeCategoryList'
      })
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
        }).then((data) => {
          this.loadingFlag = true;
        });
        this.$session.set("storeNewFlag", true);
      });
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
    height: 100%;
  }

  .card {
    float: left;
    width: 302px;
    border: 1px #175c8e solid;
    margin-bottom: 30px;
    height: 130px;
    padding: 22px 27px;
    cursor: pointer;
  }

  .second-card {
    margin-left: 28px;
    margin-right: 29px;
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
    margin-top: 15px;
    height: 40px;
  }

  .card .options span {
    border: 1px #f7941e solid;
    font-size: 11px;
    border-radius: 20px;
    padding: 5px 10px;
    background: #f7931e;
    color: white;
  }

  .event-flag {
    width: 13px;
    margin-left: 3px;
    position: relative;
    top: 2px;
  }

  @media (max-width: 576px) {
    .card:hover {
      border: 1px #175c8e solid;
    }

    .card:hover .title {
      color: black;
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

    .list {
      margin-left: auto;
      margin-right: auto;
      width: calc(100% - 32px);
    }

    .card {
      width: calc(100% - 54px);
      margin-bottom: 14px;
    }

    .second-card {
      margin: 0;
      margin-bottom: 14px;
    }

  }
</style>

