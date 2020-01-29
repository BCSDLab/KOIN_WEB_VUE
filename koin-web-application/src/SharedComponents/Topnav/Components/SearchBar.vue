<template>
  <div
    class="search__container"
    :style="{ width: containerWidth }">
    <div class="search-bar">
      <img
        class="back-icon"
        src="https://static.koreatech.in/assets/img/back-menu.png"
        alt="back-icon"
        @click="goBack()"
      />
      <div class="search-box">
        <img
          class="search-icon"
          src="http://static.koreatech.in/assets/img/ic-search.png"
          alt="search-icon"
          @click="search"
        />
        <input
          v-model="searchWord"
          class="search-input"
          placeholder="검색어를 입력하세요."
          type="text"
          @keyup.enter="search"
          @keyup.esc="closeSearchBar"
          @focus="focusFlag = true"
          ref="searchInput"
        />
        <img
          class="close-icon"
          src="http://static.koreatech.in/assets/img/close.png"
          alt="close-icon"
          @click="closeSearchBar"
        />
        <img
          class="eraser-icon"
          src="http://static.koreatech.in/assets/img/ic-eraser.png"
          alt="eraser-icon"
          @click="eraseSearchWord"
        />
      </div>
      <img
        class="mobile-search-icon"
        src="http://static.koreatech.in/assets/img/ic-search.png"
        alt="search-icon"
        @click="search"
      />
    </div>
    <div
      v-if="focusFlag"
      class="recent-search-words">

      <div class="recent-search-words__head">
        <span>최근 검색</span>
        <span
          class="remove-all"
          @click="removeAllRecentSearchWord">전체 삭제</span>
      </div>
      <div
        v-if="recentSearchWords.length !== 0"
        class="recent-search-word__list">
        <div
          class="search-word__container"
          v-if="index < 5"
          v-for="(word, index) in recentSearchWords"
          :key="word.id"
        >
          <span
            class="search-word"
            @click="clickRecentSearchWord(word)">
            {{ word }}
          </span>
          <img
            class="remove-icon"
            src="http://static.koreatech.in/assets/img/ic-x.png"
            @click="removeRecentSearchWord(word)"
            alt="remove-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { closeSearchBarAction } from "../../../mixins/index";
export default {
  name: "SearchBar",
  mixins:[closeSearchBarAction],

  data() {
    return {
      page: 1,
      searchWord: "",
      spaceReg: /[\s]/g,
      focusFlag: false
    };
  },
  computed: {
    ...mapGetters({
      recentSearchWords: "recentSearchWords"
    }),
    containerWidth() {
      if (this.$session.get("token") !== undefined) return '835px';
      else return '850px';
    }
  },
  watch: {
    "$route.query.q"(newValue) {
      if (newValue !== undefined) {
        this.searchWord = newValue;
      } else {
        this.searchWord = "";
      }
    },
  },
  methods: {
    search() {
      if (this.searchWord.trim() === "") {
        alert("검색어를 입력해주세요.");
        return;
      }
      console.log("검색");
      this.$store.commit("updateRecentSearchWords", this.searchWord.trim());
      window.localStorage.setItem("recentSearchWords", JSON.stringify(this.recentSearchWords));
      if (window.innerWidth > 576) {
        this.$store.dispatch("toggleSearchBarAction", false);
      }
      this.$session.set("nowSearchPageNum", 1);
      this.$router.push(`/search?q=${encodeURIComponent(this.searchWord)}`);
    },
    eraseSearchWord() {
      this.searchWord = "";
      this.$refs.searchInput.focus();
    },
    removeRecentSearchWord(word) {
      if (confirm("해당 검색어를 삭제하시겠습니까?")) {
        this.$store.commit("removeSearchWord", word);
        window.localStorage.setItem("recentSearchWords", JSON.stringify(this.recentSearchWords));
      }
    },
    removeAllRecentSearchWord() {
      if (confirm("전체 검색어를 모두 삭제하시겠습니까?")) {
        window.localStorage.removeItem("recentSearchWords");
        this.$store.commit("setRecentSearchWords", []);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    clickRecentSearchWord(word) {
      this.searchWord = word;
      this.search();
    }
  },
  mounted() {
    this.$refs.searchInput.focus();
    if (JSON.parse(window.localStorage.getItem("recentSearchWords")) === null) {
      this.$store.commit("setRecentSearchWords", []);
    } else {
      this.$store.commit("setRecentSearchWords", JSON.parse(window.localStorage.getItem("recentSearchWords")));
    }
  }
};
</script>

<style scoped>
.search__container {
  position: absolute;
  top: 0;
  left: 114px;
  height: 80px;
  background-color: #175c8e;
}

.search-bar {
  height: 100%;
}

.search-box {
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
}
.back-icon {
  display: none;
}
.search-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
  cursor: pointer;
}

.search-input {
  font-family: NanumSquare;
  font-size: 17px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: white;
  background-color: transparent;
  border: none;
  width: 100%;
}

.search-input::placeholder {
  color: #7da0b9;
}

.close-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.eraser-icon,
.mobile-search-icon {
  display: none;
}
.recent-search-words {
  position: absolute;
  top: 81px;
  background-color: white;
  width: 100%;
  height: 263px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  padding: 25px 30px;
  box-sizing: border-box;
  z-index: 20;
}
.recent-search-words__head {
  font-family: NanumSquare;
  font-size: 17px;
  font-weight: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #175c8e;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.remove-all {
  cursor: pointer;
}
.recent-search-word__list {
  margin-top: 25px;
  overflow: hidden;
}
.search-word__container {
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-word {
  font-family: NanumBarunGothic;
  font-size: 15px;
  font-weight: normal;
  line-height: 1.2;
  letter-spacing: normal;
  color: #252525;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.remove-icon {
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.recent-search-word__list .search-word:last-child {
  margin-bottom: 0;
}

@media (max-width: 576px) {
  .search__container {
    left: 0;
    width: 100%!important;
    height: 56px;
  }
  .search-bar {
    display: flex;
    align-items: center;
    padding: 0 16px;
  }
  .back-icon {
    display: block;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }
  .search-box {
    width: calc(100% - 39px);
    border-bottom: 1px solid #ffffff;
    height: 28px;
    margin: 0 15px;
  }
  .search-icon,
  .close-icon {
    display: none;
  }
  .eraser-icon {
    display: block;
    cursor: pointer;
  }
  .mobile-search-icon {
    display: block;
    cursor: pointer;
    width: 24px;
    height: 24px;
  }
  .search-input {
    font-family: NanumSquareL;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.43;
    letter-spacing: normal;
    color: #ffffff;
  }
  .search-input::placeholder {
    color: #d2dae2;
  }

  .recent-search-words {
    display: none;
  }
}
</style>
