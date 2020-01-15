<template>
  <div class="container">
    <div v-if="faqList === null">
      <v-loading-bar></v-loading-bar>
    </div>
    <div
      v-if="faqList !== null"
      class="faq">
      <div class="title">FAQ</div>
      <div class="desc">
        아래 질문 외에 다른 궁금한 것이 있다면<br>
        직접 질문해주세요.
      </div>
      <div class="ask">
        <a
          target="_blank"
          href="https://docs.google.com/forms/d/1pWoxCLm5YqTlcdiXThvyGlNu_7t5hojxgjH5FA8eypo/edit?usp=drive_web">
          질문하기
        </a>
      </div>
      <div
        class="tab blue"
        v-for="faq in faqList"
        :key="faq.id">
        <input
          type="radio"
          name="tabs2"
          :id="'tab-one'+faq.id">
        <label
          :for="'tab-one'+faq.id"><span><b>Q.</b> {{ faq.question }}</span>
          <img
            class="under-arrow"
            src="https://static.koreatech.in/assets/img/bus_dropdown.png">
        </label>
        <div class="tab-content">
          <p><b class="a">A.</b> {{ faq.answer }}</p>
        </div>
      </div>
    </div>
    <div class="pagination">
      <button
        class="arrow"
        @click="clickPrevButton">이전으로
      </button>
      <span
        v-for="n in totalPageNum"
        :key="n.id">
        <button
          class="number"
          type="button"
          @click="clickPageNum(n)"
          :class="{ 'active': n === nowPageNum }">{{ n }}</button></span>
      <button
        class="arrow"
        @click="clickNextButton">다음으로
      </button>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'Faq',
    data() {
      return {
        nowPageNum: 1
      }
    },
    computed: {
      ...mapGetters({
        faqList: 'faqList',
        totalPageNum: 'totalPageNum'
      }),
    },
    methods: {
      callFaq: function (pageNum) {
        this.$store.dispatch('setFaqList', {
            pageNum: pageNum
          }
        )
      },
      clickPageNum: function (pageNum) {
        this.nowPageNum = pageNum;
        this.callFaq(pageNum);
      },
      clickPrevButton: function () {
        this.nowPageNum--;
        if (this.nowPageNum === 0) {
          alert("첫 페이지입니다.");
          this.nowPageNum++;
        }
        else {
          this.callFaq(this.nowPageNum);
        }
      },
      // 다음 버튼 누르기
      clickNextButton: function () {
        this.nowPageNum++;
        if (this.nowPageNum === this.totalPageNum + 1) {
          alert("마지막 페이지입니다.");
          this.nowPageNum--;
        }
        this.callFaq(this.nowPageNum);
      },
    },
    created() {
      this.callFaq(1);
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    border-top: #f7941e 5px solid;
    width:100%;
  }

  .faq {
    width: 1132px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 64px;
  }

  h2 {
    font-size: 30px;
    font-weight: 300;
    padding-bottom: 10%;
  }

  .title {
    font-size: 30px;
    letter-spacing: -1.5px;
    float: left;
    font-family: NanumSquare, serif;
    font-weight: 800;
    color: #175c8e;
    height: 59px;
    width: 100%;
    text-align: left;
  }

  .desc {
    float: left;
    text-align: left;
    font-weight: 300;
    letter-spacing: -1.2px;
    line-height: 1.25;
    font-size: 24px;
    height: 80px;
    margin-bottom: 12px;
  }

  .ask {
    float: right;
  }

  .ask a {
    display: block;
    position: relative;
    top: 15px;
    margin-top: 10px;
    background: #175c8e;
    padding: 9px 15px;
    letter-spacing: -0.6px;
    color: white;
    font-size: 12px;
    text-decoration: none;
  }
  .ask a:visited, .ask a:active {
    text-decoration: none;
  }
  .tab {
    position: relative;
    width: 1132px;
    color: black;
    overflow: hidden;
    margin-bottom: 15px;
    text-align: left;
    display: table;
    border-collapse: collapse;
  }

  input {
    height: 0;
    display: none;
    box-sizing: border-box;
    padding: 0;
    position: absolute;
    z-index: -1;
  }

  /* question */
  label {
    position: relative;
    display: block;
    padding: 5px;
    padding-left: 26px;
    line-height: 3;
    cursor: pointer;
    background: white;
    font-size: 15px;
    border: 1px solid #175c8e;
    color: #252525;
    letter-spacing: -0.8px;
    margin-left: 1px;
  }

  .tab-content {
    max-height: 0;
    overflow: hidden;
    background: #cbcbcb;
    -webkit-transition: max-height .35s;
    -o-transition: max-height .35s;
    transition: max-height .35s;
    color: #858585;
    margin-left: 1px;
    border: 1px solid #cbcbcb;
    border-top: none;
    margin-top: -1px;
    width: 1132px;
  }

  /* answer */
  .blue .tab-content {
    width: 1132px;
    background: #e4e4e4;
  }

  .tab-content p {
    margin: 21px 26px 27px;
    text-align: left;
    float: left;
    letter-spacing: -0.8px;
  }
  .a {
    display: block;
    float: left;
    width: 17px;
    height: 30px;
  }
  /* :checked */
  input:checked ~ .tab-content {
    max-height: 10em;
  }

  /* Icon */
  label::after {
    position: absolute;
    right: 0;
    top: 0;
    display: block;
    width: 3em;
    height: 3em;
    line-height: 3;
    text-align: center;
    -webkit-transition: all .35s;
    -o-transition: all .35s;
    transition: all .35s;
  }

  input[type=checkbox] + label::after {
    content: "+";
  }

  input[type=radio] + label::after {

  }

  input[type=checkbox]:checked + label::after {
    transform: rotate(315deg);
  }

  input[type=radio]:checked + label::after {
    transform: rotateX(180deg);
  }

  .pagination {
    margin-top: 35px;
    margin-bottom: 40px;
    background: #ffffff;
    color: #858585;
  }

  .pagination .number {
    border-radius: 0;
    padding-top: 7px;
    padding-bottom: 7px;
    padding-left: 12px;
    padding-right: 12px;
    margin-left: 1px;
    margin-right: 1px;
    border: 1px #edf0f3 solid;
    font-size: 13px;
    color: #858585;
    cursor: pointer;
    background-color: #ffffff;
  }

  .pagination .arrow {
    border-radius: 0;
    padding-top: 7px;
    padding-bottom: 7px;
    padding-left: 14px;
    padding-right: 14px;
    margin-left: 6px;
    margin-right: 6px;
    background: #ffffff;
    border: 1px #edf0f3 solid;
    color: #858585;
    font-size: 13px;
    letter-spacing: -0.7px;
    cursor: pointer;
  }

  .pagination .number:hover, .pagination .arrow:hover {
    background: #175c8e;
    color: white;
  }

  .pagination .active {
    background: #175c8e;
    color: white;
  }

  .under-arrow{
    width: 15px;
    float: right;
    margin-right: 22px;
    margin-top: 17px;
  }

  @media (max-width: 576px) {
    .container {
      border-top: none;
    }
    .faq {
      width: calc(100% - 32px);
      min-width: 300px;
      margin: 30px auto auto auto;
    }

    .title {
      height: 22px;
      font-size: 20px;
      margin-bottom: 20px;
      display: none;
    }

    .desc {
      width: 100%;
      height: 45px;
      font-size: 18px;
      line-height: 1.39;
      letter-spacing: normal;
      margin-bottom: 0;
    }

    .ask a {
      width: 73px;
      height: 15px;
      font-size: 13px;
      letter-spacing: normal;
      padding: 9px 0;
      top: 0;
      margin-top: 0;
      margin-bottom: 20px;
    }

    .tab {
      width: 100%;
      display: block;
    }

    .tab label {
      color: #175c8e;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 16px;
      line-height: 1.33;
    }

    .tab label b {
      margin-right: 3px;
    }

    .under-arrow {
      margin: 0 0 0 13px;
      width: 17px;
    }

    .blue .tab-content {
      width: 100%;
      background-color: #efefef;
    }

    .tab-content p {
      margin: 20px 16.5px;
      line-height: 1.38;
      font-size: 13px;
      letter-spacing: normal;
    }

    .tab-content p b {
      height: auto;
    }

    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 36px;
      margin-bottom: 70px;
    }

    .pagination .arrow {
      width: 73px;
      height: 30px;
      line-height: 1.15;
    }
    .pagination .number {
      width: 30px;
      height: 30px;
      line-height: 1.15;
      margin: 0 2px;
    }
    .pagination .number:hover, .pagination .arrow:hover {
      background: white;
      color: #858585;
    }
    .pagination .active:hover {
      background-color: #175c8e;
      color: white;
    }
  }

</style>
