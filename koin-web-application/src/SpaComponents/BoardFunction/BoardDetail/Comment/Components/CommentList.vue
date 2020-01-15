<template>
  <div class="comments">
    <!-- 단일 댓글 -->
    <div 
      class="comment"
      v-for="comment in comments"
      :key="comment.key">
      
      <!-- 댓글 1개 > 상단 정보(닉네임, 일시, 수정, 삭제)에 대한 부분 -->
      <div class="comment__upper-info">
        
        <!-- 작성자 -->
        <div class="comment__author">{{ comment.nickname }}</div>
        <!-- 작성일시 -->
        <div class="comment__created">{{ computedTime(comment.created_at)[0] }}</div>
        <!-- 작성일시 new logo -->
        <div
          v-if="computedTime(comment.created_at)[1]"
          class="n">
          <img src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png">
        </div>

        <!-- 삭제 버튼 -->
        <div
          class="comment__remove"
          v-if="comment.grantDelete"
          @click="removeComment(comment.id)">
          <img src="https://static.koreatech.in/upload/a603ece7567e3b28552fe5193f0453e6.png">
        </div>
      </div>
      <!-- 댓글 내용 -->
      <div class="comment__content__conatiner">
        <div
          :id="'comment__content__inner-' + comment.id"
          class="comment__content__inner">
          <!-- 댓글 내용 -->
          <div
            class="comment__content"
            v-html="convertUrlTypeStringToAtag(comment.content)">
          </div>

          <!-- 댓글 수정 area 보이게하는 btn -->
          <button
            class="comment__adjust-outer-btn"
            v-if="boardId === -1 || comment.grantEdit"
            @click="showCommentAdjustArea(comment.id, comment.content)">수정
          </button>
        </div>

        <!-- 댓글 수정 area -->
        <div
          :id="'comment__adjust-area-' + comment.id"
          class="comment__adjust-area">
          <!-- 수정내용 입력 창 -->
          <textarea
            type="text"
            v-model="inputAdjustComment">
          </textarea>
          <!-- 익게 input password -->
          <input
            placeholder="비밀번호를 입력해주세요."
            class="comment__adjust-area__anonymous-pw"
            v-if="boardId === -1"
            v-model="anonymousCommentPassword"
            type="password">
          <!-- 공통 댓글 수정 취소 btn -->
          <button
            @click="cancelAdjustComment(comment.id)"
            class="comment__adjust-area__cancel-btn">
            취소
          </button>
          <!-- 공통 댓글 수정 btn -->
          <button
            @click="adjustComment(comment.id)"
            class="comment__adjust-area__adjust-btn">
            수정
          </button>
          <!-- 익명 댓글 삭제 btn -->
          <button
            v-if="boardId === -1"
            @click="removeComment(comment.id)"
            class="comment__adjust-area__remove-btn">
            삭제
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BoardMixin from '../../../BoardMixins/boardMixin'

  export default {
    name: 'CommentList',
    mixins: [ BoardMixin ],
    props: {
      boardId: {
        type: Number,
        default: 0
      },
      comments: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        inputAdjustComment: "",
        anonymousCommentPassword: ""
      }
    },
    methods: {
      /**
       * 댓글 삭제
       * @param commentId : 댓글 uid
       */
      removeComment: function (commentId) {
        let payload = {
          id: commentId,
          articleId: this.$session.get("specificBoardId"),
          token: this.$session.get("token"),
          boardId: this.boardId
        };

        // 익명 게시판일 경우 추가 예외 처리
        if (this.boardId === -1) {
          // 댓글 비밀번호 유효성 체크
          if (!this.checkInputValid(this.anonymousCommentPassword, "댓글 비밀번호", 500)) {
            return;
          }
          payload['anonymousCommentPassword'] = this.convertCleanString(this.anonymousCommentPassword);
        }

        if (confirm("삭제하시겠습니까?") === true) {
          this.$store.dispatch('removeComment', payload).then((data) => {
            // 성공적으로 삭제 시 게시글 최신화
            if (data.status === 200 || data.status === 201) {
              this.refreshSpecificBoard(this.boardId);
            }
            else if (data.status === 401) {
              alert("다시 로그인해주세요.");
            }
            else {
              alert("서버와의 연결이 끊어졌습니다.");
            }
            this.inputAdjustComment = "";
            this.anonymousCommentPassword = "";
          }, (error) => {
            alert("비밀번호가 틀렸습니다.");
          })
        }
      },
      /**
       * 댓글 수정 하기
       * @param commentId : comment uid
       */
      adjustComment: function (commentId) {
        let payload = {
          id: commentId,
          articleId: this.$session.get("specificBoardId"),
          token: this.$session.get("token"),
          boardId: this.$session.get("nowBoardId"),
          content: this.convertCleanString(this.inputAdjustComment),
        };

        // 익명 게시판일 경우 추가 예외 처리
        if (this.boardId === -1) {
          // 댓글 비밀번호 유효성 체크
          if (!this.checkInputValid(this.anonymousCommentPassword, "댓글 비밀번호", 500)) {
            return;
          }
          payload['anonymousCommentPassword'] = this.convertCleanString(this.anonymousCommentPassword);
        }

        // 댓글 유효성 체크
        if (!this.checkInputValid(this.inputAdjustComment, "댓글", 500)) {
          return;
        }

        if (confirm("수정하시겠습니까?") === true) {
          this.$store.dispatch('adjustComment', payload).then((data) => {
            if (data.status === 200 || data.status === 201) {
              // 수정 창 닫기
              this.cancelAdjustComment(commentId);
              // 댓글 새로고침
              this.refreshSpecificBoard(this.boardId);
              // 값 초기화
              this.inputAdjustComment = "";
              this.anonymousCommentPassword = "";
            }
          }, (error) => {
            if (error === 403) {
              if(this.$session.get("nowBoardId")!==-1){
                alert("다시 로그인해주세요.");
                this.inputAdjustComment = "";
                this.anonymousCommentPassword = "";
              }
              else {
                alert("비밀번호가 틀렸습니다.")
              }
            }
            else if (error === 412){
              alert("입력형식이 잘못됬습니다.")
              this.inputAdjustComment = "";
              this.anonymousCommentPassword = "";
            }
            else {
              alert('서버와의 통신이 불안정합니다.');
              this.inputAdjustComment = "";
              this.anonymousCommentPassword = "";
            }
          })
        }
      },

      /**
       * 수정 창 출력
       * @param commentId : comment UID
       * @param commentContent : 수정을 하기 전의 현재 댓글 내용
       */
      showCommentAdjustArea: function(commentId, commentContent) {

        this.inputAdjustComment = commentContent;
        // comment inner 디스플레이 분기 로직
        // 이거 댓글 많아지면 엄청 오래걸릴거임 ;
        Array.from(document.getElementsByClassName("comment__content__inner")).forEach(function(commentContentInner) {
          commentContentInner.style.display = "block";
        });
        document.getElementById("comment__content__inner-" + commentId).style.display = "none";

        // 수정 input 디스플레이 분기 로직
        Array.from(document.getElementsByClassName("comment__adjust-area")).forEach(function(commentAdjustArea) {
          commentAdjustArea.style.display = "none";
        })
        document.getElementById("comment__adjust-area-" + commentId).style.display = "block";
      },

      /**
       * 수정 취소
       * @param commentId : comment UID
       */
      cancelAdjustComment: function (commentId) {
        document.getElementById("comment__content__inner-" + commentId).style.display = "block";
        document.getElementById("comment__adjust-area-" + commentId).style.display = "none";
      },
    },
    created() {
      console.log(this.computedTime())
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .comments .comment {
    padding-top: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
  }

  .comments .comment .comment__upper-info {
    display: flex;
    margin-bottom: 4px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .comments .comment .comment__upper-info .comment__author {
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    letter-spacing: -0.7px;
    color: #175c8e;
    margin-right: 12px;
  }

  .comments .comment .comment__upper-info .comment__created {
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    letter-spacing: -0.7px;
    color: #858585;
    margin-right: 10px;
  }

  .comments .comment .comment__upper-info .comment__remove {
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #252525;
    cursor: pointer;
    margin-right: 10px;
    user-select: none;
  }

  .temp-comment__remove {
    font-size: 11px;
    position: relative;
    left: 3px;
    border: none;
    background: #d32525;
    padding: 6px 14px;
    padding-top: 4px;
    padding-bottom: 5px;
    top: 0px;
    margin-right: 1px;
    text-align: center;
    color: white;
    height: 23px;
    user-select: none;
    letter-spacing: -0.7px;
  }

  .comment__remove img {
    width: 10px;
    position: relative;
    top: 1px;
  }

  .comment__content__conatiner {
    padding-left: 20px;
    padding-right: 20px;
  }

  .comments .comment .comment__content {
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #252525;
    max-width: 100%;
    height: 100%;
    word-break: break-all;
    padding-bottom: 9px;
  }

  .comment__adjust-outer-btn {
    font-size: 11px;
    position: relative;
    border: 1px #d2dae2 solid;
    padding: 6px 13px;
    padding-top: 3px;
    text-align: center;
    color: #858585;
    height: 23px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    margin-top: 4px;
    letter-spacing: -0.6px;
    background-color: #ffffff;
  }

  /* 댓글쓰기 */
  .comments .comment-write {
    margin: 32px 20px 27px;
    height: 74px;
    width: 795px;
  }

  .write-box {
    margin-bottom: 27px;
    height: 74px;
    width: 705px;
    float: left;
    border: 1px #bbbbbb solid;
    border-right: none;
  }

  .comments .comment-write .counter {
    padding-left: 16px;
    font-size: 13px;
    color: #bebebe;
    width: 691px;
    height: 16px;
    position: relative;
    bottom: -1px;
    margin-bottom: 15px;
    margin-top: 49px;
    z-index: 10;
    user-select: none;
  }

  .comment__adjust-area textarea {
    height: 29px;
    width: 756px;
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 13px;
    padidng-bottom: 10px;
    border: solid 1px #d2dae2;
    resize: none;
    color: #252525;
    font-size: 13px;
    letter-spacing: -0.7px;
  }

  .comment-adjust-box button {

  }

  .comments .comment-write button {
    float: left;
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    letter-spacing: -0.7px;
    border: 1px #bbbbbb solid;
    color: black;
    width: 87px;
    height: 76px;
    cursor: pointer;
    user-select: none;
    background: white;
  }

  /* 댓글수정 */
  .comments .comment__adjust-area {
    display: none;
    width: 756px;
  }

  .comments .comment__adjust-area .comment__author {
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    letter-spacing: -0.7px;
    color: #175c8e;
    margin-right: 12px;
  }

  .comments .comment__adjust-area button {
    font-family: NanumBarunGothic, serif;
    letter-spacing: -0.7px;
    user-select: none;
    font-size: 11px;
    resize: none;
    color: white;
    background: #175c8e;
    border: 1px #175c8e solid;
    padding: 5px 14px 4px;
    margin-top: 3px;
  }

  .comments .comment__adjust-area .comment__adjust-area__cancel-btn {
    border: 1px #d2dae2 solid;
    color: #858585;
    background-color: #ffffff;
  }

  .comments .comment__adjust-area .comment__adjust-area__remove-btn {
    border: 1px #d32525 solid;
    color: #ffffff;
    background-color: #d32525;
  }

  .n img {
    width: 11.5px;
    height: 12px;
    position: relative;
    margin-right: 12px;
    bottom: 1px;
    user-select: none;
  }

  button {
    cursor: pointer;
  }

  .comment__adjust-area__anonymous-pw {
    width: 140px;
    border: 1px #d2dae2 solid;
    color: #858585;
    background-color: #ffffff;
    padding: 2px 14px 4px;
    margin-top: 3px;
  }

  .comment__adjust-area__anonymous-pw::placeholder {
    font-size: 12px;
  }

  @media (max-width: 576px) {
    .comments {
      width: 100%;
      border-bottom: 1px #ececec solid;
      margin-top: -1px;
    }

    .comments .comment .comment__upper-info, .comment__content__conatiner {
      padding-left: 16px;
      padding-right: 16px;
    }

    .comments .comment .comment__content, .comments .comment .comment__upper-info .comment__author, .comments .comment .comment__upper-info .comment__created {
      font-size: 14px;
    }

    .comments .comment .comment__content {
      font-weight: 300;
    }

    .comments .comment .comment__upper-info .comment__author {
      font-weight: 400;
      color: black;
    }

    .comments .comment .comment__upper-info .comment__created {
      position: relative;
      font-size: 14px;
    }
    .comments .comment__adjust-area {
      width: 100%;
    }

    .comment__adjust-area textarea {
      width: calc(100% - 34px);
    }

    .comment__adjust-outer-btn {
      font-size: 14px;
      height: 28.7px;
      border: solid 1px #a1a1a1;
      color: #252525;
    }

    .comments .comment {
      padding-top: 15px;
      padding-bottom: 15px;
    }

    .first-comment {
      padding-top: 20px;
      padding-bottom: 10px;
    }

    .last-comment {
      padding-top: 10px;
      padding-bottom: 20px;
    }

  }
</style>
