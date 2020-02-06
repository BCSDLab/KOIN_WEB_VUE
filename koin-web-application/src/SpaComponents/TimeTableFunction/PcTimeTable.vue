<template>
  <div class="container">
    <div class="list">
      <!-- 전체 header -->
      <div>
        <time-table-header></time-table-header>
      </div>
      <!--첫번째 row-->
      <div class="row">
        <!--좌상단 테이블-->
        <div class="table-total">
          <!--검색 바 개설학부 등-->
          <div class="table-info">
            <div class="search-bar">
              <input
                @keyup="enter"
                placeholder="교과명을 입력하세요"
                class="search"
                v-model="searchName"
                type="text">
              <button
                class="search-btn"
                @click="searchTable">
                <img
                  class="search-icon"
                  src="http://static.koreatech.in/assets/img/ic-search.png">
              </button>
            </div>
            <!--학부별 dropdown-->
            <div
              @click="myFunction()"
              class="dropdown">
              <div
                class="dropbtn major-now">{{ nowMajor }}
                <img
                  class="major-icon"
                  src="http://static.koreatech.in/assets/img/ic-arrow-up-down.png">
              </div>
              <div
                id="myDropdown"
                class="dropdown-content">
                <button
                  :class="{'selected': nowMajor === major}"
                  class="major-dropdown"
                  @click="selectMajor(major)"
                  :key="major.id"
                  v-for="major in majors">
                  {{ major }}
                </button>
              </div>
            </div>
          </div>
          <!--전체 시간표-->
          <div class="time-table">
            <div
              class="loading"
              v-if="!loadingFlag">
              <v-loading-bar></v-loading-bar>
            </div>
            <div v-if="loadingFlag">
              <time-table
                :change-major-count="changeMajorCount"
                :time-table-data="totalTimeTable"
                :myTimeTableflag="false">
              </time-table>
            </div>
          </div>
        </div>
        <!--우측상단 이미지-->
        <div class="table-image">
          <time-table-image></time-table-image>
        </div>
      </div>
      <!--첫번째 row 끝-->
      <!--두번째 row 시작-->
      <div class="row second-row">
        <div class="table-total second-table">
          <div class="title">
            나의 시간표
          </div>
          <time-table
            :time-table-data="myTimeTable"
            :myTimeTableflag="true">
          </time-table>
          <div class="grade-table">
            <div class="grade-table-row">
              <div
                class="grade-table-content"
                :key="header.id"
                :class="{'last-content': idx===4}"
                v-for="(header, idx) in myTableGradeTableHeader">
                {{ header }}
              </div>
            </div>
            <div class="grade-table-row">
              <div
                class="grade-table-content content"
                :class="{'last-content': idx===4}"
                :key="grade.id"
                v-for="(grade, idx) in myTimeTableGrade">
                {{ grade }}
              </div>
            </div>
          </div>
        </div>
        <!--학부별 커리큘럼-->
        <div class="curriculum">
          <div class="title">
            커리큘럼
          </div>
          <curriculum></curriculum>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import * as DB from '../../static/timeTableDB'
  import TimeTableHeader from './Components/TimeTableHeader';
  import DetailTimeTable from './Components/DetailTimeTable';
  import TimeTableImage from './Components/TimeTableImage';
  import Curriculum from './Components/Curriculum';

  export default {
    name: 'PcTimeTable',
    components: {
      "time-table-header": TimeTableHeader,
      "time-table": DetailTimeTable,
      "time-table-image": TimeTableImage,
      "curriculum": Curriculum
    },
    computed: {
      ...mapGetters({
        totalTimeTable: 'totalTimeTable',
        myTimeTable: 'myTimeTable',
        myTimeTableGrade: 'myTimeTableGrade'
      })
    },
    data() {
      return {
        loadingFlag: false,
        majorClickFlag: false,
        nowMajor: "전체",
        searchName: "",
        changeMajorCount: 0,
        majors: ["전체", "컴퓨터공학부", "전기ㆍ전자ㆍ통신공학부", "에너지신소재화학공학부", "기계공학부", "디자인ㆍ건축공학부", "산업경영학부", "교양학부", "HRD학과", "융합학과"],
        myTableGradeTableHeader: ["총 학점", "전공학점", "교양학점", "HRD학점", "융합학점"],
      }
    },
    methods: {
      enter: function (e) {
        if (e.keyCode === 13)
          this.searchTable();
      },
      myFunction: function () {
        console.log("clicked");
        document.getElementById("myDropdown").classList.toggle("show");
      },
      setSemester: function () {
        let date = new Date();
        if (date.getMonth() + 1 <= 6) {
          return `${date.getFullYear()}1`;
        } else if (date.getMonth() + 1 >= 7 && date.getMonth() + 1 <= 12) {
          return `${date.getFullYear()}2`;
        }
      },
      // 학부 선택
      selectMajor: function (major) {
        this.majorClickFlag = false;
        this.loadingFlag = false,
        this.changeMajorCount++;
        this.$store.dispatch("selectMajor", {
          'timeTableData': DB.default,
          "major": major
        }).then((resolve)=> {
          this.loadingFlag = true;
          this.nowMajor = major;
        });
      },
      // 테이블 검색
      searchTable: function () {
        this.nowMajor = "전체";
        this.$store.dispatch("searchTimeTable", {
          'timeTableData': DB.default,
          'searchName': this.searchName
        })
      },
      getMyTimetable: function() {
        this.$store.dispatch("getMyTimeTable", {
          token: this.$session.get("token"),
          mobile: false,
        }).then(() => {
          console.log(this.myTimeTable);
        })
      },

    },
    created() {
      window.addEventListener('click', function (event) {
        if (!event.target.matches('.dropbtn')) {
          var dropdowns = document.getElementsByClassName("dropdown-content");
          var i;
          for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
            }
          }
        }
      })
    },
    mounted() {
      console.log("pc web");
      this.$store.dispatch("initTimeTable");
      this.$store.dispatch("resetLayout");
      // 학기 받아오기
      this.$store.dispatch("setTotalSemester");
      this.$store.dispatch("selectSemester", this.setSemester());
      //전체 테이블 초기화
      this.$store.dispatch("setTotalTimeTable", {
        timeTableData: DB.default
      }).then((resolve, reject)=> {
        if(resolve) {
          this.loadingFlag=true;
          if (this.$session.get("token") !== undefined) {
            this.getMyTimetable();
          } else if (this.$cookies.get("timetable") !== null) {
            console.log(this.$cookies.get("timetable"))
            this.$store.dispatch("searchMyTimeTableInfo", {
              subject: this.$cookies.get("timetable")[this.setSemester()],
              mobile: false,
            })
            this.$store.dispatch("setMyTimeTableGrade");
          }
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    border-top: #f7941e 5px solid;
    width: 100%;
  }

  .list {
    width: 1132px;
    margin-top: 68px;
    margin-left: auto;
    margin-right: auto;
    min-height: 800px;
  }

  .row {
    width: 100%;
    text-align: left;
  }

  .row:after {
    content: '';
    display: block;
    clear: both;
  }

  .table-total {
    float: left;
    width: 766px;
    margin-right: 30px;
  }

  .time-table {
    margin-top: 14px;
    width: 100%;
  }

  .table-image {
    float: left;
    width: 336px;
  }

  .table-info {
    height: 45px;
  }

  .search {
    width: 249px;
    height: 32px;
    font-size: 15px;
    text-align: left;
    color: #252525;
    margin-right: 0px;
    padding-left: 20px;
    background-color: #ffffff;
    border: none;
    position: relative;
    bottom: 4px;
  }

  .search::placeholder {
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    text-align: left;
    color: #bec9d5;
  }

  .search-btn {
    margin-left: 0px;
    width: 44px;
    height: 38px;
    background: white;
    border: none;
    position: relative;
    top: 4px;
    left: 4px;
    cursor: pointer;
  }

  .search-bar {
    border: 1px #d2dae2 solid;
    width: 322px;
    height: 42px;
    float: left;
  }

  .search-icon {
    width: 24px;
  }

  .major-now {
    border: 1px #d2dae2 solid;
    width: 177px;
    height: 29px;
    padding-top: 13px;
    text-align: left;
    padding-left: 20px;
    float: right;
    font-size: 14px;
    color: #252525;
    cursor: pointer;
  }

  .major-dropdown {
    position: relative;
    top: 10px;
    border: 1px #d2dae2 solid;
    margin-top: -1px;
    display: block;
    width: 199px;
    right: 22px;
    height: 42px;
    border-collapse: collapse;
    text-align: left;
    padding: 10px 20px;
    font-size: 14px;
    background: white;
    cursor: pointer;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.11), 0 5px 15px 0 rgba(0, 0, 0, 0.08);
    color: #858585;
    font-size: 15px;
    font-family: NanumBarunGothic;
  }

  .major-dropdown:hover {
    font-weight: bold;
    color: #252525;
  }

  .selected {
    font-weight: bold;
    color: #252525;
  }

  .major-icon {
    position: relative;
    right: 8px;
    bottom: 3px;
    width: 24px;
    float: right;
  }

  .dropbtn {
    width: 100%;
  }

  /* The container <div> - needed to position the dropdown content */
  .dropdown {
    float: right;
    width: 177px;
    display: inline-block;
  }

  /* Dropdown Content (Hidden by Default) */
  .dropdown-content {
    display: none;
    position: absolute;
    margin-top: 40px;
    min-width: 160px;
    z-index: 1;
  }

  /* Links inside the dropdown */
  .dropdown-content a {
    color: black;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  /* Change color of dropdown links on hover */
  .dropdown-content a:hover {
    background-color: #ddd
  }

  /* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
  .show {
    display: block;
  }

  .second-row {
    margin-top: 66px;
  }

  .title {
    height: 22px;
    font-family: NanumSquare, serif;
    font-weight: 800;
    font-size: 20px;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #175c8e;
    margin-bottom: 27px;
  }

  .second-table {
    height: 400px;
  }

  .curriculum {
    float: right;
    width: 336px;
    height: 76px;
  }

  .grade-table {
    margin-top: 20px;
    width: 772px;
    table-layout: fixed;
  }

  .grade-table .grade-table-row {
    width: 772px;
  }

  .grade-table .grade-table-content {
    float: left;
    width: 152px;
    border-collapse: collapse;
    border-left: none;
    background-color: #eaf3fc;
    height: 37px;
    line-height: 37px;
    font-size: 13px;
    padding: 0px;
    text-align: center;
    border-bottom: 1px #858585 solid;
    border-right: 1px #d2dae2 solid;
    color: #555555;
  }

  .grade-table .content {
    height: 37px;
    line-height: 37px;
    text-align: center;
    background: #ffffff;
    border-right: 1px #d2dae2 solid;
    border-bottom: 1px #858585 solid;
  }

  .last-content {
    border-right: none;
  }

  .loading {
    height: 382px;
    margin-top: -150px;
  }
</style>
