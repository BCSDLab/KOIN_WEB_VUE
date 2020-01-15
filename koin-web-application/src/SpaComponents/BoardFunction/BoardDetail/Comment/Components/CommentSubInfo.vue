<template>
  <div class="board-sub-info">
    <span>{{ title }}</span>
    <span class="numberOfComments">{{ commentCount }}</span>개
    <span class="bar">|</span>
    조회수
		<span class="hits">{{ boardHit }}</span>

    <!-- 공지사항인 경우 원문 출력 -->
    <a 
      class="link"
      v-if="this.$session.get('nowBoardId')===4"
      target="_blank"
      :href="permaLinkNotice"><span>원문 바로가기</span></a>
  </div>
</template>

<script>
  export default {
    name: 'CommentSubInfo',
    props: {
      boardId: {
        type: Number,
        default: 0
      },
      commentCount: {
        type: Number,
        default: 0
      },
      permaLinkNotice: {
        type: String,
        default: ""
      },
      boardHit: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        title: "댓글"
      }
    },
		created() {
      switch(this.boardId) {
        case 10:
          this.title = "답변";
					break;
				default:
					this.title = "댓글";

			}
		}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .board-sub-info {
    display: block;
    border-top: 1px solid #edf0f3;
    border-bottom: 1px solid #edf0f3;
    padding: 19px;
    text-align: left;
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #858585;
  }

  .board-sub-info button {
    float: right;
    border: 1px #d2dae2 solid;
    margin-left: 19px;
    margin-right: 19px;
    position: relative;
    bottom: 2px;
  }

  .board-sub-info button:active, .board-sub-info button:hover {
    background: #175c8e;
    color: white;
  }

  .board-sub-info .numberOfComments, .board-sub-info .hits {
    color: #175c8e;
  }

  .bar {
    margin-left: 9px;
    margin-right: 9px;
  }

  @media (max-width: 576px) {
    .board-sub-info {
      display: none;
    }
  }
</style>
