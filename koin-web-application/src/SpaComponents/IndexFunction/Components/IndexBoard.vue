<template>
  <div class="board-list">
    <div
      @click="clickTitle()"
      class="board-title">{{ title }}</div>
    <div
      class="article"
      v-for="(board, index) of boards"
      :key="board.id"
      @click="clickBoard(board.id)">
      <div class="row title-row">
        <div
          class="titles"
          :class="{first: index === 0, title: index!== 0}">
          <span
            class="type"
            v-if="board.board_id === 5">
            [일반공지]
          </span>
          <span
            class="type"
            v-if="board.board_id === 6">
            [장학공지]
          </span>
          <span
            class="type"
            v-if="board.board_id === 7">
            [학사공지]
          </span>
          <span
            class="type"
            v-if="board.board_id === 8">
            [취업공지]
          </span>
          <span
            class="type"
            v-if="board.board_id === 9">
            [코인공지]
          </span>
          {{ board.title }}
        </div>
        <i
          :class="{firstTitle: index === 0}"
          v-if="computedTime(board.created_at)[1]"
          class="n">
          <img src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png">
        </i>
      </div>
      <div
        v-if="index === 0"
        class="row content-row">
        <div class="content-first">{{ computedContent(board.content) }}</div>
      </div>
      <div
        class="row footer-row"
        :class="{firstFooter: index===0, lastFooter: index===3}">
        <span class="nickname">
          {{ board.nickname }}
        </span>
        <span class="time">
          {{ computedTime(board.created_at)[0] }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
  import * as BOARD_ID_LIST from '../../../static/boardId';

  export default {
    name: 'IndexBoard',
    props: {
      boards: {
        type: Array,
        default: function () { return [] }
      },
      category: {
        type: Number,
        default: function() { return 0 }
      }
    },
    data() {
      return {
        boardIdList: BOARD_ID_LIST.default,
        today: new Date()
      }
    },
    computed: {
      title: function() {
        for (let i = 0; i < this.boardIdList.length; i++) {
          if (this.category === this.boardIdList[i].boardId) {
            return this.boardIdList[i].title;
          }
        }
      },
    },
    methods: {
      clickTitle: function() {
        this.$store.dispatch("setNowFooterCategory", {
          footerCategoryIndex: -1
        });
        for (let i = 0; i < this.boardIdList.length; i++) {
          if (this.category === this.boardIdList[i].boardId) {
            this.$session.set("nowBoardId",this.category);
            this.$router.push(this.boardIdList[i].path);
          }
        }
      },
      clickBoard: function(id) {
        let boardId = this.category;
        this.$session.set("specificBoardId", id);
        this.$session.set("nowBoardId",(boardId > 4 && boardId < 10) ? 4 : boardId);
        for (let i = 0; i < this.boardIdList.length; i++) {
          if (this.$session.get("nowBoardId") === this.boardIdList[i].boardId) {
            this.$store.dispatch("setNowFooterCategory", {
              footerCategoryIndex: -1
            });
            this.$router.push(this.boardIdList[i].path+'/'+id);
          }
        }
      },
      changeTime: function(time) {
        let times = time.split(" ");
        let date = times[0].split("-");
        let tim = times[1].split(":");
        let created = new Date();
        created.setFullYear(date[0]);
        created.setMonth(date[1]-1);
        created.setDate(date[2]);
        created.setHours(tim[0]);
        created.setMinutes(tim[1]);
        created.setSeconds(tim[2]);
        return created;
      },
      computedTime: function(time) {
        let created = this.changeTime(time);

        if ( Math.ceil((this.today - created)/1000/60) < 60 && Math.ceil((this.today - created)/1000/60) > 0 )
          return [ Math.floor((this.today - created)/1000/60) + "분 전", true ];

        if ( Math.floor((this.today - created)/60/1000/60) < 4 &&  Math.floor((this.today - created)/60/1000/60) > 0 )
          return [ Math.floor((this.today - created)/60/60/1000) + "시간 전", true ];

        else if ( Math.floor((this.today - created)/60/1000/60) < 24 &&  Math.floor((this.today - created)/60/1000/60) > 0 )
          return [ Math.floor((this.today - created)/60/1000/60) + "시간 전", false ];

        else{
          let year = created.getFullYear();
          let month = created.getMonth()+1 < 10 ? "0"+(created.getMonth()+1) : created.getMonth()+1;
          let date = (created.getDate() < 10 )? "0"+created.getDate() : created.getDate();
          let hour = created.getHours() < 10 ? "0"+created.getHours() : created.getHours();
          let minutes = created.getMinutes() < 10 ? "0"+created.getMinutes() : created.getMinutes();

          if(Math.floor((this.today - created)/60/1000/60) < 0){
            return [String(year)+"."+String(month)+"."+String(date)+" "+String(hour)+":"+String(minutes), true]
          }
          return [String(year)+"."+String(month)+"."+String(date)+" "+String(hour)+":"+String(minutes), false]
        }
      },
      computedContent: function(content) {
        return content.length > 87 ? content.substring(0,87) + "..." : content;
      },
      computedTitle: function(content) {
        return content.length > 25 ? content.substring(0,25) + "..." : content;
      }
    },
    created() {

    },
  }
</script>
<style scoped>
  .row {
    width: 100%;
    float: left;
  }
  .firstFooter{
    padding-top: 10px;
  }
  .footer-row{
    padding-bottom: 15px;
    border-bottom: 1px #d2dae2 solid;
  }
  .title-row{
    padding-bottom: -2px;
  }
  .board-title {
    text-align: left;
    font-size: 20px;
    font-weight: 800;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -1px;
    color: #175c8e;
    margin-bottom: 17px;
    font-family: "NanumSquare", serif;
    cursor: pointer;
  }
  .article {
    text-align: left;
    cursor: pointer;
    width: 100%;
    font-size: 15px;
  }
  .first {
    float:left;
    max-width:94.5%;
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -1px;
    text-align: left;
    color: #252525;
    padding-top: 9px;
    border-top: none;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 5px;
    margin-right: -2px;
  }
  .article .title {
    float:left;
    max-width:94.5%;
    font-size: 15px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.8px;
    text-align: left;
    color: #252525;
    padding-top: 19px;
    padding-right: 3px;
    margin-bottom: 8px;
    margin-right: -2px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .content-first {
    font-size: 13px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.54;
    letter-spacing: -0.7px;
    text-align: left;
    color: #858585;
    margin-top: 8px;
    height: 50px;
    margin-bottom: 5px;

    word-wrap:break-word;
  }
  .article .n {
    width: 3%;
    float: left;
  }
  .article .n img{
    width: 13.7px;
    height: 14px;
    position: relative;
    top: 20px;
    margin-left: 6px;
  }

  .firstTitle{
    position: relative;
    bottom: 8px;
  }
  .article .nickname {
    font-size: 13px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.38;
    letter-spacing: -0.7px;
    text-align: left;
    color: #175c8e;
    padding-right: 14px;
  }
  .article .time {
    font-size: 12px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: -0.6px;
    text-align: left;
    color: #858585;
  }
  .type {
    font-weight: 600;
  }
  div {
    display: block;
  }

  .lastFooter {
    border-bottom: 0;
  }

  @media (max-width: 576px) {
    .first {
      font-size: 16px;
      margin-bottom: 6px;
    }

    .article .title {
      font-size :14px;
      margin-bottom: 2px;
    }

    .article .footer-row {
      padding-bottom: 13px;
    }
    .title-row {
      margin-bottom: 4px;
      width: 100%;
    }
    .board-title {
      margin-bottom: 10px;
    }
    .titles {
      width: 100%;
    }

    .board-list {
      width: 100%;
    }
  }
</style>
