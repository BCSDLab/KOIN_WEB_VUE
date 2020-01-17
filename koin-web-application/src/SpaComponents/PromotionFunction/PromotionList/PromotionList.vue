<template>
  <div class="promotion">
    <promotion-header
      @click-title="goFirstPage">
      <button
        class="promotion__button"
        @click="registerPromotion">
        <img
          src="https://static.koreatech.in/assets/img/mobile__create.png"
          alt="mobile-create"/>
        <span>글쓰기</span>
      </button>
    </promotion-header>
    <div class="promotion__checkboxs">
      <div class="promotion__checkbox--wrapper">
        <input
          class="promotion__checkbox"
          id="finished"
          name="finished"
          :checked="promotionType[1]"
          @click="toggleCheckbox($event, 1)"
          type="checkbox">
        <label for="finished">
          종료된 이벤트
        </label>
      </div>
      <div class="promotion__checkbox--wrapper">
        <input
          class="promotion__checkbox"
          id="proceeding"
          name="proceeding"
          :checked="promotionType[0]"
          @click="toggleCheckbox($event, 0)"
          type="checkbox">
        <label for="proceeding">
          진행중 이벤트
        </label>
      </div>
    </div>

    <div class="promotion__content">
      <promotion-item
        v-for="promotion in this.promotionList"
        :thumbnail="promotion.thumbnail === null ? undefined : promotion.thumbnail"
        :start-date="promotion.start_date"
        :end-date="promotion.end_date"
        :created-time="promotion.created_at"
        :key="promotion.id"
        @click="clickSpecificPromotion(promotion.id)">
        <template #store>
          {{ promotion.nickname }}
        </template>

        <template #description>
          {{ substrTitle(promotion.title) }}
        </template>
      </promotion-item>
    </div>
    <promotion-pagination
      v-model="nowPageNumPromotion"
      :total-page-num="totalPageNumPromotion"
      @change="setPromotionList"/>
    <div
      v-show="isConfirmActive"
      class="promotion__confirm">
      <div class="confirm__content">
        <div class="confirm__alert"/>
        <div class="confirm__title">
          이미 진행중인 이벤트가 있습니다.
        </div>
        <div class="confirm__sub-title">
          수정하시겠습니까?
        </div>
        <div class="confirm__buttons">
          <button
            class="confirm__button"
            @click="clickConfirm(true)">
            예
          </button>
          <button
            class="confirm__button"
            @click="clickConfirm(false)">
            아니요
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import PromotionHeader from "../PromotionSharedComponent/PromotionHeader";
  import PromotionListItem from "./PromotionListComponent/PromotionListItem";
  import PromotionListPagination from "./PromotionListComponent/PromotionListPagination";

  export default {
    name: "PromotionList",
    components: {
      'promotion-header': PromotionHeader,
      'promotion-item': PromotionListItem,
      'promotion-pagination': PromotionListPagination
    },
    data() {
      return {
        promotionId: 1,
        nowPageNumPromotion: 1,
        myFlag: false,
        today: new Date(),
        // [진행중 이벤트, 종료된 이벤트]
        promotionType: [true, true],
        mobileFlag: false,
        isConfirmActive: false,
        confirmResult: false
      }
    },
    computed: {
      ...mapGetters({
        promotionList: 'promotionList',
        totalPageNumPromotion: 'totalPageNumPromotion',
      })
    },
    methods: {
      ...mapActions({
        setPromotionList: 'setPromotionList'
      }),
      ...mapMutations({
        darkenBackGround: 'darkenBackGround'
      }),
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
      substrTitle: function (title) {
        if (title !== undefined)
          return title.length > 18 ? title.substring(0, 18) + "..." : title;
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
      // promotionList 호출
      setPromotionList: function (nowPageNumPromotion) {
        this.$store.dispatch("setPromotionList", {
          nowPageNumPromotion: nowPageNumPromotion,
          marketId: this.marketId,
          type: this.promotionType[0] * 1 + this.promotionType[1] * 2,
          limit: 12
        })
      },
      // 특정 게시물 선택
      clickSpecificPromotion(id) {
        console.log(id)
        this.$router.push('/board/promotion/' + id);
      },
      // 등록하기 누르기
      registerPromotion() {
        if(this.$session.get('userInfo') !== undefined && this.$session.get('userInfo').identity === 5) {
          this.$store.dispatch('checkMyPromotion', {
            token: this.$session.get('token')
          }).then(
            async (res) => {
              if (res.data.totalItemCount !== 0) {
                if(await this.confirmAdjustPendingEvent()) {
                  this.$session.set('specificPromotionId', res.data.event_articles[0].id);
                  this.$router.push('/board/promotion/adjust');
                }
              } else {
                this.$session.remove('specificPromotionId');
                this.$router.push('/board/promotion/register');
              }
            }
          )
        } else {
          alert('점주가 아니면 게시물을 쓸 수 없습니다.');
        }
      },
      goFirstPage () {
        this.nowPageNumPromotion = 1;
        this.$session.set("nowPromotionPageNum", 1);
      },
      toggleCheckbox (event, type) {
        if(this.promotionType[type] && !this.promotionType[!type - 0]) {
          event.preventDefault();
        } else {
          this.promotionType[type] = !this.promotionType[type]
          this.setPromotionList(this.nowPageNumPromotion)
        }
      },
      confirmAdjustPendingEvent () {
        if (this.mobileFlag) {
          return Promise.resolve(confirm('이미 진행중인 이벤트가 있습니다.\n수정하시겠습니까?'));
        } else {
          return new Promise(
            resolve => {
              let vm = this;
              vm.isConfirmActive = true;
              vm.darkenBackGround(true);
              (function waitForClickButton () {
                console.log('check');
                if (!vm.isConfirmActive) {
                  if (vm.confirmResult) {
                    console.log('true')
                    resolve(true)
                  } else {
                    console.log('false')
                    resolve(false)
                  }
                  clearTimeout(waitForClickButton);
                } else {
                  setTimeout(waitForClickButton, 100);
                }
              })();
            }
          )
        }
      },
      clickConfirm (value) {
        this.confirmResult = value;
        this.isConfirmActive = false;
        this.darkenBackGround(false);
      }
    },
    // 생성자
    created() {
      this.myFlag = this.$session.get("myPromotionFlag");
      this.nowPageNumMarket = this.$session.get("nowPromotionPageNum") !== undefined ? this.$session.get("nowMarketPageNum") : 1;
      this.setPromotionList(this.nowPageNumMarket);

      this.mobileFlag = window.innerWidth < 576;
      window.addEventListener('resize', () => {
        this.mobileFlag = window.innerWidth < 576;
      });
    },
    destroyed () {
      window.removeEventListener('resize', () => {
        this.mobileFlag = window.innerWidth < 576;
      })
    }
  }
</script>

<style scoped>
  .promotion {
    float: left;
    margin: 0 40px 101px 0;
    width: 834px;
  }

  .promotion__content {
    margin-bottom: 73px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 336px;
    grid-column-gap: 22px;
    grid-row-gap: 33px;
  }

  .mobile__write {
    display: none;
  }


  .promotion__button {
    font-size: 13px;
    letter-spacing: -0.7px;
    color: white;
    background: #175c8e;
    padding: 5px 0;
    width: 74px;
    height: 30px;
    cursor: pointer;
    border: 1px solid #175c8e;
    flex: none;
  }
  .promotion__button img {
    display: none;
  }

  .promotion__checkboxs {
    margin: 27px 0 27px;
    height: 16px;
  }

  .promotion__checkbox--wrapper {
    margin-left: 25px;
    color: #175c8e;
    letter-spacing: -0.6px;
    font-size: 12px;
    float: right;
  }


  /*체크박스 커스텀*/
  .promotion__checkbox {
    display: none;
  }

  .promotion__checkbox + label {
    display: inline-block;
    cursor: pointer;
    position: relative;
    padding-left: 23px;
    font-family: NanumBarunGothic;
    text-align: left;
    width: content-box;
  }

  .promotion__checkbox + label:before {
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

  .promotion__checkbox:checked + label:before {
    content: "";
    background-image: url("https://static.koreatech.in/assets/img/check.png");
    background-color: #175c8e;
    border: 1px solid #175c8e;
    background-size: cover;
  }

  .promotion__confirm {
    z-index: 1;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .confirm__content {
    width: 322px;
    height: 127px;
    background-color: white;
    padding: 18px 0 23px;
    font-family: NanumBarunGothic;
    letter-spacing: normal;
    text-align: center;
  }
  .confirm__alert {
    margin: auto;
    width: 26px;
    height: 26px;
    border-radius: 13px;
    background-color: #175c8e;
    color: white;
    line-height: 1.7;
    text-indent: 1px;
  }
  .confirm__alert::before {
    content: "!"
  }
  .confirm__title {
    margin-top: 13px;
    font-size: 18px;
    line-height: 1.11;
    color: #252525;
  }
  .confirm__sub-title {
    margin-top: 9px;
    font-size: 15px;
    line-height: 1.2;
    color: #4f4f4f;
  }
  .confirm__buttons {
    margin-top: 14px;
    display: flex;
    justify-content: center;
  }
  .confirm__buttons .confirm__button {
    margin: 0 8px;
    width: 81px;
    height: 27px;
    border: solid 1px #edf0f3;
    background-color: #ffffff;
    font-size: 14px;
    line-height: 1.14;
    color: #606060;
  }

  @media (max-width: 576px) {

    .promotion {
      width: 100%;
      margin: 0 0 72px;
      min-height: auto;
    }
    .promotion__content {
      margin: 0 auto 39px;
      width: 328px;
      min-height: 471px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 226px;
      grid-column-gap: 12px;
      grid-row-gap: 19px;
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

    .item .title, .item .sub-info, .item .thumbnail-container {
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

    .promotion__button {
      display: block;
      position: absolute;
      top: 10px;
      right: 16px;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
    .promotion__button img {
      display: block;
    }
    .promotion__button span {
      display: none;
    }

    .promotion__checkboxs {
      margin: 26px 16px 17px 0;
      height: 16px;
    }
    .promotion__checkbox--wrapper {
      margin-left: 12px;
      height: 16px;
    }
  }

  @media (max-width: 360px) {
    .mobile__write {
      left: 312px;
    }
  }
</style>
