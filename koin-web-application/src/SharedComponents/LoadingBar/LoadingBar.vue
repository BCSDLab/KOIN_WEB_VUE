<template>
  <div class="loading">

    <circle2
      size="80px"
      stroke="10px"
      background="white"
      color="#175c8e">
    </circle2>
  </div>
</template>

<script>
  import { Circle2 } from 'vue-loading-spinner'

  export default {
    name: 'LoadingBar',
    data() {
      return {
        flag: false
      }
    },
    components: {
      Circle2
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loading{
    height: 800px;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    align-items: center;
    width: 100%;
  }
  @media (max-width: 576px) {
    .loading {
      height: 550px;
    }
  }
</style>
