<template>
  <div
    :class="{'banner': true, 'banner--secondary': secondColor}"
    @click="$router.push(to)">
    <div class="banner__title">
      <slot name="title"/>
    </div>
    <div class="banner__summary">
      <slot/>
    </div>
    <div class="banner__date">
      <span class="banner__date-desc">기간 :</span> {{ displayPeriod }}
    </div>
  </div>
</template>

<script>
  export default {
    name: "StoreBanner",
    props: {
      startDate: {
        type: String,
        required: true
      },
      endDate: {
        type: String,
        required: true
      },
      secondColor: {
        type: Boolean,
        required: true
      },
      to: {
        type: String,
        required: true
      }
    },
    computed: {
      displayPeriod () {
        let startDate = new Date(this.startDate);
        let endDate = new Date(this.endDate);
        let startMonth = startDate.getMonth() + 1;
        let endMonth = endDate.getMonth() + 1;
        return  `${startMonth}월 ${startDate.getDate()}일 ~ ` +
          ( startMonth !== endMonth ? `${endMonth}월 ${endDate.getDate()}일` : `${endDate.getDate()}일`)
      }
    }
  }
</script>

<style scoped>
  .banner {
    height: 91px;
    position: relative;
    background-color: #f7941e;
    transition: background-color .5s;
    font-family: NanumBarunGothic;
    color: white;
    text-align: center;
    cursor: pointer;
  }
  .banner.banner--secondary.banner {
    background-color: #4db297;
  }

  .banner__title {
    padding-top: 22px;
    font-size: 20px;
    font-weight: bold;
    line-height: 1.15;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .banner__summary {
    padding-top: 10px;
    font-size: 12px;
    line-height: 1.17;
  }
  .banner__date {
    position: absolute;
    font-size: 11px;
    line-height: 1.09;
    bottom: 11px;
    right: 15px;
  }
  .banner__date-desc {
    color: #fbff9f
  }

  @media (max-width: 576px) {
    .banner {
      margin: 16px 0;
      height: 106px;
    }

    .banner__title {
      padding-top: 14px;
      font-size: 16px;
      line-height: 1.19;
    }

    .banner__summary {
      padding-top: 11px;
      font-size: 13px;
      line-height: 1.46;
    }
    .banner__date {
      font-size: 9px;
      font-weight: 200;
      line-height: 1.22;
      right: 10px;
      bottom: 8px;
    }
  }
</style>
