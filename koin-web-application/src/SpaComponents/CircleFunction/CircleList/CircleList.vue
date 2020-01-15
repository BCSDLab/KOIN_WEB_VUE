<template>
  <div class="container">
    <div v-if="!loadingFlag">
      <v-loading-bar></v-loading-bar>
    </div>
    <div
      v-if="loadingFlag"
      class="list">
      <div class="container-category">
        <div class="header">
          <div class="header-name">
            동아리 안내
          </div>
          <div class="category-container">
            <div class="category-title">CAREGORY</div>
            <div class="categories">
                <div
                  @click="clickCategory(category.tag)"
                  class="category"
                  v-for="(category, index) in categories"
                  @mouseover="showByIndex = index"
                  @mouseout="showByIndex = null"
                  :key="category.id">
                <img
                  v-show="showByIndex !== index && nowCategoryTag !== category.tag"
                  :src="category.img">
                <img
                  v-show="(showByIndex === index) || nowCategoryTag === category.tag"
                  :src="category.on_img">
                <span
                  :class="{selected: nowCategoryTag === category.tag}"
                  class="category-name">{{ category.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="cards">
        <div
          :key="circle.id"
          v-for="(circle, index) in displayCircleList"
          class="card"
          @click="clickCircle(circle.id)"
          :class="{'last-card': index%3===2}">
          <div class="circle-background">
            <img
              v-if="circle.background_img_url !== null && circle.background_img_url !== undefined"
              :src="circle.background_img_url">
          </div>
          <div
            class="circle-logo">
            <img
              v-if="circle.logo_url !== null && circle.logo_url !== undefined"
              :src="circle.logo_url">
          </div>
          <div class="title">
            {{ circle.name }}
          </div>
          <div class="desc">
            {{ circle.line_description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as CATEGORY from '../../../static/circleCategory';
  import {mapGetters} from 'vuex';

  export default {
    name: 'CircleList',
    data() {
      return {
        loadingFlag: false,
        categories: CATEGORY.default,
        showByIndex: null,
        nowCategoryTag: null
      }
    },
    computed: {
      ...mapGetters({
        displayCircleList: 'displayCircleList',
      })
    },
    methods: {
      clickCategory: function (tag) {
        this.nowCategoryTag = tag;
        this.$session.set("circleCategory", tag);
        this.$store.dispatch('setTag', {
          tag: tag
        }).then((data) => {
        })
      },
      clickCircle: function (id) {
        this.$router.push('/circle/' + id);
      }
    },
    created() {
      this.loadingFlag = false;
      if (this.$session.get("circleCategory") !== null && this.$session.get("circleCategory") !== undefined) {
        this.nowCategoryTag = this.$session.get('circleCategory');
      }
      this.$store.dispatch('setCircleList').then((data) => {
        if (data) {
          this.loadingFlag = true;
          this.$store.dispatch('setTag', {tag: this.$session.get("circleCategory")})
        }
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    border-top: #f7941e 5px solid;
    width: 100%;
  }

  .list {
    width: 1132px;
    margin-top: 63px;
    margin-left: auto;
    margin-right: auto;
    min-height: 800px;
  }

  .container-category {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    height: 190px;
  }

  .header {
    width: 1132px;
  }

  .header .header-name {
    float: left;
    font-family: NanumSquare, serif;
    font-size: 30px;
    font-weight: 800;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -1.5px;
    color: #175c8e;
    width: 100%;
    text-align: left;
    height: 32px;
    margin-bottom: 21px;
  }

  .header .category-container {
    float: left;
    width: 1052px;
    border-top: 2px #175c8e solid;
    border-bottom: 1px #175c8e solid;
    padding-left: 40px;
    padding-right: 40px;
    height: 132px;
  }

  .category-container .category-title {
    display: none;
  }

  .category-container .category {
    height: 100px;
    width: 58px;
    margin-left: 37px;
    margin-right: 36.5px;
    text-align: center;
    float: left;
    padding-top: 23px;
    cursor: pointer;
  }

  .category-container .category img {
    width: 55px;
    display: inline-block;
    border-radius: 90px;
    float: left;
    margin-bottom: 5px;
  }

  .category-container .category .category-name {
    width: 55px;
    font-size: 15px;
    letter-spacing: -0.8px;
  }

  .category-container .category:hover {
    color: #f7931e;
  }

  .selected {
    color: #f7931e;
  }

  .cards {
    margin-top: 36px;
    height: 100%;
    margin-bottom: 100px;
  }

  .cards .card {
    margin-bottom: 30px;
    float: left;
    width: 354px;
    margin-right: 31px;
    border: solid 1px #d8d8d8;
    height: 280px;
    cursor: pointer;
  }

  .cards .last-card {
    margin-right: 0;
  }

  .cards .card .circle-background {
    background: #175c8e;
    width: 356px;
    height: 128px;
    overflow: hidden;
  }

  .cards .card .circle-background img {

  }

  .cards .card .circle-logo {
    width: 85px;
    height: 85px;
    background: #d8d8d8;
    position: relative;
    top: -40px;
    left: 135px;
    border-radius: 42px;
    border: solid 1px #d8d8d8;
  }

  .cards .card .circle-logo img {
    width: 85px;
    height: 85px;
    border-radius: 40px;
    background: white;
  }

  .cards .card .title {
    font-size: 20px;
    color: #252525;
    letter-spacing: -1px;
    position: relative;
    bottom: 17px;
  }

  .cards .card .desc {
    letter-spacing: -0.7px;
    font-size: 13px;
    color: #c4c4c4;
    position: relative;
    bottom: 10px;
  }

  @media (max-width: 576px) {
    .container {
      border-top: none;
    }

    .list {
      width: calc(100% - 32px);
      margin: 30px auto auto auto;
      display: flex;
      flex-direction: column;
    }

    .container-category {
      height: auto;
    }

    .header {
      width: 100%;
    }

    .header .category-container {
      width: 100%;
      height: auto;
      /* display: flex; */
      padding: 0;
      /* flex-wrap: wrap; */
    }

    .category-container .category-title {
      display: block;
      font-family: NanumSquare;
      font-size: 15px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: normal;
      color: #252525;
      margin-top: 12px;
      float: left;
    }

    .category-container .categories {
      width: 100%;
      height: auto;
      display: flex;
      padding-top: 11px;
      padding-bottom: 20px;
      flex-wrap: wrap;
      justify-content: space-around;
    }

    .category-container .category {
      margin: 0 26px;
      padding: 0;
      height: auto;
    }

    .category-container .category img {
      width: 50px;
      height: 50px;
    }

    .category-container .category .category-name {
      font-size: 13px;
      font-weight: normal;
      line-height: 1.15;
      letter-spacing: -0.3px;
      color: #252525;
    }

    .header-name {
      display: none;
    }

    .cards {
      display: flex;
      flex-direction: column;
      margin-top: 26px;
      margin-bottom: 16px;
    }

    .cards .card {
      width: 100%;
      margin-right: 0;
      margin-bottom: 20px;
    }

    .cards .card .circle-background {
      width: auto;
    }

    .cards .card .circle-logo {
      margin: auto;
      left: 0;
    }
  }

  @media (max-width: 471px) and (min-width: 401px) {
    .category-container .category {
      margin: 0 17px;
    }
  }

  @media (max-width: 400px) {
    .category-container .category {
      margin: 0 12px;
    }
  }


</style>
