<template>
  <div class="Index__Recommend">
    <div class="Recommend__title">
      오늘의 추천
    </div>
    <div
      v-if="storeList.length"
      class="Recommend__card">
      <div class="store-info">
        <div class="store-info__head">
          <div
            class="store-name"
            @click="$router.push(`/store/${storeList[number].permalink}`)">
            {{ storeList[number].name }}
          </div>
          <img
            class="refresh"
            @click="clickRefresh()"
            src="https://static.koreatech.in/assets/img/refresh46%403x.png">
        </div>
        <div class="store-phone-number">
          <div class="title">전화번호</div>
          <div class="content">{{ storeList[number].phone }}</div>
        </div>
        <div class="store-operating-hours">
          <div class="title operating__hours">운영시간</div>
          <div
            v-if="storeList[number].open_time!==null"
            class="content operating__hours">
            {{ storeList[number].open_time }} ~ {{ storeList[number].close_time }}
          </div>
          <div
            v-if="storeList[number].open_time===null"
            class="content operating__hours"> -
          </div>
        </div>
      </div>
      <div class="sub-info-tag">
        <div class="tag-btns">
          <button
            v-if="storeList[number].delivery"
            class="tag delivery-tag">
            #배달가능
          </button>
          <button
            v-if="storeList[number].pay_card"
            class="tag card-tag">
            #카드가능
          </button>
          <button
            v-if="storeList[number].pay_bank"
            class="tag account-tag">
            #계좌이체가능
          </button>
        </div>
        
      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: "IndexRecommend",
    data() {
      return {
        number: 0
      }
    },
    computed: {
      ...mapGetters({
        storeList: 'indexStoreList'
      })
    },
    methods: {
      clickRefresh: function () {
        this.number = Math.floor(Math.random() * (this.storeList.length));
      }
    },
    created() {
      this.$store.dispatch('setStoreList', {
        tag: this.$session.get("storeNewFlag")
      });
      this.clickRefresh();
    }
  }
</script>

<style scoped>
  .Recommend__title {
    width: 100%;
    font-family: NanumSquare;
    font-size: 17px;
    font-weight: 800;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.15;
    letter-spacing: normal;
    text-align: left;
    color: #175c8e;
  }
  .Recommend__card {
    margin-top: 20px;
    width: 295px;
    height: 157px;
    border: solid 1px #175c8e;
    padding: 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .store-info__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  .store-name {
    font-family: NanumBarunGothic;
    font-size: 16px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.15;
    letter-spacing: normal;
    text-align: left;
    color: #252525;
    cursor: pointer;
    ovreflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .store-phone-number {
    display: flex;
  }
  .store-operating-hours {
    display: flex;
    margin-top: 4px;
  }
  .title {
    font-family: NanumBarunGothic;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #000000;
    margin-right: 17px;
  }
  .content {
    font-family: NanumBarunGothic;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #858585;
  }
  .sub-info-tag {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tag-btns {
    display: flex;
  }
  .tag-btns .tag:last-child {
    margin-right: 0;
  }
  .tag {
    border: 1px #f7941e solid;
    width: auto;
    height: 20px;
    border-radius: 12px;
    background-color: #f7941e;
    font-family: NanumBarunGothic;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    margin-right: 5px;
  }

  .refresh {
    width: 23px;
    height: 23px;
    object-fit: contain;
    cursor: pointer;
  }
  @media (max-width: 576px) {
    .Index__Recommend {
      max-width: 100%;
    }
    .Recommend__card {
      height: 154px;
      max-width: 100%;
      width: 544px;
      padding: 21px 27px;
    }
    .Recommend__title {
      font-size: 18px;
    }
    .tag {
      padding: 0 5px;
    }
  }

</style>
