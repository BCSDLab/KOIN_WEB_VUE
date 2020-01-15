<template>
  <div class="market-list">
    <div
      @click="clickTitle()"
      class="market-title">중고장터
    </div>
    <div class="row">
      <div
        class="item"
        :class="{ 'last-item': index === 4 }"
        v-for="(market, index) in markets"
        :key="market.id"
        @click="clickMarket(market.id, market.type)">
        <div class="row img-row">
          <img
            v-if="market.thumbnail!==null"
            :src="market.thumbnail">
          <div
            class="no-img"
            v-if="market.thumbnail===null">
            no image
          </div>
          <div
            :class="{ sell: market.type === 0, buy: market.type === 1}"
            class="type">
            <span>{{ market.type ? '구매' : '판매' }}중</span>
          </div>
        </div>
        <div class="title">
          <span>{{ computedTitle(market.title) }}</span>
          <img
            v-if="computedTime(market.created_at)[1]"
            src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png" alt="">
        </div>
        <div class="info-row info1">
          <div class="nickname">
            {{ market.nickname }}
          </div>
        </div>
        <div class="info-row info2">
          <div class="date">
            {{ computedTime(market.created_at)[0] }}
          </div>
          <div
            v-if="market.price.toLocaleString()!=='0'"
            class="price">
            {{ market.price.toLocaleString() }}원
          </div>
          <div
            v-if="market.price.toLocaleString()==='0'"
            class="price">
            - &nbsp; 원
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as LoginCheck from '../../../stores/loginCheck'

  export default {
    name: 'IndexMarket',
    props: {
      markets: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    computed: {
      computedTitle() {
        return (content) => {
          return content.length > 24 ? content.substring(0, 24) + "···" : content;
        }
      }
    },
    data() {
      return {
        today: new Date()
      }
    },
    methods: {
      clickTitle: function () {
        this.$store.dispatch("setNowFooterCategory", {
          footerCategoryIndex: -1
        });
        this.$router.push("/market/sell");
      },
      clickMarket: function (id, type) {
        this.$session.set("specificMarketId", id);
        switch (type) {
          case 0:
            this.$session.set("nowMarketId", 0);
            this.$router.push("/market/sell/" + id);
            break;
          case 1:
            this.$session.set("nowMarketId", 1);
            this.$router.push("/market/buy/" + id);
            break;
        }
        this.$store.dispatch("setNowFooterCategory", {
          footerCategoryIndex: -1
        });
      },
      changeTime: function (time) {
        let times = time.split(" ");
        let date = times[0].split("-");
        let tim = times[1].split(":");
        let created = new Date();
        created.setFullYear(date[0]);
        created.setMonth(date[1] - 1);
        created.setDate(date[2]);
        created.setHours(tim[0]);
        created.setMinutes(tim[1]);
        created.setSeconds(tim[2]);
        return created;
      },
      computedTime: function (time) {
        let created = this.changeTime(time);
        if (Math.ceil((this.today - created) / 1000 / 60) < 60)
          return [Math.floor((this.today - created) / 1000 / 60) + "분 전", true];
        if (Math.floor((this.today - created) / 60 / 1000 / 60) < 4)
          return [Math.floor((this.today - created) / 60 / 60 / 1000) + "시간 전", true];
        else if (Math.floor((this.today - created) / 60 / 1000 / 60) < 24)
          return [Math.floor((this.today - created) / 60 / 1000 / 60) + "시간 전", false];
        else {
          let year = created.getFullYear();
          let month = created.getMonth() + 1 < 10 ? "0" + (created.getMonth() + 1) : created.getMonth() + 1;
          let date = (created.getDate() < 10) ? "0" + created.getDate() : created.getDate();
          let hour = created.getHours() < 10 ? "0" + created.getHours() : created.getHours();
          let minutes = created.getMinutes() < 10 ? "0" + created.getMinutes() : created.getMinutes();
          return [String(year) + "." + String(month) + "." + String(date) + " ", false]
        }
      },
      substrTitle: function (title) {
        return title.length > 36 ? title.substring(0, 36) + "..." : title;
      }
    },
    created() {
    },
  }
</script>
<style scoped>
  .market-list {
    height: 100%;
  }

  .row {
    width: 100%;
    display: flex;
  }

  .img-row {
    height: 141px;
    position: relative;
  }

  .market-title {
    text-align: left;
    font-size: 17px;
    font-weight: 800;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    color: #175c8e;
    margin-bottom: 20px;
    font-family: NanumSquare;
    cursor: pointer;
  }

  .item {
    text-align: left;
    height: 100%;
    width: 212px;
    margin-right: 18px;
    cursor: pointer
  }

  .row .item:last-child {
    margin-right: 0;
  }

  .item .title {
    font-family: NanumBarunGothic;
    font-size: 15px;
    font-weight: normal;
    line-height: 1.6;
    letter-spacing: normal;
    color: #252525;
    margin: 15px 0;
    height: 42px;
    overflow: hidden;
    word-break: break-all;
  }

  .item .title img {
    width: 14px;
    height: 14px;
    margin-left: 5px;
  }

  .item img {
    width: 212px;
    height: 141px;
  }

  .item .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .item .no-img {
    background: #cacaca;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    height: 141px;
    width: 212px;
    color: #999999;
    font-size: 9px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .item .nickname {
    font-family: NanumBarunGothic;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.3;
    letter-spacing: -0.64px;
    text-align: left;
    color: #175c8e;
  }

  .item .time {
    font-size: 12px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: -0.6px;
    text-align: left;
    color: #858585;
  }

  .item .price {
    font-family: NanumBarunGothic;
    font-size: 15px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: -0.72px;
    text-align: left;
    color: #252525;
  }

  .item .date {
    font-family: NanumBarunGothic;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 2;
    letter-spacing: -0.6px;
    text-align: left;
    color: #9fa9b3;
  }
  .type {
    position: absolute;
    bottom: 0;
    left: 0;
    font-family: NanumSquareR;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: -0.48px;
    text-align: center;
    width: 40px;
    height: 17px;
    box-sizing: border-box;
    background-color: #ffffff;
  }

  .sell {
    border: 1px solid #175c8e;
    color: #175c8e;
  }
  .buy {
    border: 1px solid #f7941e;
    color: #f7941e;
  }
  div {
    display: block;
  }

  @media (max-width: 576px) {
    .market-title {
      font-size: 18px;
    }
    .market-list {
      width:100%;
    }
    .row {
      flex-wrap: wrap;
    }
    .item {
      width: calc(50% - 10px);
      margin-right: 0px;
      margin-bottom: 19px;
    }

    .row .item:nth-child(2n - 1) {
      margin-right: 20px;
    }

    .item .no-img {
      width: 100%;
      height: 100px;
    }
    .img-row {
      height: 100px;
    }
    .row img {
      width: 100%;
      height: 100%;
    }

    .title-row {
      height: 45px;
    }

    .item .title {
      text-overflow: ellipsis;
      word-wrap: break-word;
      overflow:hidden;
      font-size: 15px;
      margin: 11px 0 5px 0;
      line-height: 1.27;
      height: 39px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .item .info1 {
      display: block;
      height: 14px;
    }

    .item .info-row {
      align-items: flex-end;
    }

    .item .nickname {
      font-size: 10px;
      /* padding-top: 28px; */
      float: left;
    }

    .item .price {
      font-size: 15px;
      line-height: 1.215;
      letter-spacing: -0.6px;
      float: right;
    }
    .item .date {
      font-size: 8px;
      line-height: 1.5;
      letter-spacing: -0.48px;
    }

    .item .type {
      font-size: 12px;
      letter-spacing: -0.48px;
    }
    .last-item {
      display: none;
    }
    
  }
</style>
