<template>
  <div class="comment-write">
    <input
      placeholder="댓글 닉네임"
      class="temp-comment-nick-input"
      v-model="anonymousCommentNickname"
      v-if="boardId===-1"
      type="text">
    <input
      placeholder="댓글 비밀번호"
      class="temp-comment-pw-input"
      v-model="anonymousCommentPassword"
      v-if="boardId===-1"
      type="password">
    <div
      class="write-box"
      @click="nonMemberCheck">
      <div
        v-if="this.$session.get('userInfo') !== undefined && this.$session.get('nowBoardId') !== -1"
        class="mobile__my__nickname">
        {{ this.$session.get('userInfo').nickname }}
      </div>
      <textarea
        placeholder="댓글을 작성해주세요."
        type="text"
        v-model="inputRegisterComment">
      </textarea>
      <div class="counter">{{ computedCommentCount }}/3000</div>
    </div>
    <button
      class="mobile__cancel-btn"
      type="button"
      @click="cancelComment()">
      취소
    </button>
    <button
      class="register-btn"
      type="button"
      @click="registerComment()">등록
    </button>
  </div>
</template>

<script>
  import BoardMixin from '../../../BoardMixins/boardMixin'

  export default {
    name: 'CommentWrite',
    mixins: [BoardMixin],
    props: {
      boardId: {
        type: Number,
        default: 0
      },
      tempInputRegisterComment: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        inputRegisterComment: "",
        anonymousCommentNickname: "",
        anonymousCommentPassword: ""
      }
    },

    computed: {
      computedCommentCount: function () {
        if (this.inputRegisterComment !== '') {
          if (this.$session.get('userInfo') === undefined && this.$session.get("nowBoardId") !== -1) {
            if (confirm('로그인해야 작성할 수 있습니다. 로그인하시겠습니까?')) {
              this.$router.push('/login');
            } else {
              this.inputRegisterComment = '';
            }
          }
        }
        if (this.inputRegisterComment.length > 3000) {
          alert("3000자 이상 입력할 수 없습니다.");
          this.cutComment();
        }
        return this.inputRegisterComment.length;
      }
    },
    methods: {
      cancelComment: function() {
        this.$emit('closeMobileComment', this.inputRegisterComment)
			},
      registerComment: function () {
        // 스크립트 제거 > 엔티티코드 변환
        let payload = {
          content: this.convertCleanString(this.inputRegisterComment),
          articleId: this.$session.get("specificBoardId"),
          boardId: this.boardId,
          token: this.$session.get("token")
        };

        // 익명 게시판일 경우 추가 예외 처리
        if (this.boardId === -1) {
          // 댓글 닉네임 유효성 체크
          if (!this.checkInputValid(this.anonymousCommentNickname, "댓글 닉네임", 500)) {
            return;
          }
          payload['anonymousCommentNickname'] = this.convertCleanString(this.anonymousCommentNickname);
          // 댓글 비밀번호 유효성 체크
          if (!this.checkInputValid(this.anonymousCommentPassword, "댓글 비밀번호", 500)) {
            return;
          }
          payload['anonymousCommentPassword'] = this.convertCleanString(this.anonymousCommentPassword);
        }

        // 댓글 유효성 체크
        if (!this.checkInputValid(this.inputRegisterComment, "댓글", 500)) {
          return;
        }

        this.$store.dispatch('registerComment', payload).then((data) => {
          if (data.status === 200 || data.status === 201) {
            alert("댓글이 등록되었습니다.");
            this.inputRegisterComment = "";
            this.anonymousCommentNickname = "";
            this.anonymousCommentPassword = "";
            this.refreshSpecificBoard(this.boardId);
          } else if (data.status === 401) {
            alert("다시 로그인해주세요.")
          } else {
            alert("서버와의 연결이 끊어졌습니다.")
          }
        }, (error) => {
          if (error.message.indexOf('412') !== -1) {
            alert("닉네임이 필요합니다.");
            this.$store.dispatch('nicknameFlagCheck', {
              nickname: this.$session.get("userInfo").nickname
            });
            this.$router.replace('/changeinfo');
          } else {
            alert("더 이상 데이터를 불러올 수 없습니다.");
          }
        })
      },
      // 댓글 입력 시 로그인 체크
      nonMemberCheck() {
        if (this.$session.get('userInfo') === undefined && this.$session.get("nowBoardId") !== -1) {
          if (confirm('로그인해야 작성할 수 있습니다. 로그인하시겠습니까?')) {
            this.$router.push('/login');
          }
        }
      },

      // 글자 수 커팅
      cutComment: function () {
        this.inputRegisterComment = this.inputRegisterComment.substring(0, 3000);
      },
    },
    created() {
      if(this.tempInputRegisterComment !== "") {
        if(confirm("이전에 작성하시던 댓글이 존재합니다. \n이어서 작성하시겠습니까?") === true) {
          this.inputRegisterComment = this.tempInputRegisterComment;
        }
        else {
          this.tempInputRegisterComment = "";
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	/* 댓글쓰기 */
	.comment-write {
		margin: 32px 20px 27px;
		height: 100%;
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

	.comment-write .counter {
		padding-left: 12px;
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

	.comment-write textarea {
		resize: none;
		font-family: NanumBarunGothic, serif;
		font-size: 13px;
		font-weight: normal;
		font-style: normal;
		font-stretch: normal;
		line-height: normal;
		letter-spacing: -0.7px;
		padding-right: 10px;
		color: #175c8e;
		width: 691px;
		padding: 10px;
		padding-bottom: 0;
		scroll-snap-margin-bottom: 2000px;
		height: 45px;
		z-index: 13;
		float: left;
		border: none;
	}

	.comment-write textarea::placehoder {
		color: #e3e3e3;
	}

	.board-comment .comment-write button {
		float: left;
		font-family: NanumBarunGothic, serif;
		font-size: 13px;
		font-weight: normal;
		font-style: normal;
		font-stretch: normal;
		line-height: normal;
		letter-spacing: -0.7px;
		border: 1px #bbbbbb solid;
		color: black;
		width: 87px;
		height: 76px;
		cursor: pointer;
		user-select: none;
		background: white;
	}


	.temp-comment-nick-input {
		padding: 7px 8px;
		font-size: 13px;
		border: 1px #bbbbbb solid;
		margin-bottom: 10px;
		width: 70px;
		margin-right: 5px;
	}

	.temp-comment-pw-input {
		padding: 7px 8px;
		font-size: 13px;
		border: 1px #bbbbbb solid;
		margin-bottom: 10px;
		width: 80px;
	}

	.temp-comment-adjust-pw-input {
		position: relative;
		left: -46px;
		padding: 4px 8px;
		border: 1px #d2dae2 solid;
		font-size: 11px;
		top: 1px;
	}
	.mobile__my__nickname {
		display: none;
	}
	.mobile__cancel-btn {
		display: none;
	}

	@media (max-width: 576px) {
		.comment-write {
			width: calc(100% - 32px);
			float: left;
			margin: 15px 20px 52px 16px;
		}

		.comment-write textarea{
			width: calc(100% - 24px);
			padding: 4px 12px 12px;
			color: #252525
		}

		.write-box {
			width: calc(100% - 2px);
			border: 1px #bbbbbb solid;
			margin-bottom: 11px;
			height: 100px;
		}

		.comment-write .counter {
			display: none;
		}

		.board-comment .comment-write button {
			width: calc(50% - 5px);
			height: 28px;
		}

		.temp-comment-nick-input {
			width: calc(50% - 23px);
			margin-right: 7px;
		}

		.temp-comment-pw-input {
			float: right;
			width: calc(50% - 24px);
		}

		.mobile__my__nickname {
			display: block;
			font-size: 14px;
			font-weight: normal;
			line-height: 1.71;
			letter-spacing: -0.7px;
			color: #252525;
			padding-left: 12px;
			padding-top: 11px;
		}

		.mobile__cancel-btn {
			display: block;
			margin-right: 10px;
		}
	}


</style>
