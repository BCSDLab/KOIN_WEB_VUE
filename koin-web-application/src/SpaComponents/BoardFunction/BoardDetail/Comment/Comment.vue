<template>
  <div
    v-if="mobileCommentDisplayFlag"
    :style="{top: mobileCommentPositionTop}"
    id="board-comment"
    class="board-comment">
    <div
      class="comment__container">
      <!-- 댓글 상단 박스 뷰 -->
      <comment-sub-info
        :boardId="boardId"
        :commentCount="comments.length"
        :permaLinkNotice="permaLinkNotice"
        :boardHit="boardHit">
      </comment-sub-info>


      <!-- 댓글 리스트 뷰(전체) -->
      <comment-list
        :boardId="boardId"
        :comments="comments">
      </comment-list>

      <!-- 댓글 작성 뷰 -->
      <comment-write
        @closeMobileComment="closeMobileComment"
        :tempInputRegisterComment="tempInputRegisterComment"
        :boardId="boardId">
      </comment-write>

    </div>
  </div>
</template>

<script>
  import CommentList from './Components/CommentList';
  import CommentSubInfo from './Components/CommentSubInfo';
  import CommentWrite from './Components/CommentWrite';

  export default {
    name: 'Comment',
		props: {
      boardId: {
        type: Number,
				default: 0
			},
      comments: {
        type: Array,
        default: () => []
      },
			grantEdit: {
        type: Boolean,
        default: false
      },
			permaLinkNotice: {
        type: String,
        default: ""
      },
			boardHit: {
        type: Number,
        default: 0
      },
      mobileCommentDisplayFlag: {
        type: Boolean,
        default: false
      },
      mobileCommentPositionTop: {
        type: String,
        default: ""
      }
		},
    components: {
      "comment-sub-info": CommentSubInfo,
      "comment-list": CommentList,
      "comment-write": CommentWrite
    },
    data() {
      return {
        // 댓글 작성하다가 취소하는 경우 임시로 살려두는 답변
        tempInputRegisterComment: ""
      }
    },
		methods: {
      closeMobileComment: function(tempInputRegisterComment) {
        console.log(tempInputRegisterComment)
        this.tempInputRegisterComment = tempInputRegisterComment;
        this.$emit("closeMobileComment")
      }
		},
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .comment__container {
    text-align: left;
    height: 100%;
    margin-bottom: 20px;
    border-bottom: 1px solid #175c8e;
    -ms-overflow-style: none;
    user-select: text;
    position: relative;
    background: white;
    z-index: 10;
    float: left;
  }

  .comment__container::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 576px) {
    .comment__container {
      width: 100%;
      border-bottom: none;
    }
  }
</style>
