<template>
  <div class="promotion__pagination">
    <button
      class="pagination__arrow"
      @click="clickPrevButton">
      이전으로
    </button>
    <button
      class="pagination__number"
      :class="{'pagination__number--active' : n + displayCorrectionNum === value}"
      v-for="n in (limit <= totalPageNum ? limit : totalPageNum)"
      :key="n + displayCorrectionNum"
      @click="clickPageNumPromotion(n + displayCorrectionNum)">
      {{ n + displayCorrectionNum }}
    </button>
    <button
      class="pagination__arrow"
      @click="clickNextButton">
      다음으로
    </button>
  </div>
</template>

<script>
  export default {
    name: "PromotionListPagination",
    model: {
      prop: "value",
      event: "change"
    },
    props: {
      value: {
        type: Number,
        default: 1
      },
      totalPageNum: {
        type: Number,
        required: true
      },
      limit: {
        type: Number,
        default: 5
      }
    },
    methods: {
      clickPageNumPromotion(pageNumberPromotion) {
        this.$session.set("nowPromotionPageNum", this.nowPageNumMarket);
        this.$emit("change", pageNumberPromotion);
        console.log(pageNumberPromotion)
      },
      clickNextButton() {
        if (this.value === this.totalPageNum) {
          alert("마지막 페이지 입니다.");
        } else {
          console.log(this.value + 1)
          this.$session.set("nowPromotionPageNum", this.nowPageNumMarket);
          this.$emit("change", this.value + 1);
        }
      },
      clickPrevButton() {
        if (this.value === 1) {
          alert("첫 페이지 입니다.");
        } else {
          console.log(this.value - 1)
          this.$session.set("nowPromotionPageNum", this.nowPageNumMarket);
          this.$emit("change", this.value - 1);
        }
        console.log(this.value)
      },
    },
    computed: {
      //보정 값
      displayCorrectionNum() {
        if (this.totalPageNum <= this.limit) {
          return 0;
        } else {
          if (this.value <= Math.ceil(this.limit / 2)) {
            //만약 초반 숫자일경우((limit = 5일경우 1, 2)
            return 0;
          } else if (this.totalPageNum - this.value <= Math.floor(this.limit / 2)) {
            ///만약 후반 숫자일 경우(limit = 5, totalPageNum = 8일경우 7, 8)
            return this.totalPageNum - this.limit;
          } else {
            return this.value - Math.ceil(this.limit / 2)
          }
        }
      }
    }
  }
</script>

<style scoped>
  .promotion__pagination {
    background: #ffffff;
    color: #858585;
  }
  .promotion__pagination .pagination__number {
    border-radius: 0;
    padding: 7px 12px;
    margin-left: 2px;
    margin-right: 2px;
    border: 1px #edf0f3 solid;
    font-size: 13px;
    color: #858585;
    cursor: pointer;
    background-color: #ffffff;
  }

  .promotion__pagination .pagination__arrow {
    width: 73px;
    border-radius: 0;
    padding: 7px 0;
    margin: 0 2px;
    background: #ffffff;
    border: 1px #edf0f3 solid;
    color: #858585;
    font-size: 13px;
    letter-spacing: -0.7px;
    cursor: pointer;
  }

  .promotion__pagination .pagination__number:hover, .promotion__pagination .pagination__arrow:hover {
    background: #175c8e;
    color: white;
  }

  .promotion__pagination .pagination__number--active {
    background: #175c8e;
    color: white;
  }

  @media (max-width: 576px) {
    .promotion__pagination {
      display: flex;
      justify-content: center;
      width: 100%;
      border-top: none;
      padding: 0;
      margin-top: 22px;
      margin-bottom: 40px;
    }

    .promotion__pagination .pagination__number:hover, .promotion__pagination .pagination__arrow:hover {
      background: white;
      color: #858585;
    }
    .promotion__pagination .pagination__number--active:hover {
      background-color: #175c8e;
      color: white;
    }
  }
</style>
