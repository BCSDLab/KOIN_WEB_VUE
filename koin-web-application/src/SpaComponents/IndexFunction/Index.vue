<template>
  <!--component total container-->
  <div class="index__container">

    <!--index event diversion-->
    <div class="index__event">

      <!--index event carousel container-->
      <div class="index__event__carousel-container">

        <!--index event carousel content start-->
        <div class="index__event__carousel my-index__event__carousel">

          <!--index event carousel content input form // 보이지않음 -->
          <input
            v-for="event in events"
            :key="event.id"
            class="index__event__carousel__activator"
            type="radio"
            name="index__event__carousel"
            :id="event.name"
            :checked="event.check"/>

          <!--index event carousel content total container -->
          <div
            v-for="event in events"
            :key="event.id"
            class="index__event__carousel__controls">

            <!--index event carousel content left arrow -->
            <label
              class="index__event__carousel__control index__event__carousel__control--backward"
              :for="event.controls[0]"></label>

            <!--index event carousel content right arrow -->
            <label
              class="index__event__carousel__control index__event__carousel__control--forward"
              :for="event.controls[1]"></label>
          </div>

          <!--index event carousel content description -->
          <li
            v-for="event in events"
            :key="event.id"
            :style="event.bgStyle"
            class="index__event__carousel__slide">

            <!--index event carousel content title  -->
            <h1 class="index__event__carousel__title">
              {{ event.title }}
            </h1>

            <!--index event carousel content desc  -->
            <h2
              class=".index__event__carousel__desc"
              :style="event.descStyle">
              {{ event.desc }}
            </h2>
          </li>

          <!--index event carousel content pager // 밑에 동그라미  -->
          <div class="index__event__carousel__indicators">
            <label
              v-for="event in events"
              :key="event.id"
              class="index__event__carousel__indicator"
              :for="event.name"></label>
          </div>
        </div>
      </div>
    </div>
    <!--index event end -->

    <!--index board start-->
    <div class="index__row">

      <!--공지사항 board -->
      <div class="index__board">
        <v-index-board
          :category="4"
          :boards="indexNoticeBoard"></v-index-board>
      </div>

      <!--자유게시판 board-->
      <div class="index__board">
        <v-index-board
          :category="1"
          :boards="indexFreeBoard"></v-index-board>
      </div>

      <!--취업게시판 board-->
      <div class="index__board">
        <v-index-board
          :category="2"
          :boards="indexJobBoard"></v-index-board>
      </div>

      <!--일정 및 달력-->
      <div class="index__schedule">
        <calendar></calendar>
      </div>
    </div>
    <!--index board END-->


    <!--index 중고장터 start-->
    <div class="index__row-market">

      <!--index market -->
      <div class="index__market">
        <v-index-market
          :markets="indexMarket">
        </v-index-market>
      </div>
    </div>
    <!--index 중고장터 END-->

    <!--index link list start-->
    <div class="index__row">

      <!--index link list container-->
      <div class="index__link__container">

        <!--index link list -->
        <a
          class="index__link"
          v-for="(link, index) of linkList"
          :class="{odd: index%2 !== 0}"
          :key="link.id"
          :href="link.link"
          target="_blank">

          <!--index link list img-->
          <img :src="link.image">
        </a>
      </div>
    </div>
    <!--index link list End-->
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import * as ACADEMIC_CALENDAR from '../../static/AcademicCalendar';
  import Calendar from './Components/Calendar/Calendar'

  export default {
    name: 'Index',
    components: {
      'calendar': Calendar
    },
    data() {
      return {
        displayedSchedule: [],
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
            link: "https://docs.google.com/forms/d/1VEuxVK9ioVRZN36eb6m0UClyTJwW4lYiKLWcaQw2JzQ/edit",
            image: "https://static.koreatech.in/assets/img/banner_add.png"
          },
          {
            title: ["BCSDLab", "알아보기"],
            link: "http://bcsdlab.com/",
            image: "https://static.koreatech.in/assets/img/banner_bcsd.png"
          },
        ],
        events: [
          {
            name: "A",
            title: "한기대 학생들이 만들어가는 커뮤니티",
            desc: "코인 홈페이지 디자인 개편",
            controls: ["C", "B"],
            check: "checked",
            bgStyle: {
              background: "#f7941e",
            },
            descStyle: {
              color: '#ffe19a'
            }
          },
          {
            name: "B",
            title: "더 이상 페이스북을 통해 힘들게 거래하지 마세요",
            desc: "중고장터 서비스 오픈",
            controls: ["A", "C"],
            check: "",
            bgStyle: {
              background: "#7c9fae",
            },
            descStyle: {
              color: '#bfebff'
            }
          },
          {
            name: "C",
            title: "평소에 불편했던 것들을 기술로 풀어드리겠습니다",
            desc: "새로운 서비스를 요청해주세요",
            controls: ["B", "A"],
            check: "",
            bgStyle: {
              background: "#4db297",
            },
            descStyle: {
              color: '#70ffd8'
            }
          }
        ],
        userId: "",
        AcademicCalendar: ACADEMIC_CALENDAR.default,
        slideIndex: 0
      }
    },
    methods: {
      autoSlide() {
        let s = document.getElementsByClassName("index__event__carousel__activator");
        if (s.length !== 0) {
          if (s[0].checked === true) {
            s[0].checked = false;
            s[1].checked = true;
          } else if (s[1].checked === true) {
            s[1].checked = false;
            s[2].checked = true;
          } else if (s[2].checked === true) {
            s[2].checked = false;
            s[0].checked = true;
          }
          setTimeout(this.autoSlide, 10000);
        }
      }
    },
    computed: {
      ...mapGetters({
        indexFreeBoard: 'indexFreeBoard',
        indexAnonymousBoard: 'indexAnonymousBoard',
        indexJobBoard: 'indexJobBoard',
        indexNoticeBoard: 'indexNoticeBoard',
        indexMarket: 'indexMarket'
      }),
      academicCalendar: function () {
        let today = new Date();
        let ddays = [];
        for (let i = 0; i < this.AcademicCalendar.length; i++) {
          ddays.push({
              "title": this.AcademicCalendar[i].title,
              "date": this.AcademicCalendar[i].date,
              "dday": Math.ceil((new Date(this.AcademicCalendar[i].date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            }
          )
        }
        return ddays;
      }
    },
    created() {
      console.log(this.$router);
      this.$session.set("storeCheckBoxs", [false, false, false]);
      this.$session.set("storeTag", undefined)
      this.$session.set("storeNewFlag", true)
      this.$store.dispatch("setIndexBoard");
      this.$store.dispatch('setIndexmarket');
      //this.userId = this.$session.get("userInfo").id === undefined ? "" : this.$session.get("userInfo").portal_account + "님, ";
      window.scrollTo(0, 0);
      this.$store.dispatch("setNowFooterCategory", {
        footerCategoryIndex: 0
      });
    },
    mounted() {
      this.autoSlide();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .index__row {
    margin-top: 40px;
    width: 1132px;
    margin-left: auto;
    margin-right: auto;
  }

  .index__row-market {
    width: 1132px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 24px;
  }

  .index__event {
    height: 226px;
    min-width: 1132px;
    text-align: center;
    vertical-align: middle;
  }

  .index__event__carousel__title {
    margin-left: 2px;
    font-size: 48px;
    font-weight: 400;
    color: #fafafa;
    position: absolute;
    top: 50%;
    width: 100%;
    text-align: center;
    margin-top: -23px;
    font-family: "NanumSquare", serif;
  }

  .index__event__carousel__desc {
    margin-left: 4px;
    font-size: 20px;
    color: #ffe19a;
    opacity: 0.8;
    position: absolute;
    top: 28%;
    width: 100%;
    text-align: center;
    margin-top: -9px;
    font-family: "NanumSquare", serif;
    font-weight: 700;
  }

  .index__event .highlight {
    font-weight: 900;
  }

  .index__schedule {
    width: 256px;
    float: left;
  }

  .index__board {
    width: 270px;
    float: left;
    margin-right: 22px;
  }

  .index__market {
    width: 876px;
    height: 303px;
    margin-top: 37px;
    float: left;
  }

  .index__link__container {
    width: 876px;
    height: 70px;
    margin-top: 36px;
    margin-bottom: 38px;
    float: left;
  }

  .index__link {
    float: left;
    margin-right: 21px;
  }

  .index__link img {
    width: 198px;
  }

  /* event */
  .index__event__carousel {
    height: 226px;
    width: 1132px;
    overflow: hidden;
    text-align: center;
    position: relative;
    padding: 0;
    list-style: none;
    margin-left: 0;
    /**
      * Where the magic happens
      */
    /**
        * Control element - right/left arrows
      */
    /**
        * Element for holding slide indicators
      */
    /**
        * Indicator for indicating active slide
      */
    /**
        * Create rules for when slides are contained within a track
      */
  }

  .index__event__carousel__controls,
  .index__event__carousel__activator {
    display: none;
  }

  .index__event__carousel__activator:nth-of-type(1):checked ~ .index__event__carousel__track {
    -webkit-transform: translateX(0%);
    transform: translateX(0%);
  }

  .index__event__carousel__activator:nth-of-type(1):checked ~ .index__event__carousel__slide:nth-of-type(1) {
    transition: opacity 0.5s, -webkit-transform 0.5s;
    transition: opacity 0.5s, transform 0.5s;
    transition: opacity 0.5s, transform 0.5s, -webkit-transform 0.5s;
    top: 0;
    left: 0;
    right: 0;
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  .index__event__carousel__activator:nth-of-type(1):checked ~ .index__event__carousel__controls:nth-of-type(1) {
    display: block;
    opacity: 1;
  }

  .index__event__carousel__activator:nth-of-type(1):checked ~ .index__event__carousel__indicators .index__event__carousel__indicator:nth-of-type(1) {
    opacity: 1;
  }

  .index__event__carousel__activator:nth-of-type(2):checked ~ .index__event__carousel__track {
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
  }

  .index__event__carousel__activator:nth-of-type(2):checked ~ .index__event__carousel__slide:nth-of-type(2) {
    transition: opacity 0.5s, -webkit-transform 0.5s;
    transition: opacity 0.5s, transform 0.5s;
    transition: opacity 0.5s, transform 0.5s, -webkit-transform 0.5s;
    top: 0;
    left: 0;
    right: 0;
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  .index__event__carousel__activator:nth-of-type(2):checked ~ .index__event__carousel__controls:nth-of-type(2) {
    display: block;
    opacity: 1;
  }

  .index__event__carousel__activator:nth-of-type(2):checked ~ .index__event__carousel__indicators .index__event__carousel__indicator:nth-of-type(2) {
    opacity: 1;
  }

  .index__event__carousel__activator:nth-of-type(3):checked ~ .index__event__carousel__track {
    -webkit-transform: translateX(-200%);
    transform: translateX(-200%);
  }

  .index__event__carousel__activator:nth-of-type(3):checked ~ .index__event__carousel__slide:nth-of-type(3) {
    transition: opacity 0.5s, -webkit-transform 0.5s;
    transition: opacity 0.5s, transform 0.5s;
    transition: opacity 0.5s, transform 0.5s, -webkit-transform 0.5s;
    top: 0;
    left: 0;
    right: 0;
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  .index__event__carousel__activator:nth-of-type(3):checked ~ .index__event__carousel__controls:nth-of-type(3) {
    display: block;
    opacity: 1;
  }

  .index__event__carousel__activator:nth-of-type(3):checked ~ .index__event__carousel__indicators .index__event__carousel__indicator:nth-of-type(3) {
    opacity: 1;
  }

  .index__event__carousel__activator:nth-of-type(4):checked ~ .index__event__carousel__track {
    -webkit-transform: translateX(-300%);
    transform: translateX(-300%);
  }

  .index__event__carousel__activator:nth-of-type(4):checked ~ .index__event__carousel__slide:nth-of-type(4) {
    transition: opacity 0.5s, -webkit-transform 0.5s;
    transition: opacity 0.5s, transform 0.5s;
    transition: opacity 0.5s, transform 0.5s, -webkit-transform 0.5s;
    top: 0;
    left: 0;
    right: 0;
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  .index__event__carousel__activator:nth-of-type(4):checked ~ .index__event__carousel__controls:nth-of-type(4) {
    display: block;
    opacity: 1;
  }

  .index__event__carousel__activator:nth-of-type(4):checked ~ .index__event__carousel__indicators .index__event__carousel__indicator:nth-of-type(4) {
    opacity: 1;
  }

  .index__event__carousel__activator:nth-of-type(5):checked ~ .index__event__carousel__track {
    -webkit-transform: translateX(-400%);
    transform: translateX(-400%);
  }

  .index__event__carousel__activator:nth-of-type(5):checked ~ .index__event__carousel__slide:nth-of-type(5) {
    transition: opacity 0.5s, -webkit-transform 0.5s;
    transition: opacity 0.5s, transform 0.5s;
    transition: opacity 0.5s, transform 0.5s, -webkit-transform 0.5s;
    top: 0;
    left: 0;
    right: 0;
    opacity: 1;
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  .index__event__carousel__activator:nth-of-type(5):checked ~ .index__event__carousel__controls:nth-of-type(5) {
    display: block;
    opacity: 1;
  }

  .index__event__carousel__activator:nth-of-type(5):checked ~ .index__event__carousel__indicators .index__event__carousel__indicator:nth-of-type(5) {
    opacity: 1;
  }

  .index__event__carousel__control {
    height: 31px;
    width: 31px;
    margin-top: -11px;
    top: 48.5%;
    position: absolute;
    display: block;
    cursor: pointer;
    border-width: 2px 2px 0 0;
    border-style: solid;
    border-color: white;
    outline: 0;
    z-index: 3;
  }

  .index__event__carousel__control:hover {
    opacity: 1;
  }

  /* 화살표 */
  .index__event__carousel__control--backward {
    left: 16.7%;
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg);
  }

  .index__event__carousel__control--forward {
    right: 16.7%;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  .index__event__carousel__indicators {
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
  }

  /* 밑에 동그라미 */
  .index__event__carousel__indicator {
    height: 6px;
    width: 6px;
    border-radius: 100%;
    display: inline-block;
    z-index: 2;
    cursor: pointer;
    opacity: 0.35;
    margin: 10px 3px -1px 4px;
    cursor: pointer;
  }

  .index__event__carousel__indicator:hover {
    opacity: 0.75;
  }

  .index__event__carousel__track {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 0;
    transition: -webkit-transform 0.5s ease 0s;
    transition: transform 0.5s ease 0s;
    transition: transform 0.5s ease 0s, -webkit-transform 0.5s ease 0s;
  }

  .index__event__carousel__track .index__event__carousel__slide {
    display: block;
    top: 0;
    left: 0;
    right: 0;
    opacity: 1;
  }

  .index__event__carousel__track .index__event__carousel__slide:nth-of-type(1) {
    -webkit-transform: translateX(0%);
    transform: translateX(0%);
  }

  .index__event__carousel__track .index__event__carousel__slide:nth-of-type(2) {
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
  }

  .index__event__carousel__track .index__event__carousel__slide:nth-of-type(3) {
    -webkit-transform: translateX(200%);
    transform: translateX(200%);
  }

  .index__event__carousel__track .index__event__carousel__slide:nth-of-type(4) {
    -webkit-transform: translateX(300%);
    transform: translateX(300%);
  }

  .index__event__carousel__track .index__event__carousel__slide:nth-of-type(5) {
    -webkit-transform: translateX(400%);
    transform: translateX(400%);
  }

  .index__event__carousel--scale .index__event__carousel__slide {
    -webkit-transform: scale(0);
    transform: scale(0);
  }

  .index__event__carousel__slide {
    height: 100%;
    position: absolute;
    overflow-y: auto;
    opacity: 0;
  }

  /**
    * Theming
  */
  * {
    box-sizing: border-box;
  }

  .index__event__carousel-container {
    display: inline-block;
    width: 100%;
  }

  .my-index__event__carousel {
    width: 100%;
  }

  .index__event__carousel__slide {
    overflow: hidden;
  }

  .index__event__carousel--thumb .index__event__carousel__indicator {
    height: 30px;
    width: 30px;
  }

  .index__event__carousel__indicator {
    background-color: #fafafa;
  }

  .index__event__carousel__slide:nth-of-type(1),
  .index__event__carousel--thumb .index__event__carousel__indicators .index__event__carousel__indicator:nth-of-type(1) {
    background-size: cover;
    background-position: center;
  }

  .index__event__carousel__slide:nth-of-type(2),
  .index__event__carousel--thumb .index__event__carousel__indicators .index__event__carousel__indicator:nth-of-type(2) {
    background-size: cover;
    background-position: center;
  }

  .index__event__carousel__slide:nth-of-type(3),
  .index__event__carousel--thumb .index__event__carousel__indicators .index__event__carousel__indicator:nth-of-type(3) {
    background-size: cover;
    background-position: center;
  }

  .index__event__carousel__slide:nth-of-type(4),
  .index__event__carousel--thumb .index__event__carousel__indicators .index__event__carousel__indicator:nth-of-type(4) {
    background-size: cover;
    background-position: center;
  }

  .index__event__carousel__slide:nth-of-type(5),
  .index__event__carousel--thumb .index__event__carousel__indicators .index__event__carousel__indicator:nth-of-type(5) {
    background-size: cover;
    background-position: center;
  }

  @media (min-width: 1500px) and (max-width: 1700px) {
    .index__event__carousel__control--backward {
      left: 10%;
    }

    .index__event__carousel__control--forward {
      right: 10%;
    }
  }

  @media (min-width: 1200px) and (max-width: 1400px) {
    .index__event__carousel__control--backward {
      left: 5%;
    }

    .index__event__carousel__control--forward {
      right: 5%;
    }
  }

  @media (max-width: 1200px) {
    .index__event__carousel__control--backward {
      left: 1%;
    }

    .index__event__carousel__control--forward {
      right: 1%;
    }
  }

  @media (max-width: 576px) {
    .index__container, .index__event, .index__row,
    .index__event__carousel, .index__event__carousel-container, .index__event__carousel,
    .my-index__event__carousel, .index__event__carousel__slide, .index__event__carousel__slide, .index__event__carousel__title, .index__event__carousel__desc, .index__event__carousel__indicators
    .index__event__carousel__control,
    .index__link__container,
    .index__market, .index__row-market
    {
      width: 100%;
      min-width: 300px;
    }
    .index__event {
      height: 113px;
    }
    .index__event__carousel__title {
      font-size: 16px;
    }
    .index__event__carousel h2 {
      font-size: 10px;
      margin-top: 10px;
    }
    .index__event__carousel, .my-index__event__carousel {
      height: 113px;
      line-height: 53px;
    }
    .index__event__carousel__indicators {
      height: 24px;
    }

    .index__event__carousel__indicator {
      height: 3px;
      width: 3px;
    }

    .index__schedule {
      display: none;
    }

    .index__event__carousel__control {
      width: 10px;
      height: 10px;
      top: 57.5%;
    }

    .index__event__carousel__control--backward {
     left: 10px;
    }

    .index__event__carousel__control--forward {
      right: 10px;
    }

    .index__board {
      width: 100%;
      margin-bottom: 36px;
    }
    .index__row, .index__market {
      padding-left: 16px;
      padding-right: 16px;
    }

    .index__market {
     height: 100%;
      margin-top: 7px;
    }

    .index__link {
      width: calc(50% - 10px);
      margin-right: 20px;
      flat: left;
    }
    .index__link img {
      width: 100%;
    }
    .odd {
      margin-right: 0px;
    }

    .index__link__container {
      height: 100%;
      margin-bottom: 70px;
    }
  }
</style>
