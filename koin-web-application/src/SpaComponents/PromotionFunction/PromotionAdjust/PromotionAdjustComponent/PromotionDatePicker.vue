<template>
  <div
    :class="{'promotion__date': true, 'promotion__date--active': isActive}">
    <div
      class="date__field"
      @click="toggleScheduler">
      <img
        class="date__icon"
        src="http://static.koreatech.in/assets/img/ic_calendar%403x.png"
        alt="scheduler">
      <div class="date__date">
        {{ date | formatDate }}
      </div>
    </div>
    <div class="date__content">
      <div
        class="date__scheduler">
        <div class="scheduler__header">
          <button
            class="scheduler__button scheduler__button--right"
            @click="goNextMonth">
            »
          </button>

          {{ currentYear }}년 {{ currentMonth }}월

          <button
            class="scheduler__button scheduler__button--left"
            @click="goPreviousMonth">
            &#171;
          </button>
        </div>

        <div class="scheduler__days">
          <div
            v-for="day in days"
            :key="day">
            {{ day }}
          </div>
        </div>

        <div class="scheduler__content">
          <div
            v-for="(date, index) in scheduler"
            :key="index"
            class="scheduler__date"
            :class="date.class"
            @click="selectDate(date)">
            {{ date.date }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    name: "PromotionDatePicker",
    model: {
      prop: 'date',
      event: 'change'
    },
    props: {
      date: {
        type: String,
        required: true
      },
      startDate: {
        type: String,
        default: ''
      },
      mobile: {
        type: Boolean,
        required: true
      }
    },
    data () {
      return {
        days: ['일', '월', '화', '수', '목', '금', '토'],
        isActive: false,
        //현재 나온 월, 일
        currentYear: this.date.slice(0, 4) - 0,
        currentMonth: this.date.slice(5, 7) - 0,
        selectedDate: this.date.slice(8, 10) - 0,
        selectedMonth: this.date.slice(5, 7) - 0,
        selectedYear: this.date.slice(0, 4) - 0,
        nowYear: '',
        nowMonth: '',
        nowDate: ''
      }
    },
    methods: {
      selectDate(dateValue) {
        if(!dateValue.class['scheduler__date--disabled']) {
          this.selectedDate = dateValue.date;
          this.selectedMonth = this.currentMonth;
          this.$emit('change', this.currentYear + '-'
            + ('0' + this.currentMonth).slice(-2) + '-'
            + ('0' + dateValue.date).slice(-2));
          this.toggleScheduler();
        }
      },
      goPreviousMonth () {
        if (this.currentMonth === this.nowMonth) {
          alert('저번달은 선택할 수 없습니다.');
        } else {
          if (this.currentMonth === 1) {
            this.currentYear--
            this.currentMonth = 12
          } else
            this.currentMonth--
        }
      },
      goNextMonth () {
        if (this.currentMonth === 12) {
          this.currentYear++
          this.currentMonth = 1
        } else
          this.currentMonth++
      },
      toggleScheduler () {
        if(!this.isActive) {
          this.$emit("activate");
        }

        this.isActive = !this.isActive;
        if(this.mobile) {
          this.darkenBackGround(this.isActive);
        }
      },
      ...mapMutations({
        darkenBackGround: "darkenBackGround"
      })
    },
    computed: {
      scheduler () {
        let dateValue = new Date(
          this.currentYear,
          this.currentMonth - 1,
          1, 9
        );
        let dayOfFirstDate = dateValue.getDay();
        let dateArray = [];
        let startDate = new Date(this.startDate)
        let startDateTime = startDate.getTime();
        startDate.setMonth(startDate.getMonth() + 1);
        let endDateTime = startDate.getTime();
        if(dayOfFirstDate !== 0) {
          dateValue.setDate(-dayOfFirstDate + 1);
        }

        for(let i = 0; i < 42; i++) {
          let displayDate = dateValue.getDate();
          let displayMonth = dateValue.getMonth() + 1;
          let displayTime = dateValue.getTime()
          if(this.startDate.length !== 0) {
            console.log(displayDate, this.selectedDate)
            console.log(displayMonth, this.selectedMonth)
          }
          dateArray.push({
            date: displayDate,
            class: {
              'scheduler__date--select': displayDate === this.selectedDate &&
                displayMonth === this.selectedMonth &&
                this.currentYear === this.selectedYear,
              'scheduler__date--disabled': displayMonth !== this.currentMonth ||
                (this.startDate.length !== 0 &&
                  (startDateTime > displayTime || endDateTime < displayTime))
            }
          })

          dateValue.setDate(++displayDate)
        }

        return dateArray;
      }
    },
    watch: {
      mobile (mobileFlag) {
        if(this.isActive) {
          this.darkenBackGround(mobileFlag);
        }
      }
    },
    filters: {
      formatDate (dateString) {
        return dateString.split('-').join('.')
      }
    },
    created () {
      let today = new Date();
      this.nowYear = today.getFullYear();
      this.nowMonth = today.getMonth() + 1;
      this.nowDate = today.getDate();
      console.log(this.date)
      console.log(this.selectedDate)
      console.log(this.selectedMonth)
    },
    destroyed () {
      this.darkenBackGround(false);
    }
  }
</script>

<style scoped>
  .promotion__date {
    width: 149px;
    height: 30px;
    margin: 0 7px;
    tab-index: 10;
  }
  .date__field {
    padding: 5px 14px;
    border: 1px solid #175c8e;
    width: 119px;
    height: 18px;
    display: flex;
    cursor: pointer;
  }


  .date__icon {
    width: 19px;
    height: 19px;
    overflow: hidden;
    margin-right: 21px;
    flex: none;
  }
  .date__date {
    color: #707070;
    line-height: 1.7;
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
  }
  .date__content {
    display: none;
  }
  .promotion__date.promotion__date--active > .date__content {
    display: flex;
  }

  .date__scheduler {
    position: relative;
    top: 4px;
    padding: 7px 13px 8px;
    width: 123px;
    background-color: #edf0f3;
    z-index: 2;
  }
  .scheduler__header {
    border-bottom: 1px solid #c9ced3;
    height: 21px;
    color: #131313;
    font-family: NanumSquareB;
    font-size: 11px;
    line-height: 1.09;
    position: relative;
  }

  .scheduler__button {
    width: 12px;
    padding: 0;
    border: 0;
    font-family: NanumSquareB;
    line-height: 0.7;
    position: absolute;
    background-color: transparent;
    cursor: pointer;
  }
  .scheduler__button.scheduler__button--right {
    right: 10px;
  }
  .scheduler__button.scheduler__button--left {
    left: 10px;
  }
  .scheduler__button:hover {
    color: #f7941e;
  }

  .scheduler__days {
    width: 124px;
    margin: 4px 0;
    color: #131313;
    font-family: NanumSquareR;
    font-size: 11px;
    line-height: 1.09;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-column-gap: 5px;
  }

  .scheduler__content {
    margin: 0 4px;
    display: grid;
    grid-template: repeat(6, 1fr) / repeat(7, 1fr);
    grid-column-gap: 5px;
    grid-row-gap: 3px;
    font-family: NanumSquareR;
    font-size: 10px;
    line-height: 0.9;
    text-align: center;
    color: #131313;
  }

  .scheduler__date:not(.scheduler__date--disabled) {
    cursor: pointer;
  }
  .scheduler__date:not(.scheduler__date--disabled):hover,
  .scheduler__date.scheduler__date--select {
    color: #f7941e;
  }
  .scheduler__date.scheduler__date--disabled {
    color: #c9ced3;
  }

  @media (max-width: 576px) {
    .date__content {
      z-index: 1;
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      justify-content: center;
      align-items: center;
    }

    .date__scheduler {
      top: 0;
      width: 259px;
      height: 213px;
      padding: 11px 16px 18px;
    }

    .scheduler__header {
      height: 34px;
      font-size: 20px;
    }
    .scheduler__button {
      width: 15px;
      height: 18px;
      font-size: 25px;
    }

    .scheduler__days {
      width: 100%;
      height: 22px;
      margin: 7px 0 1px;
      font-size: 20px;
      line-height: 0.8;
      grid-column-gap: 10px;
    }
    .scheduler__content {
      margin: 0;
      font-size: 20px;
      grid-column-gap: 10px;
      grid-row-gap: 7px;
    }
  }
</style>
