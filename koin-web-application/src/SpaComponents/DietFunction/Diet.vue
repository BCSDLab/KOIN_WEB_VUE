<template>
  <div class="main">
    <div class="container-diet">
      <div class="title">
        <div class="category">
          오늘의 식단
        </div>
        <div class="date-selector">
          <span
            class="arrow-btn prev"
            @click="clickPrev"><img src="https://static.koreatech.in/upload/3694a4611fadea308631f50b8f825bf5.png"></span>
          <span class="date">20{{ years }}년 {{ month }}월 {{ date }}일</span>
          <span
            class="arrow-btn next"
            @click="clickNext"><img src="https://static.koreatech.in/upload/283d4f6aac521b58705fda13918b3a2a.png"></span>
        </div>
        <div v-for="dietList in allDietList" :key="dietList.id">
          <div class="diet-list-buttons">
            <button
              class="diet-list-button"
              v-for="diet in dietList"
              :key="diet.id"
              :style="{ color: diet === '능수관' ? '#f7941e' : (diet === '수박여' ? '#f7941e' : (diet === '2캠퍼스' ? '#1b89d9' : '#175c8e')), borderColor: diet === '능수관' ? '#f7941e' : (diet === '수박여' ? '#f7941e' : (diet === '2캠퍼스' ? '#1b89d9' : '#175c8e'))}">
              {{ diet }}
            </button>
          </div>
          <div class="breakfast">
            <button class="mealtime-btn">아침 / Breakfast</button>
          </div>
          <div class="breakfast-carte">
            <div
              class="carte-container"
              v-for="dietName in dietList"
              :key="dietName.id">
              <div class="carte-content">
                <div
                  v-for="diet in breakfastCarte"
                  :key="diet.id">
                  <div
                    class="carte"
                    v-if="dietName===diet.place"
                    >
                    <div
                      class="menu"
                      v-for="menu in diet.menu"
                      :key="menu.id">
                      {{ menu }}
                    </div>
                    <div class="info">
                      <div class="kcal">{{ diet.kcal }}Kcal</div>
                      <div class="price">현금/캐시비 {{ diet.price_cash | currency }}원/{{ diet.price_card | currency }}원</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="lunch">
            <button class="mealtime-btn">점심 / Lunch</button>
          </div>
          <div class="lunch-carte">
            <div
              class="carte-container"
              v-for="dietName in dietList"
              :key="dietName.id">
              <div class="carte-content">
                <div
                  v-for="diet in lunchCarte"
                  :key="diet.id">
                  <div
                    class="carte"
                    v-if="dietName===diet.place"
                    >
                    <div
                      class="menu"
                      v-for="menu in diet.menu"
                      :key="menu.id">
                      {{ menu }}
                    </div>
                    <div class="info">
                      <div class="kcal">{{ diet.kcal }}Kcal</div>
                      <div class="price">현금/캐시비 {{ diet.price_cash | currency }}원/{{ diet.price_card | currency }}원</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="dinner">
            <button class="mealtime-btn">저녁 / Dinner</button>
          </div>
          <div class="dinner-carte">
            <div
              class="carte-container"
              v-for="dietName in dietList"
              :key="dietName.id">
              <div class="carte-content">
                <div
                  v-for="diet in dinnerCarte"
                  :key="diet.id">
                  <div
                    class="carte"
                    v-if="dietName===diet.place">
                    <div
                      class="menu"
                      v-for="menu in diet.menu"
                      :key="menu.id">
                      {{ menu }}
                    </div>
                    <div class="info">
                      <div class="kcal">{{ diet.kcal }}Kcal</div>
                      <div class="price">현금/캐시비 {{ diet.price_cash | currency }}원/{{ diet.price_card | currency }}원</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'Diet',
    data() {
      return {
        specificDateDiet: null,
        breakfastCarte: '',
        lunchCarte: '',
        dinnerCarte: '',
        today: new Date(),
        type: 0, //morning:0, lunch:1, dinner:2
        movingDate: 0,
        allDietList: [['한식', '일품식', '양식', '능수관', '수박여', '2캠퍼스']],
        width: 0,
        lastDay: [],
        thisYear: new Date().getFullYear(),
        thisMonth: new Date().getMonth() + 1,
        thisDay: new Date().getDate()
      }
    },
    computed: {
      ...mapGetters({
        diets: 'diets',
        month: 'month',
        date: 'date',
        years: 'year'
      })
    },
    watch: {
    },
    methods: {
      //날짜, 아점저
      callDiet: function (apiToday) {
        this.$store.dispatch('setDiets', {
          apiToday: apiToday,
        }).then((flag) => {
          if (flag) {
            this.breakfastCarte = this.diets[0];
            this.lunchCarte = this.diets[1];
            this.dinnerCarte = this.diets[2];
          }
          else
            this.movingDate = this.movingDate > 0 ? this.movingDate - 1 : this.movingDate + 1;
        });

      },
      clickPrev: function () {
        if (this.thisDay - 1 >= 1) {
          this.type = 2;
          this.thisDay -= 1;
        } else {
          if (this.thisMonth - 1 >= 1) {
            this.thisMonth -= 1;
            this.thisDay = this.lastDay[this.thisMonth - 1];
          } else {
            this.thisYear -= 1;
            this.thisMonth = 12;
            this.thisDay = 31;
            this.lastDay = [];
            for(let i = 0; i < 12; i++) {
              this.lastDay.push(new Date(this.thisYear, i+1, 0).getDate())
            }
          }
        }
        this.callDiet(this.apiToday());
      },
      clickNext: function () {
        if (this.thisDay + 1 <= this.lastDay[this.thisMonth - 1]) {
          this.type = 0;
          this.thisDay += 1;
        } else {
          if (this.thisMonth + 1 < 13) {
            this.thisMonth += 1;
            this.thisDay = 1;
          } else {
            this.thisYear += 1;
            this.thisMonth = 1;
            this.thisDay = 1;
            this.lastDay = [];
            for(let i = 0; i < 12; i++) {
              this.lastDay.push(new Date(this.thisYear, i+1, 0).getDate())
            }
          }
        }
        this.callDiet(this.apiToday(), 0);
      },
      apiToday: function () {
        return (this.thisYear - 2000) * 10000 + this.thisMonth * 100 + this.thisDay;
      },
    },
    mounted() {
      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          this.allDietList = window.innerWidth <= 576  ? [['한식', '일품식', '양식'], ['능수관', '수박여', '2캠퍼스']] : [['한식', '일품식', '양식', '능수관', '수박여', '2캠퍼스']];
        });
      })
    },
    created() {
      this.thisYear = new Date().getFullYear();
      this.thisMonth = new Date().getMonth() + 1;
      this.thisDay = new Date().getDate();
      let nowTime = this.today.getHours();
      if (nowTime >= 19 || nowTime <= 11) {
        this.type = 0;
        this.callDiet(this.apiToday());
      }
      else if (nowTime > 11 || nowTime < 14) {
        this.type = 1;
        this.callDiet(this.apiToday())
      }
      else {
        this.type = 2;
        this.callDiet(this.apiToday())
      }
      this.allDietList = window.innerWidth <= 576  ? [['한식', '일품식', '양식'], ['능수관', '수박여', '2캠퍼스']] : [['한식', '일품식', '양식', '능수관', '수박여', '2캠퍼스']];
      for(let i = 0; i < 12; i++) {
        this.lastDay.push(new Date(this.thisYear, i+1, 0).getDate())
      }
    },
    filters: {
      currency: value => {
        if (!value) return ''
        return value.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main {
    border-top: #f7941e 5px solid;
    width: 100%;
  }
  .container-diet {
    margin: 63px auto 23px auto;
    width: 1132px;
  }

  .container-diet .title .category {
    width: 160px;
    height: 29px;
    font-family: NanumSquare, serif;
    font-size: 30px;
    font-weight: 800;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -1.5px;
    text-align: left;
    color: #175c8e;
  }

  .date-selector {
    margin-top: 22px;
    margin-bottom: -4px;
  }

  .date-selector .date {
    width: 157px;
    height: 22px;
    font-family: NanumBarunGothic;
    font-size: 24px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -1.2px;
    text-align: center;
    color: #252525;
    margin: 0 26px;
  }

  .date-selector .arrow-btn {
    width: 11px;
    height: 16px;
    font-size: 24px;
    object-fit: contain;
    color: #252525;
    cursor: pointer;
  }

  .date-selector .arrow-btn:hover {
    color: #f7941e;
  }

  .diet-list-buttons {
    margin-top: 25px;
  }

  .diet-list-button {
    width: 185px;
    height: 56px;
    border: 1px solid #175c8e;
    padding: 21px auto;
    margin: 0 2px;
    font-size: 16px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: -0.8px;
    text-align: center;
    background-color: #ffffff;
  }

  .diet-list-buttons .diet-list-button:first-child {
    margin-left: 0px;
  }

  .diet-list-buttons .diet-list-button:last-child {
    margin-right: 0px;
  }

  .breakfast {
    margin-top: 27px;
  }

  .mealtime-btn {
    height: 31px;
    border-radius: 15.5px;
    background-color: #ffffff;
    border: solid 1px #175c8e;
    font-size: 12px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.6px;
    text-align: center;
    color: #175c8e;
    padding-left: 11px;
    padding-right: 11px;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .mealtime-btn:before {
    content: "";
    display: block;
    position: absolute;
    height: 1px;
    width: 1132px;
    background-color: #175c8e;
    left: 0;
    right: 0;
    margin: 8px auto 0 auto;
    z-index: -1;
  }

  .breakfast-carte, .lunch-carte, .dinner-carte {
    display: flex;
    padding-top: 17px;
    padding-bottom: 18px;
  }

  .breakfast-carte .carte-container:first-child, .lunch-carte .carte-container:first-child, .dinner-carte .carte-container:first-child {
    margin-left: 0;
  }

  .breakfast-carte .carte-container:last-child, .lunch-carte .carte-container:last-child, .dinner-carte .carte-container:last-child {
    margin-right: 0;
  }

  .carte-container {
    width: 185px;
    margin: 0 2px;
  }

  .carte-content {
    display: flex;
    /* margin: 5% 0; */
  }

  .menu {
    font-size: 15px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.6;
    letter-spacing: -0.8px;
    text-align: left;
    color: #252525;
  }
  .arrow-btn img {
    width: 11px;
  }
  .info {
    font-size: 13px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.85;
    letter-spacing: -0.7px;
    text-align: left;
    color: #858585;
    margin-top: 30px;
  }
  .date {
    padding-left: -2px;
    padding-right: -2px;
  }

  @media (max-width: 576px) {
    .main {
      border-top: none;
    }
    .container-diet {
      width: calc(100% - 32px);
      margin: 30px auto auto auto;
    }

    .container-diet .title  .category {
      display: none;
    }

    .arrow-btn img {
      width: 11px;
      height: 16px;
    }

    .date-selector {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
      margin-top: 0;
    }

    .date-selector .date {
      width: auto;
      height: 20px;
      font-size: 18px;
      margin: 0 16px;
      line-height: 1.39;
      letter-spacing: normal;
    }

    .diet-list-buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 0;
    }

    .diet-list-button {
      height: 30px;
      font-size: 13px;
      line-height: 1.15;
      margin-left: 0px;
      margin-right: 5px;
    }

    .diet-list-buttons .diet-list-button:last-child {
      margin-right: 0;
    }

    .mealtime-btn {
      font-size: 12px;
      font-weight: 500;
      letter-spacing: normal;
      width: 106px;
      padding: 0;
    }

    .mealtime-btn:before {
      width: calc(100% - 32px);
    }

    .breakfast-carte, .lunch-carte {
      padding: 20px 0;
    }

    .carte-container {
      margin: 0 5px 0 0;
    }


    .dinner-carte {
      padding: 20px 0 70px 0;
    }

    .menu {
      font-size: 12px;
      line-height: 1.67;
      letter-spacing: -0.2px;
    }

    .info {
      margin-top: 10px;
    }

    .info .kcal {
      font-size: 12px;
      line-height: 2;
      letter-spacing: -0.4px;
    }

    .info .price {
      font-size: 8px;
      line-height: 1.5;
      letter-spacing: -1.2px;
    }

    .mobile {
      display: block;
    }
  }
</style>
