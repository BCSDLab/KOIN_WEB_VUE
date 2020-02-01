<template>
  <div class="timetable">
    <div class="form-group">
      <select
        id="semester"
        class="semester-dropdown"
        @change="selectSemester">
        <option
          v-for="semester in semesters"
          :key="semester.id"
          :value="semester.semester">
          {{ semester.semester | displaySemester }}
        </option>
      </select>
      <label
        for="semester"
        class="dropdown-arrow"/>
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
        <template v-if="!saveImageFlag">
          <img
            class="download-img"
            src="http://static.koreatech.in/assets/img/ic-image.png">
          이미지로 저장하기
        </template>
      </div>
    </div>
    <div
      class="table-wrapper">
      <div
        class="time-table-head"
        :style="{ 'box-shadow': isScrollTop ? '' : '0 3px 6px 0 rgba(0, 0, 0, 0.16)'} ">
        <div
          class="thead"
          :class="{'first-thead-edge': idx === 0, 'second-thead-edge': idx === 1}"
          v-for="(day, idx) in days"
          :key="day.id">
          {{ day }}
        </div>
      </div>
      <div
        class="time-table-body"
        ref="table"
        :style="tableStyle"
        @scroll="scrolling">
        <table>
          <tbody>
            <tr
              v-for="(time, idx) in times"
              :key="idx">
              <td
                :class="{'odd-body': idx%2 === 1, 'even-body': idx%2 === 0}"
                :style="renderSelectBox(0, idx)">{{ timeAlias[idx] }}
              </td>
              <td
                :class="{'odd-body': idx%2 === 1, 'even-body': idx%2 === 0}"
                :style="renderSelectBox(1, idx)">{{ time }}
              </td>
              <td
                :class="{'odd-body': idx%2 === 1, 'even-body': idx%2 === 0}"
                :style="[renderBackgroundColor(2, idx), renderSelectBox(2, idx)]"
                @click="selectMySubject(2, idx)">
                <div class="subject">
                  <div class="subject-title">{{ renderSubjectTitle(2, idx) }}</div>
                  <div class="subject-info">{{ renderSubjectInfo(2, idx) }}</div>
                </div>
              </td>
              <td
                :class="{'odd-body': idx%2 === 1, 'even-body': idx%2 === 0}"
                :style="[renderBackgroundColor(3, idx), renderSelectBox(3, idx)]"
                @click="selectMySubject(3, idx)">
                <div class="subject">
                  <div class="subject-title">{{ renderSubjectTitle(3, idx) }}</div>
                  <div class="subject-info">{{ renderSubjectInfo(3, idx) }}</div>
                </div>
              </td>
              <td
                :class="{'odd-body': idx%2 === 1, 'even-body': idx%2 === 0}"
                :style="[renderBackgroundColor(4, idx), renderSelectBox(4, idx)]"
                @click="selectMySubject(4, idx)">
                <div class="subject">
                  <div class="subject-title">{{ renderSubjectTitle(4, idx) }}</div>
                  <div class="subject-info">{{ renderSubjectInfo(4, idx) }}</div>
                </div>
              </td>
              <td
                :class="{'odd-body': idx%2 === 1, 'even-body': idx%2 === 0}"
                :style="[renderBackgroundColor(5, idx), renderSelectBox(5, idx)]"
                @click="selectMySubject(5, idx)">
                <div class="subject">
                  <div class="subject-title">{{ renderSubjectTitle(5, idx) }}</div>
                  <div class="subject-info">{{ renderSubjectInfo(5, idx) }}</div>
                </div>
              </td>
              <td
                :class="{'odd-body': idx%2 === 1, 'even-body': idx%2 === 0}"
                :style="[renderBackgroundColor(6, idx), renderSelectBox(6, idx)]"
                @click="selectMySubject(6, idx)">
                <div class="subject">
                  <div class="subject-title">{{ renderSubjectTitle(6, idx) }}</div>
                  <div class="subject-info">{{ renderSubjectInfo(6, idx) }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {Circle2} from 'vue-loading-spinner'
  import domtoimage from "dom-to-image";

  export default {
    name: 'MobileTimeTableImage',
    components: {
      Circle2
    },
    computed: {
      ...mapGetters({
        myTimeTable: 'myTimeTable',
        selectTimeTable: "selectTimeTable",
        selectedLayout: "selectedLayout",
        displayLayout: "displayLayout",
        sheetFlag: "sheetFlag",
        clickedSubject: "clickedSubject",
        semesters: "semesters",
        selectedSemester: "selectedSemester",
      }),
      tableStyle() {
        if (this.sheetFlag) {
          return {
            height: 'calc(100vh - 391px)',
            overflow: 'scroll'
          }
        }
      },
    },
    data() {
      return {
        width: 0,
        height: 0,
        marginLeft: 0,
        days: ["", "", "월", "화", "수", "목", "금"],
        timeAlias: ["01A", "01B", "02A", "02B", "03A", "03B", "04A", "04B", "05A", "05B", "06A", "06B", "07A", "07B", "08A", "08B", "09A", "09B", "10A", "10B", "11A"],
        times: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"],
        configKonva: {
          width: this.width,
          height: this.height
        },
        isScrollTop: true,
        saveImageFlag: false
      }
    },
    methods: {
      selectMySubject(x, y) {
        let id = -1;
        for (let i = 0; i < this.displayLayout.length; i++) {
          if (x === this.displayLayout[i].start.x && (y >= this.displayLayout[i].start.y && y <= this.displayLayout[i].end.y)) {
            id = this.displayLayout[i].id;
          }
        }
        if (id === -1) {
          console.log('empty table clicked');
          this.$store.commit("sheetFlagUpdate", false);
          this.$store.dispatch("clickSubjectOnTimeTable", {
            subject: {},
            flag: false
          })
        } else {
          console.log("subject clicked");
          this.$store.commit("sheetFlagUpdate", true);
          this.$store.dispatch("selectClickedSubject", id);
          this.$store.dispatch("clickSubjectOnTimeTable", {
            subject: this.clickedSubject,
            flag: true
          });
        }
      },
      scrolling() {
        if (this.$refs.table.scrollTop === 0) this.isScrollTop = true;
        else this.isScrollTop = false;
      },
      renderBackgroundColor(x, y) {
        for (let i = 0; i < this.displayLayout.length; i++) {
          if (x === this.displayLayout[i].start.x && (y >= this.displayLayout[i].start.y && y <= this.displayLayout[i].end.y)) {
            return {
              'background-color': this.displayLayout[i].backgroundColor,
              'borderTopColor': this.displayLayout[i].borderBottomColor,
              'borderWidth': 2,
              'position': 'relative'
            }
          }
        }
        return;
      },
      renderSubjectTitle(x, y) {
        for (let i = 0; i < this.displayLayout.length; i++) {
          if (x === this.displayLayout[i].start.x && y === this.displayLayout[i].start.y) {
            return this.displayLayout[i].title;
          }
        }
        return;
      },
      renderSubjectInfo(x, y) {
        for (let i = 0; i < this.displayLayout.length; i++) {
          if (x === this.displayLayout[i].start.x && y === this.displayLayout[i].start.y) {
            return this.displayLayout[i].info;
          }
        }
        return;
      },
      renderSelectBox(x, y) {
        for (let i = 0; i < this.selectedLayout.length; i++) {
          if (this.selectedLayout[i].selected) {
            if (x === this.selectedLayout[i].start.x && y === this.selectedLayout[i].start.y) {
              return {
                'borderTop': '3px solid #555555',
                'borderRight': '3px solid #555555',
                'borderLeft': '3px solid #555555'
              }
            } else if (x === this.selectedLayout[i].end.x && y === this.selectedLayout[i].end.y) {
              return {
                'borderRight': '3px solid #555555',
                'borderLeft': '3px solid #555555',
                'borderBottom': '3px solid #555555',
              }
            } else if (x === this.selectedLayout[i].start.x && (y > this.selectedLayout[i].start.y && y < this.selectedLayout[i].end.y)) {
              return {
                'borderRight': '3px solid #555555',
                'borderLeft': '3px solid #555555'
              }

            }
          } else {
            if (x === this.selectedLayout[i].start.x && y === this.selectedLayout[i].start.y) {
              return {
                'borderTop': '1px solid #555555',
                'borderRight': '1px solid #555555',
                'borderLeft': '1px solid #555555'
              }
            } else if (x === this.selectedLayout[i].end.x && y === this.selectedLayout[i].end.y) {
              return {
                'borderRight': '1px solid #555555',
                'borderLeft': '1px solid #555555',
                'borderBottom': '1px solid #555555',
              }
            } else if (x === this.selectedLayout[i].start.x && (y > this.selectedLayout[i].start.y && y < this.selectedLayout[i].end.y)) {
              return {
                'borderRight': '1px solid #555555',
                'borderLeft': '1px solid #555555'
              }
            }
          }
        }
        return;
      },
      async selectSemester (event) {
        console.log(event.target.value)
        await this.$store.dispatch('selectSemester', event.target.value)
        await this.$store.dispatch('setTotalTimeTable')
        this.$store.dispatch('initTimeTable')
        await this.$store.dispatch('resetLayout')
        await this.$store.dispatch("getMyTimeTable", {
          token: this.$session.get("token"),
          mobile: true,
        })
      },
      convert () {
        this.saveImageFlag = true;
        this.$store.dispatch("resetSelectedLayer").then((resolve)=>{
          if(resolve){
            let node = document.getElementById('table-wrapper');
            domtoimage.toJpeg(document.getElementById('table-wrapper'), { quality: 0.95, position: "absolute", width: "336px" })
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
      }
    },
    filters: {
      displaySemester (semester) {
        return semester.slice(0,4) + '년 ' + semester.slice(4,5) + '학기'
      }
    },
    mounted() {
    },
    updated() {
      console.log(this.displayLayout);
      console.log(this.selectedLayout);
    }
  }
</script>

<style scoped>
  .timetable {
    width: 100%;
  }

  .form-group {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
  }
  .semester-dropdown {
    width: 151px;
    height: 31px;
    margin-right: 9px;
    padding: 0 20px 0 10px ;
    font-family: NanumBarunGothic;
    font-size: 14px;
    border: 1px solid #d2dae2;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  .semester-dropdown::-ms-expand {
    display: none;
  }
  .dropdown-arrow {
    position: relative;
    right: 29px;
    background-color: #bfbfbf;
    width: 8px;
    height: 7px;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
  }

  .image-download {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 151px;
    height: 31px;
    text-align: center;
    cursor: pointer;
    font-size: 12px;
    color: #fdfdfd;
    background-color: #175c8e;
  }
  .download-img {
    position: relative;
    width: 18px;
    height: 18px;
    flex: none;
    padding-right: 23px;
  }

  .time-table-head {
    width: 100%;
    min-width: 360px;
    background-color: #f1f1f1;
    position: absolute;
    top: 107px;
    transition: box-shadow .3s;
  }

  .thead {
    background-color: #f1f1f1;
    font-size: 11px;
    font-weight: normal;
    line-height: 2.18;
    letter-spacing: normal;
    text-align: center;
    color: #555555;
    width: 16.667%;
    display: inline-block;
  }

  .first-thead-edge, tbody td:first-child {
    width: 7.499%
  }

  .second-thead-edge, tbody td:nth-child(2) {
    width: 9.166%
  }

  .time-table-body {
    padding-top: 24px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  table thead {
    position: sticky;
  }

  table thead tr {
    height: 20px;
  }

  table thead td {
    border-collapse: collapse;
  }

  tbody td {
    font-family: NanumSquare;
    font-size: 9px;
    font-weight: normal;
    line-height: 2.67;
    letter-spacing: normal;
    text-align: center;
    color: #252525;
    border-left: 1px solid #dadada;
    width: 16.667%;
  }

  tbody tr {
    border-right: 1px solid #dadada;
  }

  tbody tr:last-child td {
    border-bottom: 1px rgba(218, 218, 218, 0.3) solid;
  }

  .odd-body {
    border-top: 1px rgba(218, 218, 218, 0.3) solid;
  }

  .even-body {
    border-top: 1px #dadada solid;
  }

  .grid {
    top: 81px;
    z-index: 2;
    position: absolute;
    user-select: none;
    border-collapse: collapse;
    border: 0px;
  }

  .subject {
    position: absolute;
    text-align: left;
    padding: 0 3.5px;
    z-index: 1;
  }

  .subject-title {
    font-family: NotoSansCJKkr;
    font-size: 9px;
    font-weight: 500;
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
