<template>
  <div class="main">
    <vue-topprogress
      color="#f7941e"
      ref="topProgress"></vue-topprogress>
    <div v-if="!loadingFlag">
      <v-loading-bar></v-loading-bar>
    </div>
    <div
      v-if="loadingFlag"
      class="container">
      <div class="list">
        <div class="header">
          <div
            @click="goFirstList"
            class="board-name">
            분실물
          </div>
          <div>
            <button
              class="go-list"
              type="button"
              @click="goList">목록으로
            </button>
            <button
              v-if="myFlag"
              class="board-remove"
              type="button"
              @click="checkGrantEdit('remove')">삭제
            </button>
            <button
              v-if="myFlag"
              class="board-adjust"
              type="button"
              @click="checkGrantEdit('edit')">수정
            </button>
          </div>
        </div>
        <div class="board-head">
          <div class="board-title">
            <span>{{ specificItem.title }}</span>
            <span class="board-title-num-of-comment">[{{ specificItem.comment_count }}]</span>
            <span
              v-if="computedTime(specificItem.created_at)[1]"
              class="n">
              <img src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png">
            </span>
          </div>
          <div class="board-info">
            <div class="author">{{ specificItem.nickname }}</div>
            <div class="createdAt">{{ computedCreatedAt(specificItem.created_at) }} <span>{{ computedCreatedAtTime(specificItem.created_at) }}</span>
            </div>
          </div>
        </div>
        <div class="mobile__board__head">
          <div class="mobile__board__title">
            <span>{{ specificItem.title }}</span>
            <span class="mobile__comment__count">({{ specificItem.comment_count }})</span>
          </div>
          <div class="mobile__board__info">
            <span class="mobile__hit">조회 {{ specificItem.hit }} · </span>
            <span class="mobile__nickname">{{ specificItem.nickname }}</span>
            <span class="mobile__createAt">{{ computedCreatedAt(specificItem.created_at) }}</span>
          </div>
          <div class="mobile__button__list">
            <button
              class="mobile__comment__button"
              @click="showCommentList">
              댓글 <span class="mobile__button__comment__count">{{ specificItem.comment_count }}</span>
            </button>
            <button
              v-if="myFlag"
              class="mobile__update"
              @click="checkGrantEdit('edit')">수정</button>
            <button
              v-if="myFlag"
              class="mobile__delete"
              @click="checkGrantEdit('remove')">삭제</button>
          </div>
        </div>
        <transition name="fade">
          <div
            class="mobile__comment__container"
            v-if="mobileCommentFlag">
            <div
              v-if="specificItem.comments.length !== 0"
              class="mobile__comment__list">
              <div
                :style="{ marginBottom: comment.grantEdit ? '24px' : '16px' }"
                class="mobile__comment"
                v-for="comment in specificItem.comments"
                :key="comment.id">
                <div class="mobile__comment__info">
                  <span class="mobile__comment__author">{{ comment.nickname }}</span>
                  <span class="mobile__comment__createdAt">{{ computedTime(comment.created_at)[0] }}</span>
                  <img
                    v-if="comment.grantEdit"
                    @click="deleteLostComment(comment.id)"
                    class="mobile__comment__remove__button"
                    src="https://static.koreatech.in/upload/a603ece7567e3b28552fe5193f0453e6.png"
                    alt="">
                </div>
                <div
                  v-if="!adjustInputFlag || comment.id !== adjustIdCheck"
                  class="mobile__comment__content"
                  v-html="displayCommentLink(comment.content)">
                </div>
                <div
                  v-if="comment.grantEdit && !adjustInputFlag"
                  class="mobile__comment__button__container">
                  <button
                    v-if="!adjustInputFlag"
                    @click="showAdjustButton(adjustInputFlag, comment.id, comment.content)"
                    class="mobile__comment__update__button">
                    수정
                  </button>
                </div>
              </div>
            </div>
            <div
              class="mobile__comment__editor">
              <div
                class="mobile__comment__write__box"
                @click="nonMemberCheck">
                <div
                  v-if="this.$session.get('userInfo') !== undefined"
                  class="mobile__my__nickname">
                  {{ this.$session.get('userInfo').nickname }}
                </div>
                <textarea
                  type="text"
                  v-if="!adjustInputFlag"
                  v-model="inputRegisterComment"
                  placeholder="댓글을 작성해주세요">
                </textarea>
                <textarea
                  type="text"
                  v-if="adjustInputFlag"
                  v-model="inputAdjustComment"
                  placeholder="댓글을 작성해주세요">
                </textarea>
              </div>
              <div class="mobile__comment__button__list">
                <button
                  @click="showCommentList"
                  class="mobile__comment__cancel__button">
                  취소
                </button>
                <button
                  class="mobile__comment__register__button"
                  v-if="adjustInputFlag"
                  @click="adjustLostComment(adjustIdCheck)">
                  수정
                </button>
                <button
                  @click="registerLostComment"
                  v-if="!adjustInputFlag"
                  class="mobile__comment__register__button">
                  등록
                </button>
              </div>
            </div>
          </div>
        </transition>
        <div class="item-info">
          <table>
            <tbody>
              <tr>
                <td>분류</td>
                <td>{{ itemInfo.type === 0 ? '분실물 습득' : '분실물 찾기' }}</td>
              </tr>
              <tr>
                <td>{{ itemInfo.type === 0 ? '습득일' : '분실일' }}</td>
                <td>{{ itemInfo.date }}</td>
              </tr>
              <tr>
                <td>{{ itemInfo.type === 0 ? '습득장소' : '분실장소' }}</td>
                <td>{{ itemInfo.location }}</td>
              </tr>
              <tr>
                <td>연락처</td>
                <td>{{ itemInfo.phone }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="board-content"
          v-html="addMaxWidth(specificItem.content)">
        </div>
        <div class="board-sub-info">
          댓글 <span class="numberOfComments">{{ specificItem.comment_count }}</span>개
          <span class="bar">|</span> 조회수
          <span class="hits">{{ specificItem.hit }}</span>
        </div>
        <div class="board-comment">
          <div
            class="comment"
            v-for="comment in specificItem.comments"
            :key="comment.id">
            <div class="comment-info">
              <div class="comment-author">{{ comment.nickname }}</div>
              <div class="comment-createdAt">
                {{ computedTime(comment.created_at)[0] }}
              </div>
              <div
                v-if="computedTime(comment.created_at)[1]"
                class="n">
                <img src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png">
              </div>
              <div
                v-show="comment.grantDelete"
                class="comment-remove"
                @click="deleteLostComment(comment.id)">
                <img src="https://static.koreatech.in/upload/a603ece7567e3b28552fe5193f0453e6.png">
              </div>
            </div>
            <div
              v-if="!adjustInputFlag || comment.id !== adjustIdCheck"
              class="comment-content"
              v-html="displayCommentLink(comment.content)">
            </div>
            <div
              class="comment-adjust-input"
              v-if="adjustInputFlag && comment.id === adjustIdCheck">
              <div class="comment-adjust-box">
                <textarea
                  type="text"
                  v-model="inputAdjustComment">
                </textarea>
                <button
                  class="button"
                  v-if="comment.grantEdit"
                  @click="adjustLostComment(comment.id)">수정
                </button>
              </div>
            </div>
            <button
              v-if="comment.grantEdit"
              class="comment-adjust"
              @click="showAdjustButton(adjustInputFlag, comment.id, comment.content)"
              :style="{ left: adjustInputFlag && comment.id === adjustIdCheck ? '-48px' : '20px' }">
              <span v-if="adjustInputFlag && comment.id === adjustIdCheck">취소</span>
              <span v-if="!(adjustInputFlag && comment.id === adjustIdCheck)">수정</span>
            </button>
          </div>
          <div class="comment-write">
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
              type="button"
              @click="registerLostComment">등록
            </button>
          </div>
        </div>
        <div class="footer">
          <button
            class="go-list"
            type="button"
            @click="goList">목록으로
          </button>
          <button
            v-if="myFlag"
            class="board-remove"
            type="button"
            @click="checkGrantEdit('remove')">삭제
          </button>
          <button
            v-if="myFlag"
            class="board-adjust"
            type="button"
            @click="checkGrantEdit('edit')">수정
          </button>
        </div>
        <div class="mobile__top__nav__button">
          <div
            @click="goList"
            class="mobile__back__button">
            <img
              src="https://static.koreatech.in/assets/img/back-menu.png"
              alt="">
          </div>
          <div
            @click="goRegister"
            class="mobile__register__button">
            <img
              src="https://static.koreatech.in/assets/img/mobile__create.png"
              alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {store} from '../../../stores/store'
  import * as LoginCheck from '../../../stores/loginCheck'
  import {mapGetters} from 'vuex';
  import {vueTopprogress} from 'vue-top-progress'

  export default {
    name: 'LostItemDetail',
    data() {
      return {
        itemInfo: '',
        today: new Date(),
        myFlag: false,
        loadingFlag: false,
        nowSpecificItemId: '',
        adjustInputFlag: false,
        adjustIdCheck: '',
        done: false,
        inputRegisterComment: '',
        inputAdjustComment: '',
        tagFilter: /<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig,
        urlR: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,256}\b(\/?[-a-zA-Z0-9@:;|_\+.~#%?&//=]*)?/gi,
        mobileCommentFlag: false
      }
    },
    computed: {
      ...mapGetters({
        specificItem: 'specificItem'
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
      }
    },
    methods: {
      goFirstList: function() {
        this.$session.set('nowBoardPageNum', 1);
        this.goList();
      },
      getSpecificLostItem (nowSpecificItemId) {
        this.$store.dispatch('getSpecificLostItem', {
          token: this.$session.get('token'),
          specificItemId: nowSpecificItemId
        }).then(data => {
          this.itemInfo = data;
          console.log(data);
          this.displayLink();
          this.loadingFlag = true;
          this.$refs.topProgress.done();
        }, reject => {
          alert('존재하지 않는 게시글입니다.');
          this.$router.push('/lost');
        })
      },

      displayLink() {
        if (this.$session.get("nowBoardId") !== 4) {
          if (this.specificItem.content === null) return ;
          this.specificItem.content = this.specificItem.content.replace(this.urlR, (match) => {
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
          return [String(year) + "." + String(month) + "." + String(date) + " " + String(hour) + ":" + String(minutes), false]
        }
      },

      computedCreatedAt (val) {
        let tmp = val.split(" ");
        let test = tmp[0].replace("-", '.');
        let test2 = test.replace("-", '.')
        return test2;
      },

      computedCreatedAtTime (val) {
        let tmp = val.split(" ");
        return tmp[1];
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
        this.$router.push('/lost');
      },

      checkGrantEdit (check) {
        this.$store.dispatch('grantCheckLost', {
          token: this.$session.get('token'),
          id: this.$session.get('specificItemId')
        }).then(data => {
          if (data.data.grantEdit === true && data.status === 200) {
            if (check === 'remove') {
              if (confirm('삭제하시겠습니까?')) {
                this.$store.dispatch('deleteLostItem', {
                  token: this.$session.get('token'),
                  id: this.$session.get('specificItemId')
                }).then(data => {
                  alert('삭제되었습니다.');
                  this.$router.push('/lost');
                })
              }
            } else {
              if (confirm('수정하시겠습니까?')) {
                this.$router.push('/lost/adjust');
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

      addMaxWidth (val) {
        if (val === null) return ;
          return window.innerWidth > 576 ? val.replace(/<img/gi, "<img style='max-width: 796px' ") : val.replace(/<img/gi, "<img style='max-width: 100%' ")
      },

      registerLostComment () {
        if (this.$session.get('userInfo') === undefined) {
          if(confirm('로그인해야 작성할 수 있습니다. 로그인하시겠습니까?')) {
            this.$router.push('/login');
          }
        } else {
          this.today = new Date();
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
          this.$store.dispatch('registerLostComment', {
            token: this.$session.get('token'),
            itemId: this.$session.get('specificItemId'),
            content: this.inputRegisterComment
          }).then(data => {
            if (data.status === 200 || data.status === 201) {
              alert('댓글이 등록되었습니다.');
              this.inputRegisterComment = '';
              this.getSpecificLostItem(this.nowSpecificItemId);
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

      adjustLostComment (commentId) {
        if (confirm('수정하시겠습니까?')) {
          this.$store.dispatch('adjustLostComment', {
            token: this.$session.get('token'),
            itemId: this.$session.get('specificItemId'),
            id: commentId,
            content: this.inputAdjustComment
          }).then(data => {
            if (data.status === 200 || data.status === 201) {
              this.getSpecificLostItem(this.nowSpecificItemId);
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

      deleteLostComment (commentId) {
        if (confirm('삭제하시겠습니까?')) {
          this.$store.dispatch('deleteLostComment', {
            token: this.$session.get('token'),
            itemId: this.$session.get('specificItemId'),
            id: commentId
          }).then(data => {
            if (data.status === 200 || data.status === 201) {
              this.getSpecificLostItem(this.nowSpecificItemId);
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

      setItemInfo () {
        if (this.itemInfo.type === 0) {

        } else {

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
      }
    },
    mounted () {
      this.$refs.topProgress.start();

      let path = this.$router.history.current.path.split('/');
      this.nowSpecificItemId = path[3];
      this.$session.set('specificItemId', path[3]);
      this.getSpecificLostItem(this.nowSpecificItemId);
      // 로그인 상태에서만 권한 체크
      if (this.$session.get("token") !== undefined) {
        this.$store.dispatch('grantCheckLost', {
          token: this.$session.get('token'),
          id: this.$session.get('specificItemId')
        }).then(data => {
          console.log(data);
          this.myFlag = data.data.grantEdit === true && data.status === 200;
        }, reject => {

        })
      }
      
    },
    created() {
      console.log(this.$session.get('userInfo'))
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main {
    border-top: #f7941e 5px solid;
    width: 100%;
  }

  .container {
    margin-top: 61px;
    width: 1132px;
    margin-left: auto;
    margin-right: auto;
  }

  .list {
    width: 1132px;
    float: left;
    margin-right: 40px;
    margin-bottom: 20px;
  }

  .top {
    width: 258px;
    float: left;
    text-align: left;
    margin-bottom: 20px;
    user-select: none;
  }

  .header {
    width: 100%;
    height: 55px;
  }

  .header .board-name {
    float: left;
    font-family: NanumSquare, serif;
    font-size: 30px;
    font-weight: 800;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -1.5px;
    margin-bottom: 20px;
    color: #175c8e;
    cursor: pointer;
  }

  .go-list {
    float: right;
    padding: 6px 13px;
    color: white;
    background-color: #175c8e;
    border: 1px #175c8e solid;
    font-size: 13px;
    cursor: pointer;
    margin-top: 1px;
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

  .board-head {
    border-top: 2px solid #175c8e;
    border-bottom: 1px solid #175c8e;
    width: 1132px;
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
    padding-top: 26px;
    padding-left: 20px;
    padding-right: 20px;
    padding-bottom: 7px;
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

  .item-info {
    text-align: left;
    padding: 36px 19px 0 19px;
  }

  .item-info table tbody tr td:first-child {
    font-size: 15px;
    font-weight: bold;
    line-height: 1.73;
    letter-spacing: -0.8px;
    color: #555555;
    padding-right: 33px;
  }

  .item-info table tbody tr td:nth-child(2) {
    font-size: 15px;
    font-weight: 300;
    line-height: 1.73;
    letter-spacing: -0.8px;
    color: #555555;
  }

  .board-content {
    text-align: left;
    padding-left: 19px;
    padding-right: 19px;
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
    user-select: text;
    padding-top: 15px;
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

  .board-comment {
    text-align: left;
    height: 100%;
    overflow: scroll;
    margin-bottom: 20px;
    border-bottom: 1px solid #175c8e;
    -ms-overflow-style: none;
    user-select: text;
  }

  .board-comment::-webkit-scrollbar {
    display: none;
  }

  .board-comment .comment {
    padding-top: 20px;
  }

  .board-comment .comment .comment-info {
    display: flex;
    margin-bottom: 4px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .board-comment .comment .comment-info .comment-author {
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

  .board-comment .comment .comment-info .comment-createdAt {
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #858585;
    margin-right: 10px;
  }

  .board-comment .comment .comment-info .comment-remove {
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

  .comment-adjust {
    font-size: 11px;
    position: relative;
    left: 20px;
    border: 1px #d2dae2 solid;
    padding: 6px 13px;
    padding-top: 3px;
    margin-right: 1px;
    text-align: center;
    color: #858585;
    height: 23px;
    user-select: none;
    margin-top: 4px;
    letter-spacing: -0.6px;
    background-color: #ffffff;
    cursor: pointer;
  }

  .comment-remove img {
    width: 10px;
    position: relative;
    top: 1px;
  }

  .board-comment .comment .comment-content {
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #252525;
    padding-left: 20px;
    padding-right: 20px;
    max-width: 100%;
    height: 100%;
    word-break: break-all;
    white-space: pre;
    padding-bottom: 9px;
  }

  /* 댓글쓰기 */
  .board-comment .comment-write {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 27px;
    margin-top: 32px;
    height: 74px;
    width: 1088px;
  }

  .write-box {
    margin-bottom: 27px;
    height: 74px;
    width: 1000px;
    float: left;
    border: 1px #bbbbbb solid;
    border-right: none;
  }

  .board-comment .comment-write .counter {
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

  .board-comment .comment-write textarea {
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
    scroll-snap-margin-bottom: 2000px;
    height: 45px;
    z-index: 13;
    float: left;
    border: none;
  }

  .comment-adjust-box {
    width: 786px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .comment-adjust-box textarea {
    height: 29px;
    width: 1057px;
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

  /* 댓글수정 */
  .board-comment .comment-adjust-input {
  }

  .board-comment .comment-adjust-input .comment-author {
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

  .board-comment .comment-adjust-input input {
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

  .board-comment .comment-adjust-input button {
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

  .mobile__board__head {
    display: none;
  }

  .mobile__comment__container {
    display: none;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .mobile__top__nav__button {
    display: none;
  }

  @media (max-width: 576px) {
    .main {
      border-top: none;
    }

    .container {
      width: 100%;
      margin: 0;
    }

    .list {
      width: inherit;
      margin: 0;
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
    }

    .mobile__button__list .mobile__comment__button {
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
      margin-right: 9.6px;
    }

    .mobile__button__comment__count {
      color: #175c8e;
    }

    .mobile__button__list .mobile__update {
      border: 1px solid #a1a1a1;
      height: 29px;
      width: 51.5px;
      font-size: 12px;
      font-weight: normal;
      color: #252525;
      text-align: center;
      line-height: 1.42;
      letter-spacing: -0.6px;
      background-color: #ffffff;
      margin-right: 9.6px;
    }

    .mobile__button__list .mobile__delete {
      border: 1px solid #a1a1a1;
      height: 29px;
      width: 51.5px;
      font-size: 12px;
      font-weight: normal;
      color: #ff3030;
      line-height: 1.42;
      letter-spacing: -0.6px;
      text-align: center;
      background-color: #ffffff;
    }

    .item-info {
      padding: 15px 16px 0 16px;
    }

    .item-info table tr:first-child {
      display: none;
    }

    .item-info table tbody tr td:first-child {
      width: 92px;
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
    }

    .item-info table tbody tr td:nth-child(2) {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      color: #252525;
    }

    .board-content {
      padding-top: 20px;
      padding-bottom: 20px;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.71;
      letter-spacing: -0.7px;
      min-height: 400px;
      color: #252525;
    }

    .board-sub-info {
      display: none;
    }

    .board-comment {
      display: none;
    }

    .footer {
      display: none;
    }

    .mobile__comment__container {
      display: block;
      position: absolute;
      width: 100%;
      background-color: #ffffff;
      z-index: 4;
    }
    .mobile__comment__list {
      width: calc(100% - 32px);
      padding: 22.5px 16px;
      height: initial;
      border-bottom: 1px solid #ececec;
    }

    .mobile__comment__list .mobile__comment:last-child {
      margin-bottom: 0!important;
    }

    .mobile__comment__info {
      height: 20px;
    }

    .mobile__comment__author {
      font-size: 14px;
      font-weight: normal;
      line-height: 1.71;
      letter-spacing: -0.7px;
      color: #252525;
      float: left;
      margin-right: 5px;
    }

    .mobile__comment__createdAt {
      font-size: 14px;
      font-weight: 300;
      line-height: 1.71;
      letter-spacing: -0.7px;
      text-align: left;
      color: #a1a1a1;
      float: left;
    }

    .mobile__comment__remove__button {
      width: 13px;
      height: 13px;
      padding-top: 3px;
      float: right;
    }

    .mobile__comment__content {
      margin-top: 4px;
      font-size: 14px;
      font-weight: 300;
      line-height: 1.43;
      letter-spacing: -0.7px;
      text-align: left;
      color: #252525;
      word-break: break-all;
    }

    .mobile__comment__button__container {
      height: 39px;
    }

    .mobile__comment__update__button {
      border: 1px solid #a1a1a1;
      height: 29px;
      width: 51.5px;
      font-size: 12px;
      font-weight: normal;
      color: #252525;
      text-align: center;
      line-height: 1.42;
      letter-spacing: -0.6px;
      background-color: #ffffff;
      margin-top: 10px;
      float: left;
    }

    .mobile__comment__editor {
      width: calc(100% - 32px);
      padding: 15.5px 16px 0 16px;
    }

    .mobile__comment__write__box {
      padding: 11px 12px 14px 12px;
      border: 1px solid #a1a1a1;
      text-align: left;
    }

    .mobile__my__nickname {
      font-size: 14px;
      font-weight: normal;
      line-height: 1.71;
      letter-spacing: -0.7px;
      color: #252525;
    }

    .mobile__comment__write__box textarea {
      width: 100%;
      height: 63px;
      font-size: 14px;
      font-weight: 300;
      line-height: 1.71;
      letter-spacing: -0.7px;
      color: #252525;
      border: none;
      padding: 0;
      resize: none;
    }

    .mobile__comment__button__list {
      display: flex;
      margin-top: 8px;
      margin-bottom: 24px;
    }

    .mobile__comment__button__list button {
      width: calc((100% - 8px) / 2);
      border: 1px solid #a1a1a1;
      height: 29px;
      font-size: 12px;
      font-weight: normal;
      line-height: 1.42;
      letter-spacing: -0.6px;
      background-color: #ffffff;
      color: #252525;
    }

    .mobile__comment__button__list button:first-child {
      margin-right: 8px;
    }

    .mobile__top__nav__button {
      display: block;
    }

    .mobile__back__button {
      position: absolute;
      top: 16px;
      left: 16px;
    }

    .mobile__register__button {
      position: absolute;
      top: 16px;
      right: 16px;
    }

    .mobile__back__button, .mobile__register__button {
      background-color: #175c8e;
      width: 24px;
      height: 24px;
    }

    .mobile__top__nav__button img {
      width: 24px;
      height: 24px;
    }

  }
</style>
