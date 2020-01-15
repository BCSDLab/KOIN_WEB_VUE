<template>
  <div class="result-container">
    <div v-if="loadingFlag">
      <v-loading-bar></v-loading-bar>
    </div>
    <div v-if="!loadingFlag && ($route.query.q === undefined && mobileFlag)" class="mobile-search-view">
      <div class="head">
        <div class="title">최근 검색</div>
        <div class="remove-all" @click="removeRecentSearchWords">전체 삭제</div>
      </div>
      <div class="recent-search-word-list">
        <div
          class="search-word__container"
          v-for="word in recentSearchWords"
          :key="word.id">
          <span
            class="search-word"
            @click="clickRecentSearchWord(word)">
            {{ word }}
          </span>
          <img
            class="remove-icon"
            src="http://static.koreatech.in/assets/img/ic-x.png"
            @click="removeRecentSearchWord(word)"
            alt="remove-icon"/>
        </div>
      </div>
    </div>
    <div
      v-if="!loadingFlag && (($route.query.q !== undefined && mobileFlag) || (!mobileFlag))"
      class="result">
      <div
        class="result-title"
        v-if="$route.query.q !== undefined">
        '<div class="query-string">{{ $route.query.q }}</div>' 검색 결과입니다.
      </div>
      <table class="table">
        <thead>
          <tr>
            <th class="id">번호</th>
            <th class="category">분류</th>
            <th class="title">제목</th>
            <th class="author">작성자</th>
            <th class="date">날짜</th>
            <th class="hit">조회수</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="row"
            v-for="article in searchResult"
            :key="article.id"
            @click="goArticle(article.permalink)">
            <td class="id">{{ article.id }}</td>
            <td class="category">{{ article.service_name }}</td>
            <td class="title">
              <div class="title__container">
                <strong v-if="setPrefix(article.permalink) !== ''">[{{ setPrefix(article.permalink) }}]</strong>
                <span
                  class="styled-title"
                  v-html="styledText(article.title)">
                </span>
                <img
                  v-if="computedTime(article.created_at)[1]"
                  class="new-tag"
                  src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
                  alt="new-tag" />
              </div>
            </td>
            <td class="author">
              <span v-html="styledText(article.nickname)"></span>
            </td>
            <td class="date">{{ computedTime(article.created_at)[0].substring(0, 10) }}</td>
            <td class="hit">{{ article.hit }}</td>
          </tr>
          <tr
            v-if="searchResult.length === 0 || $route.query.q === undefined">
            <td colspan="6">
              <div class="no-result">
                <img src="http://static.koreatech.in/assets/img/no-result.png" alt />
                <span
                  v-if="searchResult.length === 0 && $route.query.q !== undefined"
                  class="no-result-text">
                  일치하는 검색 결과가 없습니다.
                </span>
                <span
                  v-if="searchResult.length === 0 && $route.query.q === undefined"
                  class="no-result-text">
                  검색어를 입력해주세요!
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="mobile-table">
        <div
          class="row"
          v-for="article in searchResult"
          :key="article.id"
          @click="goArticle(article.permalink)"
        >
          <div class="title__container">
            <strong>[{{ article.service_name}}]</strong>
            <span
              class="title" 
              v-html="styledText(article.title)">
            </span>
            <img
              v-if="computedTime(article.created_at)[1]"
              class="new-tag"
              src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"a
              lt="">
          </div>
          <div class="sub-info">
            <div class>
              <span class="hit">조회 {{ article.hit }}</span> · 
              <span v-html="styledText(article.nickname)" class="author"></span>
            </div>
            <div class="date">{{ computedTime(article.created_at)[0].substring(0, 10) }}</div>
          </div>
        </div>
        <div
          v-if="searchResult.length === 0"
          class="no-result">
          <img src="http://static.koreatech.in/assets/img/no-result.png" alt />
          <span class="no-result-text">일치하는 검색 결과가 없습니다.</span>
        </div>
      </div>
      <div
        v-if="searchResult.length !== 0"
        class="pagination">
        <button class="arrow" @click="clickPrevButton">이전으로</button>
        <button
          :class="{active: nowPageNum===n}"
          class="number"
          v-for="n in totalDisplayResultPageNum"
          :key="n.id"
          @click="clickPageNum(n)"
          v-if="n>=totalDisplayResultMinNum"
        >
          <span class="num">{{ n }}</span>
        </button>
        <button class="arrow" @click="clickNextButton">다음으로</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "SearchResult",
  computed: {
    ...mapGetters({
      searchResult: "searchResult",
      totalDisplayResultMinNum: "totalDisplayResultMinNum",
      totalDisplayResultPageNum: "totalDisplayResultPageNum",
      totalResultPageNum: "totalResultPageNum",
      recentSearchWords: "recentSearchWords"
    }),
    changeTime() {
      return time => {
        let times = time.split(" ");
        let date = times[0].split("-");
        let tim = times[1].split(":");
        let created = new Date();
        created.setFullYear(date[0]);
        created.setMonth(date[1] - 1);
        created.setDate(date[2]);
        created.setHours(tim[0]);
        created.setMinutes(tim[1]);
        created.setSeconds(tim[2]);
        return created;
      };
    },
    computedTime() {
      return time => {
        let today = new Date();
        let created = this.changeTime(time);
        if (
          Math.ceil((today - created) / 1000 / 60) < 60 &&
          Math.ceil((today - created) / 1000 / 60) > 0
        )
          return [Math.floor((today - created) / 1000 / 60) + "분 전", true];

        if (
          Math.floor((today - created) / 60 / 1000 / 60) < 4 &&
          Math.floor((today - created) / 60 / 1000 / 60) > 0
        )
          return [
            Math.floor((today - created) / 60 / 60 / 1000) + "시간 전",
            true
          ];
        else if (
          Math.floor((today - created) / 60 / 1000 / 60) < 24 &&
          Math.floor((today - created) / 60 / 1000 / 60) > 0
        )
          return [
            Math.floor((today - created) / 60 / 1000 / 60) + "시간 전",
            false
          ];
        else {
          let year = created.getFullYear();
          let month =
            created.getMonth() + 1 < 10
              ? "0" + (created.getMonth() + 1)
              : created.getMonth() + 1;
          let date =
            created.getDate() < 10
              ? "0" + created.getDate()
              : created.getDate();
          let hour =
            created.getHours() < 10
              ? "0" + created.getHours()
              : created.getHours();
          let minutes =
            created.getMinutes() < 10
              ? "0" + created.getMinutes()
              : created.getMinutes();

          if (Math.floor((today - created) / 60 / 1000 / 60) < 0) {
            return [
              String(year) +
                "." +
                String(month) +
                "." +
                String(date) +
                " " +
                String(hour) +
                ":" +
                String(minutes),
              true
            ];
          }
          return [
            String(year) +
              "." +
              String(month) +
              "." +
              String(date) +
              " " +
              String(hour) +
              ":" +
              String(minutes),
            false
          ];
        }
      };
    },
    styledText() {
      return text => {
        const idx = text.indexOf(this.$route.query.q);
        const queryLength = this.$route.query.q.length;
        if (text.indexOf(this.$route.query.q) !== -1) {
          const styledText = `${text.substring(0, idx)}<strong style="color: #175c8e;">${text.substring(idx, idx + queryLength)}</strong>${text.substring(idx + queryLength, text.length)}`;
          return styledText;
        } else {
          return text;
        }
      };
    },
    setPrefix() {
      return permalink => {
        if (permalink.indexOf("sell") !== -1) return "팝니다"
        else if (permalink.indexOf("buy") !== -1) return "삽니다"
        else return '';
      }
    }
  },
  data() {
    return {
      loadingFlag: true,
      nowPageNum: 1,
      mobileFlag: false,
      searchWord: ""
    };
  },
  watch: {
    "$route.query.q"(newValue) {
      console.log("watch")
      if (newValue === '') {
        this.handleWrongQueryException();
      } else {
        this.searchWord = newValue;
        this.nowPageNum = 1;
        this.search();
      }
      
    }
  },
  methods: {
    search() {
      console.log(this.$route.query.q)
      this.$store.dispatch("searchArticle", {
          page: this.nowPageNum,
          searchType: 1,
          searchWord: this.$route.query.q
        }).then(res => {
          this.loadingFlag = false;
        }).catch(err => {
          alert("검색 과정에서 문제가 발생했습니다.");
          this.$router.go(-1);
        })
    },
    goArticle(permalink) {
      const path = permalink.split("koreatech.in")[1];
      this.$router.push(path);
    },
    clickPageNum(pageNum) {
      this.nowPageNum = pageNum;
      this.$session.set("nowSearchPageNum", pageNum);
      this.search();
    },
    clickNextButton() {
      this.nowPageNum++;
      if (this.nowPageNum === this.totalResultPageNum + 1) {
        alert("마지막 페이지입니다.");
        this.nowPageNum--;
      }
      this.search();
      this.$session.set("nowSearchPageNum", this.nowPageNum);
    },
    clickPrevButton() {
      this.nowPageNum--;
      if (this.nowPageNum === 0) {
        alert("첫 페이지입니다.");
        this.nowPageNum++;
      } else {
        this.search();
      }
      this.$session.set("nowSearchPageNum", this.nowPageNum);
    },
    removeRecentSearchWords() {
      if (confirm("전체 검색어를 모두 삭제하시겠습니까?")) {
        window.localStorage.removeItem("recentSearchWords");
        this.$store.commit("setRecentSearchWords", []);
      }
    },
    clickRecentSearchWord(word) {
      this.searchWord = word;
      this.search();
      this.$router.push(`/search?q=${encodeURIComponent(this.searchWord)}`);
    },
    removeRecentSearchWord(word) {
      if (confirm("해당 검색어를 삭제하시겠습니까?")) {
        this.$store.commit("removeSearchWord", word);
        window.localStorage.setItem("recentSearchWords", JSON.stringify(this.recentSearchWords));
      }
    },
    handleWrongQueryException() {
      alert("검색어를 입력해주세요.")
      if (this.mobileFlag) this.$router.push('/search')
      else this.$router.push('/')
    }
  },
  created() {
    this.nowPageNum = this.$session.get("nowSearchPageNum") !== undefined ? this.$session.get("nowSearchPageNum") : 1;
    window.addEventListener('beforeunload', this.search());
    if (window.innerWidth > 576) {
      this.mobileFlag = false;
    } else {
      this.mobileFlag = true;
      this.$store.dispatch("toggleSearchBarAction", true);
    }
    this.$store.dispatch("setNowFooterCategory", {
      footerCategoryIndex: 2
    });
    if (this.$route.query.q === '') {
      this.handleWrongQueryException();
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        if (window.innerWidth > 576) {
          this.mobileFlag = false;
          this.$store.dispatch("toggleSearchBarAction", false);
        } else {
          this.mobileFlag = true;
          this.$store.dispatch("toggleSearchBarAction", true);
        }
      });
    });
    this.$store.dispatch("setNowRoutingPath", {
      path: "search"
    });
    this.$store.commit("setRecentSearchWords", JSON.parse(window.localStorage.getItem("recentSearchWords")));
  },
  destroyed() {
    this.$store.dispatch("setNowRoutingPath", {
      path: ""
    });
    this.$store.dispatch("toggleSearchBarAction", false);
    this.$store.dispatch("setNowFooterCategory", {
      footerCategoryIndex: -1
    });
  }
};
</script>

<style scoped>
.result-container {
  height: 969px;
}
.mobile-search-view {
  display: none;
}

.result-text {
  font-family: NanumSquareR;
  font-size: 24px;
  font-weight: normal;
  line-height: 0.83;
  letter-spacing: normal;
  text-align: center;
  color: #9fa9b3;
}

.result {
  width: 1132px;
  margin: 0 auto;
  padding: 69px 0 0 0;
}

.result-title {
  font-family: NanumSquareEB;
  font-size: 30px;
  font-weight: bold;
  letter-spacing: normal;
  color: #175c8e;
  text-align: left;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.query-string {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
}

table {
  width: 1132px;
  border-top: 2px solid #175c8e;
  border-bottom: 1px solid #175c8e;
  border-collapse: collapse;
  margin-bottom: 22px;
}

.mobile-table {
  display: none;
}

thead tr th {
  height: 49px;
  font-family: NanumBarunGothic;
  font-size: 15px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: center;
  color: #175c8e;
  border-bottom: 1px solid #175c8e;
}
tbody tr {
  cursor: pointer;
}
tbody tr td {
  height: 69px;
  border-bottom: 1px solid #d2dae2;
  box-sizing: border-box;
  font-family: NanumBarunGothic;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  text-align: center;
  color: #252525;
}

tbody tr:last-child td {
  border-bottom: none;
}


td.category,
td.title {
  font-size: 15px;
}
td.title {
  text-align: left;
}
td.title .title__container {
  display:flex;
  align-items: center;
  justify-content: flex-start;
}

.styled-title {
  max-width: 550px;
  margin-left: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
td.author {
  color: #175c8e;
}
td.id, th.id,
td.hit, th.hit {
  width: 5%;
}
td.category, th.category,
td.author, th.author,
td.date, th.date {
  width: 10%;
}

.no-result {
  height: 618px;
  cursor: initial;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.no-result-text {
  font-family: NanumBarunGothic;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  color: #bbbbbb;
  margin-top: 30px;
}

.new-tag {
  width: 14px;
  height: 14px;
  margin-left: 5px;
}

.pagination {
  margin-top: 22px;
  margin-bottom: 40px;
  background: #ffffff;
  color: #858585;
}

.pagination .number {
  border-radius: 0;
  padding-top: 7px;
  padding-bottom: 7px;
  padding-left: 12px;
  padding-right: 12px;
  margin-left: 1px;
  margin-right: 1px;
  border: 1px #edf0f3 solid;
  font-size: 13px;
  color: #858585;
  cursor: pointer;
  background-color: #ffffff;
}

.pagination .arrow {
  border-radius: 0;
  padding-top: 7px;
  padding-bottom: 7px;
  padding-left: 14px;
  padding-right: 14px;
  margin-left: 6px;
  margin-right: 6px;
  background: #ffffff;
  border: 1px #edf0f3 solid;
  color: #858585;
  font-size: 13px;
  letter-spacing: -0.7px;
  cursor: pointer;
}

.pagination .number:hover,
.pagination .arrow:hover {
  background: #175c8e;
  color: white;
}

.pagination .active {
  background: #175c8e;
  color: white;
}

@media (max-width: 576px) {
  .result-container {
    height: auto;
  }
  .mobile-search-view {
    display: block;
    padding: 20px 16px 0 16px;
    height: 553px;
  }

  .mobile-search-view .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: NanumSquareB;
    font-size: 15px;
    letter-spacing: normal;
    color: #175c8e;
    margin-bottom: 20px;
  }
  .recent-search-word-list {
    height: 514px;
    overflow: scroll;
  }
  .search-word__container {
    display: flex;
    justify-content: space-between;
    align-items: center; 
    margin-bottom: 20px;
  }

  .search-word {
    font-family: NanumBarunGothic;
    font-size: 14px;
    color: #252525;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }

  .remove-icon {
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
  .no-result {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .no-result-text {
    font-size: 18px;
  }

  .result {
    width: 100%;
    min-height: 506px;
    margin: 0;
    padding: 20px 0 40px 0;
    box-sizing: border-box;
  }

  .result-title {
    font-size: 16px;
    font-weight: normal;
    padding: 0 16px;
    margin-bottom: 0;
  }

  .query-string {
    max-width: 68%;
  }

  .table {
    display: none;
  }

  .mobile-table {
    display: block;
    padding: 0 16px;
  }

  .mobile-table .row {
    padding: 15px 0;
    border-bottom: 1px solid #d2dae2;
  }

  .mobile-table .row:last-child {
    border-bottom: none;
  }

  .mobile-table .row .title__container {
    text-align: left;
    font-size: 15px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }

  .mobile-table .row .title__container .title {
    max-width: 70%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 3px
  }

  .mobile-table .row .sub-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    color: #9fa9b3;
  }
  .no-result {
    height: 500px;
  }
  .pagination {
    margin-bottom: 0;
  }
}
</style>