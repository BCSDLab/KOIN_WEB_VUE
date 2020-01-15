<template>
  <div class="copyright">
    Copyright
    <a
      class="team"
      href="http://kap.koreatech.in/"
      target="_blank">TeamKAP</a> All rights reserved.
  </div>
</template>

<script>
  export default {
    name: 'Copyright',
    data() {
      return {

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .copyright {
    padding-left: 10%;
    padding-right: 10%;
    padding-bottom: 1%;
    padding-top: 1%;
    width: 80%;
    background-color: #020b10b8;
    color: white;
    display: table;
    font-size: 13px;
    border: none;
  }

  a {
    color: white;
    cursor: hand;
  }
  a:hover, a:visited, a:active, a:link {
    text-decoration: none;
  }

  .team {
    font-weight: 600;
  }
</style>
