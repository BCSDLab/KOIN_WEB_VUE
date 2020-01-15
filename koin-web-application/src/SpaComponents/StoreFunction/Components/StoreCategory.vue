<template>
  <div class="container-category">
    <div class="header">
      <div class="header-name">
        주변 상점
      </div>
      <div class="category-container">
        <span class="title">CATEGORY</span>
        <div class="menus">
          <div
            @click="clickCategory(categoryArr.tag)"
            class="category"
            :class="{
              test: $router.history.current.path.split('/')[2]===undefined,
              'idx-5': idx===4,
              'second-row': idx > 4,
              'left-side': idx === 5,
              'right-side': idx === 8,
              'general': idx===6 }"

            v-for="(categoryArr, idx) in categoryList.storeMenu"
            :key="categoryArr.id">
            <img
              :src="categoryArr.image">
            <span
              :class="{now: tag===categoryArr.tag || category===categoryArr.tag}"
              class="category-name">
              {{ categoryArr.title }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as FILTERTABLE from '../../../static/storeFilterTag';
  import {mapGetters} from 'vuex';

  export default {
    name: 'StoreCateogry',
    props: {
      category: {
        type: String,
        default: function () {
          return ""
        }
      }
    },
    data() {
      return {
        categoryList: FILTERTABLE.default,
      }
    },
    methods: {
      clickCategory: function (tag) {
        let path = this.$router.history.current.path.split('/');
        console.log(path)
        console.log(path[2])
        if (path[2] === undefined) {
          this.$session.set("storeTag", tag);
          this.$store.dispatch('setCategoryStoreList', {tag: tag})
        }
      }
    },
    computed: {
      ...mapGetters({
        tag: "tag"
      })
    },
    created: function () {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container-category {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  .header {
    width: 1131px;
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
    height: 30px;
    margin-bottom: 21px;
  }

  .header .category-container {
    float: left;
    width: 100%;
    height: 142px;
    border-top: 2px #175c8e solid;
    border-bottom: 1px #175c8e solid;
  }

  .category-container .title {
    font-size: 15px;
    font-family: NanumSquare, serif;
    font-weight: 800;
    height: 150px;
    line-height: 149px;
    float: left;
    margin-left: 56px;
    margin-right: 60px;
    letter-spacing: -0.8px;
  }

  .category-container .category {
    height: 100px;
    width: 58px;
    margin-right: 47px;
    text-align: center;
    float: left;
    padding-top: 30px;
    cursor: pointer;
  }

  .category-container .category img {
    width: 57px;
    display: inline-block;
    height: auto;
    border-radius: 90px;
    float: left;
    margin-left: 4px;
  }

  .category-container .category span {
    margin-top: 10px;
    width: 68px;
    float: left;
    letter-spacing: -0.8px;
  }

  .test:hover {
    color: #f7931e;
  }

  .now {
    color: #f7941e;
    font-weight: 700;
  }

  @media (max-width: 576px) {
    .header .header-name {
      display: none;
    }
    .header-name, .header {
      width: calc(100% - 10px);
      margin-left: auto;
      margin-right: auto;
    }

    .container-category {
      width: calc(100% - 24px);
      padding-left: 12px;
      padding-right: 12px;
      height: 100%;
    }

    .header .header-name {
      font-size: 20px;
      margin-bottom: 10px;
      height: 22px;
    }

    .category-container .title {
      width: 100%;
      padding: 0;
      text-align: left;
      height: 17px;
      font-size: 15px;
      margin: 10px 0 0;
      display: inline-block;
      line-height: 1;
      letter-spacing: normal
    }

    .category-container .category {
      padding-top: 11px;
      margin-right: 19px;
      width: 50px;
      height: 100%;
    }

    .category-container .category img {
      width: 50px;
      height: 50px;
      margin-left: 0px;
    }

    .category-name {
      text-align: center;
      font-size: 13px;
    }

    .category-container .category span {
      width: 50px;
    }

    .category .idx-5 {
      margin-right: 0;
    }

    .category .second-row {
      margin-top: 3px;
      margin-bottom: 14px;
    }

    .header .category-container {
      height: 100%;
      width: 100%;
      text-align: center;
    }

    .category .left-side {
      margin-left: 35.5px;
    }

    .category .right-side {
      margin-right: 35.5px;
    }

    .category .general {
      width: 60px;
      margin-right: 9px;
    }
    .category .general span {
      width: 60px;
      margin-left: -5px;
    }
    .menus {
      width: 330px;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
