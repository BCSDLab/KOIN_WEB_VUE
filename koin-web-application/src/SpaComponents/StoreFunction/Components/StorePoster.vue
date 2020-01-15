
<template>
  <div class="poster-container">
    <div
      @click="localImageIndex--"
      v-if="localImageIndex !== 0"
      class="prev">
      <img src="http://static.koreatech.in/assets/img/prev-arrow.png" />
    </div>
    <div
      class="posters"
      @click="$emit('close')">
      <img
        v-img-orientation-changer
        :src="posterImages[localImageIndex]"
        alt
      />
    </div>
    <div
      @click="localImageIndex++"
      v-if="localImageIndex !== posterImages.length - 1"
      class="next">
      <img src="http://static.koreatech.in/assets/img/next-arrow.png" />
    </div>
    <div
      class="close"
      @click="$emit('close')">
      <img src="http://static.koreatech.in/assets/img/close.png" />
    </div>
  </div>
</template>

<script>
export default {
  name: "StorePoster",
  props: {
    posterImages: {
      type: Array,
      default: []
    },
    imageIndex: {
        type: Number,
        default: 0
    }
  },
  data() {
    return {
        localImageIndex: 0
    };
  },
  created() {
      this.localImageIndex = this.imageIndex;
  }
};
</script>

<style scoped>
.poster-container {
    width: 100%;
    height: 100vh;
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.prev {
  width: 60px;
  height: 60px;
  background-color: #252525;
  border-radius: 50%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: fixed;
  top: calc((100vh - 60px) / 2);
  left: 50px;
}

.next {
  width: 60px;
  height: 60px;
  background-color: #252525;
  border-radius: 50%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: fixed;
  top: calc((100vh - 60px) / 2);
  right: 50px;
}

.prev:hover,
.next:hover {
  background-color: #f7941e;
}

.close {
  position: fixed;
  top: 33px;
  right: 62px;
  cursor: pointer;
}

.posters {
  width: 600px;
  cursor: pointer;
  position: fixed;
}

.posters img {
  width: 100%;
}
button img {
  width: 24px;
  height: 24px;
}

@media (max-width: 576px) {
    .posters {
        width: 275px;
    }

    .close {
        top: 20px;
        right: 20px;
    }
    .close img{
        width: 24px;
        height: 24px;
    }

    .prev {
        width: 24px;
        height: 24px;
        background-color: transparent;
        left: 10px;
        top: calc((100vh - 24px) / 2);
    }

    .next {
        width: 24px;
        height: 24px;
        background-color: transparent;
        right: 10px;
        top: calc((100vh - 24px) / 2);
    }

    .prev:hover,
    .next:hover {
        background-color: transparent;
    }
}
</style>