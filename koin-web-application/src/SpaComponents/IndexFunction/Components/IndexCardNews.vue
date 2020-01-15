<template>
  <div
    class="card-news__container"
    @click="goCardNews">
    <img
      class="card-news__thumbnail"
      :src="imgLink"
      alt="">
  </div>
</template>

<script>
import * as api from '../../../api/api';
export default {
    name: "IndexCardNews",
    data() {
        return {
            imgLink: null,
            newsLink: null
        }
    },
    methods: {
        async getCardNewsData() {
            const result = await api.getCardNews();
            this.imgLink = await result.data.card_news_image;
            this.newsLink = await result.data.card_link_url;
        },
        goCardNews() {
            window.open(this.newsLink);
        }

    },
    created() {
        this.getCardNewsData();
    }
}
</script>

<style scoped>
    .card-news__container {
        width: 295px;
        height: 189px;
        cursor: pointer;
    }

    .card-news__thumbnail {
        width: 100%;
        height: 100%;
    }
</style>