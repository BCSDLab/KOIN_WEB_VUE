<template>
  <div class="index__bus__container">
    <div
      class="bus__title"
      @click="clickTitle()">
      실시간 버스
    </div>
    <!-- 카드 -->
    <div
      class="bus__card"
      :class="{bus__background: true,
              shuttle__background: (busType%3===0),
              daesung__background: (busType%3===1),
              cityBus__background: (busType%3===2)}">
      <!-- 출발지 & 목적지 , shift 버튼 행 -->
      <div class="destination__shift__row">
        <div class="departure__boarder">
          <div class="departure__boarder__inner__text">
            출발
          </div>
        </div>
        <div class="destination__departure">
          {{ depart }}
        </div>
        <img
          :src="setBusReverseIcon"
          class="destination__shift__icon"
          @click="shiftDestination()">
        <div class="departure__boarder">
          <div class="departure__boarder__inner__text">
            도착
          </div>
        </div>
        <div class="destination__departure">
          {{ arrival }}
        </div>
      </div>
      <!-- shift 행 외의 내용물 -->
      <transition
        name="fade"
        mode="out-in">
        <!-- 버스 카드 -->
        <div
          class="info">
          <div
            class="type"
            @click="clickTitle">
            <img src="https://static.koreatech.in/assets/img/bus_icon.png">
            <span v-if="busType%3===0">셔틀버스</span>
            <span v-else-if="busType%3===1">대성고속</span>
            <span v-else>시내버스</span>
          </div>
          <div class="time">
            <img
              :src="setBusPreviousIcon"
              alt="previous"
              class="carousel__control__arrow controller__left"
              @click="changeBusType(-1)">
            <div
              v-if="busType%3===0 || busType%3===1"
              @click="clickTitle">
              <span
                v-if="fastestBusTime!==0 && fastestBusTime!=='미운행' && fastestBusTime!==-1 && !loadingFlag">
                <span v-if="hour(fastestBusTime)!==0">{{ hour(fastestBusTime) }}시간</span>
                {{ minute(fastestBusTime) }}분
                {{ second(fastestBusTime) }}초 남음
              </span>
              <span v-if="fastestBusTime===0">
                운행정보없음
              </span>
              <span v-if="fastestBusTime==='미운행' && !loadingFlag">
                미운행
              </span>
            </div>
            <div
              v-else
              @click="clickTitle">
              <span v-if="cityBusData.remain_time !== null && cityBusData.remain_time !== undefined">
                약 {{ Math.ceil(cityBusData.remain_time/60)%60 }}분 남음
              </span>

              <span v-if="cityBusData.remain_time === undefined">
                운행정보없음
              </span>
            </div>
            <img
              :src="setBusNextIcon"
              alt="next"
              class="carousel__control__arrow controller__right"
              @click="changeBusType(1)">
          </div>
          <div
            class="detail"
            v-if="busType%3===0 || busType%3===1"
            @click="clickTitle">
            <span v-if="fastestBusTime!==0 && fastestBusTime!=='미운행' && fastestBusTime!==-1 && !loadingFlag">
              ({{ timeLength(busTime[0].hour) }}:{{ timeLength(busTime[0].minute) }}분 출발)
            </span>
          </div>
          <div
            class="detail"
            v-else
            @click="clickTitle">
            <span v-if="cityBusData.remain_time !== null && cityBusData.remain_time !== undefined">
              ({{ getCityBusDepartTime( Math.ceil(cityBusData.remain_time/60)%60 ) }}분 출발)
            </span>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import * as TIMETABLE from '../../../static/busTimeTable';
  import {mapGetters} from 'vuex'

  export default {
    name: "IndexBus",
    data: function () {
      return {
        timetable: TIMETABLE.default,
        depart: "한기대",
        arrival: "야우리",
        loadingFlag: false,
        timer: null,
        today: new Date(),
        createdFlag: true,
        busType: 300,
      }
    },
    computed: {
      ...mapGetters({
        fastestDaesungTime: 'fastestDaesungTime',
        nextFastestDaesungTime: 'nextFastestDaesungTime',
        fastestShuttleTime: 'fastestShuttleTime',
        nextFastestShuttleTime: 'nextFastestShuttleTime',
        daesungTime: 'daesungTime',
        shuttleTime: 'shuttleTime',
        cityBusData: 'cityBusData'
      }),
      busTime() {
        if (this.busType % 3 === 0) {
          return this.shuttleTime;
        } else {
          return this.daesungTime;
        }
      },
      fastestBusTime() {
        if (this.busType % 3 === 0) {
          return this.fastestShuttleTime;
        } else {
          return this.fastestDaesungTime;
        }
      },
      setBusReverseIcon() {
        if (this.busType % 3 === 0) {
          return 'https://static.koreatech.in/assets/img/shuttle_reverse.png';
        } else if(this.busType % 3 === 1) {
          return 'https://static.koreatech.in/assets/img/daesung_reverse.png';
        } else {
          return 'https://static.koreatech.in/assets/img/city_reverse.png';
        }
      },
      setBusPreviousIcon() {
        if (this.busType % 3 === 0) {
          return 'https://static.koreatech.in/assets/img/shuttle_left.png';
        } else if(this.busType % 3 === 1) {
          return 'https://static.koreatech.in/assets/img/daesung_left.png';
        } else {
          return 'https://static.koreatech.in/assets/img/city_left.png';
        }
      },
      setBusNextIcon() {
        if (this.busType % 3 === 0) {
          return 'https://static.koreatech.in/assets/img/shuttle_right.png';
        } else if(this.busType % 3 === 1) {
          return 'https://static.koreatech.in/assets/img/daesung_right.png';
        } else {
          return 'https://static.koreatech.in/assets/img/city_right.png';
        }
      }
    },
    methods: {
      clickTitle: function(){
        // 모바일 진입 시 Home 버튼 비활성화.
        this.$store.dispatch("setNowFooterCategory", {
          footerCategoryIndex: -1
        });
        this.$router.push('/bus')
      },
      shiftDestination: function () {
        if (this.arrival === "한기대") {
          this.arrival = "야우리";
          this.depart = "한기대";
        } else {
          this.arrival = "한기대";
          this.depart = "야우리";
        }
        this.clickLookup(this.depart, this.arrival);
      },
      changeBusType: function (direction) {
        this.busType = this.busType + direction;
      },
      timeLength: function (val) {
        return val < 10 ? '0' + val : val;
      },
      hour: function (val) {
        return Math.floor(val / 1000 / 60 / 60) % 24;
      },
      minute: function (val) {
        return Math.floor(val / 1000 / 60) % 60;
      },
      second: function (val) {
        return Math.floor(val / 1000) % 60;
      },
      clickLookup(depart, arrival) {
        if (depart === arrival) {
          //alert("출발지와 도착지는 달라야합니다.")
        } else {
          this.$Progress.start();
          this.loadingFlag = true;

          var self = this;
          this.displayDepart = depart;
          this.displayArrival = arrival;
          let globalDepart = depart;
          let globalArrival = arrival;
          this.$store.dispatch("setBusTime", {
            depart: globalDepart,
            arrival: globalArrival
          }).then((data) => {
                this.loadingFlag = false;
                this.$Progress.finish();
              }
          );
          this.createdFlag = false;
          window.clearInterval(this.timer)
          this.timer = window.setInterval(function () {
            self.loadingFlag = false;
            self.$store.dispatch("setBusTime", {
              depart: globalDepart,
              arrival: globalArrival
            })
          }, 1000);
          this.callCityBusData(this.changeEnglish(depart), this.changeEnglish(arrival));
        }
      },
      callCityBusData: function (depart, arrival) {
        this.$store.dispatch('setCityBusData', {
          'depart': depart,
          'arrival': arrival
        })
      },
      changeEnglish: function (val) {
        switch (val) {
          case '한기대':
            return "koreatech";
          case '야우리':
            return "terminal";
          case '천안역':
            return "station";
        }
      },
      getCityBusDepartTime(val) {
        let today = new Date();
        let minutes = today.getMinutes() + val;
        let hours = today.getHours();
        if (minutes >= 60) {
          hours = hours + 1;
          minutes = minutes - 60;
        }
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return hours + ":" + minutes;
      },
    },

    created: function () {
      var self = this;
      console.log(self);
      self.$store.dispatch("setBusTime", {
        'depart': "한기대",
        'arrival': "야우리"
      })
      window.clearInterval(this.timer)
      this.timer = window.setInterval(function () {
        if (self.createdFlag) {
          self.$store.dispatch("setBusTime", {
            'depart': "한기대",
            'arrival': "야우리"
          })
        }
      }, 1000);
      this.callCityBusData("koreatech", "terminal");
    },
    beforeDestroy() {
      window.clearInterval(this.timer)
    }
  }
</script>

<style scoped>
  .bus__title {
    width: 100%;
    font-family: NanumSquare;
    font-weight: 800;
    font-size: 17px;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.15;
    letter-spacing: normal;
    text-align: left;
    color: #175c8e;
    cursor: pointer;
  }

  .bus__card {
    margin-top: 20px;
    width: 494px;
    height: 157px;
    box-sizing: border-box;
  }

  .bus__background {
    transition: border-color .3s;
  }

  .bus__card.shuttle__background {
    border: 1px solid #f7941e;
  }

  .bus__card.daesung__background {
    border: 1px solid #7c9fae;
  }

  .bus__card.cityBus__background {
    border: 1px solid #4db297;
  }

  .destination__shift__row {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
  }

  .shuttle__background .destination__shift__row {
    background-color: #fff4e9;
  }
  .daesung__background .destination__shift__row {
    background-color: #f2f5f7;
  }
  .cityBus__background .destination__shift__row {
    background-color: #edf7f4;
  }

  .departure__boarder {
    width: 42px;
    height: 20px;
    border-radius: 11px;
  }

  .shuttle__background .departure__boarder {
    background: #f7941e;
  }

  .cityBus__background .departure__boarder {
    background: #4db297;
  }

  .daesung__background .departure__boarder {
    background: #7c9fae;
  }

  .departure__boarder__inner__text {
    font-family: "NanumBarunGothic", serif;
    font-size: 11px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.09;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    padding: 5px;
  }

  .destination__shift__icon {
    height: 20px;
    width: 19px;
    padding-left: 40px;
    padding-right: 40px;
    cursor: pointer;
  }

  .destination__departure {
    height: 18px;
    font-family: "NanumBarunGothic", serif;
    font-size: 15px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #252525;
    padding-left: 8px;
  }

  .info {
    width: 100%;
    margin-top: 17px;
  }

  .time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: "NanumBarunGothic", serif;
    font-size: 16px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.19;
    letter-spacing: normal;
    text-align: center;
    color: #252525;
    padding: 0 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .time div {
    cursor: pointer;
    padding-top: 15px;
  }

  .detail {
    height: 18px;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    color: #252525;
    padding-top: 3px;
    text-align: center;
    cursor: pointer;
  }

  .type {
    width: 70px;
    height: 18px;
    font-family: "NanumBarunGothic", serif;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.15;
    letter-spacing: normal;
    text-align: center;
    color: #252525;
    margin: 0 auto;
    cursor: pointer;
  }

  .type img {
    position: relative;
    height: 15px;
    width: auto;
    right: 5px;
    top: 3px;
  }

  .carousel__control__arrow {
    padding-top: 15px;
    width: 10px;
    height: 20px;
    cursor: pointer;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }


  @media (max-width: 576px) {
    .bus__card {
      width: 544px;
      max-width: 100%;
      height: 154px;
    }

    .bus__title {
      font-size: 18px;
    }

    .index__bus__container {
      padding-left: 0;
    }

    .destination__shift__row {
      height: 38px; 
      padding: 0 30px;
    }

    .destination__shift__icon {
      padding: 0 11.5px;
    }

    .departure__boarder {
      width: 32px;
      height: 16px;
    }
    .departure__boarder__inner__text {
      font-size: 11px;
      padding: 3px;
    }
    .destination__departure {
      font-size: 12px;
      height: auto;
    }

    .info {
      margin-top: 15px;
      height: 91px;
    }
    .type {
      font-size: 11px;
    }
    .time {
      padding: 0 15.5px;
      font-size: 20px;
    }
    .detail {
      padding-top: 12px;
      font-size: 11px;
    }

  }

</style>
