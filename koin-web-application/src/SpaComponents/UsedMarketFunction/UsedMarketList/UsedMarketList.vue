<template>
  <div class="main">
    <div class="market">
      <div class="header">
        <div
          @click="goFirstList"
          class="title">
          {{ computedTitle() }}
        </div>
        <button
          class="write"
          type="button"
          @click="registermarket">글쓰기
        </button>
        <button
          class="my-register-button"
          @click="myMarket()"
          v-if="this.$session.get('token') !== undefined">
          <span v-if="!myFlag">내가 등록한 물품 보기</span>
          <span v-if="myFlag">전체 물품 보기</span>
        </button>
      </div>
      <div class="counter">
        총 {{ numberWithCommas(marketItemCount) }}개의 게시물이 있습니다.
      </div>
      <div
        class="item"
        v-for="(market, index) in this.marketList"
        :class="{'fourth-item': index %4 === 3, 'non-border' : index/4 > 2}"
        :key="market.id"
        @click="clickSpecificmarket(market.id)">
        <div class="title">{{ substrTitle(market.title) }}<i
          v-if="computedTime(market.created_at)[1]"
          class="n">
          <img src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png">
        </i></div>
        <div class="sub-info">
          <span class="nickname">{{ market.nickname }}</span>
          <span class="time">{{ computedTime(market.created_at)[0] }}</span>
        </div>
        <div class="thumbnail-container">
          <img
            class="thumbnail"
            v-if="market.thumbnail!==null"
            :src="market.thumbnail">
          <div
            class="no-img"
            v-if="market.thumbnail===null">
            no image
          </div>
        </div>
        <div class="footer">
          <span class="price">{{ price(market.price) }}</span>
          <span
            v-if="market.state === 0"
            class="type">{{ state(market.state) }}</span>
          <span
            v-if="market.state === 1"
            class="type-2">{{ state(market.state) }}</span>
          <span
            v-if="market.state === 2"
            class="type-3">{{ state(market.state) }}</span>
        </div>
        <div class="mobile__item__info">
          <div class="mobile__item__title">
            <span
              v-if="market.state === 1"
              class="type-2">
              ({{ state(market.state) }})
            </span>
            <span
              v-if="market.state === 2"
              class="type-3">
              ({{ state(market.state) }})
            </span>
            {{ substrTitle(market.title) }}
          </div>
          <div class="mobile__item__sub__info">
            <span class="mobile__hit">조회 {{ market.hit }}</span> ·
            <span class="mobile__item__nick">{{ market.nickname }}</span>
          </div>
          <div class="mobile__item__price">
            {{ price(market.price) }}
          </div>
        </div>
        <div class="mobile__thumbnail__container">
          <img
            class="mobile__thumbnail"
            v-if="market.thumbnail!==null"
            :src="market.thumbnail"
            alt="">
          <div
            class="mobile__no__image"
            v-if="market.thumbnail===null">
            no image
          </div>
        </div>
      </div>
      <div class="pagination">
        <button
          class="arrow"
          @click="clickPrevButton">이전으로
        </button>
        <button
          class="number"
          :class="{active : n ===nowPageNumMarket}"
          v-for="n in totalDisplayPageNumMarket"
          :key="n.id"
          @click="clickPageNumMarket(n)"
          v-if="n>=totalDisplayMinNumMarket">{{ n }}
        </button>
        <button
          class="arrow"
          @click="clickNextButton">다음으로
        </button>
        <button
          class="write"
          type="button"
          @click="registermarket">글쓰기
        </button>
      </div>
      <div
        class="mobile__write"
        @click="registermarket">
        <img src="https://static.koreatech.in/assets/img/mobile__create.png">
      </div>
    </div>
  </div>
</template>

<script>
  import * as market_ID_LIST from '../../../static/marketId';
  import {store} from '../../../stores/store'
  import {mapGetters} from 'vuex';
  import * as LoginCheck from '../../../stores/loginCheck'

  export default {
    name: 'MarketList',
    data() {
      return {
        marketIdList: market_ID_LIST.default,
        marketId: this.$store.getmarketId,
        nowPageNumMarket: 1,
        VUEX_market_STATE: store.state,
        myFlag: false,
        today: new Date(),
      }
    },
    computed: {
      ...mapGetters({
        marketList: 'marketList',
        marketItemCount: 'marketItemCount',
        totalmarketPageNumMarket: 'totalmarketPageNumMarket',
        totalDisplayMinNumMarket: 'totalDisplayMinNumMarket',
        totalDisplayPageNumMarket: 'totalDisplayPageNumMarket'
      })
    },
    methods: {
      goFirstList: function() {
        this.nowPageNumMarket = 1;
        this.$session.set("nowMarketPageNum", 1);
        this.setMarketList(1);
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
      computedTitle: function () {
        switch (this.$session.get("nowMarketId")) {
          case 0:
            return "팝니다";
          case 1:
            return "삽니다";
        }
      },
      numberWithCommas: function (x) {
        if (x !== undefined)
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      substrTitle: function (title) {
        if (title !== undefined)
          return title.length > 22 ? title.substring(0, 22) + "..." : title;
      },
      computedTime: function (time) {
        let created = this.changeTime(time);
        if (Math.ceil((this.today - created) / 1000 / 60) < 60)
          return [Math.floor((this.today - created) / 1000 / 60) + "분 전", true];
        if (Math.floor((this.today - created) / 60 / 1000) < 4)
          return [Math.floor((this.today - created) / 60 / 1000) + "시간 전", true];
        else if (Math.floor((this.today - created) / 60 / 1000) < 24)
          return [Math.floor((this.today - created) / 60 / 1000) + "시간 전", false];
        else {
          let year = created.getFullYear();
          let month = created.getMonth() + 1 < 10 ? "0" + (created.getMonth() + 1) : created.getMonth() + 1;
          let date = (created.getDate() < 10) ? "0" + created.getDate() : created.getDate();
          let hour = created.getHours() < 10 ? "0" + created.getHours() : created.getHours();
          let minutes = created.getMinutes() < 10 ? "0" + created.getMinutes() : created.getMinutes();
          return [String(year) + "." + String(month) + "." + String(date) + " " + String(hour) + ":" + String(minutes), false]
        }
      },
      myMarket() {
        if (!this.myFlag) {
          this.$session.set("myMarketFlag", true);
          this.myFlag = true;
          this.$store.dispatch("setMyMarketList", {
            nowPageNumMarket: 1,
            marketId: this.marketId,
            token: this.$session.get("token")
          })
        }
        else {
          this.$session.set("myMarketFlag", false);
          this.myFlag = false;
          this.setMarketList(1);
        }
        this.nowPageNumMarket = 1;
        this.$session.set("nowMarketPageNum", 1);
      },
      state: function (state) {
        switch (state) {
          case 0:
            if (this.$session.get("nowMarketId") === 0)
              return "판매중";
            else
              return "구매중";
          case 1:
            if (this.$session.get("nowMarketId") === 0)
              return "판매중지";
            else
              return "구매중지";
          case 2:
            if (this.$session.get("nowMarketId") === 0)
              return "판매완료";
            else
              return "구매완료";
        }
      },
      price: function (price) {
        if (price === 0)
          return "- 원"
        else
          return this.numberWithCommas(price) + "원";
      },
      // marketList 호출
      setMarketList: function (nowPageNumMarket) {
        if(this.myFlag){
          this.$store.dispatch("setMyMarketList", {
            nowPageNumMarket: nowPageNumMarket,
            marketId: this.marketId,
            token: this.$session.get("token")
          })
        }
        else {
          this.$store.dispatch("setMarketList", {
            nowPageNumMarket: nowPageNumMarket,
            marketId: this.marketId
          })
        }
      },
      // 페이지 번호 누르기
      clickPageNumMarket: function (pageNumMarket) {
        this.nowPageNumMarket = pageNumMarket;
        this.$session.set("nowMarketPageNum", pageNumMarket);
        this.setMarketList(pageNumMarket);
      },
      // 이전 버튼 누르기
      clickPrevButton: function () {
        this.nowPageNumMarket--;
        if (this.nowPageNumMarket === 0) {
          alert("전 페이지는 없습니다.");
          this.nowPageNumMarket++;
        }
        else {
          this.$session.set("nowMarketPageNum", this.nowPageNumMarket);
          this.setMarketList(this.nowPageNumMarket);
        }
      },
      // 다음 버튼 누르기
      clickNextButton: function () {
        this.nowPageNumMarket++;
        if (this.nowPageNumMarket === this.totalmarketPageNumMarket + 1) {
          alert("마지막 페이지 입니다.");
          this.nowPageNumMarket--;
        }
        this.$session.set("nowMarketPageNum", this.nowPageNumMarket);
        this.setMarketList(this.nowPageNumMarket);
      },
      // 보드 선택
      selectmarket: function (marketId) {
        this.marketId = marketId;
        this.$session.set("nowMarketId", marketId);
        for (let i = 0; i < this.marketIdList.length; i++) {
          if (this.marketIdList[i].marketId === this.$session.get("nowMarketId")) {
            this.$router.push(this.marketIdList[i].path)
          }
        }
        this.setMarketList(1)
      },
      // 특정 게시물 선택
      clickSpecificmarket: function (id) {
        this.$session.set("specificMarketId", id);
        for (let i = 0; i < this.marketIdList.length; i++) {
          if (this.marketIdList[i].marketId === this.$session.get("nowMarketId")) {
            this.$router.push(this.marketIdList[i].path + "/" + id)
          }
        }
      },
      // 등록하기 누르기
      registermarket: function () {
        this.$router.push('/market/register');
      }
    },
    // 생성자
    created() {
      this.myFlag = this.$session.get("myMarketFlag");
      if (this.$session.get("nowMarketId") === undefined) {
        let path = this.$router.history.current.path.split('/');
        switch (path[2]) {
          case 'sell':
            this.$session.set("nowMarketId", 0);
            break;
          case 'buy':
            this.$session.set("nowMarketId", 1);
            break;
        }
        this.nowPageNumMarket = 1;
      }
      this.marketId = this.$session.get("nowMarketId");
      this.nowPageNumMarket = this.$session.get("nowMarketPageNum") !== undefined ? this.$session.get("nowMarketPageNum") : 1;
      this.setMarketList(this.nowPageNumMarket);
    },
    // 라우팅 변경 감지 훅
    beforeRouteUpdate(to, from, next) {
      for (let i = 0; i < this.marketIdList.length; i++) {
        if (this.marketIdList[i].path === to.path) {
          this.marketId = this.marketIdList[i].marketId
        }
      }
      this.nowPageNumMarket = 1;
      this.$session.set("nowMarketId", this.marketId);
      this.setMarketList(1);
      next();
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main {
    width: 100%;
    border-top: #f7941e 5px solid;
  }

  .market {
    width: 1132px;
    min-height: 1395px;
    margin-left: auto;
    margin-right: auto;
  }

  .header {
    height: 116px;
    border-bottom: #175c8e 2px solid;
  }

  .header .title {
    float: left;
    font-size: 30px;
    font-family: NanumSquare, serif;
    font-weight: 800;
    letter-spacing: -1.5px;
    padding-top: 63px;
    color: #175c8e;
    cursor: pointer;
  }

  .header .my-register-button {
    margin-top: 65px;
    font-size: 13px;
    letter-spacing: -0.6px;
    color: white;
    float: right;
    background: #909090;
    padding: 6px 14px;
    margin-right: 5px;
    cursor: pointer;
    border: 1px solid #909090;
  }

  .header .write, .pagination .write {
    margin-top: 65px;
    font-size: 13px;
    letter-spacing: -0.7px;
    color: white;
    float: right;
    background: #175c8e;
    padding: 6px 20px;
    cursor: pointer;
    border: 1px solid #175c8e;
  }

  .pagination .write {
    margin-top: 0;
  }

  .counter {
    font-size: 12px;
    letter-spacing: -0.6px;
    text-align: left;
    padding-top: 25px;
    color: #858585;
    height: 38px;
    width: 1132px;
    margin-bottom: -10px;
  }

  .item {
    width: 262px;
    height: 322px;
    float: left;
    padding-right: 28px;
    border-bottom: #e7e7e7 solid 1px;
    text-align: left;
    margin-top: 30px;
    cursor: pointer;
  }

  .fourth-item {
    padding-right: 0px;
  }

  .non-border {
    border-bottom: none;
  }

  .item .title {
    font-size: 20px;
    letter-spacing: -1px;
    height: 42px;
  }

  .item .sub-info {
    height: 13px;
    margin-top: 13px;
    margin-bottom: 21px;
  }

  .item .sub-info .nickname {
    letter-spacing: -0.7px;
    text-align: left;
    color: #175c8e;
    font-size: 13px;
  }

  .item .sub-info .time {
    letter-spacing: -0.6px;
    text-align: left;
    color: #858585;
    font-size: 12px;
    margin-left: 15px;
  }

  .item .footer {
    margin-top: 18px;
  }

  .item .footer .price {
    float: left;
    color: #175c8e;
    font-weight: bold;
    letter-spacing: -0.9px;
  }

  .item .footer .type, .item .footer .type-2, .item .footer .type-3 {
    float: right;
    font-size: 11px;
    border-radius: 15px;
    padding: 5px 13px;
    position: relative;
    top: -3px;
  }

  .item .footer .type {
    color: #175c8e;
    border: 1px #175c8e solid;
  }

  .item .footer .type-2 {
    color: #d32525;
    border: 1px #d32525 solid;
  }

  .item .footer .type-3 {
    color: #aeaeae;
    border: 1px #aeaeae solid;
  }

  .item .thumbnail-container {
    width: 262px;
    height: 169px;
    overflow: hidden;
  }

  .item .thumbnail {
    width: 100%;
    height: auto;
    min-height: 169px;
  }

  .item .no-img {
    background: #cacaca;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 169px;
    height: 169px;
    width: 262px;
    text-align: center;
    vertical-align: middle;
    color: #999999;
    font-size: 15px;
    margin-bottom: 7px;
  }

  .item .n img {
    width: 13.5px;
    height: 14px;
    position: relative;
    margin-left: 4px;
    top: 1px;
  }

  .pagination {
    width: 1132px;
    float: left;
    padding-top: 30px;
  }

  .pagination {
    border-top: #e7e7e7 solid 1px;
    width: 1132px;
    padding-top: 32px;
    background: #ffffff;
    color: #858585;
  }

  .pagination .number {
    border-radius: 0;
    padding: 7px 12px;
    margin-left: 1px;
    margin-right: 1px;
    border: 1px #edf0f3 solid;
    font-size: 13px;
    color: #858585;
    cursor: pointer;
    background-color: #ffffff;
  }

  .pagination .arrow {
    border-radius: 0;
    padding: 7px 14px;
    margin-left: 6px;
    margin-right: 6px;
    background: #ffffff;
    border: 1px #edf0f3 solid;
    color: #858585;
    font-size: 13px;
    letter-spacing: -0.7px;
    cursor: pointer;
  }

  .pagination .number:hover, .pagination .arrow:hover {
    background: #175c8e;
    color: white;
  }

  .pagination .active {
    background: #175c8e;
    color: white;
  }

  .under-arrow {
    width: 15px;
    float: right;
    margin-right: 22px;
    margin-top: 17px;
  }

  .mobile__write {
    display: none;
  }

  .mobile__item__info, .mobile__thumbnail__container {
    display: none;
  }
  @media (max-width: 576px) {
    .main {
      border-top: none;
    }

    .market {
      width: 100%;
      margin-top: 0;
      min-height: auto;
    }

    .header, .counter {
      display: none;
    }

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: calc(100% - 32px);
      height: 89px;
      margin: 0;
      padding: 0 16px;
      border-bottom: 1px solid #ececec;
    }

    .item .title, .item .sub-info, .item .thumbnail-container, .item .footer {
      display: none;
    }

    .mobile__item__info {
      display: block;
      overflow: hidden;
    }

    .mobile__item__title {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: rgba(0, 0, 0, 0.87);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mobile__item__sub__info {
      margin-top: 1px;
      color: #a1a1a1;
    }

    .mobile__item__sub__info span {
      font-size: 13px;
      font-weight: normal;
      line-height: 1.54;
      letter-spacing: -0.7px;
    }

    .mobile__item__price {
      font-size: 13px;
      font-weight: normal;
      line-height: 1.54;
      letter-spacing: -0.7px;
      color: #175c8e;
      margin-top: 1px;
    }

    .mobile__thumbnail__container {
      display: block;
      width: 55px;
      height: 55px;
    }

    .mobile__thumbnail__container .mobile__thumbnail {
      width: inherit;
      height: inherit;
    }

    .mobile__thumbnail__container .mobile__no__image {
      display: flex;
      justify-content: center;
      align-items: center;
      width: inherit;
      height: inherit;
      background-color: #a1a1a1;
      font-size: 10px;
      font-weight: normal;
      line-height: 2;
      letter-spacing: -0.5px;
      color: #d1d1d1;
    }

    .pagination {
      width: 100%;
      border-top: none;
      padding: 0;
      margin-top: 22px;
      margin-bottom: 40px;
    }

    .pagination .write {
      display: none;
    }

    .mobile__write {
      display: block;
      position: absolute;
      top: 16px;
      right: 16px;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }

    .pagination {
      display: flex;
      justify-content: center;
    }
    
    .pagination .number:hover, .pagination .arrow:hover {
      background: white;
      color: #858585;
    }
    .pagination .active:hover {
      background-color: #175c8e;
      color: white;
    }
  }

  @media (max-width: 360px) {
    .mobile__write {
      left: 312px;
    }
  }
</style>
