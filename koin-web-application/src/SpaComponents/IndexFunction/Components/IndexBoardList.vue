<template>
  <div class="board-list-container">
    <div class="board-list-header">
      <div class="board-list">
        <div
          class="board-name"
          :class="{ active: state === board }"
          v-for="(board, index) in boards"
          :key="index"
          @click="setBoard(board)"
        >
            {{ board }}
        </div>
      </div>
      <div class="show-more" @click="showMore">
        <span class="show-more__text">더 보기</span>
        <img src="http://static.koreatech.in/assets/img/ic-more.png" alt />
      </div>
    </div>
    <div class="article-list">
      <div
        class="article"
        v-for="article in articles"
        :key="article.id"
        @click="clickArticle(article.board_id, article.id)"
      >
        <div class="article__title__container">
          <span class="type" v-if="article.board_id === 5">[일반공지]</span>
          <span class="type" v-if="article.board_id === 6">[장학공지]</span>
          <span class="type" v-if="article.board_id === 7">[학사공지]</span>
          <span class="type" v-if="article.board_id === 8">[취업공지]</span>
          <span class="type" v-if="article.board_id === 9">[코인공지]</span>
          <span class="article__title">{{ article.title }}</span>
          <span class="article__comment">
            [{{ article.comment_count }}]
          </span>
          <span
            v-if="computedTime(article.created_at)[1]"
            class="article__new-tag">
            <img src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png" alt="">
          </span>
        </div>
        <div class="article__date">
          {{ computedTime(article.created_at)[0].substring(0, 10) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import * as BOARD_ID_LIST from "../../../static/boardId";
export default {
  name: "IndexBoardList",
  computed: {
    ...mapGetters({
      indexFreeBoard: "indexFreeBoard",
      indexAnonymousBoard: "indexAnonymousBoard",
      indexJobBoard: "indexJobBoard",
      indexNoticeBoard: "indexNoticeBoard",
      indexQuestionBoard: "indexQuestionBoard"
    }),
    articles() {
      switch (this.state) {
        case "공지사항":
          return this.indexNoticeBoard;
        case "자유게시판":
          return this.indexFreeBoard;
        case "취업게시판":
          return this.indexJobBoard;
        case "익명게시판":
          return this.indexAnonymousBoard;
        case "질문게시판":
          return this.indexQuestionBoard;
        default:
          return this.indexNoticeBoard;
      }
    },
    checkDate() {
      return (articleDate) => {
        const year = new Date().getFullYear();
        const month = (new Date().getMonth() + 1) < 10 ? `0${(new Date().getMonth() + 1)}` : (new Date().getMonth() + 1);
        const date = new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate();
        const today = `${year}-${month}-${date}`
        if (today === articleDate.substring(0, 10)) return true;
        else return false;
      }
    }
  },
  data() {
    return {
      boards: ["공지사항","자유게시판","취업게시판","익명게시판","질문게시판"],
      state: "공지사항",
      boardIdList: BOARD_ID_LIST.default
    };
  },
  methods: {
    setBoard(name) {
      this.state = name;
    },
    showMore() {
      this.$store.dispatch("setNowFooterCategory", {
        footerCategoryIndex: -1
      });
      for (let i = 0; i < this.boardIdList.length; i++) {
        if (this.state === this.boardIdList[i].title) {
          this.$session.set("nowBoardId", this.boardIdList[i].boardId);
          this.$router.push(this.boardIdList[i].path);
        }
      }
    },
    clickArticle(boardId, id) {
      this.$session.set("specificBoardId", id);
      this.$session.set("nowBoardId", boardId > 4 && boardId < 10 ? 4 : boardId);
      if (this.state === '익명게시판') this.$session.set("nowBoardId", -1);
      for (let i = 0; i < this.boardIdList.length; i++) {
        if (this.$session.get("nowBoardId") === this.boardIdList[i].boardId) {
          this.$store.dispatch("setNowFooterCategory", {
            footerCategoryIndex: -1
          });
          this.$router.push(`${this.boardIdList[i].path}/${id}`);
        }
      }
    },
    changeTime(time) {
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
    },
    computedTime(time) {
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
          created.getDate() < 10 ? "0" + created.getDate() : created.getDate();
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
    }
  }
};
</script>

<style scoped>
.board-list-container {
  width: 813px;
}
.board-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.board-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.board-name {
  font-family: NanumSquare;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.14;
  letter-spacing: normal;
  text-align: center;
  color: #bbbbbb;
  padding: 0 0 5px 0;
  margin-right: 20px;
  cursor: pointer;
}

.board-name.active {
  color: #175c8e;
  border-bottom: 2px solid #175c8e;
  font-weight: 600;
}

.show-more {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.show-more__text {
  font-family: NanumBarunGothic;
  font-size: 12px;
  font-weight: normal;
  letter-spacing: -0.6px;
  color: #bbbbbb;
}

.show-more img {
  width: 15px;
  height: 15px;
}
.article-list {
  margin-top: 17px;
}
.article {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  cursor: pointer;
}
.article-list .article:last-child {
  margin-bottom: 0;
}
.article__title__container {
  width: 700px;
  height: 18px;
  font-size: 15px;
  font-weight: normal;
  line-height: 1.12;
  text-align: left;
  letter-spacing: normal;
  color: #252525;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.article__title__container .type {
  font-weight: bold;
}

.article__title {
  max-width: 550px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.article__date {
  font-family: NanumBarunGothic;
  font-size: 13px;
  font-weight: normal;
  line-height: 1.15;
  letter-spacing: normal;
  color: #175c8e;
}

.article__comment {
  opacity: 0.6;
  font-family: NanumBarunGothic;
  font-size: 12px;
  line-height: 1.17;
  letter-spacing: normal;
  color: #bbbbbb;
  margin-left: 10px;
}

.article__new-tag {
  width: 14px;
  height: 14px;
  margin-left: 10px;
}

.article__new-tag img{
  width: 14px;
  height: 14px;
}
</style>