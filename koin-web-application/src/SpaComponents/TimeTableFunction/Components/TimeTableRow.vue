<template functional>
  <div>
    <!-- timetable code 값 -->
    <div
      :style="{width: props.colWidth[0] + 'px'}"
      :class="{'table-body-content': true, 'code': true, 'cell-width-0': !props.myFlag, 'my-cell-width-0': props.myFlag}">
      {{ props.subject.code | valueSpaceCheck }}
    </div>
    <!-- timetable 과목명 값 -->
    <div
      :style="{width: props.colWidth[1] + 'px'}"
      :class="{'table-body-content': true, 'subject': true, 'cell-width-1': !props.myFlag, 'my-cell-width-1': props.myFlag}">
      {{ props.subject.name | valueSpaceCheck }}
    </div>
    <!-- timetable 분반 값 -->
    <div
      :style="{width: props.colWidth[2] + 'px'}"
      :class="{'table-body-content': true, 'class': true, 'cell-width-2': !props.myFlag, 'my-cell-width-2': props.myFlag}">
      {{ props.subject.lecture_class | valueSpaceCheck }}
    </div>
    <!-- timetable 교수 값 -->
    <div
      :style="{width: props.colWidth[3] + 'px'}"
      :class="{'table-body-content': true, 'professor': true, 'cell-width-3': !props.myFlag, 'my-cell-width-3': props.myFlag}">
      {{ props.subject.professor | valueSpaceCheck }}
    </div>
    <!-- timetable 대상 값 -->
    <div
      :style="{width: props.colWidth[4] + 'px'}"
      :class="{'table-body-content': true, 'target': true, 'cell-width-4': !props.myFlag, 'my-cell-width-4': props.myFlag}">
      {{ props.subject.professor | valueSpaceCheck }}
    </div>
    <!-- timetable 학점 값 -->
    <div
      :style="{width: props.colWidth[5] + 'px'}"
      :class="{'table-body-content': true, 'grade': true, 'cell-width-5': !props.myFlag, 'my-cell-width-5': props.myFlag}">
      {{ props.subject.grades | valueSpaceCheck }}
    </div>
    <!-- timetable 비고 값 -->
    <div
      :style="{width: props.colWidth[6] + 'px'}"
      :class="{'table-body-content': true, 'etc': true, 'cell-width-6': !props.myFlag, 'my-cell-width-6': props.myFlag}">
      {{ props.subject | resultAboutRemark | valueSpaceCheck }}
    </div>
    <!-- timetable 정원 값 -->
    <div
      :style="{width: props.colWidth[7] + 'px'}"
      :class="{'table-body-content': true, 'full': true, 'cell-width-7': !props.myFlag, 'my-cell-width-7': props.myFlag}">
      {{ props.subject.regular_number | valueSpaceCheck }}
    </div>
    <!-- timetable 설계 값 -->
    <div
      :style="{width: props.colWidth[8] + 'px'}"
      :class="{'table-body-content': true, 'design': true, 'cell-width-8': !props.myFlag, 'my-cell-width-8': props.myFlag}">
      {{ props.subject.design_score | valueSpaceCheck }}
    </div>
    <!-- timetable 개설학부 값 -->
    <div
      :style="{width: props.colWidth[9] + 'px'}"
      :class="{'table-body-content': true, 'major': true, 'cell-width-9': !props.myFlag, 'my-cell-width-9': props.myFlag}">
      {{ props.subject.department | valueSpaceCheck }}
    </div>
    <!-- timetable button -->
    <div />
  </div>
</template>

<script>
  export default {
    name: 'TimeTableRow',
    data() {
      return {}
    },
    props: {
      subject: {
        type: Object,
        default () {
          return {}
        }
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
    filters: {
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
    scrollbar-width: none;
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
