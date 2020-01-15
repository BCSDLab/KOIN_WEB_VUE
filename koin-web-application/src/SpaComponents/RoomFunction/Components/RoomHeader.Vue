<template>
  <div class="room-header">
    <div class="title">복덕방</div>
  </div>
</template>

<script>
  export default {
    name: 'RoomHeader',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .room-header {
    height: 56px;
    border-bottom: 2px #175c8e solid;
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
