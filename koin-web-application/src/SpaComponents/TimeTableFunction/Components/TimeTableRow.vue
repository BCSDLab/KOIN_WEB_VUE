<script>
  export default {
    name: 'TimeTableRow',
    data() {
      return {}
    },
    render: function (createElement) {

      return createElement(
        'div',   // 태그 이름

        [
          // timetable code 값
          createElement('div', {
            class: {
              'table-body-content': true,
              'code': true,
              'cell-width-0': !this.myFlag,
              'my-cell-width-0': this.myFlag
            },
            style: {
              width: this.colWidth[0] + 'px'
            }
          }, this.valueSpaceCheck(this.subject.code)),

          // timetable 과목명 값
          createElement('div', {
            class: {
              'table-body-content': true,
              'subject': true,
              'cell-width-1': !this.myFlag,
              'my-cell-width-1': this.myFlag
            },
            style: {
              width: this.colWidth[1]+ 'px'
            }
          }, this.valueSpaceCheck(this.subject.name)),

          // timetable 분반 값
          createElement('div', {
            class: {
              'table-body-content': true,
              'class': true,
              'cell-width-2': !this.myFlag,
              'my-cell-width-2': this.myFlag
            },
            style: {
              width: this.colWidth[2]+ 'px'
            }
          }, this.valueSpaceCheck(this.subject.lecture_class)),

          // timetable 교수 값
          createElement('div', {
            class: {
              'table-body-content': true,
              'professor': true,
              'cell-width-3': !this.myFlag,
              'my-cell-width-3': this.myFlag
            },
            style: {
              width: this.colWidth[3]+ 'px'
            }
          }, this.valueSpaceCheck(this.subject.professor)),

          // timetable 대상 값
          createElement('div', {
            class: {
              'table-body-content': true,
              'target': true,
              'cell-width-4': !this.myFlag,
              'my-cell-width-4': this.myFlag
            },
            style: {
              width: this.colWidth[4]+ 'px'
            }
          }, this.valueSpaceCheck(this.subject.target)),

          // timetable 학점 값
          createElement('div', {
            class: {
              'table-body-content': true,
              'grade': true,
              'cell-width-5': !this.myFlag,
              'my-cell-width-5': this.myFlag
            },
            style: {
              width: this.colWidth[5]+ 'px'
            }

          }, this.valueSpaceCheck(this.subject.grades)),

          // timetable 비고 값
          createElement('div', {
            class: {
              'table-body-content': true,
              'etc': true,
              'cell-width-6': !this.myFlag,
              'my-cell-width-6': this.myFlag
            },
            style: {
              width: this.colWidth[6]+ 'px'
            }

          }, this.valueSpaceCheck(this.resultAboutRemark(this.subject))),

          // timetable 정원 값
          createElement('div', {
            class: {
              'table-body-content': true,
              'full': true,
              'cell-width-7': !this.myFlag,
              'my-cell-width-7': this.myFlag
            },
            style: {
              width: this.colWidth[7]+ 'px'
            }
          }, this.valueSpaceCheck(this.subject.regular_number)),

          // timetable 설계 값
          createElement('div', {
            class: {
              'table-body-content': true,
              'design': true,
              'cell-width-8': !this.myFlag,
              'my-cell-width-8': this.myFlag
            },
            style: {
              width: this.colWidth[8]+ 'px'
            }
          }, this.valueSpaceCheck(this.subject.design_score)),

          // timetable 개설학부 값
          createElement('div', {
            class: {
              'table-body-content': true,
              'major': true,
              'cell-width-9': !this.myFlag,
              'my-cell-width-9': this.myFlag
            },
            style: {
              width: this.colWidth[9]+ 'px'
            }

          }, this.valueSpaceCheck(this.subject.department)),


          // timetable buttons
          createElement('div', {}),
        ]
      )
    },
    props: {
      subject: {
        type: Object,
        default: {}
      },
      index: {
        type: Number,
        default: 0
      },
      row: {
        type: Boolean,
        default: false
      },
      myFlag: {
        type: Boolean,
        default: false
      },
      colWidth: {
        type: Array,
        default: function () { return [0,0,0,0,0, 0,0,0,0,0] }
      }
    },
    methods: {
      valueSpaceCheck: function (str) {
        return str === " " || str.trim() === "" ? "미배정" : str
      },
      resultAboutRemark: function (rawData) {
        let remarks = " - ";
        if (rawData.is_elearning === "Y")
          remarks = "e러닝";
        if (rawData.is_english === 'Y')
          remarks = "영강";
        if (rawData.is_english === 'Y' && rawData.is_elearning === "Y")
          remarks = "e+영";

        return remarks;
      }
    },
    created() {
    }
  }
</script>

<style scoped>
  /*스크롤 감추기*/
  * {
    -ms-overflow-style: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  div {
    float: left;
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
</style>
