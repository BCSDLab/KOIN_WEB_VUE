<template>
  <div class="container">
    <!-- <div class="pc">
      <pc-time-table></pc-time-table>
    </div>
    <div class="mobile">
      <mobile-time-table></mobile-time-table>
    </div> -->
    <div v-if="width > 576">
      <pc-time-table></pc-time-table>
    </div>
    <div v-else>
      <mobile-time-table></mobile-time-table>
    </div>
  </div>
</template>

<script>
import PcTimeTable from './PcTimeTable.vue';
import MobileTimeTable from './MobileTimeTable.vue';

export default {
  name: 'TimeTable',
  components: {
    "pc-time-table": PcTimeTable,
    "mobile-time-table": MobileTimeTable
  },
  data () {
    return {
      width: 0,
    }
  },
  mounted () {
    this.$store.dispatch("getTimeTableVersionCheck").then(res => {
      if (window.localStorage.getItem('timetable_version') === null) {
        window.localStorage.setItem("timetable_version", res);
      }
      if (window.localStorage.getItem('timetable_version') != res) {
        alert('수강신청 편람이 업데이트 되었습니다. 유의하시길 바랍니다.');
        window.localStorage.setItem("timetable_version", res);
      }
    });
    this.$store.dispatch("setNowRoutingPath", {
      path: "timetable"
    });
    this.width = window.innerWidth;
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.width = window.innerWidth;
      })
    })
  },
  destroyed () {
    this.$store.dispatch("setNowRoutingPath", {
      path: ""
    });
  }
}
</script>

<style scoped>

.mobile {
  display: none;
}

@media (max-width: 576px) {
  .pc {
    display: none;
  }
  .mobile {
    display: block;
  }
}
</style>
