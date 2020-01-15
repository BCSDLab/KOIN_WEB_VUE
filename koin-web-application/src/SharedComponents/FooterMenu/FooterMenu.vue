<template>
  <div class="footer-menu__container">
    <div class="footer-menu">
      <div
        @click="clickMenu(menu.id)"
        class="menu"
        :key="menu.id"
        v-for="(menu, index) in menus">
        <img
          v-if="nowFooterCategory === index"
          class="logo"
          :src="menu.onLogo">
        <img
          v-if="nowFooterCategory !== index"
          class="logo"
          :src="menu.logo">
        <div class="content" :class="{'selected': nowFooterCategory === index}">{{ menu.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'FooterMenu',
    computed: {
      ...mapGetters({
        nowFooterCategory: 'nowFooterCategory'
      })
    },
    watch: {
      nowFooterCategory: function() {

      }
    },
    data() {
      return {
        menus: [
          {
            title: "홈",
            logo: "https://static.koreatech.in/assets/img/footer-home.png",
            onLogo: "https://static.koreatech.in/assets/img/footer-home-on.png",
            id: "home"
          },
          {
            title: "카테고리",
            logo: "https://static.koreatech.in/assets/img/footer-category.png",
            onLogo: "https://static.koreatech.in/assets/img/footer-category-on.png",
            id: "category"
          },
          {
            title: "검색",
            logo: "https://static.koreatech.in/assets/img/ic-search-menu@3x.png",
            onLogo: "https://static.koreatech.in/assets/img/ic-search-menu-on%403x.png",
            id: "search"
          }
        ]
      }
    },
    methods: {
      clickMenu: function(id) {
        switch(id){
          case "home":
            if(this.nowFooterCategory === 1) {
              this.$store.dispatch("setFooterCategory");
            }
            this.$store.dispatch("setNowFooterCategory", {
              footerCategoryIndex: 0
            });


            this.$router.push('/');
            break;

          case "category":
            this.$store.dispatch("setFooterCategory");
            break;

          case "search":
            if(this.nowFooterCategory === 1) {
              this.$store.dispatch("setFooterCategory");
            }
            this.$store.dispatch("setNowFooterCategory", {
              footerCategoryIndex: 2
            });
            this.$router.push('/search');
            break;

        }
      }
    },
    created() {
      if(this.$router.currentRoute.path ==='/') {
        this.$store.dispatch("setNowFooterCategory", {
          footerCategoryIndex: 0
        });
      }
      else if (this.$router.currentRoute.path ==='/search'){
        this.$store.dispatch("setNowFooterCategory", {
          footerCategoryIndex: 2
        });
      }
      else {
        this.$store.dispatch("setNowFooterCategory", {
          footerCategoryIndex: -1
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .footer-menu__container {
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 15;
    background: white;
    border-top: #cccccc 1px solid;
    height: 57px;
  }

  .footer-menu {
    width: 100%;
    height: 400px;
    cursor:pointer;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  .logo {
    margin-top: 8px;
    width: 38px;
  }

  .content {
    width: 100%;
    font-size: 12px;
  }

  .menu {
    width: 33.3%;
    float: left;
  }

  .selected {
    color: #175c8e;
  }
</style>
