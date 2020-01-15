<template>
  <div class="main">
    <vue-topprogress
      color="#f7941e"
      ref="topProgress"></vue-topprogress>
    <div v-if="!loadingFlag">
      <v-loading-bar></v-loading-bar>
    </div>
    <div class="detail">
      <div class="header">
        <div
          @click="goFirstList"
          class="title">
          {{ computedTitle }}
        </div>
        <div>
          <button
            class="go-list"
            type="button"
            @click="goList()">목록으로
          </button>
          <button
            v-if="myFlag"
            class="market-remove"
            type="button"
            @click="checkGrantEdit('remove')">삭제
          </button>
          <button
            v-if="myFlag"
            class="market-adjust"
            type="button"
            @click="checkGrantEdit('edit')">수정
          </button>
        </div>
      </div>
      <div class="market-head">
        <div class="left-form">
          <div class="market-header">
            <div class="market-title"> {{ specificmarket.title }}
              <span
                v-if="returnLength(specificmarket.comments)!==0"
                class="market-title-num-of-comment">[{{ returnLength(specificmarket.comments) }}]
              </span>
              <span
                v-if="computedTime(specificmarket.created_at)[1]"
                class="n">
                <img src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png">
              </span>
            </div>
            <div class="market-info">
              <div class="author">{{ specificmarket.nickname }}</div>
              <div class="createdAt">{{ computedCreatedAt(specificmarket.created_at) }} <span>{{ computedCreatedAtTime(specificmarket.created_at) }}</span>
              </div>
            </div>
          </div>
          <div class="sub-info">
            <span
              v-if="specificmarket.state === 0"
              class="type">{{ state(specificmarket.state) }}</span>
            <span
              v-if="specificmarket.state === 1"
              class="type-2">{{ state(specificmarket.state) }}</span>
            <span
              v-if="specificmarket.state === 2"
              class="type-3">{{ state(specificmarket.state) }}</span>
            <span
              :class="{'price-done': specificmarket.state === 2, 'price-stop' : specificmarket.state === 1}"
              class="price">
              <b>{{ price(specificmarket.price) }}</b>원
            </span>
            <div class="guide">
              <img
                class="alert-mark"
                src="https://static.koreatech.in/upload/6179219f1d42a44c5063d779f20ad3b0.png">
              {{ computedWord }}자의 통화 가능여부를 고려해 문자로 먼저 문의하는 센스는 필수!
              <span class="phone">
                <b>연락처</b> &nbsp;
                <span v-if="specificmarket.is_phone_open">{{ specificmarket.phone }}</span>
                <span v-if="!specificmarket.is_phone_open">비공개</span>
              </span>
            </div>
          </div>
        </div>
        <div class="right-form">
          <div class="thumbnail-container">
            <img
              class="thumbnail"
              v-if="specificmarket.thumbnail!==null"
              :src="specificmarket.thumbnail">
            <div
              class="image-done"
              v-if="specificmarket.thumbnail!==null && specificmarket.state === 2"><span>판매가 완료되었습니다.</span></div>
            <div
              class="no-img"
              :class="{'no-img-done': specificmarket.state === 2}"
              v-if="specificmarket.thumbnail===null">
              <span
                v-if="specificmarket.state !== 2">no image</span>
              <span
                v-if="specificmarket.state === 2">판매가 완료되었습니다.</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mobile__market__head">
        <div class="mobile__thumbnail__container">
          <img
            class="mobile__thumbnail"
            v-if="specificmarket.thumbnail!==null"
            :src="specificmarket.thumbnail">
          <div
            class="mobile__image__done"
            v-if="specificmarket.thumbnail!==null && specificmarket.state === 2"><span>판매가 완료되었습니다.</span></div>
          <div
            class="mobile__no__img"
            :class="{'mobile__no__img__done': specificmarket.state === 2}"
            v-if="specificmarket.thumbnail===null">
            <span
              v-if="specificmarket.state !== 2">no image</span>
            <span
              v-if="specificmarket.state === 2">판매가 완료되었습니다.</span>
          </div>
        </div>
        <div class="mobile__item__info">
          <div class="mobile__title">
            {{ specificmarket.title }}
            <span
              v-if="returnLength(specificmarket.comments)!==0"
              class="mobile__comment__count">({{ returnLength(specificmarket.comments) }})
            </span>
          </div>
          <div class="mobile__sub__info">
            <span class="mobile__hit">조회 {{ specificmarket.hit }} · </span>
            <span class="mobile__nickname">{{ specificmarket.nickname }}</span>
            <span class="mobile__createdAt">{{ computedCreatedAt(specificmarket.created_at) }}</span>
          </div>
          <div class="mobile__price">
            {{ price(specificmarket.price) }}원
          </div>
          <div class="mobile__button__list">
            <button
              @click="showCommentList"
              class="mobile__comment__button">
              댓글 <span>{{ returnLength(specificmarket.comments) }}</span>
            </button>
            <button
              v-if="myFlag"
              @click="checkGrantEdit('edit')"
              class="mobile__update__button">
              수정
            </button>
            <button
              v-if="myFlag"
              @click="checkGrantEdit('remove')"
              class="mobile__remove__button">
              삭제
            </button>
          </div>
        </div>
      </div>
      <transition name="fade">
        <div
          class="mobile__comment__container"
          v-if="mobileCommentFlag">
          <div
            v-if="specificmarket.comments.length !== 0"
            class="mobile__comment__list">
            <div
              :style="{ marginBottom: comment.grantEdit ? '24px' : '16px' }"
              class="mobile__comment"
              v-for="comment in specificmarket.comments"
              :key="comment.id">
              <div class="mobile__comment__info">
                <span class="mobile__comment__author">{{ comment.nickname }}</span>
                <span class="mobile__comment__createdAt">{{ computedTime(comment.created_at)[0] }}</span>
                <img
                  v-if="comment.grantEdit"
                  @click="removeComment(comment.id)"
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
                @click="adjustComment(adjustIdCheck)">
                수정
              </button>
              <button
                @click="registerComment"
                v-if="!adjustInputFlag"
                class="mobile__comment__register__button">
                등록
              </button>
            </div>
          </div>
        </div>
      </transition>
      <div class="content">
        <div class="title">
          상품정보
        </div>
        <div class="mobile__phone">
          <span>연락처</span>
          <span v-if="specificmarket.is_phone_open">{{ specificmarket.phone }}</span>
          <span v-if="!specificmarket.is_phone_open">비공개</span>
        </div>
        <span v-html="addMaxWidth(specificmarket.content)"></span>
      </div>

      <div class="market-sub-info">
        댓글 <span class="numberOfComments">{{ returnLength(specificmarket.comments) }}</span>개
        <span class="bar">|</span> 조회수
        <span class="hits">{{ specificmarket.hit }}</span>
      </div>
      <div class="market-comment">
        <div
          class="comment"
          v-for="comment in specificmarket.comments"
          :key="comment.key">
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
              @click="removeComment(comment.id)"
              class="comment-remove">
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
            v-if="adjustInputFlag===true && comment.id === adjustIdCheck">
            <div class="comment-adjust-box">
              <textarea
                type="text"
                v-model="inputAdjustComment">
              </textarea>
              <button
                type="button"
                v-if="comment.grantEdit"
                @click="adjustComment(comment.id)">수정
              </button>
            </div>
          </div>
          <button
            v-if="comment.grantEdit"
            @click="showAdjustButton(adjustInputFlag, comment.id, comment.content)"
            class="comment-adjust"
            :style="{ left: adjustInputFlag && comment.id === adjustIdCheck ? '-48px' : '20px'}"
          >
            <span v-if="adjustInputFlag===true && comment.id === adjustIdCheck">취소</span>
            <span v-if="!(adjustInputFlag===true && comment.id === adjustIdCheck)">수정</span>
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
            @click="registerComment()">등록
          </button>
        </div>
      </div>
      <div class="footer">
        <button
          class="go-list"
          type="button"
          @click="goList()">목록으로
        </button>
        <button
          v-if="myFlag"
          class="market-remove"
          type="button"
          @click="checkGrantEdit('remove')">삭제
        </button>
        <button
          v-if="myFlag"
          class="market-adjust"
          type="button"
          @click="checkGrantEdit('edit')">수정
        </button>
      </div>
      <div class="mobile__top__nav__button">
        <div class="mobile__back__button">
          <img
            @click="goList"
            src="https://static.koreatech.in/assets/img/back-menu.png"
            alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {store} from '../../../stores/store'
  import {mapGetters} from 'vuex';
  import {vueTopprogress} from 'vue-top-progress'
  import * as LoginCheck from '../../../stores/loginCheck'

  export default {
    name: 'MarketDetail',
    data() {
      return {
        myFlag: false,
        VUEX_market_STATE: store.state,
        inputRegisterComment: "",
        inputAdjustComment: "",
        adjustInputFlag: false,
        adjustIdCheck: "",
        authGuard: false,
        today: new Date(),
        loadingFlag: false,
        urlR: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,256}\b(\/?[-a-zA-Z0-9@:;|_\+.~#%?&//=]*)?/gi,
        mobileCommentFlag: false
      }
    },
    components: {
      vueTopprogress
    },
    computed: {
      ...mapGetters({
        specificmarket: 'specificmarket'
      }),
      computedAdjustCommentCount: function () {
        if (this.inputAdjustComment.length > 3000) {
          alert("3000자 이상 입력할 수 없습니다.");
          this.cutComment();
        }
        return this.inputAdjustComment.length;
      },
      computedCommentCount: function () {
        if (this.inputRegisterComment !== '') {
          if (this.$session.get('userInfo') === undefined) {
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
      },
      computedTitle: function () {
        switch (this.$session.get("nowMarketId")) {
          case 0:
            return "팝니다";
          case 1:
            return "삽니다";
        }
      },
      computedWord: function () {
        switch (this.$session.get("nowMarketId")) {
          case 0:
            return "판매";
          case 1:
            return "구매";
        }
      }
    },
    methods: {
      goFirstList: function() {
        this.$session.set("nowMarketPageNum", 1);
        this.goList();
      },
      displayLink() {
        this.specificmarket.content = this.specificmarket.content.replace(this.urlR, (match) => {
          console.log(this.specificmarket.content);
          console.log(match);
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
      },
      displayCommentLink(val) {
        val = val.replace(this.urlR, (match) => {
          if (match.match('http') !== null) return `<a href="${match}" target="_blank">${match}</a>`
          else return `<a href="//${match}" target="_blank">${match}</a>`;
        });
        return val;
      },
      changeTime: function (time) {
        if (time !== undefined) {
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
        }
      },
      addMaxWidth: function (val) {
        if (val !== null && val !== undefined)
          return window.innerWidth > 576 ? val.replace(/<img/gi, "<img style='max-width: 1132px' ") : val.replace(/<img/gi, "<img style='max-width: 100%' ")
      },
      goList() {
        if (this.$session.get("nowMarketId") === 0)
          this.$router.push('/market/sell');
        else if (this.$session.get("nowMarketId") === 1)
          this.$router.push('/market/buy');
        else {
          this.$router.push('/market/sell');
        }
      },
      addBr: function (val) {
        let tmp = val.replace(/(?:\r\n|\r|\n)/g, '<br />')
        return tmp;
      },
      cutComment: function () {
        this.inputRegisterComment = this.inputRegisterComment.substring(0, 3000);
      },
      returnLength: function (val) {
        if (val !== undefined)
          return val.length;
      },
      price: function (price) {
        if (price === 0)
          return "- "
        else
          return this.numberWithCommas(price);
      },
      numberWithCommas: function (x) {
        if (x !== undefined)
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      state: function (val) {
        switch (val) {
          case 0:
            if (this.$session.get("nowMarketId") === 0)
              return "판매중";
            else
              return "구매중";
          case 1:
            if (this.$session.get("nowMarketId") === 0)
              return "판매중지";
            else
              return "구매중지";
          case 2:
            if (this.$session.get("nowMarketId") === 0)
              return "판매완료";
            else
              return "구매완료";
        }
      },
      computedCreatedAt(val) {
        if (val !== undefined) {
          let tmp = val.split(" ");
          let test = tmp[0].replace("-", '.');
          let test2 = test.replace("-", '.')
          return test2;
        }
      },
      computedCreatedAtTime(val) {
        if (val !== undefined) {
          let tmp = val.split(" ");
          return tmp[1];
        }
      },
      computedTime: function (time) {
        if (time !== undefined) {
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
        }
        return [0, 0]
      },
      showAdjustButton: function (flag, id, content) {
        this.inputAdjustComment = content;
        if (id !== this.adjustIdCheck && this.adjustIdCheck !== "") {
          this.adjustInputFlag = true;
        }
        else
          this.adjustInputFlag = !flag;
        this.adjustIdCheck = id;
      },
      adjustComment: function (commentId) {
        if (confirm("수정하시겠습니까?") === true) {
          this.$store.dispatch('adjustMarketComment', {
            id: commentId,
            articleId: this.$session.get("specificMarketId"),
            token: this.$session.get("token"),
            content: this.inputAdjustComment
          }).then((data) => {
            if (data.status === 200 || data.status === 201) {
              alert("댓글이 수정되었습니다.")
              this.setSpecificMarket();
              this.inputAdjustComment = "";
              this.adjustInputFlag = false;
            }
            else if (data.status === 401) {
              alert("다시 로그인해주세요.")
            }
            else {
              alert("서버와의 연결이 끊어졌습니다.")
            }
          }, (error) => {
            alert("더 이상 데이터를 불러올 수 없습니다.");
          })
        }
      },
      removeComment: function (commentId) {
        if (confirm("삭제하시겠습니까?") === true) {
          this.$store.dispatch('removeMarketComment', {
            id: commentId,
            articleId: this.$session.get("specificMarketId"),
            token: this.$session.get("token")
          }).then((data) => {
            if (data.status === 200 || data.status === 201) {
              alert("댓글이 삭제되었습니다.");
              this.setSpecificMarket();
            }
            else if (data.status === 401) {
              alert("다시 로그인해주세요.")
            }
            else {
              alert("서버와의 연결이 끊어졌습니다.")
            }
          }, (error) => {
            alert("더 이상 데이터를 불러올 수 없습니다.");
          })
        }
      },
      registerComment: function () {
        if (this.$session.get('userInfo') === undefined) {
          if (confirm('로그인해야 작성할 수 있습니다. 로그인하시겠습니까?')) {
            this.$router.push('/login');
          }
        } else {
          if (this.$session.get("userInfo").nickname === undefined || this.$session.get("userInfo").nickname === "" || this.$session.get("userInfo").nickname === null) {
            alert("닉네임이 필요합니다.");
            this.$store.dispatch('nicknameFlagCheck', {
              nickname: this.$session.get("userInfo").nickname
            });
            this.$router.push('/changeinfo');
            return;
          }
          this.today = new Date();
          this.$store.dispatch('registerMarketComment', {
            content: this.inputRegisterComment,
            articleId: this.$session.get("specificMarketId"),
            token: this.$session.get("token")
          }).then((data) => {
            if (data.status === 200 || data.status === 201) {
              alert("댓글이 등록되었습니다.");
              this.inputRegisterComment = "";
              this.setSpecificMarket();
            }
            else if (data.status === 401) {
              alert("다시 로그인해주세요.")
            }
            else {
              alert("서버와의 연결이 끊어졌습니다.")
            }
          }, (error) => {
            alert("더 이상 데이터를 불러올 수 없습니다.");
          })
        }
      },
      setSpecificMarket: function () {
        this.$store.dispatch("setSpecificMarket", {
          specificMarketId: this.$session.get("specificMarketId"),
          token: this.$session.get("token")
        }).then((data) => {
          this.displayLink();
          if (data.type !== this.$session.get("nowMarketId")) {
            let path = this.$router.history.current.path.split('/');
            switch (path[2]) {
              case 'sell':
                this.$session.set("nowMarketId", 0);
                this.$router.push("/market/sell");
                break;
              case 'buy':
                this.$session.set("nowMarketId", 1);
                this.$router.push("/market/buy");
                break;
            }
            alert("존재하지 않는 게시글입니다.");
          }
          else {
            this.loadingFlag = true;
            this.$refs.topProgress.done();
          }
        }, (reject) => {
          alert("존재하지 않는 게시글입니다.");
          const path = this.$route.path;
          const redirectPath = path.substring(0, path.lastIndexOf('/'));
          this.$router.push(redirectPath);
        })
      },
      checkGrantEdit: function (check) {
        this.$store.dispatch('grantCheckMarket', {
          "token": this.$session.get("token"),
          "articleId": this.$session.get("specificMarketId"),
        })
          .then((data) => {
            if (data.data.grantEdit === true && data.status === 200) {
              if (check === 'remove') {
                if (confirm("삭제하시겠습니까?") === true) {
                  this.$store.dispatch('removeMarket', {
                    "token": this.$session.get("token"),
                    "articleId": this.$session.get("specificMarketId"),
                  }).then((data) => {
                    alert("삭제되었습니다.");
                    switch (this.$session.get("nowMarketId")) {
                      case 0:
                        this.$router.push("/market/sell");
                        break;
                      case 1:
                        this.$router.push("/market/buy");
                        break;
                    }
                  })
                }
              }
              else {
                if (confirm("수정하시겠습니까?") === true) {
                  this.$router.push('/market/adjust')
                }
              }
            }
            else {
              alert("권한이 없습니다.");
            }
          }, (error) => {
            if (error === 403) alert("게시물을 수정하거나 삭제할 권한이 없습니다.");
            else alert("더 이상 데이터를 불러올 수 없습니다.");

          })
      },
      removeMarket: function () {

      },
      nonMemberCheck() {
        if (this.$session.get('userInfo') === undefined) {
          if (confirm('로그인해야 작성할 수 있습니다. 로그인하시겠습니까?')) {
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
        this.$router.push('/market/register');
      }
    },
    mounted() {
      this.$refs.topProgress.start()

      let path = this.$router.history.current.path.split('/');
      switch (path[2]) {
        case 'sell':
          this.$session.set("nowMarketId", 0);
          break;
        case 'buy':
          this.$session.set("nowMarketId", 1);
          break;
      }
      this.$session.set("specificMarketId", path[3]);
      this.setSpecificMarket();
      if (this.$session.get("token") !== undefined) {
        this.$store.dispatch('grantCheckMarket', {
          "token": this.$session.get("token"),
          "articleId": this.$session.get("specificMarketId"),
        }).then((data) => {
          if (data.data.grantEdit === true && data.status === 200) {
            this.myFlag = true;
          }
          else
            this.myFlag = false;
        }, (reject) => {

        })
      }
    },
    created() {
    },
    beforeRouteUpdate(to, from, next) {
      // 로그인 세션 유지한 경우
      console.log("router updated!!!")
      let path = this.$router.history.current.path.split('/');
      switch (path[2]) {
        case 'sell':
          this.$session.set("nowMarketId", 0);
          break;
        case 'buy':
          this.$session.set("nowMarketId", 1);
          break;
      }
      this.$session.set("specificMarketId", path[3]);
      this.setSpecificMarket();
      if (this.$session.get("token") !== undefined) {
        this.$store.dispatch('grantCheckMarket', {
          "token": this.$session.get("token"),
          "articleId": this.$session.get("specificMarketId"),
        }).then((data) => {
          if (data.data.grantEdit === true && data.status === 200) {
            this.myFlag = true;
          }
          else
            this.myFlag = false;
        }, (reject) => {

        })
      }
      next();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main {
    width: 100%;
    border-top: #f7941e 5px solid;
  }

  .detail {
    width: 1132px;
    margin-left: auto;
    margin-right: auto;
  }

  .header {
    height: 116px;
    border-bottom: #175c8e 2px solid;
  }

  .header .title {
    float: left;
    font-size: 30px;
    font-family: NanumSquare, serif;
    font-weight: 800;
    letter-spacing: -1.5px;
    padding-top: 63px;
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
    margin-top: 65px;
    letter-spacing: -0.6px;
  }

  .market-adjust {
    float: right;
    padding: 6px 14px;
    color: #175c8e;
    background: white;
    border: 1px #175c8e solid;
    font-size: 13px;
    cursor: pointer;
    margin-right: 5px;
    margin-top: 65px;
    letter-spacing: -0.6px;
  }

  .market-remove {
    float: right;
    padding: 6px 14px;
    color: #d32525;
    background: white;
    border: 1px #d32525 solid;
    font-size: 13px;
    cursor: pointer;
    margin-right: 5px;
    margin-top: 65px;
    letter-spacing: -0.6px;
  }

  .footer .go-list, .footer .market-adjust, .footer .market-remove {
    margin-top: 0;
    margin-bottom: 60px;
  }

  .market-head {
    width: 1132px;
    height: 225px;
    text-align: left;
    user-select: text;
  }

  .left-form {
    float: left;
    width: 870px;
  }

  .right-form {
    float: left;
    width: 262px;
  }

  .thumbnail-container {
    margin-top: 28px;
    width: 262px;
    height: 169px;
    overflow: hidden;
  }

  .thumbnail {
    width: 262px;
    height: auto;
    min-height: 169px;
  }

  .right-form .no-img {
    background: #cacaca;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 169px;
    height: 169px;
    width: 262px;
    text-align: center;
    vertical-align: middle;
    color: #999999;
    font-size: 15px;
    margin-bottom: 7px;
    float: left;
  }

  .market-title {
    font-family: NanumBarunGothic, serif;
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -1px;
    color: #252525;
    padding-top: 26px;
    padding-bottom: 7px;
    width: 850px;
    word-wrap: break-word;
  }

  .market-title .market-title-num-of-comment {
    font-size: 15px;
    letter-spacing: -0.8px;
    color: #175c8e;
  }

  .market-header {
    height: 100%;
  }

  .market-info {
    display: flex;
  }

  .market-info .author {
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

  .market-info .createdAt {
    font-family: NanumBarunGothic, serif;
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    color: #858585;
  }

  .market-info .createdAt span {
    margin-left: 7px;
  }

  .sub-info {
    margin-top: 48px;
    height: 107px;
    height: 107px;
  }

  .sub-info .type, .sub-info .type-2, .sub-info .type-3 {
    float: left;
    font-size: 11px;
    border-radius: 15px;
    padding: 5px 13px;
  }

  .sub-info .type {
    color: #175c8e;
    border: 1px #175c8e solid;
  }

  .sub-info .type-2 {
    color: #d32525;
    border: 1px #d32525 solid;
  }

  .sub-info .type-3 {
    color: #aeaeae;
    border: 1px #aeaeae solid;
  }

  .sub-info .price {
    margin-left: 10px;
    color: #175c8e;
    font-size: 24px;
  }

  .guide {
    background: #f3f8fb;
    width: 502px;
    font-size: 12px;
    letter-spacing: -0.6px;
    text-align: center;
    margin-top: 14px;
    padding-top: 5px;
    padding-bottom: 9px;
    color: #8ca1b0;
  }

  .guide span {
    margin-left: 11px;
    color: #252525;
  }

  .alert-mark {
    width: 16px;
    position: relative;
    top: 4px;
    margin-right: 6px;
  }

  .n img {
    width: 13.5px;
    height: 14px;
    position: relative;
    margin-left: 4px;
    top: 2px;
  }

  .content {
    border-top: #175c8e 1px solid;
    text-align: left;
    height: 100%;
    min-height: 400px;
    margin-bottom: 29px;
    width: 1132px;
    word-break: break-all;
    font-size: 15px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.73;
    letter-spacing: -0.8px;
    color: #555555;
    -ms-overflow-style: none;
    user-select: text;
  }

  .content .title {
    letter-spacing: -0.9px;
    text-align: left;
    color: #175c8e;
    font-size: 18px;
    margin-top: 38px;
    font-weight: 800;
    margin-bottom: 24px;
  }

  .market-sub-info {
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

  .market-sub-info button {
    float: right;
    border: 1px #d2dae2 solid;
    margin-left: 19px;
    margin-right: 19px;
    position: relative;
    bottom: 2px;
  }

  .market-sub-info button:active, .market-sub-info button:hover {
    background: #175c8e;
    color: white;
  }

  .market-sub-info .numberOfComments, .market-sub-info .hits {
    color: #175c8e;
  }

  .market-comment {
    text-align: left;
    height: 100%;
    overflow: scroll;
    margin-bottom: 20px;
    border-bottom: 1px solid #175c8e;
    -ms-overflow-style: none;
    user-select: text;
  }

  .market-comment::-webkit-scrollbar {
    display: none;
  }

  .market-comment .comment {
    padding-top: 25px;
    padding-bottom: 7px
  }

  .market-comment .comment .comment-info {
    display: flex;
    margin-bottom: 4px;
    padding-left: 20px;
    padding-right: 20px;
  }

  .market-comment .comment .comment-info .comment-author {
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

  .market-comment .comment .comment-info .comment-createdAt {
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

  .market-comment .comment .comment-info .comment-remove {
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
    margin-top: 8px;
    letter-spacing: -0.6px;
    background-color: #ffffff;
  }

  .comment-remove img {
    width: 10px;
    position: relative;
    top: 2px;
    margin-left: 10px;
  }

  .market-comment .comment .comment-content {
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
    white-space: normal;
    word-break: break-all;
  }

  /* 댓글쓰기 */
  .market-comment .comment-write {
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 35px;
    padding-top: 32px;
    margin-top: 20px;
    height: 74px;
    width: 1092px;
    border-top: 1px #e7e7e7 solid;
  }

  .write-box {
    margin-bottom: 27px;
    height: 74px;
    width: 1000px;
    float: left;
    border: 1px #bbbbbb solid;
    border-right: none;
  }

  .market-comment .comment-write .counter {
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

  .market-comment .comment-write textarea {
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
    width: 988px;
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

  .market-comment .comment-write button {
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
  }

  /* 댓글수정 */
  .market-comment .comment-adjust-input {

  }

  .market-comment .comment-adjust-input .comment-author {
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

  .market-comment .comment-adjust-input input {
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

  .market-comment .comment-adjust-input button {
    font-family: NanumBarunGothic, serif;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -0.7px;
    float: left;
    user-select: none;
    font-size: 11px;
    top: 8px;
    position: relative;
    left: 51px;
    resize: none;
    color: white;
    background: #175c8e;
    padding: 5px 14px;
    padding-bottom: 4px;
    border: 1px #175c8e solid;
    border-radius: 0;
  }

  .comment .n img {
    top: 1px;
    user-select: none;
  }

  .sub-info .price-done {
    color: #aeaeae;
  }

  .sub-info .price-stop {
    color: #d32525;
  }

  .right-form .thumbnail-done {
    width: 190px;
    height: 100px;
    background: black;
    opacity: 0.9;
    z-index: 15;
  }

  .right-form .no-img-done {
    background: #000000;
    opacity: 0.6;
  }

  .right-form .image-done {
    position: relative;
    top: 28px;
    color: white;
    width: 262px;
    height: 169px;
    opacity: 0.6;
    background: #000000;
  }

  .right-form .image-done span {
    color: white;
    font-size: 13px;
    bottom: 120px;
    left: 75px;
    letter-spacing: -0.7px;
    opacity: 1.0;
    position: relative;
    z-index: 16;
    font-weight: 800;
  }

  .market-comment .no-comment {
    padding-top: 12px;
    border-top: none;
  }

  .mobile__market__head, .content .mobile__phone {
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

    .detail {
      width: 100%;
      margin: 0;
    }

    .header, .footer, .market-head, .market-sub-info, .market-comment {
      display: none;
    }

    .mobile__market__head {
      width: 100%;
      display: block;
      border-bottom: 1px solid #ececec;
    }

    .mobile__thumbnail__container {
      width: 100%;
      height: 214px;
    }

    .mobile__thumbnail__container .mobile__thumbnail {
      height: 214px;
    }

    .mobile__thumbnail__container .mobile__no__img {
      width: 100%;
      height: 214px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #a1a1a1;
    }

    .mobile__thumbnail__container .mobile__no__img span {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.25;
      letter-spacing: -0.8px;
      color: #d1d1d1;
    }

    .mobile__item__info {
      padding: 16px 16px 15px 16px;
      width: calc(100% - 32px);
    }

    .mobile__title {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      text-align: left;
      color: rgba(0, 0, 0, 0.87);
      word-break: break-all;
    }

    .mobile__title span {
      color: #175c8e;
    }

    .mobile__sub__info {
      width: 100%;
      height: 20px;
      font-size: 13px;
      font-weight: normal;
      line-height: 1.54;
      letter-spacing: -0.7px;
      color: #a1a1a1;
      margin-top: 1px;
    }

    .mobile__sub__info span {
      float: left;
    }

    .mobile__sub__info .mobile__createdAt {
      float: right;
    }

    .mobile__price {
      font-size: 13px;
      font-weight: normal;
      line-height: 1.54;
      letter-spacing: -0.7px;
      text-align: left;
      color: #175c8e;
      margin-top: 1px;
    }

    .mobile__button__list {
      margin-top: 17px;
      width: 100%;
      text-align: left;
    }

    .mobile__button__list button {
      padding: 6.5px 13.5px;
      font-size: 12px;
      font-weight: normal;
      line-height: 1.42;
      letter-spacing: -0.6px;
      text-align: center;
      color: #252525;
      background-color: #ffffff;
      border: 1px solid #a1a1a1;
      margin-right: 9.6px;
    }

    .mobile__button__list button span {
      color: #175c8e;
    }

    .mobile__remove__button {
      color: #ff3030!important;
    }

    .content {
      padding: 0 16px;
      width: calc(100% - 32px);
      border-top: none;
      font-size: 14px;
      font-weight: normal;
      line-height: 1.71;
      letter-spacing: -0.7px;
      color: #252525;
    }
    
    .content .title {
      display: none;
    }

    .content .mobile__phone {
      display: flex;
      margin-top: 15.5px;
      margin-bottom: 19px;
    }

    .content .mobile__phone span {
      font-size: 16px;
      font-weight: normal;
      line-height: 1.5;
      letter-spacing: -0.8px;
      text-align: left;
      color: #252525;
    }

    .content .mobile__phone span:first-child {
      width: 25%;
    }

    .content .mobile__phone span:last-child {
      width: 75%;
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
