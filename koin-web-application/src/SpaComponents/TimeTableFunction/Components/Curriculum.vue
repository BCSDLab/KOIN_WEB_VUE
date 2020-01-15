<template>
  <div>
    <div
      class="curri"
      @click="goUrl(curriculum.link)"
      :class="{'odd' : idx % 2 === 0}"
      v-for="(curriculum, idx) in curriculums"
      :key="idx">
      {{ curriculum.name }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Curriculum',
    data() {
      return {
        curriculums: [
          {
            name: "컴퓨터공학부",
            link: "https://cse.koreatech.ac.kr/page_izgw21"
          },
          {
            name: "기계공학부",
            link: "https://cms3.koreatech.ac.kr/me/795/subview.do"
          },
          {
            name: "메카트로닉스공학부",
            link: "https://cms3.koreatech.ac.kr/mechatronics/2746/subview.do"
          },
          {
            name: "전기ㆍ전자ㆍ통신공학부",
            link: "https://cms3.koreatech.ac.kr/ite/842/subview.do"
          },
          {
            name: "디자인ㆍ건축공학부",
            link: "https://cms3.koreatech.ac.kr/ide/1047/subview.do"
          },
          {
            name: "에너지신소재화학공학부",
            link: "https://cms3.koreatech.ac.kr/ace/992/subview.do"
          },
          {
            name: "산업경영학부",
            link: "https://www.koreatech.ac.kr/kor/sub03_01_08_07.do"
          },
          {
            name: "대학 입학 요람",
            link: "https://www.koreatech.ac.kr/kor/sub01_03_02.do"
          },
        ]
      }
    },
    methods: {
      goUrl: function(val) {
        if(val===""){
          alert("준비중입니다.");
          return;
        }
        window.open(val,'_blank');
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .curri {
    float: left;
    text-align: center;
    line-height: 40px;
    font-size: 12px;
    letter-spacing: -0.2px;
    color: #252525;
    width: 158px;
    height: 38px;
    border: #f7941e 1px solid;
    background-color: #ffffff;
    margin-bottom: 17px;
    cursor: pointer;
  }
  .odd {
    margin-right: 16px;
  }
</style>
