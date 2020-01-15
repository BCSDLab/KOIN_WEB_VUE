<template>
  <div class="container-bus">
    <div class="bus-lookup">
      <div class="title">
        <div class="category">
          버스 / 교통 운행정보
        </div>
        <div class="title-first-desc">
          어디를 가시나요?
        </div>
        <div class="row">
          <div class="title-second-desc">
            운행수단별로 간단히 비교해드립니다.
          </div>
          <div class="select">
            <div class="dropdown">
              <button class="dropbtn">{{ depart }}
                <img
                  class="under-arrow"
                  src="https://static.koreatech.in/assets/img/bus_dropdown.png"></button>
              <div
                id="selectDepart"
                class="dropdown-content">
                <a
                  @click="selectDepart(departs, true )"
                  v-for="departs of departList"
                  :key="departs.id">{{ departs }}</a>
              </div>
            </div>
            <span>에서</span>
            <div class="dropdown">
              <button class="dropbtn">{{ arrival }}
                <img
                  class="under-arrow"
                  src="https://static.koreatech.in/assets/img/bus_dropdown.png"></button>
              <div class="dropdown-content">
                <a
                  @click="selectArrival(arrivals, true)"
                  v-for="arrivals of arrivalList"
                  :key="arrivals.id">{{ arrivals }}</a>
              </div>
            </div>
            <span>갑니다</span>
          </div>
        </div>


        <div class="row cards">
          <!-- 셔틀버스 -->
          <div class="card">
            <!-- 상위 출발 도착 -->
            <div class="upper-card shuttle">
              <div class="header">
                <div class="badge">출발</div>
                <div class="station">{{ displayDepart }}</div>
              </div>
              <div class="header">
                <div class="badge">도착</div>
                <div class="station">{{ displayArrival }}</div>
              </div>

              <!-- 실제 시간 -->
              <div class="info">
                <div class="time">
                  <span
                    class="loading"
                    v-if="fastestShuttleTime===-1 || loadingFlag">
                    <circle2
                      size="16px"
                      stroke="2px"
                      background="transparent"
                      color="white">
                    </circle2>
                  </span>
                  <span
                    v-if="fastestShuttleTime!==0 && fastestShuttleTime!=='미운행' && fastestShuttleTime!==-1 && !loadingFlag">
                    <span v-if="hour(fastestShuttleTime)!==0">{{ hour(fastestShuttleTime) }}시간</span>
                    {{ minute(fastestShuttleTime) }}분
                    {{ second(fastestShuttleTime) }}초 남음
                    <span
                      class="detail">({{ timeLength(shuttleTime[0].hour) }}:{{ timeLength(shuttleTime[0].minute) }}분 출발)</span>
                  </span>
                  <span v-if="fastestShuttleTime===0">
                    운행정보없음
                  </span>
                  <span v-if="fastestShuttleTime==='미운행' && !loadingFlag">
                    미운행
                  </span>
                </div>
                <div class="type"><img src="https://static.koreatech.in/assets/img/bus_icon-white.png">학교셔틀
                </div>
              </div>
            </div>

            <!-- 아래 카드 -->
            <div class="lower-card shuttle">
              <div class="shuttle small-card">
                <div class="next-bus-container">
                  <div class="next-bus">
                    다음버스
                  </div>
                </div>
                <div class="time">
                  <span
                    class="loading"
                    v-if="nextFastestShuttleTime===-1 || loadingFlag">
                    <circle2
                      size="16px"
                      stroke="2px"
                      background="transparent"
                      color="white">
                    </circle2>
                  </span>
                  <span
                    v-if="nextFastestShuttleTime!==0 && nextFastestShuttleTime!=='미운행' && nextFastestShuttleTime!==-1 && !loadingFlag">
                    <span v-if="hour(nextFastestShuttleTime)!==0">{{ hour(nextFastestShuttleTime) }}시간</span>
                    {{ minute(nextFastestShuttleTime) }}분
                    {{ second(nextFastestShuttleTime) }}초 남음
                    <span
                      class="detail">({{ timeLength(shuttleTime[1].hour) }}:{{ timeLength(shuttleTime[1].minute) }}분 출발)</span>
                  </span>
                  <span v-if="nextFastestShuttleTime===0">
                    운행정보없음
                  </span>
                  <span v-if="nextFastestShuttleTime==='미운행' && !loadingFlag">
                    미운행
                  </span>
                </div>
                <div class="type"><img src="https://static.koreatech.in/assets/img/bus_icon-white.png">학교셔틀
                </div>
              </div>
            </div>
          </div>

          <!-- 중간 카드 -->
          <div class="second-card">
            <div class="upper-card daesung">
              <div class="header">
                <div class="badge">출발</div>
                <div class="station">{{ displayDepart }}</div>
                <div
                  v-if="displayDepart === '한기대'"
                  class="bus-name">
                  안동출발버스
                </div>
                <div
                  v-if="displayDepart === '야우리'"
                  class="bus-name">
                  야우리출발버스
                </div>
              </div>
              <div class="header">
                <div class="badge">도착</div>
                <div class="station">{{ displayArrival }}</div>
              </div>
              <div class="info">
                <div class="time">
                  <span
                    class="loading"
                    v-if="fastestDaesungTime===-1 || loadingFlag">
                    <circle2
                      size="16px"
                      stroke="2px"
                      background="transparent"
                      color="white">
                    </circle2>
                  </span>
                  <span
                    v-if="fastestDaesungTime!==0 && fastestDaesungTime!=='미운행' && fastestDaesungTime!==-1 && !loadingFlag">
                    <span v-if="hour(fastestDaesungTime)!==0">{{ hour(fastestDaesungTime) }}시간</span>
                    {{ minute(fastestDaesungTime) }}분
                    {{ second(fastestDaesungTime) }}초남음
                    <span
                      class="detail">({{ timeLength(daesungTime[0].hour) }}:{{ timeLength(daesungTime[0].minute) }}분 출발)</span>
                  </span>
                  <span v-if="fastestDaesungTime===0">
                    운행정보없음
                  </span>
                  <span v-if="fastestDaesungTime==='미운행' && !loadingFlag">
                    미운행
                  </span>
                </div>
                <div class="type"><img src="https://static.koreatech.in/assets/img/bus_icon-white.png">대성고속
                </div>
              </div>
            </div>

            <!-- 스몰카드 -->
            <div class="lower-card daesung">
              <div class="daesung small-card">
                <div class="next-bus-container">
                  <div class="next-bus">
                    다음버스
                  </div>
                </div>
                <div class="time">
                  <span
                    class="loading"
                    v-if="nextFastestDaesungTime===-1 || loadingFlag">
                    <circle2
                      size="16px"
                      stroke="2px"
                      background="transparent"
                      color="white">
                    </circle2>
                  </span>
                  <span
                    v-if="nextFastestDaesungTime!==0 && nextFastestDaesungTime!=='미운행' && nextFastestDaesungTime!==-1 && !loadingFlag">
                    <span v-if="hour(nextFastestDaesungTime)!==0">{{ hour(nextFastestDaesungTime) }}시간</span>
                    {{ minute(nextFastestDaesungTime) }}분
                    {{ second(nextFastestDaesungTime) }}초 남음
                    <span
                      class="detail">({{ timeLength(daesungTime[1].hour) }}:{{ timeLength(daesungTime[1].minute) }}분 출발)</span>
                  </span>
                  <span v-if="nextFastestDaesungTime===0">
                    운행정보없음
                  </span>
                  <span v-if="nextFastestDaesungTime==='미운행' && !loadingFlag">
                    미운행
                  </span>
                </div>
                <div class="type"><img src="https://static.koreatech.in/assets/img/bus_icon-white.png">대성고속
                </div>
              </div>
            </div>
          </div>


          <!-- 세번째 카드 -->
          <div class="card">
            <div class="upper-card city">
              <div class="header">
                <div class="badge">출발</div>
                <div class="station">{{ displayDepart }}</div>
                <div
                  v-if="cityBusData.bus_number !== undefined"
                  class="bus-name">
                  {{ cityBusData.bus_number }}번 버스
                </div>
              </div>
              <div class="header">
                <div class="badge">도착</div>
                <div class="station">{{ displayArrival }}</div>
              </div>
              <div class="info">
                <div
                  v-if="cityBusData.remain_time !== null && cityBusData.remain_time !== undefined"
                  class="time">약 {{ Math.ceil(cityBusData.remain_time/60)%60 }}분 남음
                  <span
                    class="detail">({{ getCityBusDepartTime( Math.ceil(cityBusData.remain_time/60)%60 ) }}분 출발)</span>
                </div>
                <div
                  v-if="cityBusData.remain_time === undefined"
                  class="time">운행정보없음
                </div>
                <div class="type"><img src="https://static.koreatech.in/assets/img/bus_icon-white.png">시내버스
                </div>
              </div>
            </div>

            <!-- 작은 카드 -->
            <div class="lower-card city">
              <div class="city small-card">
                <div class="next-bus-container">
                  <div class="next-bus">
                    다음버스
                  </div>
                  <div
                    v-if="cityBusData.bus_number !== undefined"
                    class="next-bus-name">
                    {{ cityBusData.bus_number }}번 버스
                  </div>
                </div>
                <div
                  v-if="cityBusData.next_remain_time !== undefined && cityBusData.next_remain_time !== null"
                  class="time">약 {{ Math.ceil(cityBusData.next_remain_time/60)%60 }}분 남음
                  <span
                    class="detail">({{ getCityBusDepartTime( Math.ceil(cityBusData.next_remain_time/60)%60 ) }}분 출발)</span>
                </div>
                <div
                  v-if="cityBusData.next_remain_time === undefined || cityBusData.next_remain_time === null"
                  class="time">운행정보없음
                </div>
                <div class="type"><img src="https://static.koreatech.in/assets/img/bus_icon-white.png">시내버스
                </div>
              </div>
            </div>
          </div>
          <!-- 세번째 카드 끝 -->

        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import * as TIMETABLE from '../../../static/busTimeTable';
  import {mapGetters} from 'vuex';
  import {Circle2} from 'vue-loading-spinner'

  export default {
    name: 'BusLookUp',
    components: {Circle2},
    data() {
      return {
        timetable: TIMETABLE.default,
        today: new Date(),
        departList: ["야우리", "천안역"],
        arrivalList: ["한기대", "천안역"],
        depart: "한기대",
        arrival: "야우리",
        displayDepart: "한기대",
        displayArrival: "야우리",
        createdFlag: true,
        flag: true,
        firstSelectFlag: true,
        timer: null,
        loadingFlag: false
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
      })
    },
    methods: {
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
      callCityBusData: function (depart, arrival) {
        this.$store.dispatch('setCityBusData', {
          'depart': depart,
          'arrival': arrival
        })
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
      selectDepart: function (val, flag) {
        if (val === this.arrival && flag) {
          this.selectArrival(this.depart, false);
        }
        this.depart = val;
        switch (val) {
          case "한기대":
            this.departList = ["야우리", "천안역"];
            break;
          case "야우리":
            this.departList = ["한기대", "천안역"];
            break;
          case "천안역":
            this.departList = ["한기대", "야우리"];
            break;
        }
        this.clickLookup(this.depart, this.arrival);
      },
      selectArrival: function (val, flag) {
        if (val === this.depart && flag) {
          this.selectDepart(this.arrival, false);
        }
        this.arrival = val;
        switch (val) {
          case "한기대":
            this.arrivalList = ["야우리", "천안역"];
            break;
          case "야우리":
            this.arrivalList = ["한기대", "천안역"];
            break;
          case "천안역":
            this.arrivalList = ["한기대", "야우리"];
            break;
        }

        this.clickLookup(this.depart, this.arrival);
      },
      clickLookup(depart, arrival) {
        if (depart === arrival) {
          //alert("출발지와 도착지는 달라야합니다.")
        }
        else {
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
      changeEnglish: function (val) {
        switch (val) {
          case '한기대':
            return "koreatech";
          case '야우리':
            return "terminal";
          case '천안역':
            return "station";
        }
      }
    },
    created() {
      var self = this;
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
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .upper-card {
    width: calc(100% - 46px);
    padding: 26px 23px 10px;
  }

  .lower-card {
    margin-top: 5px;
    width: calc(100% - 46px);
    padding-left: 23px;
    padding-right: 23px;
    padding-bottom: 20px;
  }

  .row {
    width: 100%;
    height: 30px;
  }

  .cards {
    margin-top: 20px !important;
    height: 137px;
    margin-bottom: 177px;
  }

  .last-card {
    margin-right: 0px;
  }

  .second-cards {
    margin-top: 30px;
  }

  .container-bus {
    border-top: #f7941e 5px solid;
    width: 100%;
  }

  .bus-lookup {
    width: 1131px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 63px;
  }

  .container-bus .title .category {
    text-align: left;
    letter-spacing: -1.5px;
    font-size: 30px;
    color: #175c8e;
    font-family: NanumSquare, serif;
    font-weight: 800;
    margin-bottom: 27px;
  }

  .container-bus .title .title-first-desc {
    text-align: left;
    letter-spacing: -1.2px;
    font-size: 24px;
    color: black;
    width: 100%;
    font-weight: 300;
  }

  .container-bus .title .title-second-desc {
    width: 50%;
    float: left;
    text-align: left;
    letter-spacing: -1.2px;
    font-size: 24px;
    font-weight: 300;
    color: black;
  }

  .container-bus .title .select {
    width: 50%;
    text-align: right;
    position: relative;
    bottom: 4px;
    float: right;
    font-size: 24px;
  }

  .container-bus .title .select span {
    color: #252525;
    letter-spacing: -1.2px;
    font-weight: 300;
    font-size: 24px;
  }

  .card {
    width: 370px;
    color: white;
    float: left;
  }

  .second-card {
    width: 370px;
    color: white;
    float: left;
    margin-left: 10px;
    margin-right: 9px;
  }

  .shuttle {
    background: #f7941e;
  }

  .daesung {
    background: #7c9fae;
  }

  .city {
    background: #4db297;
  }

  .header {
    text-align: left;
    height: 35px;
  }

  .badge {
    border: 1px white solid;
    border-radius: 14px;
    padding: 3px 8px;
    font-size: 11px;
    margin-right: 13px;
    width: 23px;
    float: left;
    margin-top: 2px;
    text-align: center;
  }

  .station {
    font-size: 24px;
    letter-spacing: -1.2px;
    float: left;
  }

  .bus-name {
    float: right;
    font-size: 14px;
    letter-spacing: -0.7px;
  }

  .next-bus-name {
    float: right;
    letter-spacing: -0.7px;
    font-size: 14px;
    width: 70%;
    text-align: right;
    margin-bottom: 8px;
  }

  .info {
    margin-top: 26px;
    text-align: left;
    width: 100%;
    height: 30px;
  }

  .time {
    font-size: 18px;
    min-width: 100px;
    float: left;
    text-align: left;
    font-weight: 700;
    letter-spacing: -0.9px;
  }

  .time .detail {
    font-size: 12px;
    font-weight: 400;
    letter-spacing: -0.6px;
    margin-left: 10px;
  }

  .type {
    float: right;
    font-size: 14px;
    width: 68px;
    letter-spacing: -0.7px;
    text-align: right;
    height: 10px;
  }

  .type img {
    position: relative;
    height: 15px;
    width: auto;
    right: 8px;
    top: 1px;
  }

  .next-bus-container {
    width: 100%;
    height: 20px;
  }

  .next-bus {
    font-size: 12px;
    text-align: left;
    width: 30%;
    float: left;
  }

  .dropbtn {
    background-color: #ffffff;
    color: black;
    top: 1px;
    position: relative;
    border: none;
    cursor: pointer;
    width: 99px;
    font-size: 24px;
    font-weight: 700;
    display: contents;
    padding-right: 0;
  }

  /* The container <div> - needed to position the dropdown content */
  .dropdown {
    position: relative;
    display: inline-block;
    width: 99px;
  }

  /* Dropdown Content (Hidden by Default) */
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #ffffff;
    width: 120px;
    left: -10px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    font-size: 14px;
  }

  /* Links inside the dropdown */
  .dropdown-content a {
    color: black;
    padding: 10px 10px;
    text-decoration: none;
    display: block;
    border: 1px #d0d0d0 solid;
    text-align: center;
    border-collapse: collapse;
    margin-top: -1px;
    cursor: pointer;
  }

  /* Change color of dropdown links on hover */
  .dropdown-content a:hover {
    background-color: #f1f1f1
  }

  /* Show the dropdown menu on hover */
  .dropdown:hover .dropdown-content {
    display: block;
  }

  /* Change the background color of the dropdown button when the dropdown content is shown */
  .dropdown:hover .dropbtn {
    background-color: white;
  }

  .under-arrow {
    width: 15px;
    margin-bottom: 2px;
  }

  .loading {
    text-align: center;
  }

  .small-card {
    padding-top: 22px;
    padding-bottom: 23px;
  }

  @media (max-width: 576px) {
    .container-bus {
      width: 100%;
      height: 100%;
    }

    .bus-lookup {
      padding-left: 16px;
      padding-right: 16px;
      width: calc(100% - 32px);
      margin-top: 26px;
      height: 100%;
      float: left;
    }

    .container-bus .title .category {
      font-size: 20px;
      margin-bottom: 17px;
    }

    .container-bus .title .title-first-desc, .container-bus .title .row, .container-bus .title .title-second-desc {
      font-size: 18px;
    }

    .container-bus .row, .container-bus .title .title-second-desc {
      margin-top: 3px;
      width: 100%;
      font-weight: 300;
    }

    .container-bus .title .select {
      margin-top: 41px;
      width: 100%;
      margin-bottom: 12px;
    }

    .dropdown .dropbtn {
      font-size: 20px;
    }

    .container-bus .title .select span {
      font-size: 18px;
    }
    .row {
      height: 100%;
      float: left;
    }
    .card {
      width: 100%;
      height: 100%;
      float: left;
      margin-bottom: 12px;
    }

    .cards {
      height: 100%;
      margin-bottom: 40px;
    }

    .second-card {
      width: 100%;
      margin: 0;
    }

    .info {
      margin-top: 5px;
    }

    .lower-card .time {
      margin-top: 23px;
    }

    .lower-card .type {
      margin-top: 23px;
    }

    .second-card {
      margin-bottom: 12px;
    }

    .upper-card {
      padding-left: 22px;
      padding-top: 22px;
      padding-bottom: 14px;
      width: calc(100% - 44px);
    }

    .lower-card {
      padding-bottom: 43px;
      width: calc(100% - 45px);
    }

    .small-card {
      padding-top: 23px;
    }

    .next-bus {
      font-size: 15px;
    }

    .station {
      font-size: 20px;
    }

    .time {
      font-size: 15px;
    }

    .container-bus {
      border-top: none;
      padding-top: 3px;
    }
  }
</style>
