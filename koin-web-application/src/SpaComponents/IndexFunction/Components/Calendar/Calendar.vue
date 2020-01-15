<template>
  <v-calendar
    class="calendar"
    is-expanded
    :attributes="attributes">
  </v-calendar>
</template>

<script>
import {store} from '../../../../stores/store';
import { mapGetters } from 'vuex';
export default {
  name: 'Calendar',
  data () {
    return {
      allSchedule: [],
      oneDayScheduleDate: [],
      oneDayScheduleContent: [],
      longTimeScheduleDate: [],
      longTimeScheduleContent: []
    }
  },
  methods: {
    getOneDaySchedules () {
      this.$store.dispatch('getOneDaySchedules', {
        year: 2018
      }).then(data => {
        this.oneDayScheduleContent = data[0];
        this.oneDayScheduleDate = data[1];
        for(let i = 0; i < this.oneDayScheduleContent.length; i++){
          this.allSchedule.push({
            id: `one-day-schedules-${i}`,
            description: `${this.oneDayScheduleDate[i].toLocaleDateString('ko')} : ${this.oneDayScheduleContent[i]}`,
            isComplete: this.oneDayScheduleDate[i].getTime() < new Date().getTime() ? true : false,
            dotColor: 'rgb(247, 148, 30)',
            contentColor: 'rgb(247, 148, 30)',
            date: this.oneDayScheduleDate[i]
          })
        }
      }), error => {
        console.log(error);
      }
    },
    getLongTimeSchedules () {
      this.$store.dispatch('getLongTimeSchedules', {
        year: 2018
      }).then(data => {
        this.longTimeScheduleContent = data[0];
        this.longTimeScheduleDate = data[1];
        for(let i = 0; i < this.longTimeScheduleContent.length; i++){
          this.allSchedule.push({
            id: `long-time-schedules-${i}`,
            description: `${this.longTimeScheduleDate[i].start.toLocaleDateString('ko')} ~ ${this.longTimeScheduleDate[i].end.toLocaleDateString('ko')} : ${this.longTimeScheduleContent[i]}`,
            isComplete: this.longTimeScheduleDate[i].end.getTime() < new Date().getTime() ? true : false,
            highlightColor: '#ffffff',
            height: '1.0rem',
            dotColor: 'transparent',
            contentColor: '#175c8e',
            date: this.longTimeScheduleDate[i]
          })
        }
      }), error => {
        console.log(error);
      }
    }
  },
  created () {
    this.getOneDaySchedules();
    this.getLongTimeSchedules();
    this.allSchedule.push({
      id: 'today',
      description: '오늘!',
      dotColor: 'transparent',
      highlightColor: 'transparent',
      // highlightColor: 'rgb(247, 148, 30)',
      contentColor: '#FF7F00',
      height: '1.6rem',
      fontWeight: '800',
      date: new Date()
    })
  },
  computed: {
    attributes () {
      return this.allSchedule.map(t => (
      {
        key: t.id,
        highlight: {
          backgroundColor: t.highlightColor,
          height: t.height,
          opacity: t.isComplete == true ? 0.3 : 1,
        },
        contentStyle: {
          color: t.contentColor,
          fontWeight: t.fontWeight,
          fontSize: t.fontSize
        },
        dot: {
          backgroundColor: t.dotColor,
          diameter: t.dotColor == 'transparent' ? '0px' : '5px',
          opacity: t.isComplete == true ? 0.3 : 1
        },
        popover: {
          label: t.description,
          hideIndicator: true
        },
        dates: t.date,
        customData: t
      }));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.calendar {
  background-color: #175c8e!important;
  color: #ffffff;
}

</style>
