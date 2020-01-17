<template>
  <div
    :class="{'promotion__item': true, 'promotion__item--disabled': isDisabled}"
    @click="$emit('click')">
    <div class="promotion__cover"/>
    <div class="promotion__cover__text">
      마감
    </div>

    <div
      class="promotion__thumbnail--wrapper">
      <img
        class="promotion__thumbnail"
        v-if="thumbnail !== undefined"
        :src="thumbnail">
      <div
        class="promotion__thumbnail--no-img"
        v-else>
        no image
      </div>
    </div>
    <div class="promotion__store">
      <slot name="store"/>
    </div>

    <div class="promotion__description">
      <slot name="description"/>
    </div>

    <div class="promotion__period">
      {{ startDate | shortenDate }} ~ {{ endDate | shortenDate }}
    </div>

    <div class="promotion__date">
      {{ promotionCreatedTime }}
    </div>
  </div>
</template>

<script>
  export default {
    name: "PromotionListItem",
    data() {
      return {
        todayTime: Date.now()
      }
    },
    props: {
      thumbnail: {
        type: String,
        default: undefined
      },
      startDate: {
        type: String,
        required: true
      },
      endDate: {
        type: String,
        required: true
      },
      createdTime: {
        type: String,
        default: undefined
      }
    },
    computed: {
      promotionCreatedTime() {
        return this.createdTime.slice(0,4) + '.' + this.createdTime.slice(5,7) + '.' + this.createdTime.slice(8,10)
      },
      isDisabled() {
        let endDate = new Date(this.endDate);
        endDate.setHours(0);
        endDate.setDate(endDate.getDate() + 1)
        return endDate.getTime() <= this.todayTime
      }
    },
    filters: {
      shortenDate(date) {
        return date.slice(2, 4) + '.' + date.slice(5, 7) + '.' + date.slice(8, 10)
      }
    }
  }
</script>

<style scoped>
  .promotion__item {
    border: solid 1px #c0c0c0;
    background-color: #ffffff;
    cursor: pointer;
    position: relative;
  }
  .promotion__item:not(.promotion__item--disabled):hover {
    border: solid 1px #f7941e;
  }

  .promotion__item--disabled > .promotion__cover {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 1);
    z-index: 10;
    position: absolute;
  }
  .promotion__item:not(.promotion__item--disabled) > .promotion__cover__text {
    display: none;
  }
  .promotion__item--disabled > .promotion__cover__text {
    width: 49px;
    padding: 6px 0;
    background-color: #175c8e;
    font-family: NanumBarunGothic;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.17;
    letter-spacing: 0.6px;
    text-align: center;
    z-index: 11;
    color: #ffffff;
    position: absolute;
  }
  .promotion__period::before {
    content: "행사기간:";
    line-height: 1.17;
  }

  .promotion__thumbnail--wrapper {
    margin: 19px auto 20px;
    width: 236.5px;
    height: 161.8px;
    position: relative;
  }
  .promotion__thumbnail--wrapper .promotion__thumbnail {
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .promotion__thumbnail--wrapper .promotion__thumbnail--no-img {
    background: #cacaca;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 169px;
    height: 100%;
    width: 100%;
    text-align: center;
    vertical-align: middle;
    color: #999999;
    font-size: 15px;
    margin-bottom: 7px;
  }

  .promotion__store {
    margin-top: 20px;
    font-family: NanumBarunGothic;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: center;
    color: #175c8e;
  }
  .promotion__item:not(.promotion__item--disabled):hover .promotion__store {
    color: #f7941e;
  }

  .promotion__description {
    width: fit-content;
    margin: 16.5px auto 0;
    font-family: NanumBarunGothic;
    font-size: 15px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: center;
    color: #404040;
  }
  .promotion__period {
    width: fit-content;
    margin: 10px auto 0;
    font-family: NanumBarunGothic;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.17;
    letter-spacing: normal;
    text-align: center;
    color: #7e7e7e;
  }

  .promotion__date {
    margin: 19px auto 0;
    opacity: 0.98;
    font-family: NanumBarunGothic;
    font-size: 12px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.17;
    letter-spacing: -0.36px;
    text-align: center;
    color: #778391;
  }

  .promotion__cover {
    position: absolute;
    opacity: 0.5;
    background-color: #000000;
    z-index: 3;
  }
  .promotion__date::before {
    content: "";
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 5px;
    margin-bottom: -2px;
    background-image: url("https://static.koreatech.in/assets/img/ic_date.png");
    background-repeat: no-repeat;
    background-size: 12px 12px;
  }

  @media (max-width: 576px) {
    .promotion__item--disabled > .promotion__cover__text {
      width: 46px;
      padding: 3px 0;
      font-size: 11px;
      line-height: 1.09;
    }

    .promotion__thumbnail--wrapper {
      margin: 0;
      width: 100%;
      height: 106px;
      position: relative;
    }
    .promotion__thumbnail--wrapper .promotion__thumbnail--no-img {
      line-height: 106px;
    }

    .promotion__store {
      margin-top: 10px;
      font-size: 14px;
      font-weight: 500;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.14;
      letter-spacing: normal;
      text-align: center;
      color: #175c8e;
    }
    .promotion__item:not(.promotion__item--disabled):hover .promotion__store {
      color: #f7941e;
    }

    .promotion__description {
      width: 118px;
      height: 32px;
      margin: 10px 20px 0;
      font-size: 13px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      word-break: break-all;
      line-height: 1.31;
      letter-spacing: normal;
      text-align: center;
      color: #252525;
    }
    .promotion__period {
      width: fit-content;
      margin: 10px auto 0;
      font-size: 12px;
      line-height: 1.17;
      color: #7e7e7e;
    }
    .promotion__period::before {
      display: inline-block;
      content: "";
      width: 8px;
      height: 11px;
      margin-right: 6px;
      background-image: url(https://stage-static.koreatech.in/upload/8c621c1a7b4e016debf3a1164b51d96b.png);
      background-size: cover
    }

    .promotion__date {
      margin: 10px auto 0;
      font-size: 10px;
      line-height: 1.2;
      color: #9fa9b3;
    }
    .promotion__date::before {
      content: "";
      width: 10px;
      height: 10px;
      margin-right: 3px;
      margin-bottom: -2px;
      background-size: 10px 10px;
    }
  }
</style>
