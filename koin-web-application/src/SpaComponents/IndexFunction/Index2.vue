<template>
  <!--component total container-->
  <div class="index__container">
    <div class="index__row mobile__bus__section">
      <div class="index__bus">
        <v-index-bus v-if="mobileFlag"></v-index-bus>
      </div>
    </div>
    
    <!-- index 상단 게시판 start -->
    <div class="index__row top-board">
      <div class="index__top-board">
        <v-index-top-board></v-index-top-board>
      </div>
    </div>
    <!-- index 상단 게시판 end -->

    <!-- 추천, 버스, 식단 row start -->
    <div class="index__row card__list">
      <div class="index__recommend">
        <v-index-recommend v-if="!mobileFlag"></v-index-recommend>
      </div>
      <div class="index__bus">
        <v-index-bus v-if="!mobileFlag"></v-index-bus>
      </div>
      <div class="index__diet">
        <v-index-diet></v-index-diet>
      </div>
    </div>

    <div class="index__row mobile__swiper">
      <swiper :options="swiperOption">
        <swiper-slide>
          <v-index-diet></v-index-diet>
        </swiper-slide>
        <swiper-slide>
          <v-index-recommend v-if="mobileFlag"></v-index-recommend>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <!-- row end -->

    <!-- index 게시판 리스트 start -->
    <div class="index__row board-list">
      <div class="index__board__list">
        <v-index-board-list></v-index-board-list>
      </div>
      <div class="index__card-news">
        <v-index-card-news></v-index-card-news>
      </div>
    </div>
    <!-- index 게시판 리스트 end -->

    <!--index 중고장터 start-->
    <div class="index__row market">
      <!--index market -->
      <div class="index__market">
        <v-index-market :markets="indexMarket"></v-index-market>
      </div>
    </div>
    <!--index 중고장터 END-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: "Index",
  components: {
    swiper,
    swiperSlide
  },
  data() {
    return {
      linkList: [
        {
          title: ["코리아텍", "바로가기"],
          link: "https://www.koreatech.ac.kr/kor.do",
          image: "https://static.koreatech.in/assets/img/banner_koreatech.png"
        },
        {
          title: ["아우누리", "바로가기"],
          link: "https://portal.koreatech.ac.kr/login.jsp?sso=ok",
          image: "https://static.koreatech.in/assets/img/banner_awoonori.png"
        },
        {
          title: ["새로운 서비스", "요청하기"],
          link:
            "https://docs.google.com/forms/d/1VEuxVK9ioVRZN36eb6m0UClyTJwW4lYiKLWcaQw2JzQ/edit",
          image: "https://static.koreatech.in/assets/img/banner_add.png"
        },
        {
          title: ["BCSDLab", "알아보기"],
          link: "http://bcsdlab.com/",
          image: "https://static.koreatech.in/assets/img/banner_bcsd.png"
        }
      ],
      userId: "",
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 30,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      },
      mobileFlag: false
    };
  },
  methods: {},
  computed: {
    ...mapGetters({
      indexFreeBoard: "indexFreeBoard",
      indexAnonymousBoard: "indexAnonymousBoard",
      indexJobBoard: "indexJobBoard",
      indexNoticeBoard: "indexNoticeBoard",
      indexMarket: "indexMarket"
    })
  },
  created() {
    if (window.innerWidth < 576) this.mobileFlag = true;
    else this.mobileFlag = false;
    this.$session.set("storeCheckBoxs", [false, false, false]);
    this.$session.set("storeTag", undefined);
    this.$session.set("storeNewFlag", true);
    this.$store.dispatch("setIndexBoard");
    this.$store.dispatch("setIndexMarket");
    //this.userId = this.$session.get("userInfo").id === undefined ? "" : this.$session.get("userInfo").portal_account + "님, ";
    window.scrollTo(0, 0);
    this.$store.dispatch("setNowFooterCategory", {
      footerCategoryIndex: 0
    });
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        if (window.innerWidth < 576) this.mobileFlag = true;
        else this.mobileFlag = false;
      })
    })
    this.$store.dispatch("setNowRoutingPath", {
      path: "index"
    });
    this.$store.dispatch("toggleSearchBarAction", false);
  },
  destroyed() {
    this.$store.dispatch("setNowRoutingPath", {
      path: ""
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  box-sizing: border-box;
}
.index__container {
  width: 1132px;
  margin: 0 auto;
  padding: 40px 0 50px 0;
}
.index__row {
  margin-top: 40px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}
.mobile__bus__section {
  display: none;
}
.top-board {
  margin-top: 0;
}
.card__list {
  display: flex;
  justify-content: space-between;
}
.mobile__swiper {
  display: none;
}
.board-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 576px) {
  .index__container {
    padding: 16px 16px 55px 16px;
    width: 100%;
  }
  .index__row {
    width: 100%;
    margin-top: 0;
  }
  .mobile__bus__section {
    display: block;
  }
  .card__list {
    display: none;
    flex-direction: column;
    width: 100%;
    margin-top: 35px;
  }
  .mobile__swiper {
    display: block;
    margin-top: 45px;
  }
  .swiper-container {
    padding-bottom: 41px!important;
  }
  .swiper-slide {
    width: 85%;
  }
  .swiper-pagination {
    margin-top: 10px;
  }
  .board-list {
    display: none;
  }

  .market {
    margin-top: 20px;
  }
}
</style>
