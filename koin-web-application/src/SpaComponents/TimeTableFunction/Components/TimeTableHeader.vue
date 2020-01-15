<template>
  <div class="room-header">
    <div class="title">시간표</div>
  </div>
</template>

<script>
  export default {
    name: 'TimeTableHeader',
    data() {
      return {
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .room-header {
    height: 56px;
    border-bottom: 2px #175c8e solid;
    margin-bottom: 16px;
  }
  .title {
    text-align: left;
    float: left;
    font-family: NanumSquare, serif;
    font-size: 30px;
    font-weight: 800;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #175c8e;
    width: 100%;
    height: 32px;
    margin-bottom: 21px;
  }
</style>
