<template>
  <div class="header--promotion">
    <div
      @click="$emit('click')"
      class="header__title">
      {{ title }}
    </div>
    <div class="header__left-side">
      <slot/>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PromotionHeader",
    data() {
      return {
        title: "홍보게시판"
      }
    }
  }
</script>

<style scoped>
  .header--promotion {
    height: 53px;
    border-bottom: #175c8e 3px solid;
    display: flex;
    justify-content: space-between;
    position: relative;
  }

  .header--promotion > .header__title  {
    font-size: 30px;
    font-family: NanumSquareEB;
    font-weight: bold;
    line-height: 1.17;
    height: 34px;
    letter-spacing: -1.15px;
    color: #175c8e;
    cursor: pointer;
    margin-top: 5px;
  }
  .header--promotion > .header__left-side {
    display: flex;
    flex: none;
  }

  @media (max-width: 576px) {
    .header--promotion {
      height: auto;
      border-bottom: 0;
      position: unset;
    }
    .header--promotion > .header__left-side {
      width: 100%;
      display: unset;
    }
    .header--promotion > .header__title {
      display: none;
    }
  }
</style>
