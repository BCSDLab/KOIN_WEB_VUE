<template>
  <div>
    <button
      class="go-list"
      type="button"
      @click="goUpperCategoryBoardList(boardId)">목록으로
    </button>
    <button
      v-if="myFlag || boardId === -1"
      class="board-remove"
      type="button"
      @click="checkGrantEdit('remove')">삭제
    </button>
    <button
      v-if="myFlag || boardId === -1"
      class="board-adjust"
      type="button"
      @click="checkGrantEdit('edit')">수정
    </button>
    <input
      v-if="boardId === -1"
      placeholder="게시글 비밀번호"
      class="temp-pw-input"
      v-model="anonymousSpecificBoardPassword"
      type="password">
  </div>
</template>

<script>
  import BoardMixin from '../BoardMixins/boardMixin'

  export default {
    name: 'GrantBtns',
    mixins: [ BoardMixin ],
    props: {
      boardId: {
        type: Number,
        default: 0
      },
      myFlag: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        anonymousSpecificBoardPassword: ""
      }
    },

    methods: {
      // 글 수정 삭제 가능 여부 체크
      checkGrantEdit: function (nextFunction) {
        //임시 게시판 비밀번호 입력 여부 체크
        if (this.anonymousSpecificBoardPassword === "" && this.$session.get("nowBoardId") === -1) {
          alert("비밀번호를 입력해주세요");
          return;
        }

        this.$store.dispatch('grantCheckBoard', {
          "token": this.$session.get("token"),
          "articleId": this.$session.get("specificBoardId"),
          "anonymousSpecificBoardPassword": this.anonymousSpecificBoardPassword,
          "boardId": this.$session.get("nowBoardId")
        })
          .then((data) => {
            if (data.data.grantEdit === true && data.status === 200) {
              // 삭제인 경우
              if (nextFunction === 'remove') {
                if (confirm("삭제하시겠습니까?") === true) {
                  this.$store.dispatch('removeBoard', {
                    "token": this.$session.get("token"),
                    "articleId": this.$session.get("specificBoardId"),
                    "anonymousSpecificBoardPassword": this.anonymousSpecificBoardPassword,
                    "boardId": this.$session.get("nowBoardId")
                  }).then((data) => {
                    alert("삭제되었습니다.");
                    // 현재 보드 id에 속하는 리스트 페이지로 이동
                    this.goUpperCategoryBoardList(this.$session.get("nowBoardId"))
                  })
                }
              } 
              // 수정인 경우
              else if(nextFunction === 'edit') {
                if (confirm("수정하시겠습니까?") === true) {
                  if (this.$session.get("nowBoardId") === -1) {
                    this.$session.set("tempPw", this.anonymousSpecificBoardPassword);
                  }
                  for (let i = 0; i < this.boardIdList.length; i++) {
                    if (this.boardIdList[i].boardId === this.$session.get("nowBoardId")) {
                      this.$router.push(this.boardIdList[i].path + "/adjust")
                    }
                  }
                }
              }
            } else {
              alert("권한이 없습니다.");
            }
          }, (error) => {
            if (error === 403) alert("게시물을 수정하거나 삭제할 권한이 없습니다.");
            else alert("더 이상 데이터를 불러올 수 없습니다.");
          })
      },
    },
    created() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .go-list {
    float: right;
    padding: 6px 13px;
    color: white;
    background-color: #175c8e;
    border: 1px #175c8e solid;
    font-size: 13px;
    cursor: pointer;
    margin-top: 1px;
    display: block;
  }

  .board-adjust {
    float: right;
    padding: 6px 13px;
    color: #175c8e;
    background: white;
    border: 1px #175c8e solid;
    font-size: 13px;
    cursor: pointer;
    margin-right: 5px;
    margin-top: 1px;
  }

  .board-remove {
    float: right;
    padding: 6px 13px;
    color: #d32525;
    background: white;
    border: 1px #d32525 solid;
    font-size: 13px;
    cursor: pointer;
    margin-right: 5px;
    margin-top: 1px;
  }

  .temp-pw-input {
    margin-right: 5px;
    padding: 7px 8px;
    font-size: 13px;
    margin-top: 1px;
    border: 1px #d2dae2 solid;
    float: right;
    width: 83px;
  }

  @media (max-width: 576px) {
    .go-list {
      display: none;
    }

    .board-adjust {
      margin-top: 0;
      font-size: 12px;
      padding: 6px 13px;
      padding-top: 5px;
    }

    .board-remove {
      font-size: 12px;
      margin-top: 0;
      padding: 6px 13px;
      padding-top: 5px;
      margin-right: 0;
    }

    .temp-pw-input {
      min-width: 88px;
      margin-top: 0;
      font-size: 12px;
      padding: 7px 13px;
      padding-top: 6px;
      border: 1px #a1a1a1 solid
    }
  }

</style>
