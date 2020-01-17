<template>
  <div :class="{'promotion__popup':true, 'promotion__popup--active': isActive}">
    <button
      class="popup__button"
      @click="isActive = !isActive"
      @focusout="isActive = false">
      ?
    </button>
    <div
      class="popup__container"
      v-show="isActive">
      <div class="popup__popup">
        <slot/>
      </div>

      <div class="popup__border--arrow">
        <div class="popup__arrow"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PromotionPopupButton",
    data() {
      return {
        isActive: false
      }
    }
  }
</script>

<style scoped>
  .promotion__popup {
    margin: 5px 9px;
    width: 18px;
    height: 18px;
    flex: none;
    position: relative;
  }

  .popup__button {
    margin: auto;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 1px solid #f7941e;
    border-radius: 9px;
    font-family: AppleSDGothicNeoEB00;
    font-size: 15px;
    text-indent: 1px;
    font-weight: bold;
    line-height: 0.6;
    color: #f7941e;
    background-color: white;
    tab-index: -1;
    cursor: pointer;
  }
  .promotion__popup--active > .popup__button {
    color: white;
    background-color: #f7941e;
  }

  .popup__container {
    position: relative;
    width: 375px;
    top: -1px;
    left: -366px;
    z-index: 1;
  }

  .popup__border--arrow {
    width: 12px;
    height: 16px;
    position: absolute;
    right: 0;
    background-color: #e8e7e7;
    clip-path: polygon(100% 0, 100% 100%, 0 100%);
  }
  .popup__arrow {
    width: 10px;
    height: 15px;
    position: absolute;
    top: 1px;
    left: 1px;
    background-color: white;
    clip-path: polygon(100% 0, 100% 100%, 0 100%);
  }

  .popup__popup {
    position: absolute;
    top: 14px;
    right: 0;
    border: 1px solid #e8e7e7;
    width: 100%;
    padding: 10px;
    background-color: #ffffff;
    font-family: NanumBarunGothic;
    font-size: 12px;
    line-height: 1.42;
    letter-spacing: normal;
    text-align: left;
    word-break: break-word;
    color: #707070;
  }
  .popup__popup span {
    font-weight: bold;
    color: #175c8e;
  }

  @media (max-width: 576px) {
    .promotion__popup {
      margin: 0 4px;
    }

    .popup__container {
      width: 270px;
      left: -260px;
    }

    .popup__border--arrow {
      width: 8px;
      height: 19px;
    }
    .popup__arrow {
      width: 6px;
      height: 18px;
    }
    .popup__popup {
      top: 18px;
      padding: 16px;
    }
  }
</style>
