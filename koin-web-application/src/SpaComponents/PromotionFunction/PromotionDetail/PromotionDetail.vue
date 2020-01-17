<template>
  <div class="promotion--detail">
    <div v-if="!loadingFlag">
      <v-loading-bar/>
    </div>
    <div
      v-else
      class="container">
      <div class="promotion__head">
        <promotion-header
          class="promotion__header"
          @click="$router.push('/board/promotion')">
          <template v-if="myFlag">
            <button
              class="promotion__button promotion__button--adjust"
              type="button"
              @click="checkGrantEdit('edit')">
              수정
            </button>
            <button
              class="promotion__button promotion__button--remove"
              type="button"
              @click="checkGrantEdit('remove')">
              삭제
            </button>
          </template>
          <button
            class="promotion__button promotion__button--home"
            type="button"
            @click="goList">
            목록으로
          </button>
        </promotion-header>
        <div class="promotion__info">
          <div class="promotion__title">
            <span>{{ specificPromotion.title }}</span>
            <span class="promotion__comment-count">[{{ specificPromotion.comment_count }}]</span>
            <span
              class="n"
              v-if="computedTime(specificPromotion.created_at)[1]">
              <img src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png">
            </span>
            <div
              v-if="isFinished"
              class="promotion__badge">
              마감
            </div>
          </div>
          <div class="promotion__date-info">
            <div>행사 기간 :</div>
            <div class="promotion__dates"> {{ specificPromotion['start_date'] | formatDate }} ~ {{ specificPromotion['end_date'] | formatDate }}</div>
          </div>
          <div class="promotion__write-info">
            <div class="promotion__author">{{ specificPromotion.nickname }}</div>
            <div class="promotion__created-at">{{ specificPromotion.created_at | formatDate }} <span>{{ specificPromotion.created_at | getTime }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="board-content"
        v-html="addMaxWidth(specificPromotion.content)">
      </div>

      <button
        class="promotion__button promotion__button--order"
        @click="goStore">
        주문하러 가기
      </button>

      <div class="board-sub-info">
        댓글 <span class="numberOfComments">{{ specificPromotion.comment_count }}</span>개
        <span class="bar">|</span> 조회수
        <span class="hits">{{ specificPromotion.hit }}</span>
      </div>
      <div class="promotion__comments">
        <div
          class="comment"
          v-for="comment in specificPromotion.comments"
          :key="comment.id">
          <div class="comment__info">
            <div
              v-if="itemInfo['user_id'] === comment['user_id']"
              class="promotion__badge">
              점주
            </div>
            <div class="comment__author">{{ comment.nickname }}</div>
            <div
              class="comment__created-at"
              v-html="computedTime(comment.created_at)[0]"/>
            <div
              v-if="computedTime(comment.created_at)[1]"
              class="n">
              <img src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png">
            </div>
            <div
              v-show="comment.grantDelete"
              class="comment__remove"
              @click="deletePromotionComment(comment.id)">
              <img src="https://static.koreatech.in/upload/a603ece7567e3b28552fe5193f0453e6.png">
            </div>
          </div>
          <div
            v-if="!adjustInputFlag || comment.id !== adjustIdCheck"
            class="comment__content"
            v-html="displayCommentLink(comment.content)">
          </div>
          <div
            class="comment__adjust-input"
            v-else>
            <div class="comment__adjust-box">
              <textarea
                type="text"
                v-model="inputAdjustComment">
              </textarea>
              <button
                class="button"
                v-if="comment.grantEdit"
                @click="adjustPromotionComment(comment.id)">수정
              </button>
            </div>
          </div>
          <button
            class="comment__adjust"
            v-if="comment.grantEdit"
            :style="{ left: adjustInputFlag && comment.id === adjustIdCheck ? '-48px' : '0' }"
            @click="showAdjustButton(adjustInputFlag, comment.id, comment.content)">
            <span v-if="adjustInputFlag && comment.id === adjustIdCheck">취소</span>
            <span v-if="!(adjustInputFlag && comment.id === adjustIdCheck)">수정</span>
          </button>
        </div>
        <div class="comment__write">
          <div
            class="write-box"
            @click="nonMemberCheck">
            <textarea
              type="text"
              v-model="inputRegisterComment">
            </textarea>
            <div class="counter">{{ computedCommentCount }}/3000</div>
          </div>
          <button
            class="comment__button"
            type="button"
            @click="registerPromotionComment">등록
          </button>
          <button
            class="comment__button comment__button--cancel"
            @click="resetPromotionComment">
            취소
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import {vueTopprogress} from 'vue-top-progress'
  import PromotionHeader from "../PromotionSharedComponent/PromotionHeader";

  export default {
    name: 'PromotionDetail',
    components: {PromotionHeader},
    data() {
      return {
        itemInfo: '',
        today: new Date(),
        myFlag: false,
        loadingFlag: false,
        nowSpecificPromotionId: '',
        adjustInputFlag: false,
        adjustIdCheck: '',
        done: false,
        inputRegisterComment: '',
        inputAdjustComment: '',
        tagFilter: /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig,
        urlR: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,256}\b(\/?[-a-zA-Z0-9@:;|_\+.~#%?&//=]*)?/gi
      }
    },
    computed: {
      ...mapGetters({
        specificPromotion: 'specificPromotion'
      }),
      computedCommentCount () {
        if (this.inputRegisterComment !== '') {
          if (this.$session.get('userInfo') === undefined) {
            if(confirm('로그인해야 작성할 수 있습니다. 로그인하시겠습니까?')) {
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
      },
      isFinished () {
        let endTime = new Date(this.itemInfo['end_date']);
        endTime.setDate(endTime.getDate() + 1);
        let nowTime = this.today.getTime();
        return endTime.getTime() <= nowTime
      }
    },
    methods: {
      getSpecificPromotion (nowSpecificPromotionId) {
        this.$store.dispatch('setSpecificPromotion', {
          articleId: nowSpecificPromotionId,
          token: this.$session.get('token')
        }).then(data => {
          this.itemInfo = data;
          console.log(data);
          this.displayLink();
          this.loadingFlag = true;
        }, reject => {
          alert('존재하지 않는 게시글입니다.');
          this.$router.push('/board/promotion');
        })
      },

      displayLink() {
        if (this.$session.get("nowBoardId") !== 4) {
          if (this.specificPromotion.content === null) return ;
          this.specificPromotion.content = this.specificPromotion.content.replace(this.urlR, (match) => {
            if (match.indexOf('static.koreatech') !== -1 &&
              (match.indexOf('.png') !== -1 || match.indexOf('.jpg') !== -1 || match.indexOf('.jpeg') !== -1 ||
                match.indexOf('.gif') !== -1 || match.indexOf('.bmp') !== -1 || match.indexOf('.raw') !== -1 || match.indexOf('.svg') !== -1 ||
                match.indexOf('.PNG') !== -1 || match.indexOf('.JPG') !== -1 || match.indexOf('.JPEG') !== -1 ||
                match.indexOf('.GIF') !== -1 || match.indexOf('.BMP') !== -1 || match.indexOf('.RAW') !== -1 || match.indexOf('.SVG') !== -1)) {
              return `${match}`;
            }
            if (match.indexOf('static.koreatech') === -1 &&
              (match.indexOf('.png') !== -1 || match.indexOf('.jpg') !== -1 || match.indexOf('.jpeg') !== -1 ||
                match.indexOf('.gif') !== -1 || match.indexOf('.bmp') !== -1 || match.indexOf('.raw') !== -1 || match.indexOf('.svg') !== -1 ||
                match.indexOf('.PNG') !== -1 || match.indexOf('.JPG') !== -1 || match.indexOf('.JPEG') !== -1 ||
                match.indexOf('.GIF') !== -1 || match.indexOf('.BMP') !== -1 || match.indexOf('.RAW') !== -1 || match.indexOf('.SVG') !== -1)) {
              return '';
            }
            if (match.match('http') !== null) return `<a href="${match}" target="_blank">${match}</a>`
            else return `<a href="//${match}" target="_blank">${match}</a>`;

          });
        }
      },
      changeTime (time) {
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

      cutComment () {
        this.inputRegisterComment = this.inputRegisterComment.substring(0, 3000);
      },

      computedTime (time) {
        let created = this.changeTime(time);
        if (Math.ceil((this.today - created) / 1000 / 60) < 60)
          return [Math.ceil((this.today - created) / 1000 / 60) + "분 전", true];

        if (Math.floor((this.today - created) / 60 / 1000 / 60) < 4)
          return [Math.floor((this.today - created) / 60 / 60 / 1000) + "시간 전", true];

        else if (Math.floor((this.today - created) / 60 / 1000 / 60) < 24)
          return [Math.floor((this.today - created) / 60 / 1000 / 60) + "시간 전", false];

        else {
          let year = created.getFullYear();
          let month = created.getMonth() + 1 < 10 ? "0" + (created.getMonth() + 1) : created.getMonth() + 1;
          let date = (created.getDate() < 10) ? "0" + created.getDate() : created.getDate();
          let hour = created.getHours() < 10 ? "0" + created.getHours() : created.getHours();
          let minutes = created.getMinutes() < 10 ? "0" + created.getMinutes() : created.getMinutes();
          return [String(year) + "." + String(month) + "." + String(date) + "&nbsp;&nbsp; " + String(hour) + ":" + String(minutes), false]
        }
      },

      showAdjustButton (flag, id, content) {
        this.inputAdjustComment = content;
        if (id !== this.adjustIdCheck && this.adjustIdCheck !== "") {
          this.adjustInputFlag = true;
        }
        else
          this.adjustInputFlag = !flag;
        this.adjustIdCheck = id;
      },

      goList () {
        this.$router.push('/board/promotion');
      },

      checkGrantEdit (check) {
        this.nowSpecificPromotionId = this.$session.get('specificPromotionId');
        this.$store.dispatch('grantCheckPromotion', {
          token: this.$session.get('token'),
          articleId: this.nowSpecificPromotionId
        }).then(data => {
          if (data.data.grantEdit === true && data.status === 200) {
            if (check === 'remove') {
              if (confirm('삭제하시겠습니까?')) {
                this.$store.dispatch('removePromotion', {
                  token: this.$session.get('token'),
                  articleId: this.nowSpecificPromotionId
                }).then(data => {
                  alert('삭제되었습니다.');
                  this.$router.push('/board/promotion');
                })
              }
            } else {
              if (confirm('수정하시겠습니까?')) {
                this.$router.push('/board/promotion/adjust');
              }
            }
          } else {
            alert('권한이 없습니다.');
          }
        }, error => {
          if (error === 403) alert('게시물을 수정하거나 삭제할 권한이 없습니다.');
          else alert('더 이상 데이터를 불러올 수 없습니다.');
        })
      },

      displayCommentLink(val) {
        val = val.replace(this.urlR, (match) => {
          if (match.match('http') !== null) return `<a href="${match}" target="_blank">${match}</a>`
          else return `<a href="//${match}" target="_blank">${match}</a>`;
        });
        return val;
      },

      registerPromotionComment () {
        if (this.$session.get('userInfo') === undefined) {
          if(confirm('로그인해야 작성할 수 있습니다. 로그인하시겠습니까?')) {
            this.$router.push('/login');
          }
        } else {
          if (this.$session.get('userInfo').nickname === undefined || this.$session.get('userInfo'.nickname === '' || this.$session.get("userInfo").nickname === null)) {
            alert('닉네임이 필요합니다.');
            this.$store.dispatch('nicknameFlagCheck', {
              nickname: this.$session.get('userInfo').nickname
            });
            this.$router.push('/changeInfo');
            return;
          }
          if (this.inputRegisterComment === '' || this.inputRegisterComment === null || this.inputRegisterComment === undefined) {
            alert('댓글을 입력하세요.');
            return;
          }
          this.nowSpecificPromotionId = this.$session.get('specificPromotionId');
          this.$store.dispatch('registerPromotionComment', {
            token: this.$session.get('token'),
            articleId: this.nowSpecificPromotionId,
            content: this.inputRegisterComment
          }).then(data => {
            console.log(data)
            if (data.status === 200 || data.status === 201) {
              alert('댓글이 등록되었습니다.');
              this.inputRegisterComment = '';
              this.getSpecificPromotion(this.nowSpecificPromotionId);
            } else if (data.status === 401) {
              alert('다시 로그인해주세요.');
            } else {
              alert('서버와의 연결이 끊어졌습니다.');
            }
          }, error => {
            alert('더 이상 데이터를 불러올 수 없습니다.');
          })
        }
      },
      resetPromotionComment () {
        this.inputRegisterComment = '';
      },
      addMaxWidth (val) {
        if (val === null) return ;
        return window.innerWidth > 576 ? val.replace(/<img/gi, "<img style='max-width: 796px' ") : val.replace(/<img/gi, "<img style='max-width: 100%' ")
      },

      adjustPromotionComment (commentId) {
        this.nowSpecificPromotionId =this.$session.get('specificPromotionId');
        if (confirm('수정하시겠습니까?')) {
          this.$store.dispatch('adjustPromotionComment', {
            token: this.$session.get('token'),
            articleId: this.nowSpecificPromotionId,
            id: commentId,
            content: this.inputAdjustComment
          }).then(data => {
            if (data.status === 200 || data.status === 201) {
              this.getSpecificPromotion(this.nowSpecificPromotionId);
              this.inputAdjustComment = '';
              this.adjustInputFlag = false;
            } else if (data.status === 401) {
              alert('다시 로그인해주세요.');
            } else {
              alert('서버와의 연결이 끊어졌습니다.');
            }
          }, error => {
            alert('더 이상 데이터를 불러올 수 없습니다.');
          })
        }
      },

      deletePromotionComment (commentId) {
        if (confirm('삭제하시겠습니까?')) {
          this.$store.dispatch('removePromotionComment', {
            token: this.$session.get('token'),
            articleId: this.$session.get('specificPromotionId'),
            id: commentId
          }).then(data => {
            if (data.status === 200 || data.status === 201) {
              this.getSpecificPromotion(this.nowSpecificPromotionId);
            } else if (data.status === 401) {
              alert('다시 로그인해주세요.');
            } else {
              alert('서버와의 연결이 끊어졌습니다.');
            }
          }, error => {
            alert('더 이상 데이터를 불러올 수 없습니다.');
          })
        }
      },
      nonMemberCheck() {
        if (this.$session.get('userInfo') === undefined) {
          if(confirm('로그인해야 작성할 수 있습니다. 로그인하시겠습니까?')) {
            this.$router.push('/login');
          }
        }
      },
      showCommentList () {
        this.mobileCommentFlag = !this.mobileCommentFlag;
        if (this.adjustInputFlag) {
          this.adjustInputFlag = !this.adjustInputFlag;
        }
      },
      goRegister () {
        this.$router.push('/lost/register');
      },
      goStore () {
        this.$router.push("/store/" + this.itemInfo['shop_id'])
      }
    },
    mounted () {
      this.getSpecificPromotion(this.$route.params.id);
      this.$session.set('specificPromotionId', this.$route.params.id);
      // 로그인 상태에서만 권한 체크
      if (this.$session.get("token") !== undefined) {
        this.$store.dispatch('grantCheckPromotion', {
          token: this.$session.get('token'),
          articleId: this.$route.params.id
        }).then(data => {
          console.log(data);
          this.myFlag = data.data.grantEdit === true && data.status === 200;
        }, reject => {
          console.error(reject);
        })
      }

    },
    created() {
      console.log(this.$session.get('userInfo'))
    },
    filters: {
      formatDate(date) {
        return date.slice(0, 4) + '.' + date.slice(5, 7) + '.' + date.slice(8, 10)
      },
      getTime (val) {
        return val.split(" ")[1];
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .promotion--detail {
    float: left;
    margin: 0 40px 101px 0;
    width: 834px;
  }
  .promotion__head {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #175c8e;
  }
  .promotion__header {
    order: 1;
  }

  .promotion__button {
    font-size: 13px;
    letter-spacing: -0.7px;
    padding: 5px 0;
    margin-top: 3px;
    height: 30px;
    cursor: pointer;
  }

  .promotion__button.promotion__button--home {
    width: 74px;
    color: white;
    background: #175c8e;
    border: 1px solid #175c8e;
  }

  .promotion__button.promotion__button--adjust {
    width: 50px;
    margin-right: 7px;
    color: #175c8e;
    background: white;
    border: 1px #175c8e solid;
  }

  .promotion__button.promotion__button--remove {
    width: 50px;
    margin-right: 7px;
    color: #d32525;
    background: white;
    border: 1px #d32525 solid;
  }
  .promotion__button.promotion__button--order {
    width: 124px;
    margin-top: 0;
    margin-bottom: 91px;
    color: #ffffff;
    font-size: 14px;
    background-color: #f7941e;
    border: 0;
  }

  .promotion__badge {
    display: inline-block;
    padding: 0 10px;
    border-radius: 8px;
    font-family: SegoeUI;
    font-size: 11px;
    line-height: 1.36;
    color: #ffffff;
    background-color: #f7941e;
  }
  .promotion__title .promotion__badge{
    padding: 0 5px;
    border-radius: 0;
    color: #252525;
    background-color: #ffffff;
    border: 1px solid #252525;
  }

  .promotion__info {
    order: 2;
    height: 100%;
    text-align: left;
    user-select: text;
  }

  .promotion__title {
    font-family: NanumBarunGothic, serif;
    font-size: 20px;
    letter-spacing: -1px;
    color: #252525;
    padding: 26px 20px 7px;
    width: 794px;
    word-wrap: break-word;
  }

  .promotion__title .promotion__comment-count {
    font-size: 15px;
    letter-spacing: -0.8px;
    color: #175c8e;
  }

  .promotion__date-info {
    padding: 8px 20px 14px;
    display: flex;
    font-family: NanumBarunGothic;
    font-size: 14px;
    font-weight: bold;
    line-height: 1.14;
    letter-spacing: normal;
    color: #175c8e;
  }
  .promotion__date-info > .promotion__dates {
    font-family: NanumBarunGothic;
    font-size: 14px;
    font-weight: normal;
    margin-left: 8px;
    color: #858585;
  }

  .promotion__write-info {
    display: flex;
    padding: 0 20px 26px;
  }

  .promotion__write-info .promotion__author {
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

  .promotion__write-info .promotion__created-at {
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #707070;
  }

  .promotion__write-info .promotion__created-at span {
    margin-left: 7px;
  }

  .board-content {
    text-align: left;
    padding: 30px 20px 50px;
    font-family: NanumBarunGothic, serif;
    font-size: 15px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.73;
    letter-spacing: -0.8px;
    color: #555555;
    height: 100%;
    min-height: 230px;
    overflow: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
    user-select: text;
  }

  .board-content::-webkit-scrollbar {
    display: none;
  }

  .board-sub-info {
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

  .promotion__comments {
    text-align: left;
    height: 100%;
    margin-bottom: 20px;
    border-bottom: 1px solid #175c8e;
    -ms-overflow-style: none;
    user-select: text;
  }

  .promotion__comments::-webkit-scrollbar {
    display: none;
  }

  .promotion__comments .comment {
    padding: 20px 20px 0;
  }

  .comment .comment__info .promotion__badge {
    height: 16px;
    font-size: 11px;
    margin-right: 8px;
  }

  .promotion__comments .comment .comment__info {
    display: flex;
    align-items: center;
    margin-bottom: 7px;
    font-size: 13px;
    letter-spacing: -0.7px;
  }

  .promotion__comments .comment .comment__info .comment__author {
    font-family: NanumBarunGothic, serif;
    color: #175c8e;
    margin-right: 12px;
  }

  .promotion__comments .comment .comment__info .comment__created-at {
    font-family: NanumBarunGothic, serif;
    letter-spacing: -0.7px;
    color: #858585;
    margin-right: 10px;
  }

  .promotion__comments .comment .comment__info .comment__remove {
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

  .comment__adjust {
    font-size: 11px;
    position: relative;
    border: 1px #d2dae2 solid;
    padding: 3px 13px 6px;
    margin: 4px 1px 3px 0;
    text-align: center;
    color: #858585;
    height: 23px;
    user-select: none;
    letter-spacing: -0.6px;
    background-color: #ffffff;
    cursor: pointer;
  }

  .comment__remove img {
    width: 10px;
    position: relative;
    top: 1px;
  }

  .promotion__comments .comment .comment__content {
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    font-weight: 300;
    letter-spacing: -0.7px;
    color: #252525;
    padding: 3px 0 9px;
    max-width: 100%;
    height: 100%;
    word-break: break-all;
    white-space: pre;
  }

  /* 댓글쓰기 */
  .promotion__comments .comment__write {
    margin: 32px 20px 27px;
    height: 74px;
    width: 800px;
    display: flex;
  }

  .write-box {
    margin-bottom: 27px;
    height: 74px;
    float: left;
    border: 1px #bbbbbb solid;
    border-right: none;
  }

  .promotion__comments .comment__write .counter {
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

  .write-box textarea {
    resize: none;
    font-family: NanumBarunGothic,serif;
    font-size: 13px;
    font-weight: 400;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -.7px;
    color: #175c8e;
    width: 691px;
    margin: 10px 10px 0;
    height: 38px;
    z-index: 13;
    float: left;
    border: none;
  }

  .comment__adjust-box {
    width: 786px;
  }

  .comment__adjust-box textarea {
    height: 19px;
    width: 756px;
    padding: 13px 15px 10px;
    border: solid 1px #d2dae2;
    resize: none;
    color: #252525;
    font-size: 13px;
    letter-spacing: -0.7px;
  }

  .promotion__comments .comment__write .comment__button {
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
  .promotion__comments .comment__write .comment__button--cancel {
    display: none;
  }

  /* 댓글수정 */

  .promotion__comments .comment__adjust-input .comment__author {
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #175c8e;
    margin-right: 12px;
  }

  .promotion__comments .comment__adjust-input input {
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #175c8e;
    border: 1px #b1b2b4 solid;
    width: 705px;
    float: left;
    padding-top: 100px;
  }

  .promotion__comments .comment__adjust-input button {
    font-family: NanumBarunGothic, serif;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    float: left;
    user-select: none;
    font-size: 11px;
    top: 4px;
    position: relative;
    left: 51px;
    resize: none;
    color: white;
    background: #175c8e;
    padding: 5px 14px;
    padding-bottom: 4px;
    border: 1px #175c8e solid;
    border-radius: 0;
    cursor: pointer;
  }
  .footer {
    margin-top: 22px;
    margin-bottom: 234px;
  }

  button {
    color: #858585;
  }

  .promotion__title .n img {
    width: 13.5px;
    height: 14px;
    margin-left: 11px;
  }

  .n img {
    width: 11.5px;
    height: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    user-select: none;
  }

  .bar {
    margin-left: 9px;
    margin-right: 9px;
  }

  * {

  }

  .link {
    float: right;
    text-decoration: none;
    color: #175c8e;
  }

  .link:visited, .link:hover, .link:active {
    text-decoration: none;
    color: #175c8e;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  @media (max-width: 576px) {
    .promotion--detail {
      margin: 0;
      width: 100%;
      border-top: none;
    }

    .container {
      width: 100%;
      margin: 0;
    }

    .promotion__head {
      flex-direction: column;
      text-align: left;
      padding: 13px 16px 15px;
      height: 100%;
      border-bottom: 1px solid #ececec;
    }
    .promotion__header {
      order: 2;
    }
    .promotion__info {
      order: 1;
      display: grid;
      grid: 18px 14px / 250px 1fr;
      grid-auto-flow: column dense;
      grid-row-gap: 13px;
      margin-bottom: 15px;
    }
    .promotion__title {
      font-size: 16px;
      padding: 0;
      width: auto;
      font-weight: normal;
      color: rgba(0, 0, 0, 0.87);
      letter-spacing: -0.8px;
      line-height: normal;
      word-break: break-all;
    }
    .promotion__date-info {
      padding: 0;
      font-family: NanumSquareR;
      font-size: 13px;
      font-weight: normal;
      line-height: 1.08;
      letter-spacing: normal;
      color: #175c8e;
    }
    .promotion__date-info .promotion__dates {
      color: #252525;
    }
    .promotion__write-info {
      padding: 0;
      font-family: NanumSquareR;
      font-size: 10px;
      font-weight: normal;
      line-height: 1.2;
      letter-spacing: -0.7px;
      grid-row: 1 / 3;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
    }

    .promotion__write-info .promotion__author {
      margin: 13px 0 0;
      color: #9fa9b3;
    }
    .promotion__write-info .promotion__created-at {
      margin: 6px 0 0;
      color: #9fa9b3;
      text-align: right;
    }
    .promotion__write-info .promotion__created-at span {
      margin-left: 2px;
    }

    .promotion__button {
      border: 1px solid #a1a1a1;
      height: 29px;
      /* width: 51.5px; */
      min-width: 51.5px;
      font-size: 12px;
      font-weight: normal;
      color: #252525;
      text-align: center;
      line-height: 1.42;
      letter-spacing: -0.6px;
      background-color: #ffffff;
      float: right;
    }

    .promotion__button.promotion__button--adjust {
      border: 1px solid #a1a1a1;
      height: 29px;
      width: 51px;
      font-size: 12px;
      font-weight: normal;
      color: #252525;
      margin-right: 10px;
      float: left;
    }
    .promotion__button.promotion__button--remove {
      border: 1px solid #a1a1a1;
      height: 29px;
      width: 51px;
      font-size: 12px;
      font-weight: normal;
      color: #ff3030;
      float: left;
    }
    .promotion__button.promotion__button--order {
      margin-bottom: 58px;
      width: 159px;
      line-height: 1.09;
      font-family: NanumBarunGothic;
      font-size: 11px;
      float: unset;
    }

    .board-content {
      padding-top: 20px;
      padding-bottom: 46px;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.71;
      letter-spacing: -0.7px;
      min-height: 400px;
      color: #252525;
    }
    .board-sub-info {
      padding: 13px 16px 11px;
    }

    .promotion__comments {
      margin-bottom: 50px;
      border: 0;
    }
    .promotion__comments .comment {
      padding: 20px 16px 0;
    }

    .promotion__comments .comment .comment__info .comment__author {
      color: #252525;
    }
    .comment__adjust-box {
      width: calc(100% - 40px);
    }
    .comment__adjust-box textarea {
      padding: 5px 10px;
      height: 32px;
      width: calc(100% - 20px);
    }
    .comment__adjust {
      padding: 1px 12px;
    }
    .promotion__comments .comment__adjust-input button {
      padding: 5px 13px;
    }

    .promotion__comments .comment__write {
      width: calc(100% - 32px);
      height: 101px;
      display: grid;
      grid: 60px 29px / repeat(2, 2fr);
      grid-row-gap: 10px;
      grid-column-gap: 10px;
      margin: 32px 16px 27px;
    }
    .write-box {
      grid-column: 1 / 3;
      height: auto;
      margin-bottom: 0;
      border-right: 1px #bbbbbb solid;
    }
    .write-box textarea {

      width: calc(100% - 20px);
    }
    .promotion__comments .comment__write .counter {
      display: none;
    }
    .promotion__comments .comment__write .comment__button {
      display: block;
      float: unset;
      width: auto;
      height: auto;
    }

    .footer {
      display: none;
    }

    .mobile__top__nav__button img {
      width: 24px;
      height: 24px;
    }

  }
</style>
