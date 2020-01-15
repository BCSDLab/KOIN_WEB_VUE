<template>
  <div class="container-rank">
    <div class="top">
      <div class="titles">가장 많이 본 게시글</div>
      <div
        v-for="(rank, index) of hotBoardList"
        @click="clickList(rank.id, rank.board_id)"
        :key="rank.id"
        class="contents">
        <span class="rank">{{ index+1 }}</span>
        <span class="content-title">{{ rank.title }}</span>
      </div>
    </div>
    <div class="links">
      <a
        class="link"
        v-for="(link, index) of linkList"
        :class="{odd: index%2===0}"
        :key="link.id"
        :href="link.link"
        target="_blank">
        <img :src="link.image">
      </a>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import * as BOARD_ID_LIST from '../../../static/boardId';

  export default {
    name: 'BoardRank',
    methods: {
      clickList:function (id, boardId) {
        this.$session.set("specificBoardId", id);
        this.$session.set("nowBoardId",(boardId > 4 && boardId < 10) ? 4 : boardId);
        for (let i = 0; i < this.boardIdList.length; i++) {
          if (this.$session.get("nowBoardId") === this.boardIdList[i].boardId) {
            this.$router.push(this.boardIdList[i].path+'/'+id);
          }
        }
      }
    },
    data() {
      return {
        boardIdList: BOARD_ID_LIST.default,
        linkList: [
          {
            title: ["코리아텍", "바로가기"],
            link: "https://www.koreatech.ac.kr/kor.do",
            image: "https://static.koreatech.in/assets/img/banner_koreatech.png"
          },
          {
            title: ["아우누리", "바로가기"],
            link: "https://portal.koreatech.ac.kr/login.jsp?sso=ok",
            image: "https://static.koreatech.in/assets/img/banner_awoonori.png"
          },
          {
            title: ["새로운 서비스", "요청하기"],
            link: "https://docs.google.com/forms/d/1VEuxVK9ioVRZN36eb6m0UClyTJwW4lYiKLWcaQw2JzQ/edit",
            image: "https://static.koreatech.in/assets/img/banner_add.png"
          },
          {
            title: ["BCSDLab", "알아보기"],
            link: "http://bcsdlab.com/",
            image: "https://static.koreatech.in/assets/img/banner_bcsd.png"
          },
        ],
        ranks: [
          {title: "test1"},
          {title: "test2"},
          {title: "test3"},
          {title: "test4"},
          {title: "test5"},
          {title: "test6"},
          {title: "test7"},
          {title: "test8"},
          {title: "test9"},
          {title: "test10"},
        ],
        msg: 'Welcome to Your Vue.js App'
      }
    },
    computed: {
      ...mapGetters({
        hotBoardList: 'hotBoardList'
      }),
    },
    created: function() {
      this.$store.dispatch("setHotBoardList",{});
    }
  }
</script>

<style scoped>
  body {
    font-family: "NanumBarunGothic",serif;
  }

  .container-rank {
    margin-top:1px;
    width: 258px;
    float:left;
  }
  .top {
    color: #252525;
    width: calc(100% - 34px);
    float: left;
    padding: 16px 17px 6px;
    border: solid 1px #d2dae2;
    text-align: left;
    margin-bottom: 16px
  }
  .top .titles {
    color: #252525;
    font-size: 15px;
    font-family: NanumSquare, serif;
    font-weight: 700;
    letter-spacing: -0.8px;
    margin-bottom: 19px;
  }
  .top .rank {
    color: #175c8e;
    float: left;
    width: 20px;
    display: inline-block;
    font-weight: 400;
    text-align: center;
    font-family: Verdana, serif;
    line-height: 0.85;
    letter-spacing: -0.8px;
    font-size: 15px;
    margin-left: -1px;
  }
  .top .content-title {
    font-family: "NanumBarunGothic",serif;
    font-size: 13px;
    color: #252525;
    float: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: calc(100% - 25px);
    padding-bottom: 9px;
    padding-left: 6px;
  }
  .top .contents {
    font-size: 13px;
    margin-top: 2px;
    cursor: pointer;
  }
  .links {
    width: 100%;
    float: left;
  }
  .links .link{
    width: 48.5%;
    float: left;
  }
  .links img{
    width: 100%;
  }
  .odd {
    margin-right: 3%;
  }
</style>
