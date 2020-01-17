<template>
  <div class="container">
    <div class="time-table">
      <div class="title">전체 시간표 조회</div>
      <div class="bus-tabs">
        <div
          class="tab"
          @click="clickShuttleTab"
          :style="shuttleChecked === true ? checkedStyle : ''">학교셔틀</div>
        <div
          class="tab"
          @click="clickDaesungTab"
          :style="daesungChecked === true ? checkedStyle : ''">대성고속</div>
        <div
          class="tab"
          @click="clickCityTab"
          :style="cityChecked === true ? checkedStyle : ''">시내버스</div>
      </div>
      <div
        class="sub-info"
        v-if="shuttleChecked === true">
        <div class="dropdown">
          <button
            :class="{'shuttle': shuttleChecked, 'no-shuttle': !shuttleChecked }"
            class="select-button">
            {{ shuttleTimeTableTitle }} 
            <img
              class="under-arrow"
              src="https://static.koreatech.in/assets/img/bus_dropdown.png">
          </button>
          <div
            id="shuttle-dropdown-content"
            class="dropdown-content"
            :style="{width: shuttleChecked ? '178px' : '151px'}">
            <a
              v-for="(titles, idx) in totalTimeTable"
              :key="titles.key"
              v-if="idx < (vacationFlag ? 9 : 6)"
              @click="clickTimeTable(titles.title, '셔틀')">
              {{ titles.title }}
            </a>
          </div>
        </div>
        <div class="sub-desc">천안(터미널/천안역) 등교/하교(18:10)</div>
      </div>
      <div
        class="sub-info"
        v-if="daesungChecked === true">
        <div class="dropdown">
          <button
            class="select-button">
            {{ daesungTimeTableTitle }}
            <img
              class="under-arrow"
              src="https://static.koreatech.in/assets/img/bus_dropdown.png">
          </button>
          <div
            id="daesung-dropdown-content"
            class="dropdown-content">
            <a
              v-for="title in daesungTimeTableTitleList"
              :key="title.key"
              @click="clickTimeTable(title, '대성')">
              {{ title }}
            </a>
          </div>
        </div>
      </div>
      <!-- 셔틀버스 -->
      <div
        class="table"
        v-if="shuttleChecked === true"
        v-for="timetable in totalTimeTable"
        :key="timetable.id">
        <table v-if="timetable.title === shuttleTimeTableTitle && !vacationFlag">
          <tr
            v-for="times in timetable.timetable"
            :key="times.id">
            <td
              v-for="(time, index) in times"
              :key="time.id"
              :class="{time: index!==0}">
              {{ time }}
            </td>
          </tr>
        </table>
        <table v-if="timetable.title === shuttleTimeTableTitle && vacationFlag">
          <tr
            v-for="(times, rowIdx) in timetable.timetable"
            :key="times.id">
            <td
              :rowspan="rowIdx === 1 && index === 0 ? timetable.rowspan : 1"
              v-for="(time, index) in times"
              :key="time.id"
              :class="{time: index !== 0 || index+rowIdx >= 2, course: rowIdx === 1 && index === 0}">
              {{ time }}
            </td>
          </tr>
        </table>
        <table v-if="timetable.title === shuttleTimeTableTitle && vacationFlag && timetable.timetable2 !== undefined">
          <tr
            v-for="(times, rowIdx) in timetable.timetable2"
            :key="times.id">
            <td
              :rowspan="rowIdx === 1 && index === 0 ? timetable.rowspan2 : 1"
              v-for="(time, index) in times"
              :key="time.id"
              :class="{time: index!==0 || index+rowIdx >= 2, course: rowIdx === 1 && index === 0}">
              {{ time }}
            </td>
          </tr>
        </table>
      </div>
      <!-- 대성: 학교 -> 야우리 -->
      <div
        class="table"
        v-if="daesungChecked === true && daesungTimeTableTitle === '학교 -> 야우리'">
        <table class="">
          <tbody>
            <tr>
              <td>출발시간</td>
              <td>도착시간</td>
            </tr>
            <tr>
              <td>08:00</td>
              <td>08:20</td>
            </tr>
            <tr>
              <td >09:35</td>
              <td >09:55</td>
            </tr>
            <tr>
              <td >10:30</td>
              <td >10:50</td>
            </tr>
            <tr>
              <td >11:45</td>
              <td >12:00</td>
            </tr>
            <tr>
              <td >12:35</td>
              <td >12:55</td>
            </tr>
            <tr>
              <td >14:00</td>
              <td >14:20</td>
            </tr>
            <tr>
              <td >15:05</td>
              <td >15:25</td>
            </tr>
            <tr>
              <td >16:00</td>
              <td >16:20</td>
            </tr>
            <tr>
              <td >16:55</td>
              <td >17:15</td>
            </tr>
            <tr>
              <td class="add">18:05</td>
              <td class="add">18:25</td>
            </tr>
            <tr>
              <td class="add">18:55</td>
              <td class="add">19:15</td>
            </tr>
            <tr>
              <td class="add">20:00</td>
              <td class="add">20:20</td>
            </tr>
            <tr>
              <td class="add">21:05</td>
              <td class="add">21:25</td>
            </tr>
            <tr>
              <td class="add">21:55</td>
              <td class="add">22:15</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 대성: 야우리 -> 학교 -->
      <div
        class="table"
        v-if="daesungChecked === true && daesungTimeTableTitle === '야우리 -> 학교'">
        <table>
          <tbody>
            <tr >
              <td >출발시간</td>
              <td >도착시간</td>
            </tr>
            <tr>
              <td>07:00</td>
              <td>07:20</td>
            </tr>
            <tr>
              <td >07:30</td>
              <td >07:50</td>
            </tr>
            <tr>
              <td >09:00</td>
              <td >09:20</td>
            </tr>
            <tr>
              <td >10:00</td>
              <td >10:20</td>
            </tr>
            <tr>
              <td >11:00</td>
              <td >11:20</td>
            </tr>
            <tr>
              <td >12:00</td>
              <td >12:20</td>
            </tr>
            <tr>
              <td >13:00</td>
              <td >13:20</td>
            </tr>
            <tr >
              <td >14:00</td>
              <td >14:20</td>
            </tr>
            <tr >
              <td >14:30</td>
              <td >14:50</td>
            </tr>
            <tr >
              <td >15:00</td>
              <td >15:20</td>
            </tr>
            <tr>
              <td >16:00</td>
              <td >16:20</td>
            </tr>
            <tr>
              <td class="add">17:00</td>
              <td class="add">17:20</td>
            </tr>
            <tr>
              <td class="add">17:50</td>
              <td class="add">18:10</td>
            </tr>
            <tr>
              <td class="add">19:30</td>
              <td class="add">19:50</td>
            </tr>
            <tr>
              <td class="add">20:30</td>
              <td class="add">20:50</td>
            </tr>
            <tr>
              <td class="add">21:00</td>
              <td class="add">21:20</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 시내 버스 -->
      <div
        class="table city"
        v-if="cityChecked">
        <div class="sub-desc city-sub">버스번호 400, 401</div>
        <table>

          <tbody>
            <tr>
              <td style="vertical-align:middle;">기점</td>
              <td >종합터미널 - 병천</td>
            </tr>
            <tr>
              <td style="vertical-align:middle;">시간표(터미널)</td>
              <td >6:00(첫) - 22:30(막) (10분간격)</td>
            </tr>
            <tr>
              <td style="vertical-align:middle;">시간표(병천)</td>
              <td >6:10(첫) - 22:45(막) (10분간격)</td>
            </tr>
            <tr>
              <td style="vertical-align:middle;">소요시간</td>
              <td >약 40분</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import { semesterTimeTable, vacationTimeTable } from '../../../static/shuttleBusTimeTable';
  import {mapGetters} from 'vuex';

  export default {
    name: 'BusTimeTable',
    data: function () {
      return {
        vacationFlag: true,
        totalTimeTable: undefined,
        shuttleChecked: true,
        daesungChecked: false,
        cityChecked: false,
        checkedStyle: {
          border: '1px solid #175c8e',
          borderBottom: 'none',
          color: '#175c8e'
        },
        shuttleTimeTableTitle: '',
        daesungTimeTableTitle: "학교 -> 야우리",
        daesungTimeTableTitleList: ["학교 -> 야우리", "야우리 -> 학교"],
      }
    },
    computed: {
    },
    methods: {
      clickShuttleTab () {
        this.shuttleChecked = true;
        this.daesungChecked = false;
        this.cityChecked = false;
      },
      clickDaesungTab () {
        this.shuttleChecked = false;
        this.daesungChecked = true;
        this.cityChecked = false;
      },
      clickCityTab () {
        this.shuttleChecked = false;
        this.daesungChecked = false;
        this.cityChecked = true;
      },
      clickTimeTable (title, bus) {
        let dc;
        if (bus==="셔틀") {
          dc = document.getElementById("shuttle-dropdown-content");
          dc.style.display = 'none';
          dc.style.display = '';
          this.shuttleTimeTableTitle = title;
        }
        else {
          dc = document.getElementById("daesung-dropdown-content");
          dc.style.display = 'none';
          dc.style.display = '';
          this.daesungTimeTableTitle = title;
        }
      }
    },
    created() {
      if (this.vacationFlag) {
        this.totalTimeTable = vacationTimeTable;
        this.shuttleTimeTableTitle = "천안 계절 등교/하교";
      } else {
        this.totalTimeTable = semesterTimeTable;
        this.shuttleTimeTableTitle = "천안 등교/하교";
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    width:100%;
  }
  .time-table {
    margin-top: 119px;
    width: 1131px;
    margin-left: auto;
    margin-right: auto;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: -1px;
    text-align: left;
    color: #252525;
    margin-bottom: 22px;
  }

  .bus-tabs {
    width: 100%;
    margin-bottom: 2%;
    display:flex;
  }
  .tab {
    width: 33%;
    border: 1px solid #858585;
    border-left: 0.5px solid #858585;
    border-right: 0.5px solid #858585;
    padding-left: 152px;
    padding-right: 160px;
    padding-top: 18px;
    padding-bottom: 16px;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: -0.8px;
    text-align: center;
    color: #858585;
    cursor: pointer;
  }

  .bus-tabs .tab:first-child {
    border-left: 1px solid #858585;
  }

  .bus-tabs .tab:last-child {
    border-right: 1px solid #858585;
  }

  .tab:hover {
    /* background-color: #175c8e; */
    color: #175c8e;
  }

  .sub-info {
    height: 58px;
  }

  .dropdown {
    width: 100%;
  }

  .dropdown:hover .dropdown-content {
    display: block;

  }

  .select-button {
    margin-top: -1px;
    border: 1px solid #d2dae2;
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.8px;
    color: #252525;
    padding-top: 11px;
    padding-bottom: 11px;
    padding-left: 19px;
    padding-right: 19px;
    float: left;
    cursor: pointer;
    width: 153px;
    text-align: left;
    background-color: #ffffff;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #ffffff;
    border: 1px #d0d0d0 solid;
    width: 151px;
    z-index: 1;
    margin-top: 41px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.8px;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }

  .dropdown-content a {
    border-bottom: 1px #d0d0d0 solid;
    font-size: 15px;
    color: black;
    padding: 3% 4%;
    text-decoration: none;
    display: block;
    cursor: pointer;
  }

  .dropdown-content a:hover {
    margin-top:-1px;
    background-color: #f1f1f1;
    border-top: 1px #d0d0d0 solid;
  }

  .dropdown:hover .select-button {
    background-color: #efefef;
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
  }

  .sub-desc {
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: -0.6px;
    text-align: right;
    color: #858585;
    float: right;
    padding-top: 2.5%;
  }

  .table {
    width: 100%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 70px;
  }

  thead {
    margin-bottom: 2%;
  }
  th {
    height: 50px;
  }
  td {
    padding-top: 25px;
    padding-bottom: 25px;
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.8px;
    text-align: center;
    color: #252525;
    border-bottom: 1px solid #d2dae2;
  }

  table tr:first-child td {
    padding-top: 13px;
    padding-bottom: 13px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.8px;
    text-align: center;
    color: #175c8e;
    border-bottom: 1px solid #175c8e;
    border-top: 2px solid #175c8e;
  }

  table tr:last-child td {
    border-bottom: 1px solid #175c8e;
  }
  .shuttle {
    width: 180px;
  }

  .no-shuttle {
    width: 153px;
  }

  .city {
    margin-top: 51px;
  }
  .under-arrow{
    float: right;
    position: relative;
    top: 4px;
    width: 17px;
  }
  .time {
    font-size: 13px;
  }
  .city-sub {
    padding-top: 0;
    padding-bottom: 12px;
  }
  tr:hover td{
    font-weight: 700;
  }
  .course {
    border-bottom: 1px solid #175c8e;
  }

  @media (max-width: 576px) {
    .container {
      float: left;
    }
    .time-table {
      margin-top: 0px;
      padding-left: 16px;
      padding-right: 16px;
      width: calc(100% - 32px);
    }
    .time-table .title {
      font-size: 18px;
      margin-bottom: 28px;
    }
    .table {
      overflow-x: scroll;
    }

    .bus-tabs {
      width: calc(100%);
    }
    .tab {
      width: 33%;
      font-size: 13px;
      padding: 6px 0 5px;
    }

    .sub-info {
      margin-top: 27px;
    }

    .select-button {
      width: 100%;
    }

    td {
      padding-top: 13px;
      padding-bottom: 13px;
      font-size: 12px;
    }

    .sub-desc {
      margin-top: 6px;
      margin-bottom: 8px;
    }
    .course {
      min-width: 80px
    }

  }
</style>
