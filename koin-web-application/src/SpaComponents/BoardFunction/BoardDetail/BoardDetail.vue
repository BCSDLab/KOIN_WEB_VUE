<template>
  <div>
    <div class="detail">
      <div v-if="!loadingFlag">
        <v-loading-bar></v-loading-bar>
      </div>
      <!-- 게시글 컴포넌트 컨테이너 -->
      <div v-if="loadingFlag">
        <!-- 컴포넌트 header 부분 -->
        <div class="header">
          <!-- ??게시판 출력 -->
          <board-header-title
            :boardId="$session.get('nowBoardId')">
          </board-header-title>
          <!-- boardtitle 우측 grant관련 버튼 그룹-->
          <grant-btns
            :myFlag="myFlag"
            :boardId="$session.get('nowBoardId')">
          </grant-btns>
        </div>

        <!-- PC/web 게시글 head: 두 줄 사이 글 제목, 작성자 및 작성 시간 -->
        <div class="board-head">
          <div class="board-title">
            <span class="type">{{ convertNoiceTitle(specificBoard.board_id) }}</span>
            <span>{{ convertCleanString(specificBoard.title) }}</span>
            <span class="board-title-num-of-comment">[{{ specificBoard.comment_count }}]</span>
            <!-- 게시글이 new 인지 아닌지 -->
            <span
              v-if="computedTime(specificBoard.created_at)[1]"
              class="n">
              <img src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png">
            </span>
          </div>

          <div class="board-info">
            <div class="author">{{ specificBoard.nickname }}</div>
            <div class="createdAt">{{ computedOnlyDate(specificBoard.created_at) }} <span>{{ computedOnlyTime(specificBoard.created_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Mobile/web 게시글 head : 구조가 달라서 따로 만듦-->
        <div
          id="mobile__board__head"
          class="mobile__board__head">
          <div class="mobile__board__title">
            <span class="type">{{ convertNoiceTitle(specificBoard.board_id) }}</span>
            <span>{{ convertCleanString(specificBoard.title) }}</span>
            <span class="mobile__comment__count">({{ specificBoard.comment_count }})</span>
          </div>
          <div class="mobile__board__info">
            <span class="mobile__hit">조회 {{ specificBoard.hit }} · </span>
            <span class="mobile__nickname">{{ specificBoard.nickname }}</span>
            <span class="mobile__createAt">{{ computedOnlyDate(specificBoard.created_at) }}</span>
          </div>
          <div class="mobile__button__list">
            <button
              class="mobile__comment__button"
              @click="showCommentList">
              <span v-if="this.$session.get('nowBoardId') !== 10">댓글</span>
              <span v-else>답변</span>
              <span class="mobile__button__comment__count">{{ specificBoard.comment_count }}</span>
            </button>
            <grant-btns
              :myFlag="myFlag"
              :boardId="$session.get('nowBoardId')">
            </grant-btns>
          </div>
        </div>

        <!-- 공용 게시글 >> 내용 -->
        <contents
          :content="specificBoard.content">
        </contents>

        <!-- 공용 게시글 >> 댓글 -->
        <transition name="fade">
          <comment
            @closeMobileComment="closeCommentList()"
            :mobileCommentDisplayFlag="mobileCommentDisplayFlag"
            :mobileCommentPositionTop="mobileCommentPositionTop"
            :boardId="$session.get('nowBoardId')"
            :comments="specificBoard.comments"
            :grantEdit="false"
            :permaLinkNotice="specificBoard.permalink"
            :boardHit="specificBoard.hit">
          </comment>
        </transition>

        <!-- 하단 btn groups -->
        <div class="footer">
          <grant-btns
            :myFlag="myFlag"
            :boardId="$session.get('nowBoardId')">
          </grant-btns>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {store} from '../../../stores/store'
  import {mapGetters} from 'vuex';
  import {vueTopprogress} from 'vue-top-progress'
  import Comment from './Comment/Comment'
  import BoardHeaderTitle from '../BoardSharedComponent/BoardHeaderTitle'
	import GrantBtns from '../BoardSharedComponent/GrantBtns'
  import Contents from './Contents/Contents'
  import BoardMixin from '../BoardMixins/boardMixin'

  export default {
    name: 'BoardDetail',
    data() {
      return {
        myFlag: false,
        mobileCommentDisplayFlag: false,
        VUEX_BOARD_STATE: store.state,
        adjustIdCheck: "",
        nowBoardId: 1,
        nowSpecificBoardId: 1,
        authGuard: false,
        loadingFlag: false,
        done: false,
        tagFilter: /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig,
        mobileCommentPositionTop: "0",
        windowWidth: 0
      }
    },
    watch: {
      '$route': 'fetchData'
    },
    mixins: [BoardMixin],
    components: {
      vueTopprogress: vueTopprogress,
      boardHeaderTitle: BoardHeaderTitle,
      grantBtns: GrantBtns,
      comment: Comment,
      contents: Contents
    },
    computed: {
      ...mapGetters({
        specificBoard: 'specificBoard'
      })
    },
    methods: {
			// 특정 게시물 호출
      setSpecificBoard: function (specificBoardId) {
        this.$store.dispatch("setSpecificBoard", {
          specificBoardId: specificBoardId,
          token: this.$session.get("token"),
          boardId: this.$session.get("nowBoardId")
        }).then((data) => {
          this.displayLink();
          if (this.$session.get("nowBoardId") !== -1 && data.board_id !== this.$session.get("nowBoardId") && !(this.$session.get("nowBoardId") === 4 && data.board_id > 4)) {
            this.$router.go(-1);
            alert("존재하지 않는 게시글입니다.");
          } else {
            this.loadingFlag = true;
            //this.$refs.topProgress.done();
          }
        }, (reject) => {
          alert("존재하지 않는 게시글입니다.");
          const path = this.$route.path;
          const redirectPath = path.substring(0, path.lastIndexOf('/'));
          this.$router.push(redirectPath);
        })
      },

      // content(본문) 이미지, 링크 활성화 함수
      displayLink() {
        if (this.$session.get("nowBoardId") !== 4) {
          this.specificBoard.content = this.specificBoard.content.replace(this.urlR, (match) => {
            if (match.indexOf('static.koreatech') !== -1 &&
              (match.indexOf('.png') !== -1 || match.indexOf('.jpg') !== -1 || match.indexOf('.jpeg') !== -1 ||
                match.indexOf('.gif') !== -1 || match.indexOf('.bmp') !== -1 || match.indexOf('.raw') !== -1 || match.indexOf('.svg') !== -1)) {
              return `${match}`;
            }
            if (match.indexOf('static.koreatech') === -1 &&
              (match.indexOf('.png') !== -1 || match.indexOf('.jpg') !== -1 || match.indexOf('.jpeg') !== -1 ||
                match.indexOf('.gif') !== -1 || match.indexOf('.bmp') !== -1 || match.indexOf('.raw') !== -1 || match.indexOf('.svg') !== -1)) {
              return '';
            }
            if (match.match('http') !== null) return `<a href="${match}" target="_blank">${match}</a>`
            else return `<a href="//${match}" target="_blank">${match}</a>`;

          });
        }
      },

      // 모바일용 댓글 출력
      showCommentList() {
        this.mobileCommentDisplayFlag = !this.mobileCommentDisplayFlag;
        // 제목크기가 늘어날 경우를 위해 동적으로 top 크기 지정
        this.mobileCommentPositionTop = document.getElementById("mobile__board__head").offsetHeight + 57 + 'px';
      },

      // 모바일용 댓글 닫기
      closeCommentList(msg) {
        this.mobileCommentDisplayFlag = false;
      },

      // width 체크
      getWindowWidth(event) {
        let ua = navigator.userAgent;
        this.windowWidth = document.documentElement.clientWidth;

        if( this.windowWidth < 576) {
          // 모바일이 아닐 경우만
          if (!(ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1 || ua.indexOf("Android") !== -1)) {
              this.mobileCommentDisplayFlag = false;
          }
        }
        else {
          this.mobileCommentDisplayFlag = true;
        }
      },
      fetchData: function() {
        //this.$refs.topProgress.start();
        // 로그인 세션 유지한 경우
        let path = this.$router.history.current.path.split('/');
        //nowBoardId 지정
        for (let i = 0; i < this.boardIdList.length; i++) {
          if (path[2] === this.boardIdList[i].path.split("/")[2]) {
            this.$session.set("nowBoardId", this.boardIdList[i].boardId);
            break;
          }
        }
        //specificBoardId 지정
        this.nowSpecificBoardId = path[3];
        this.$session.set("specificBoardId", path[3]);
        this.setSpecificBoard(this.nowSpecificBoardId);
        //request
        // 익게와 비로그인 상태에서 권한체크 안함.
        if (this.$session.get("token") !== undefined && this.$session.get("nowBoardId") !== -1) {
          console.log("grant check")
          this.$store.dispatch('grantCheckBoard', {
            "token": this.$session.get("token"),
            "articleId": this.$session.get("specificBoardId"),
          }).then((data) => {
            //해당 게시글이 내글인지 확인
            this.myFlag = data.data.grantEdit === true && data.status === 200;
          }, (reject) => {
            //data 불러오지 못한경우
          });
        }
      }
    },
    // 마운팅 후
    mounted() {
      this.fetchData();

      // 모바일화면인지에대한 판단을 위해 resize 이벤트 등록
      window.addEventListener('resize', this.getWindowWidth);
      this.getWindowWidth()
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.getWindowWidth);
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.detail {
		width: 834px;
		float: left;
		margin-right: 40px;
		margin-bottom: 20px;
	}

	.header {
		width: 100%;
		height: 55px;
	}

	.board-head {
		border-top: 2px solid #175c8e;
		border-bottom: 1px solid #175c8e;
		width: 834px;
		height: 100%;
		text-align: left;
		user-select: text;
	}

	.board-title {
		font-family: NanumBarunGothic, serif;
		font-size: 20px;
		font-weight: normal;
		font-style: normal;
		font-stretch: normal;
		line-height: normal;
		letter-spacing: -1px;
		color: #252525;
    padding: 26px 20px 7px;
    width: 794px;
		word-wrap: break-word;
	}

	.board-title .board-title-num-of-comment {
		font-size: 15px;
		letter-spacing: -0.8px;
		color: #175c8e;
	}

	.board-info {
		display: flex;
		padding-bottom: 27px;
		padding-left: 20px;
		padding-right: 20px;
	}

	.board-info .author {
		font-family: NanumBarunGothic, serif;
		font-size: 13px;
		font-weight: normal;
		font-style: normal;
		font-stretch: normal;
		line-height: normal;
		letter-spacing: -0.7px;
		color: #175c8e;
		margin-right: 16px;
	}

	.board-info .createdAt {
		font-family: NanumBarunGothic, serif;
		font-size: 13px;
		font-weight: normal;
		font-style: normal;
		font-stretch: normal;
		line-height: normal;
		letter-spacing: -0.7px;
		color: #858585;
	}

	.board-info .createdAt span {
		margin-left: 7px;
	}

	.board-title .type {
		font-weight: 600;
	}

	.footer {
		margin-top: 22px;
		margin-bottom: 234px;
	}

	button {
		color: #858585;
	}

	.board-title .n img {
		width: 13.5px;
		height: 14px;
		position: relative;
		margin-left: 11px;
		top: 0px;
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

  .mobile__board__head {
    display: none;
  }



	@media (max-width: 576px) {
		.detail {
			margin: 0;
			height: calc(100%) !important;
      width: 100%;
		}

		.header {
			display: none;
		}

		.board-head {
			display: none;
		}

		.mobile__board__head {
			display: block;
			text-align: left;
			padding: 15px 16px;
			height: 100%;
			border-bottom: 1px solid #ececec;
		}

		.mobile__board__title {
			font-size: 16px;
			font-weight: normal;
			color: rgba(0, 0, 0, 0.87);
			letter-spacing: -0.8px;
			line-height: 1.5;
			word-break: break-all;
		}

		.mobile__board__title .type {
			font-weight: bold;
		}

		.mobile__board__title span {
		}

		.mobile__board__title .mobile__comment__count {
			color: #175c8e;
		}

		.mobile__board__info {
			margin-top: 1px;
			color: #a1a1a1;
			font-size: 13px;
			font-weight: normal;
			line-height: 1.54;
			letter-spacing: -0.7px;
		}

		.mobile__board__info .mobile__createAt {
			float: right;
		}

		.mobile__button__list {
			padding-top: 22px;
      height: 30px;
		}

		.mobile__button__list .mobile__comment__button {
			border: 1px solid #a1a1a1;
			height: 29px;
			min-width: 51.5px;
			font-size: 12px;
			font-weight: normal;
			color: #252525;
			text-align: center;
			line-height: 1.42;
			letter-spacing: -0.6px;
			background-color: #ffffff;
			margin-right: 9.6px;
      float: left;
		}

		.mobile__button__comment__count {
			color: #175c8e;
		}

		.footer {
			display: none;
		}

    .board-comment {
      float: left;
      position: absolute;
      width: 100%;
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
    }
	}
</style>
