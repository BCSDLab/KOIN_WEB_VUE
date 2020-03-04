<template>
  <div class="index__diet__container">
    <div
      class="diet__title"
      @click="clickType()">
      오늘의 식단
    </div>
    <!-- 식단 카드 -->
    <div class="diet__card">
      <div class="diet__category">

        <!-- 식단 종류 선택 행 -->
        <div
          class="diet__list"
          v-for="(list, index) in allDietList"
          :key="list.id"
          @click="selectDietList(index)"
          :class="{diet__list__selected : (index===selected)}">
          <span>
            {{ list }}
          </span>
        </div>

        <!-- 아침/점심/저녁 시간에 따라 바뀜 -->
        <div class="type">
          <span v-if="(type===0 && (today.getHours() < 9 ))">아침</span>
          <span v-else-if="(type===0 && (today.getHours() >= 19 ))">내일 아침</span>
          <span v-else-if="type===1">점심</span>
          <span v-else>저녁</span>
        </div>
      </div>

      <div class="menu__container">
        <!-- 메뉴 리스트 -->
        <div
          class="menu"
          v-if="selected===0"
          v-for="menus in koreanFood[type]"
          :key="menus.id"
          :class="{little__letter : (koreanFood[type].length > 8)}">
          {{ menus }}
        </div>

        <div
          class="menu"
          v-if="selected===1"
          v-for="menus in oneDishFood[type]"
          :key="menus.id"
          :class="{little__letter : (oneDishFood[type].length > 8)}">
          {{ menus }}
        </div>

        <div
          class="menu"
          v-if="selected===2"
          v-for="menus in westernFood[type]"
          :key="menus.id"
          :class="{little__letter : (westernFood[type].length > 8)}">
          {{ menus }}
        </div>

        <div
          class="menu"
          v-if="selected===3"
          v-for="menus in specialFood[type]"
          :key="menus.id"
          :class="{little__letter : (specialFood[type].length > 8)}">
          {{ menus }}
        </div>
        <div
          v-if="!this[dietType[selected]].length"
          class="no__menus">
          오늘의 식단 정보가 없습니다!
        </div>

      </div>
      <div
        class="show-more"
        @click="$router.push('/diet')">
        <span>더보기</span>
        <img src="http://static.koreatech.in/assets/img/ic-more.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: "IndexDiet",
    data: function (){
      return {
        allDietList: ['한식','일품식','양식','특식'],
        dietType: ['koreanFood','westernFood','specialFood','oneDishFood'],
        selected: 0,
        today: new Date(),
        thisYear: new Date().getFullYear(),
        //getMonth return '1월' => '0'
        thisMonth: new Date().getMonth() + 1,
        thisDay: new Date().getDate(),
        type: 0,
        // 0 = 아침, 1 = 점심, 2 = 저녁
        koreanFood: [],
        westernFood: [],
        specialFood: [],
        oneDishFood: [],
      }
    },
    computed: {
      ...mapGetters({
        month: 'month',
        date: 'date',
      })
    },
    methods: {
      ...mapGetters({
        diets: 'diets',
      }),
      selectDietList(index){
        this.selected = index;
      },
      apiToday: function () {
        return (this.thisYear - 2000) * 10000 + this.thisMonth * 100 + this.thisDay;
      },
      callDiet: function (apiToday) {
        this.$store.dispatch('setDiets', {
          apiToday: apiToday,
        }).then((flag) => {
          if (flag) {
            for(let i = 0; i < 3; i++){

              for(let j = 0; j < this.diets()[i].length; j++) {
                if (this.diets()[i][j].place === '한식') {
                  this.koreanFood.push(this.diets()[i][j].menu)
                }
                if (this.diets()[i][j].place === '일품식') {
                  this.oneDishFood.push(this.diets()[i][j].menu)
                }
                if (this.diets()[i][j].place === '양식') {
                  this.westernFood.push(this.diets()[i][j].menu)
                }
                if (this.diets()[i][j].place === '특식') {
                  this.specialFood.push(this.diets()[i][j].menu)
                }
              }
            }

            for(let i = 0; i < 3; i++){
              if(this.koreanFood[i][8]){
                this.koreanFood[i][7] = "...";
                this.koreanFood[i].splice(8, (this.koreanFood[i].length - 8))
              }
              if(this.oneDishFood[i][8]){
                this.oneDishFood[i][7] = "...";
                this.oneDishFood[i].splice(8, (this.oneDishFood[i].length - 8))
              }
              if(this.westernFood[i][8]){
                this.westernFood[i][7] = "...";
                this.westernFood[i].splice(8, (this.westernFood[i].length - 8))
              }
              if(this.specialFood[i][8]){
                this.specialFood[i][7] = "...";
                this.specialFood[i].splice(8, (this.specialFood[i].length - 8))
              }
            }

          }
        });
      },
      clickType:function ( type ) {
        this.$store.dispatch("setNowFooterCategory", {
          footerCategoryIndex: -1
        });
        this.$router.push('/diet');
      },
      returnSize: function (arr) {
        return arr.length;
      }
    },
    created() {
      let nowHour = this.today.getHours();
      let nowMinute = this.today.getMinutes();

      // 오후 7시 뒤 ~ 아침 9시
      if (nowHour >= 19 || nowHour < 9) this.type = 0;

      // 아침 9시 ~ 오후 1시 30분
      else if (nowHour < 13 || (nowHour === 13 && nowMinute <= 30)) this.type = 1;

      // 오후 1시 30분 ~ 7시
      else this.type = 2;

      this.callDiet(this.apiToday())
    },
  }
</script>

<style scoped>
  .diet__title {
    width: 100%;
    font-family: NanumSquare;
    font-weight: 800;
    font-size: 17px;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.15;
    letter-spacing: normal;
    text-align: left;
    color: #175c8e;
    cursor: pointer;
  }

  .diet__card {
    margin-top: 20px;
    width: 295px;
    height: 157px;
    padding: 15px 15px 0 15px;
    border: solid 1px #175c8e;
    box-sizing: border-box;
  }

  .diet__category {
    width: 100%;
    box-sizing: border-box;
  }
  .diet__list {
    float:left;
    margin-right: 10px;
    width: auto;
    height: 18px;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: center;
    color: #bbbbbb;
    cursor: pointer;
  }

  .diet__list.diet__list__selected {
    color: #175c8e;
    border-bottom: solid 1px #175c8e;
    font-weight: bold;
  }

  .type {
    float: right;
    font-size: 13px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: center;
    color: #175c8e;
  }

  .menu__container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    /* align-items: center; */
    flex-wrap: wrap;
    width: 100%;
    height: 95px;
    box-sizing: border-box;
    padding: 21px 35px 0 35px;
  }
  .menu {
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #252525;
    text-align: left;
    margin-bottom: 4px;
    display: inline-block;
    width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .menu.little__letter{
    font-size: 14px;
    line-height: 1.1;
    height: 14px;
  }

  .no__menus {
    height: 18px;
    font-family: "NanumBarunGothic", serif;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.2;
    letter-spacing: normal;
    color: #9fa9b3;
    text-align: center;
    margin: 27px 0 0 0;
  }

  .show-more {
    font-family: NanumBarunGothic;
    font-size: 12px;
    letter-spacing: -0.48px;
    color: #bbbbbb;
    cursor: pointer;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .show-more img {
    width: 15px;
    height: 15px;
  }

  @media (max-width: 576px) {
    .diet__card {
      max-width: 100%;
      width: 544px;
      height: 154px;
    }

    .diet__title {
      font-size: 18px;
    }

    /* .diet__list {
      font-size: 15px;
    }
    .type {
      font-family: 'NanumBarunGothic';
      font-size: 15px;
    }
    .menu {
      font-size: 15px;
    } */
    .index__diet__container {
      padding-left: 0;
    }
  }


</style>
