<template>
  <div class="container">
    <img src="https://static.koreatech.in/assets/img/ic-404.png" alt="">
    <h1>페이지를 찾을 수 없습니다!</h1>
    <h2>
      지금 입력하신 주소의 페이지는 존재하지 않습니다.<br>
      주소를 다시 한번 확인해주세요.
    </h2>
    <button
      class="mobile__home__button"
      @click="goHome()">
      홈으로
    </button>
  </div>
</template>

<script>
  export default {
    name: '404',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted() {
      this.$store.dispatch("setNowRoutingPath", {
        path: "notfound"
      });
    },
    methods: {
      goHome(){
        this.$router.push("/");
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 80px);
    min-height: 800px;
    width: 100%;
  }
  
  img {
    height: 104px;
    margin-bottom: 42px;
  }

  h1 {
    font-size: 26px;
    font-weight: normal;
    line-height: 1.15;
    letter-spacing: normal;
    text-align: center;
    color: #f7941e;
    margin: 0;
    margin-bottom: 22px;
  }

  h2 {
    font-size: 18px;
    font-weight: normal;
    line-height: 1.56;
    letter-spacing: normal;
    text-align: center;
    color: #818181;
    margin: 0;
    margin-bottom: 60px;
  }

  button {
    width: 78px;
    height: 33px;
    font-size: 13px;
    font-weight: normal;
    line-height: 2.15;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    background-color: #175c8e;
    cursor: pointer;
  }

  @media (max-width: 576px) {
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 187px);
      min-height: 486px;
    }
    img {
      height: 69px;
      margin-bottom: 34px;
    }
    h1 {
      font-size: 22px;
      font-weight: normal;
      line-height: 1.18;
      letter-spacing: normal;
      text-align: center;
      color: #f7941e;
      margin: 0;
      margin-bottom: 20px;
    }

    h2 {
      font-size: 15px;
      font-weight: normal;
      line-height: 1.53;
      letter-spacing: normal;
      text-align: center;
      color: #818181;
      margin: 0;
      margin-bottom: 49px;
    }

    button {
      width: 73px;
      height: 33px;
      font-size: 13px;
      font-weight: normal;
      line-height: 1.15;
      letter-spacing: normal;
      text-align: center;
      color: #ffffff;
      background-color: #175c8e;
      border-radius: 0;
      margin-top: 0;
      cursor: pointer;
    }
  }
</style>
