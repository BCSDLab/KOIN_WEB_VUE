<template>
  <div
    class="table"
    :class="{'my-table-total': myTimeTableflag}">
    <span v-show="false">{{ movedX - clickedPositionX }}</span>
    <!--테이블 상단부-->
    <div
      class="table-row-top"
      :class=" {'my-table-row-top': myTimeTableflag } "
      :style="{width: totalTableWidth+ 'px'}"
      @mousemove="doDrag($event)">
      <div
        :key="header.id"
        :class="{
          'table-header': index !==10,
          'surplus-border cell-width-10': index === 10 && !myTimeTableflag,
          'code cell-width-0': index===0 && !myTimeTableflag,
          'subject cell-width-1': index===1 && !myTimeTableflag,
          'class cell-width-2': index===2 && !myTimeTableflag,
          'professor cell-width-3': index===3 && !myTimeTableflag,
          'target cell-width-4': index===4 && !myTimeTableflag,
          'grade cell-width-5': index===5 && !myTimeTableflag,
          'etc cell-width-6': index===6 && !myTimeTableflag,
          'full cell-width-7': index===7 && !myTimeTableflag,
          'design cell-width-8': index===8 && !myTimeTableflag,
          'major cell-width-9': index===9 && !myTimeTableflag,

          'code my-cell-width-0': index===0 && myTimeTableflag,
          'subject my-cell-width-1': index===1 && myTimeTableflag,
          'class my-cell-width-2': index===2 && myTimeTableflag,
          'professor my-cell-width-3': index===3 && myTimeTableflag,
          'target my-cell-width-4': index===4 && myTimeTableflag,
          'grade my-cell-width-5': index===5 && myTimeTableflag,
          'etc my-cell-width-6': index===6 && myTimeTableflag,
          'full my-cell-width-7': index===7 && myTimeTableflag,
          'design my-cell-width-8': index===8 && myTimeTableflag,
          'major my-cell-width-9': index===9 && myTimeTableflag
        }"
        v-for="(header, index) in tableHeader">
        <div
          class="header-sort"
          @click="sortColumn(index)">
          <span
            :class="{'tx-center': index===2}"
            class="header">{{ header }}</span>
          <!--정렬버튼-->
          <span
            v-if="index !== tableHeader.length-1">
            <span v-if="tableSort[index]">
              <img
                class="arrow"
                src="http://static.koreatech.in/assets/img/ic-arrow-down.png">
            </span>
            <span v-if="!tableSort[index]">
              <img
                class="arrow"
                src="http://static.koreatech.in/assets/img/ic-arrow-up.png"></span>
          </span>
        </div>
        <!--사이즈 조절-->
        <div
          class="resize-col"
          v-if="index !== 10"
          @mousedown.capture="startDrag($event, index)">
        </div>
      </div>
    </div>
    <!--테이블 몸통부-->
    <div
      class="table-body"
      id="table-body"
      :class="{'my-table': myTimeTableflag}"
      :style="{width: totalTableWidth+ 'px'}"
      @scroll="scrollEvent">
      <div
        :key="subject.id"
        class="table-row-body"
        :class="{'odd-bg': index%2 === 1, 'selected': index === nowSubjectIndex}"
        v-for="( subject, index ) in timeTableData"
        v-if="index < displayIndex"
        @keyup.up="keyboardControl"
        @click="selectSubject(subject, index)">
        <row
          :myFlag="myTimeTableflag"
          :colWidth="colWidth"
          :subject="subject"
          :index="index"></row>
        <!-- <div
					:key="data.id"
					:style="{width: colWidth[idx] + 'px'}"
					class="table-body-content"
					:class="{'code': idx===0, 'subject': idx===1, 'class': idx===2, 'professor': idx===3, 'target': idx===4, 'grade': idx===5, 'etc': idx===6, 'full': idx===7, 'design': idx===8, 'major': idx===9 }"
					v-for="(data, idx) in extractTabledata(subject)">
					{{ data === " " || data === "" ? "미배정" : data }}
				</div> -->
        <div
          class="table-body-content last-content"
          @click="addSubject(subject, index)"
          v-if="!myTimeTableflag">
          <img
            class="add-img"
            src="http://static.koreatech.in/assets/img/ic-add.png"></div>
        <div
          class="table-body-content last-content"
          @click="removeSubject(index, subject.id)"
          v-if="myTimeTableflag">
          <img
            class="add-img"
            src="http://static.koreatech.in/assets/img/ic-delete.png"></div>
      </div>
    </div>
  </div>
</template>

<script>
    import TimeTableRow from './TimeTableRow'
    import {mapGetters} from 'vuex';

    export default {
        name: 'DetailTimeTable',
        props: {
            'time-table-data': null,
            'changeMajorCount': null,
            'myTimeTableflag': {
              type: Boolean,
              default: false,
            }
        },
        components: {
            row: TimeTableRow
        },
        computed: {
            ...mapGetters({
                myTimeTable: 'myTimeTable',
                selectedSemester: 'selectedSemester'
            })
        },
        data() {
            return {
                displayIndex: 20,
                nowSubjectIndex: -1,
                tableHeader: [
                    "코드", "과목명", "분반", "담당교수", "대상", "학점", "비고", "정원", "설계", "개설학부", ""
                ],

                //true이면 오름차순
                tableSort: [true, true, true, true, true, true, true, true, true, true],
                //resize에 필요한 것들
                colWidth: [63, 141, 54, 67, 53, 53, 53, 53, 53, 79, 6],
                totalTableWidth: 0,
                dragging: false,
                clickedPositionX: 0,
                movedX: 0,
                movedIndex: 0,
                widthBeforeMove: 0,

                //text align
                textAligns: ["left", "left", "center", "left", "left", "center", "center", "center", "center", "left", "left"],
                cellClassArray: []

            }
        },
        watch: {
            changeMajorCount: function () {
                this.tableSort = [true, true, true, true, true, true, true, true, true, true];
                this.nowSubjectIndex = -1;
            }
        },
        methods: {
            keyboardControl: function (e) {
                event.stopPropagation();
                if (e.keyCode === 38 && !this.myTimeTableflag) {
                    this.nowSubjectIndex = this.nowSubjectIndex > 0 ? --this.nowSubjectIndex : 0;
                    e.preventDefault();
                    this.$store.dispatch("setSelectTimeTable", {
                        'subject': this.timeTableData[this.nowSubjectIndex]
                    })

                } else if (e.keyCode === 40 && !this.myTimeTableflag) {
                    e.preventDefault();
                    this.nowSubjectIndex++;
                    if (this.nowSubjectIndex === this.timeTableData.length) {
                        this.nowSubjectIndex--;
                        return;
                    }

                    this.$store.dispatch("setSelectTimeTable", {
                        'subject': this.timeTableData[this.nowSubjectIndex]
                    })
                }
            },
            // 컬럼 정렬
            sortColumn: function (index) {
                this.tableSort[index] = !this.tableSort[index];
                this.$store.dispatch("sortTimeTableColumn", {
                    'columnIndex': index,
                    'flag': this.tableSort[index],
                    'myTimeTableFlag': this.myTimeTableflag
                })
            },
            extractTabledata: function (rawData) {
                //val[8]: 영강여부
                //val[10]: e러닝
                //val[9]: 설계
                //console.log(rawData)
                let remarks = " - ";

                if (rawData.is_elearning === "Y")
                    remarks = "e러닝";
                if (rawData.is_english === 'Y')
                    remarks = "영강";
                if (rawData.is_english === 'Y' && rawData.is_elearning === "Y")
                    remarks = "e+영";


                let extracted = [rawData.code, rawData.name, rawData.lecture_class, rawData.professor, rawData.target, rawData.grades, remarks, rawData.regular_number, rawData.design_score, rawData.department]

                return extracted;
            },
            selectSubject: function (subject, index) {
                if (!this.myTimeTableflag) {
                    if (index === this.nowSubjectIndex) {
                        this.nowSubjectIndex = -1;
                        this.$store.dispatch("setSelectTimeTable", {
                            'subject': null
                        })
                    } else {
                        this.nowSubjectIndex = index;
                        this.$store.dispatch("setSelectTimeTable", {
                            'subject': subject
                        })
                    }
                }
            },
            addSubject: function (subject, index) {

                this.nowSubjectIndex = -1;
                event.stopPropagation();
                this.$store.dispatch("addMyTimeTable", {
                    'token': this.$session.get("token"),
                    'subject': subject
                }).then((res) => {

                    if (res.status === 404 ) {
                        alert("데이터가 존재하지 않습니다.");
                    } else if (res.status === 401) {
                        alert("권한이 없습니다.");
                    }
                })
            },
            removeSubject: function (index, id) {
                // 여기서 index는 아래표의 index
                event.stopPropagation();
                this.$store.dispatch("removeMyTimeTable", {
                    'token': this.$session.get('token'),
                    'index': index,
                    'id': id,
                })
            },

            startDrag(event, index) {

                this.dragging = true;
                this.clickedPositionX = event.pageX;
                this.movedIndex = index;
                this.widthBeforeMove = this.colWidth[this.movedIndex];
            },
            stopDrag() {
                this.dragging = false;
                this.x = this.y = 'no';
            },
            doDrag(event) {
                event.stopPropagation();

                if (this.dragging) {
                    this.movedX = event.pageX;
                    this.colWidth[this.movedIndex] = this.widthBeforeMove + (this.movedX - this.clickedPositionX);
                    let totalWidth = 0;
                    for (let i = 0; i < this.colWidth.length; i++) {
                        totalWidth += this.colWidth[i];
                        totalWidth += 9;
                    }
                    totalWidth -= 5;
                    if (totalWidth < 766) totalWidth = 766;
                    this.totalTableWidth = totalWidth;

                    let all = document.getElementsByClassName((this.myTimeTableflag ? 'my-' : '') + 'cell-width-' + this.movedIndex)
                    for (let i = 0; i < all.length; i++) {
                        all[i].style.width = this.widthBeforeMove + (this.movedX - this.clickedPositionX) + 'px';
                    }


                }
            },
            scrollEvent(event) {
                if(this.displayIndex <= this.timeTableData.length ){
                    this.displayIndex +=40;
                    }
            },
            setSemester: function () {
                let date = new Date();
                if (date.getMonth() + 1 <= 6) {
                    return `${date.getFullYear()}1`;
                } else if (date.getMonth() + 1 >= 7 && date.getMonth() + 1 <= 12) {
                    return `${date.getFullYear()}2`;
                }
            }
        }
        ,
        created() {
            window.addEventListener("keyup", this.keyboardControl);
            window.addEventListener("keydown", function (e) {
                // space and arrow keys
                if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                    e.preventDefault();
                }
            }, false);

        },
        mounted() {
            window.addEventListener('mouseup', this.stopDrag);
            //this.displayIndex = this.timeTableData.length;

            //this.displayIndex = this.timeTableData.length
            this.totalTableWidth = 766;
        }

    }
</script>

<style>
	.cell-width-0, .my-cell-width-0  {
		width: 63px;
	}

	.cell-width-1, .my-cell-width-1   {
		width: 141px;
	}

	.cell-width-2, .my-cell-width-2   {
		width: 54px;
	}

	.cell-width-3, .my-cell-width-3   {
		width: 67px;
	}

	.cell-width-4, .my-cell-width-4   {
		width: 53px;
	}

	.cell-width-5, .my-cell-width-5   {
		width: 53px;
	}

	.cell-width-6, .my-cell-width-6   {
		width: 53px;
	}

	.cell-width-7, .my-cell-width-7   {
		width: 53px;
	}

	.cell-width-8, .my-cell-width-8   {
		width: 53px;
	}

	.cell-width-9, .my-cell-width-9   {
		width: 79px;
	}

	.cell-width-10, .my-cell-width-10   {
		width: 6px;
	}

	/*tbody 부분의 하나의 행내부의 내용(td)*/
	.table-body-content {
		padding-left: 10px;
		line-height: 34px;
		border-right: #d2dae2 1px solid;
		float: left;
		word-break: break-all;
		overflow-x: scroll;
		white-space: nowrap;
		cursor: pointer;
	}

</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.tx-center {
		text-align: center;
	}

	.table {
		width: 766px;
		height: 457px;
		font-size: 13px;
		text-align: left;
		word-break: break-all;
		border-bottom: #858585 1px solid;
		overflow-x: scroll;
		overflow-y: hidden;
		white-space: nowrap;
	}

	/*thead부분 row*/
	.table-row-top {
		width: 766px;
		height: 37px;
		line-height: 37px;
		border-bottom: #858585 1px solid;
		background: #f6f6f6;
	}

  .my-table-row-top {
    width: 766px;
    height: 37px;
    line-height: 37px;
    border-bottom: #858585 1px solid;
    background: #f6f6f6;
  }

	/*thead th에 해당하는 부분*/
	.table-header {
		padding-left: 10px;
		border-collapse: collapse;
		border-right: #d2dae2 1px solid;
		float: left;
		word-break: break-all;
		overflow-x: scroll;
		white-space: nowrap;
		height: 37px;
        color: #555555;

	}

	.table-header:hover {
		background: #e9e9e9;
	}

	.table-header:hover .arrow {
		display: inline;
	}

	/*tbody 부분 전체*/
	.table-body {
		min-width: 766px;
		height: 420px;
		overflow-y: scroll;
		white-space: nowrap;
		overflow-x: hidden;
	}

	/*tbody 부분의 하나의 행*/
	.table-row-body {
		height: 34px;
		line-height: 34px;
        color: #858585;
	}

	/*tbody 부분의 하나의 행내부의 내용(td)*/
	.table-body-content {
		padding-left: 10px;
		line-height: 34px;
		border-right: #d2dae2 1px solid;
		float: left;
		word-break: break-all;
		overflow-x: scroll;
		white-space: nowrap;
		cursor: pointer;
	}

	/* 나의 시간표인 경우의 tbody height */
	.my-table {
		height: 138px;
	}

	/* 나의 시간표인 경우의 전체 height */
	.my-table-total {
		height: 176px;
	}

	/*각 칸 width*/
	.code {
		padding-left: 10px;
	}

	.subject {
	}

	.class {
		padding-left: 0;
		text-align: center;
	}

	.professor {
		padding-left: 8px;
	}

	.target {

	}

	.grade {
		padding-left: 0;
		text-align: center;
	}

	.etc {
		padding-left: 0;
		text-align: center;
	}

	.full {
		padding-left: 0;
		text-align: center;
	}

	.design {
		padding-left: 0;
		text-align: center;
	}

	.major {

	}

	.last-content {
		width: 22px;
		height: 34px;
		text-align: center;
		border-right: none;
	}

	.add-img {
		cursor: pointer;
		position: relative;
		top: 6px;
		right: 1px;
		width: 22px;
	}

	.resize-col {
		top: 0;
		right: 0;
		width: 2px;
		height: 34px;
		position: relative;
		cursor: col-resize;
		background: transparent;
		userSelect: none;
		float: right;
		z-index: 2;
	}

	.arrow {
		display: none;
		float: right;
		width: 24px;
		border: none;
		position: relative;
		top: 5px;
		cursor: pointer;
		margin-left: -6px;
	}

	/*thead의 마지막 부분의 행*/
	.surplus-border {
		border-right: none;
		user-select: none;
	}

	.odd-bg {
		background: #f7f7f7;
	}

	.selected {
		background: #dbf3ff;
	}

	.table-row-body:hover {
		background: #dbf3ff61;
	}

	.selected:hover {
		background: #dbf3ff;
	}

	.text-center {
		text-align: center;
		padding: 0;
	}

	.header-sort {
		display: inline-block;
		*display: inline;
		zoom: 1;
		cursor: pointer;
		float: middle;
	}

	/*스크롤 감추기*/
	* {
		-ms-overflow-style: none;
    scrollbar-width: none;
	}

	::-webkit-scrollbar {
		display: none;
	}
</style>
