<template>
  <div class="Index__TopBoard">
    <div class="mobile__tab">
      <div
        :style="{ 'borderBottom': selectedTab === '인기게시물' ? '2px solid #175c8e' : '2px solid #d0d6db' }"
        class="mobile__tab__title"
        @click="selectedTab = '인기게시물'">
        인기게시물
      </div>
      <div
        :style="{ 'borderBottom': selectedTab === '최근게시물' ? '2px solid #175c8e' : '2px solid #d0d6db' }"
        class="mobile__tab__title"
        @click="selectedTab = '최근게시물'">
        최근게시물
      </div>
    </div>
    <div
      v-if="!mobileFlag || selectedTab === '인기게시물'"
      class="HotBoard">
      <div class="HotBoard__Title">인기게시물</div>
      <div class="HotBoard__content">
        <div
          v-for="(rank, index) of hotBoardList"
          @click="clickList(rank.id, rank.board_id)"
          :key="rank.id"
          v-if="index < 4"
          class="contents"
        >
          <div class="contents__info">
            <span class="rank">{{ index+1 }}</span>
            <span class="board-title">{{ displayBoard(rank.board_id) }}</span>
            <span class="content-title">{{ (rank.title) }}</span>
            <span class="comment">[{{ rank.comment_count }}]</span>
            <img
              v-if="computedTime(rank.created_at)[1]"
              class="new-tag"
              src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
              alt="new-tag"
            />
          </div>
          <span class="time">{{ computedTime(rank.created_at)[0].substring(0, 10) }}</span>
        </div>
      </div>
    </div>
    <!-- <div class="line"></div> -->
    <div
      v-if="!mobileFlag || selectedTab === '최근게시물'"
      class="NewBoard">
      <div class="NewBoard__Title">최근게시물</div>
      <div class="NewBoard__content">
        <div
          v-for="(rank, index) of newBoardList"
          @click="clickList(rank.id, rank.board_id)"
          :key="rank.id"
          v-if="index < 4"
          class="contents"
        >
          <div class="contents__info">
            <span class="board-title">{{ displayBoard(rank.board_id) }}</span>
            <span class="content-title">{{ rank.title }}</span>
            <span class="comment">[{{ rank.comment }}]</span>
            <img
              v-if="computedTime(rank.time)[1]"
              class="new-tag"
              src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png"
              alt="new-tag"
            />
          </div>
          <span class="time">{{ computedTime(String(rank.time))[0].substring(0, 10) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
​
<script>
import { mapGetters } from "vuex";
import * as BOARD_ID_LIST from "../../../static/boardId";

export default {
  name: "IndexTopBoard",
  data() {
    return {
      boardIdList: BOARD_ID_LIST.default,
      selectedTab: '인기게시물',
      mobileFlag: false,
    };
  },
  methods: {
    clickList: function(id, boardId) {
      this.$store.dispatch("setNowFooterCategory", {
        footerCategoryIndex: -1
      });
      this.$session.set("specificBoardId", id);
      this.$session.set(
        "nowBoardId",
        boardId > 4 && boardId < 10 ? 4 : boardId
      );
      for (let i = 0; i < this.boardIdList.length; i++) {
        if (this.$session.get("nowBoardId") === this.boardIdList[i].boardId) {
          this.$router.push(this.boardIdList[i].path + "/" + id);
          console.log(this.boardIdList[i].boardId);
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
    },
    displayBoard: function(id) {
      if (id === 1) return "[자유]";
      else if (id === 2) return "[취업]";
      else if (id === 3 || id === 5) return "[일반]";
      else if (id === 4) return "[공지]";
      else if (id === 6) return "[장학]";
      else if (id === 7) return "[학사]";
      else if (id === 8) return "[취업]";
      else if (id === 9) return "[코인]";
      else if (id === 10) return "[질문]";
      else if (id === -1) return "[익명]";
      else return "";
    }
  },
  computed: {
    ...mapGetters({
      hotBoardList: "hotBoardList",
      newBoardList: "newBoardList"
    })
  },
  created() {
    this.$store.dispatch("setHotBoardList", {});
    this.$store.dispatch("getIndexHotBoard");
    this.$store.dispatch("getIndexNewBoard");
    if (window.innerWidth < 576) this.mobileFlag = true;
    else this.mobileFlag = false;
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        if (window.innerWidth < 576) this.mobileFlag = true;
        else this.mobileFlag = false;
      })
    })
  }
};
</script>
​
<style scoped>
.Index__TopBoard {
  width: 1132px;
  height: 150.5px;
  display: flex;
}
.mobile__tab {
  display: none;
}
.HotBoard {
  width: 50%;
}
.NewBoard {
  width: 50%;
  box-sizing: border-box;
  padding-left: 39px;
}

.HotBoard__Title,
.NewBoard__Title {
  font-family: NanumSquare;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.15;
  text-align: left;
  margin-bottom: 20px;
  color: #175c8e;
}
.HotBoard__content {
  width: 100%;
  padding-right: 19.5px;
  border-right: 1px solid #eeeeee;
}
.NewBoard__content {
  width: 100%;
}
.HotBoard__content .contents:last-child,
.NewBoard__content .contents:last-child {
  margin-bottom: 0;
}
.contents {
  width: 100%;
  margin-bottom: 13px;
  font-family: NanumBarunGothic;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.contents__info {
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: normal;
}
.rank {
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  text-align: center;
  font-size: 13px;
  font-family: NanumSquareB;
  font-weight: bold;
  line-height: 1.08;
  text-align: left;
  color: #bbbbbb;
  border: 1px solid #bbbbbb;
  padding: 1px 5px;
  border-radius: 4px;
  margin-right: 10px;
}
.board-title {
  font-size: 15px;
  font-weight: bold;
  line-height: normal;
  text-align: left;
  margin-right: 10px;
  line-height: 1.2;
  color: #252525;
}
.content-title {
  max-width: 330px;
  font-size: 15px;
  line-height: normal;
  text-align: left;
  color: #252525;
  margin-right: 10px;
  line-height: 1.2;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-wrap: normal;
}
.comment {
  opacity: 0.6;
  font-size: 12px;
  line-height: 1.17;
  text-align: left;
  color: #9fa9b3;
  margin-right: 10px;
}
.new-tag {
  width: 14px;
  height: 14px;
}
.time {
  font-size: 13px;
  line-height: 1.15;
  text-align: right;
  color: #175c8e;
}
@media (max-width: 576px) {
  .Index__TopBoard {
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin: 31px 0 0 0;
  }
  .mobile__tab {
    display: flex;
  }
  .mobile__tab__title {
    width: 50%;
    font-family: NanumSquare;
    font-size: 15px;
    font-weight: bold;
    line-height: 1.13;
    letter-spacing: normal;
    text-align: center;
    color: #175c8e;
    padding-bottom: 11px;
  }
  .HotBoard__Title, .NewBoard__Title {
    display: none;
  }
  .rank {
    display: none;
  }
  .HotBoard, .NewBoard {
    width: 100%;
    padding: 21px 0 0 0;
  }
  .HotBoard__content {
    padding: 0;
  }
  .contents {
    margin-bottom: 14px;
  }
  .contents__info {
    font-size: 14px;
  }
  .content-title {
    max-width: 60%;
  }
  .board-title {
    margin-right: 2px;
  }
  .comment {
    font-size: 15px;
    margin-right: 3px;
  }
  .time {
    font-family: NanumBarunGothic;
    font-size: 11px;
    line-height: 1.09;
    letter-spacing: normal;
    color: #252525;
    white-space: nowrap;
  }
}
</style>
