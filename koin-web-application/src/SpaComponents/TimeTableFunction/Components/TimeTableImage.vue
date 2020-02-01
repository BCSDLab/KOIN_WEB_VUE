<template>
  <div>
    <div class="form-group">
      <div class="semester-dropdown">
        <div
          class="dropdown-button"
          @click="showSemesterDropdown = !showSemesterDropdown;">{{ selectedSemester | displaySemester }}
          <img
            class="dropdown-icon"
            src="http://static.koreatech.in/assets/img/ic-arrow-up-down.png">
        </div>
        <div
          v-show="showSemesterDropdown"
          class="dropdown-content">
          <button
            :class="{'selected': selectedSemester === semester.semester}"
            class="dropdown-item"
            @click="selectSemester(semester.semester)"
            :key="semester.id"
            v-for="semester in semesters">
            {{ semester.semester | displaySemester }}
          </button>
        </div>
      </div>
      <div
        class="image-download"
        @click="convert">
        <div
          class='loading'
          v-if="saveImageFlag">
          <Circle2
            size="25px"
            stroke="4px"
            background="transparent"
            color="white">
          </Circle2>
        </div>
        <span v-if="!saveImageFlag">
          <img
            class="download-img"
            src="http://static.koreatech.in/assets/img/ic-image.png">
          이미지로 저장하기
        </span>
      </div>
    </div>
    <div id="my-node">
      <table>
        <!--테이블 상단부-->
        <thead>
          <tr>
            <td
              :key="day.id"
              :style="renderSelectBox(theadIdx, -1)"
              :class="{'small-thead-first': theadIdx === 0,'small-thead-second': theadIdx === 1}"
              v-for="(day, theadIdx) in days">
              {{ day }}
            </td>
          </tr>
        </thead>
        <!--테이블 몸통부-->
        <tbody>
          <tr
            :key="time.id"
            v-for="(time, index) in times">
            <td
              :class="{'odd-body': index%2 === 1, 'even-body': index%2 === 0}"
              :style="renderSelectBox(0, index)">{{ timeAlias[index] }}</td>
            <td
              :class="{'odd-body': index%2 === 1, 'even-body': index%2 === 0}"
              :style="renderSelectBox(1, index)">{{ time }}</td>
            <td
              :class="{'odd-body': index%2 === 1, 'even-body': index%2 === 0}"
              :style="[renderBackgroundColor(2, index), renderSelectBox(2, index)]">
              <div class="subject">
                <div class="subject-title">{{ renderSubjectTitle(2, index) }}</div>
                <div class="subject-info">{{ renderSubjectInfo(2, index) }}</div>
              </div>
            </td>
            <td
              :class="{'odd-body': index%2 === 1, 'even-body': index%2 === 0}"
              :style="[renderBackgroundColor(3, index), renderSelectBox(3, index)]">
              <div class="subject">
                <div class="subject-title">{{ renderSubjectTitle(3, index) }}</div>
                <div class="subject-info">{{ renderSubjectInfo(3, index) }}</div>
              </div>
            </td>
            <td
              :class="{'odd-body': index%2 === 1, 'even-body': index%2 === 0}"
              :style="[renderBackgroundColor(4, index), renderSelectBox(4, index)]">
              <div class="subject">
                <div class="subject-title">{{ renderSubjectTitle(4, index) }}</div>
                <div class="subject-info">{{ renderSubjectInfo(4, index) }}</div>
              </div>
            </td>
            <td
              :class="{'odd-body': index%2 === 1, 'even-body': index%2 === 0}"
              :style="[renderBackgroundColor(5, index), renderSelectBox(5, index)]">
              <div class="subject">
                <div class="subject-title">{{ renderSubjectTitle(5, index) }}</div>
                <div class="subject-info">{{ renderSubjectInfo(5, index) }}</div>
              </div>
            </td>
            <td
              :class="{'odd-body': index%2 === 1, 'even-body': index%2 === 0}"
              :style="[renderBackgroundColor(6, index), renderSelectBox(6, index)]">
              <div class="subject">
                <div class="subject-title">{{ renderSubjectTitle(6, index) }}</div>
                <div class="subject-info">{{ renderSubjectInfo(6, index) }}</div>
              </div>
            </td>
          </tr>
          <tr class="even-body last-content">
            <td
              rowspan="2"
              colspan="2">그 이후</td>
            <td :style="[renderBackgroundColor(2, 18), renderSelectBox(2, 18)]"></td>
            <td :style="[renderBackgroundColor(3, 18), renderSelectBox(3, 18)]"></td>
            <td :style="[renderBackgroundColor(4, 18), renderSelectBox(4, 18)]"></td>
            <td :style="[renderBackgroundColor(5, 18), renderSelectBox(5, 18)]"></td>
            <td :style="[renderBackgroundColor(6, 18), renderSelectBox(6, 18)]"></td>
          </tr>
        </tbody>
      </table>
      <!-- <div class="grid">
        <v-stage :config="configKonva">
          <v-layer>
            <v-rect
              :key="item.id"
              v-for="item in displayLayout"
              :config="item[1]"></v-rect>

            <v-text
              :key="item.id"
              v-for="item in displayLayout"
              :config="item[0]"></v-text>
          </v-layer>

          <v-layer>
            <v-rect
              :key="item.id"
              v-for="item in selectedLayout"
              :config="item"></v-rect>
          </v-layer>
        </v-stage>
      </div> -->
    </div>
  </div>
</template>

<script scoped>
  import {mapGetters} from 'vuex';
  import VueGridLayout from 'vue-grid-layout';
  import domtoimage from 'dom-to-image';
  import {Circle2} from 'vue-loading-spinner'

  export default {
    name: 'TimeTableImage',
    components: {
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      Circle2
    },
    computed: {
      ...mapGetters({
        myTimeTable: 'myTimeTable',
        selectTimeTable: "selectTimeTable",
        selectedLayout: "selectedLayout",
        displayLayout: "displayLayout",
        semesters: "semesters",
        selectedSemester: "selectedSemester",
      })
    },
    watch: {
    },
    data() {
      return {
        configKonva: {
          width: 284,
          height: 424
        },
        configCircle: {
          x: 100,
          y: 100,
          width: 100,
          height: 50,
          text: "test",
          fill: 'green',
          stroke: "black"
        },

        test: "",
        count: 0,
        displayDays: ["", "월요일", "화요일", "수요일", "목요일", "금요일"],
        days: ["", "", "월요일", "화요일", "수요일", "목요일", "금요일"],
        timeAlias: ["01A", "01B", "02A", "02B", "03A", "03B", "04A", "04B", "05A", "05B", "06A", "06B", "07A", "07B", "08A", "08B", "09A", "09B"],
        times: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"],
        //timeId: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", '14', "15", "16", "17", "18", "19"],
        saveImageFlag: false,
        showSemesterDropdown: false
      }
    },
    methods: {
      setSemester () {
        let date = new Date();
        if (date.getMonth() + 1 <= 6) {
            return `${date.getFullYear()}1`;
        } else if (date.getMonth() + 1 >= 7 && date.getMonth() + 1 <= 12) {
            return `${date.getFullYear()}2`;
        }
      },
      convert: function () {
        this.saveImageFlag = true;
        this.$store.dispatch("resetSelectedLayer", {
          semester: this.setSemester()
        }).then((resolve)=>{
          if(resolve){
            let node = document.getElementById('my-node');
            domtoimage.toJpeg(document.getElementById('my-node'), { quality: 0.95, position: "absolute" })
              .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'timetable.png';
                link.href = dataUrl;
                link.click();
              }).then(() => {
                this.saveImageFlag = false;
              })
          }
        });
      },
      renderBackgroundColor (x, y) {
        for(let i = 0; i < this.displayLayout.length; i++) {
          if (x === this.displayLayout[i].start.x && (y >= this.displayLayout[i].start.y && y <= this.displayLayout[i].end.y)) {
              return {
                  'background-color': this.displayLayout[i].backgroundColor,
                  'borderTopColor': this.displayLayout[i].borderBottomColor,
                  'borderWidth': 2,
                  'position': 'relative'
              }
          }
        }
        return ;
      },
      renderSubjectTitle (x, y) {
        for(let i = 0; i < this.displayLayout.length; i++) {
          if (x === this.displayLayout[i].start.x && y === this.displayLayout[i].start.y) {
              return this.displayLayout[i].title;
          }
        }
        return ;
      },
      renderSubjectInfo (x, y) {
        for(let i = 0; i < this.displayLayout.length; i++) {
          if (x === this.displayLayout[i].start.x && y === this.displayLayout[i].start.y) {
              return this.displayLayout[i].info;
          }
        }
        return ;
      },
      renderSelectBox (x, y) {
        for(let i = 0; i < this.selectedLayout.length; i++) {
          if (this.selectedLayout[i].selected) {
            if (x === this.selectedLayout[i].start.x && y === this.selectedLayout[i].start.y) {
              return {
                'borderTop': '3px solid #555555',
                'borderRight': '3px solid #555555',
                'borderLeft': '3px solid #555555',
              }
            } else if (x === this.selectedLayout[i].end.x && y === this.selectedLayout[i].end.y) {
              return {
                'borderRight': '3px solid #555555',
                'borderLeft': '3px solid #555555',
                'borderBottom': '3px solid #555555',
              }
            } else if (x === this.selectedLayout[i].start.x && (y > this.selectedLayout[i].start.y && y < this.selectedLayout[i].end.y)){
              return {
                'borderRight': '3px solid #555555',
                'borderLeft': '3px solid #555555',
              }
            }
          } else {
            if (x === this.selectedLayout[i].start.x && y === this.selectedLayout[i].start.y) {
              return {
                'borderTop': '1px solid #555555',
                'borderRight': '1px solid #555555',
                'borderLeft': '1px solid #555555',
              }
            } else if (x === this.selectedLayout[i].end.x && y === this.selectedLayout[i].end.y) {
              return {
                'borderRight': '1px solid #555555',
                'borderLeft': '1px solid #555555',
                'borderBottom': '1px solid #555555',
              }
            } else if (x === this.selectedLayout[i].start.x && (y > this.selectedLayout[i].start.y && y < this.selectedLayout[i].end.y)){
              return {
                'borderRight': '1px solid #555555',
                'borderLeft': '1px solid #555555'
              }
            } else if (x === this.selectedLayout[i].start.x && y === -1 && this.selectedLayout[i].start.y === 0) {
              return {
                'borderBottom': 'none'
              }
            }
          }
        }
        return ;
      },
      async selectSemester (semester) {
        await this.$store.dispatch('selectSemester', semester)
        await this.$store.dispatch('setTotalTimeTable')
        this.$store.dispatch('initTimeTable')
        await this.$store.dispatch('resetLayout')
        await this.$store.dispatch("getMyTimeTable", {
          token: this.$session.get("token"),
          mobile: false,
        })
      }
    },
    filters: {
      displaySemester (semester) {
        return semester.slice(0,4) + '년 ' + semester.slice(4,5) + '학기'
      }
    },
    created() {
      this.$store.dispatch("resetLayout");
      window.addEventListener('click', (event) => {
        if (!event.target.matches('.dropdown-button')) {
          this.showSemesterDropdown = false;
        }
      })
    },
    beforeDestroy() {
      window.removeEventListener('click', (event) => {
        if (!event.target.matches('.dropdown-button')) {
          this.showSemesterDropdown = false;
        }})
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .test {
    background: red;
  }

  .form-group {
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
  }
  .semester-dropdown {
    width: 166px;
    height: 45px;
    cursor: pointer;
    margin-right: 4px;
  }
  .dropdown-icon {
    position: relative;
    right: 8px;
    bottom: 3px;
    width: 24px;
    float: right;
  }
  .dropdown-button {
    border: 1px #d2dae2 solid;
    width: 144px;
    height: 30px;
    padding-top: 13px;
    text-align: left;
    padding-left: 20px;
    float: right;
    font-size: 14px;
    color: #252525;
    cursor: pointer;
  }

  .dropdown-item {
    position: relative;
    width: 166px;
    top: 10px;
    border: 1px #d2dae2 solid;
    margin-top: -1px;
    display: block;
    height: 42px;
    border-collapse: collapse;
    text-align: left;
    padding: 10px 20px;
    background: white;
    cursor: pointer;
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.11), 0 5px 15px 0 rgba(0, 0, 0, 0.08);
    color: #858585;
    font-size: 15px;
    font-family: NanumBarunGothic;
  }
  .dropdown-item.selected,
  .dropdown-item:hover {
    font-weight: bold;
    color: #252525;
  }
  .dropdown-content {
    position: absolute;
    margin-top: 40px;
    min-width: 160px;
    max-width: 324px;
    z-index: 3;
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

  .image-download {
    display: inline-block;
    width: 166px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    cursor: pointer;
    font-size: 15px;
    color: #fdfdfd;
    background-color: #175c8e;
  }
  .loading {
    padding: 10px 156.5px;
  }
  #my-node{
    position:relative;
    height: 416px;
  }
  table {
    z-index: 2;
    background: white;
    position: absolute;
    font-size: 11px;
    border-spacing: 0px;
    border-collapse: collapse;
    table-layout: fixed;
  }
  thead {
    width: 100%;
  }
  table thead td {
    border-collapse: collapse;
    border: 1px #dadada solid;
    width: 56px;
    height: 34px;
    text-align: center;
    background-color: #f1f1f1;
    color: #555555;
  }
  tbody {
    font-size: 8px;
  }

  tbody tr {
    border-right: 1px solid #dadada;
  }
  tbody td {
    height: 21px;
    text-align: center;
    border-left: 1px #dadada solid;
    color: #252525;
    box-sizing: border-box;
  }

  .small-thead-first {
    width: 22px;
  }
  .small-thead-second {
    width: 25px;
  }
  .odd-body {
    border-top: 1px rgba(218, 218, 218, 0.3) solid;
  }
  .even-body {
    border-top: 1px #dadada solid;
  }
  .last-content {
    height: 42px;
    border-bottom: 1px #dadada solid;
  }
  .grid {
    width: 282px;
    top: 35px;
    margin-left: 53px;
    z-index: 2;
    position: relative;
    user-select: none;
    border-collapse: collapse;
    border: 0px;
  }
  .grid-item {
  }
  .item {
    background: black;
    color: white;
    height: 100%;
  }
  .download-img {
    position: relative;
    top: 7px;
    margin-right: 2px;
    width: 24px;
  }

  .subject {
    position: absolute;
    text-align: left;
    padding: 0 3.5px;
    z-index: 1;
  }

  .subject-title {
    font-family: NanumSquare;
    font-size: 9px;
    font-weight: bold;
    line-height: 1.33;
    letter-spacing: -0.27px;
    text-align: left;
    color: #252525;
    padding-bottom: 8px;
  }

  .subject-info {
    font-family: NanumSquare;
    font-size: 9px;
    font-weight: normal;
    line-height: 1.33;
    letter-spacing: -0.27px;
    text-align: left;
    color: #252525;
  }

</style>
