<template>
  <div class="list">
    <div class="header">
      <board-header-title
        :boardId="$session.get('nowBoardId')">
      </board-header-title>
      <div>
        <button
          v-if="this.$session.get('nowBoardId')!==4"
          class="write"
          type="button"
          @click="registerBoard">글쓰기
        </button>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th class="index-id">번호</th>
          <th class="title">제목</th>
          <th class="nickname">작성자</th>
          <th class="date">날짜</th>
          <th class="hit">조회수</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="board in this.boardList"
          :key="board.id"
          @click="clickSpecificBoard(board.id)">
          <td class="id">{{ board.id }}</td>
          <td class="title">
            <span class="type">{{ convertNoiceTitle(board.board_id) }}</span>
            <span>{{ convertTitle(board.title) }}</span>
            <span
              v-if="board.comment_count!==0"
              class="hit"><span class="comment-count">[{{ board.comment_count }}]</span>
            </span>

            <i
              v-if="computedTime(board.created_at)[1]"
              class="n">
              <img src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png">
            </i>
          </td>
          <td class="nickname">{{ board.nickname === undefined ? board.author : board.nickname }}</td>
          <td class="date">{{ computedTime(board.created_at)[0] }}
          </td>
          <td class="hit">{{ board.hit }}</td>
          <div class="mobile__list">
            <div class="mobile__title">
              <span class="type">{{ convertNoiceTitle(board.board_id) }}</span>
              <span>{{ convertTitle(board.title) }}</span>
              <span
                v-if="board.comment_count!==0"
                class="mobile__comment__count">
                ({{ board.comment_count }})
              </span>
            </div>
            <div class="mobile__info">
              <span class="mobile__hit">조회 {{ board.hit }} · </span>
              <span class="mobile__nickname">{{ board.nickname === undefined ? board.author : board.nickname }}</span>
              <span class="mobile__date">{{ computedTime(board.created_at)[0] }}</span>
            </div>
          </div>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button
        class="arrow"
        @click="clickPrevButton">이전으로
      </button>
      <button
        :class="{active: nowPageNum===n}"
        class="number"
        v-for="n in totalDisplayPageNum"
        :key="n.id"
        @click="clickPageNum(n)"
        v-if="n>=totalDisplayMinNum"><span class="num">{{ n }}</span>
      </button>
      <button
        class="arrow"
        @click="clickNextButton">다음으로
      </button>
      <div>
        <button
          v-if="this.$session.get('nowBoardId')!==4"
          class="write end-write"
          type="button"
          @click="registerBoard">글쓰기
        </button>
      </div>
    </div>
    <div
      v-if="this.$session.get('nowBoardId')!==4"
      class="mobile__write"
      @click="registerBoard">
      <img src="https://static.koreatech.in/assets/img/mobile__create.png">
    </div>
  </div>



</template>

<script>
  import * as BOARD_ID_LIST from '../../../static/boardId';
  import {store} from '../../../stores/store'
  import {mapGetters} from 'vuex';
  import BoardMixin from '../BoardMixins/boardMixin'
  import BoardHeaderTitle from '../BoardSharedComponent/BoardHeaderTitle'

  export default {
    name: 'BoardList',
    data() {
      return {
        today: new Date(),
        boardIdList: BOARD_ID_LIST.default,
        boardId: this.$store.getBoardId,
        nowPageNum: 1,
        VUEX_BOARD_STATE: store.state
      }
    },
    watch: {
      '$route': 'fetchData'
    },
    mixins: [BoardMixin],
    components: {
      boardHeaderTitle: BoardHeaderTitle,
    },
    computed: {
      ...mapGetters({
        boardList: 'boardList',
        totalBoardPageNum: 'totalBoardPageNum',
        totalDisplayMinNum: 'totalDisplayMinNum',
        totalDisplayPageNum: 'totalDisplayPageNum'
      }),
    },
    methods: {
      convertTitle : function(string) {
        let entityMap = {
          "'": "&apos;",
          "<": "&lt;",
          ">": "&gt;",
          " ": "&nbsp;",
          "¡": "&iexcl;",
          "¢": "&cent;",
          "£": "&pound;",
          "¤": "&curren;",
          "¥": "&yen;",
          "¦": "&brvbar;",
          "§": "&sect;",
          "¨": "&uml;",
          "©": "&copy;",
          "ª": "&ordf;",
          "«": "&laquo;",
          "¬": "&not;",
          "®": "&reg;",
          "¯": "&macr;",
          "°": "&deg;",
          "±": "&plusmn;",
          "²": "&sup2;",
          "³": "&sup3;",
          "´": "&acute;",
          "µ": "&micro;",
          "¶": "&para;",
          "·": "&middot;",
          "¸": "&cedil;",
          "¹": "&sup1;",
          "º": "&ordm;",
          "»": "&raquo;",
          "¼": "&frac14;",
          "½": "&frac12;",
          "¾": "&frac34;",
          "¿": "&iquest;",
          "À": "&Agrave;",
          "Á": "&Aacute;",
          "Â": "&Acirc;",
          "Ã": "&Atilde;",
          "Ä": "&Auml;",
          "Å": "&Aring;",
          "Æ": "&AElig;",
          "Ç": "&Ccedil;",
          "È": "&Egrave;",
          "É": "&Eacute;",
          "Ê": "&Ecirc;",
          "Ë": "&Euml;",
          "Ì": "&Igrave;",
          "Í": "&Iacute;",
          "Î": "&Icirc;",
          "Ï": "&Iuml;",
          "Ð": "&ETH;",
          "Ñ": "&Ntilde;",
          "Ò": "&Ograve;",
          "Ó": "&Oacute;",
          "Ô": "&Ocirc;",
          "Õ": "&Otilde;",
          "Ö": "&Ouml;",
          "×": "&times;",
          "Ø": "&Oslash;",
          "Ù": "&Ugrave;",
          "Ú": "&Uacute;",
          "Û": "&Ucirc;",
          "Ü": "&Uuml;",
          "Ý": "&Yacute;",
          "Þ": "&THORN;",
          "ß": "&szlig;",
          "à": "&agrave;",
          "á": "&aacute;",
          "â": "&acirc;",
          "ã": "&atilde;",
          "ä": "&auml;",
          "å": "&aring;",
          "æ": "&aelig;",
          "ç": "&ccedil;",
          "è": "&egrave;",
          "é": "&eacute;",
          "ê": "&ecirc;",
          "ë": "&euml;",
          "ì": "&igrave;",
          "í": "&iacute;",
          "î": "&icirc;",
          "ï": "&iuml;",
          "ð": "&eth;",
          "ñ": "&ntilde;",
          "ò": "&ograve;",
          "ó": "&oacute;",
          "ô": "&ocirc;",
          "õ": "&otilde;",
          "ö": "&ouml;",
          "÷": "&divide;",
          "ø": "&oslash;",
          "ù": "&ugrave;",
          "ú": "&uacute;",
          "û": "&ucirc;",
          "ü": "&uuml;",
          "ý": "&yacute;",
          "þ": "&thorn;",
          "ÿ": "&yuml;",
          "Œ": "&OElig;",
          "œ": "&oelig;",
          "Š": "&Scaron;",
          "š": "&scaron;",
          "Ÿ": "&Yuml;",
          "ƒ": "&fnof;",
          "ˆ": "&circ;",
          "˜": "&tilde;",
          "Α": "&Alpha;",
          "Β": "&Beta;",
          "Γ": "&Gamma;",
          "Δ": "&Delta;",
          "Ε": "&Epsilon;",
          "Ζ": "&Zeta;",
          "Η": "&Eta;",
          "Θ": "&Theta;",
          "Ι": "&Iota;",
          "Κ": "&Kappa;",
          "Λ": "&Lambda;",
          "Μ": "&Mu;",
          "Ν": "&Nu;",
          "Ξ": "&Xi;",
          "Ο": "&Omicron;",
          "Π": "&Pi;",
          "Ρ": "&Rho;",
          "Σ": "&Sigma;",
          "Τ": "&Tau;",
          "Υ": "&Upsilon;",
          "Φ": "&Phi;",
          "Χ": "&Chi;",
          "Ψ": "&Psi;",
          "Ω": "&Omega;",
          "α": "&alpha;",
          "β": "&beta;",
          "γ": "&gamma;",
          "δ": "&delta;",
          "ε": "&epsilon;",
          "ζ": "&zeta;",
          "η": "&eta;",
          "θ": "&theta;",
          "ι": "&iota;",
          "κ": "&kappa;",
          "λ": "&lambda;",
          "μ": "&mu;",
          "ν": "&nu;",
          "ξ": "&xi;",
          "ο": "&omicron;",
          "π": "&pi;",
          "ρ": "&rho;",
          "ς": "&sigmaf;",
          "σ": "&sigma;",
          "τ": "&tau;",
          "υ": "&upsilon;",
          "φ": "&phi;",
          "χ": "&chi;",
          "ψ": "&psi;",
          "ω": "&omega;",
          "ϑ": "&thetasym;",
          "ϒ": "&Upsih;",
          "ϖ": "&piv;",
          "–": "&ndash;",
          "—": "&mdash;",
          "‘": "&lsquo;",
          "’": "&rsquo;",
          "‚": "&sbquo;",
          "“": "&ldquo;",
          "”": "&rdquo;",
          "„": "&bdquo;",
          "†": "&dagger;",
          "‡": "&Dagger;",
          "•": "&bull;",
          "…": "&hellip;",
          "‰": "&permil;",
          "′": "&prime;",
          "″": "&Prime;",
          "‹": "&lsaquo;",
          "›": "&rsaquo;",
          "‾": "&oline;",
          "⁄": "&frasl;",
          "€": "&euro;",
          "ℑ": "&image;",
          "℘": "&weierp;",
          "ℜ": "&real;",
          "™": "&trade;",
          "ℵ": "&alefsym;",
          "←": "&larr;",
          "↑": "&uarr;",
          "→": "&rarr;",
          "↓": "&darr;",
          "↔": "&harr;",
          "↵": "&crarr;",
          "⇐": "&lArr;",
          "⇑": "&UArr;",
          "⇒": "&rArr;",
          "⇓": "&dArr;",
          "⇔": "&hArr;",
          "∀": "&forall;",
          "∂": "&part;",
          "∃": "&exist;",
          "∅": "&empty;",
          "∇": "&nabla;",
          "∈": "&isin;",
          "∉": "&notin;",
          "∋": "&ni;",
          "∏": "&prod;",
          "∑": "&sum;",
          "−": "&minus;",
          "∗": "&lowast;",
          "√": "&radic;",
          "∝": "&prop;",
          "∞": "&infin;",
          "∠": "&ang;",
          "∧": "&and;",
          "∨": "&or;",
          "∩": "&cap;",
          "∪": "&cup;",
          "∫": "&int;",
          "∴": "&there4;",
          "∼": "&sim;",
          "≅": "&cong;",
          "≈": "&asymp;",
          "≠": "&ne;",
          "≡": "&equiv;",
          "≤": "&le;",
          "≥": "&ge;",
          "⊂": "&sub;",
          "⊃": "&sup;",
          "⊄": "&nsub;",
          "⊆": "&sube;",
          "⊇": "&supe;",
          "⊕": "&oplus;",
          "⊗": "&otimes;",
          "⊥": "&perp;",
          "⋅": "&sdot;",
          "⌈": "&lceil;",
          "⌉": "&rceil;",
          "⌊": "&lfloor;",
          "⌋": "&rfloor;",
          "⟨": "&lang;",
          "⟩": "&rang;",
          "◊": "&loz;",
          "♠": "&spades;",
          "♣": "&clubs;",
          "♥": "&hearts;",
          "♦": "&diams;"
        };
        for (let key in entityMap) {
          let entity = entityMap[key];
          let regex = new RegExp(entity, 'g');
          string = string.replace(regex, key);
        }
        string = string.replace(/&quot;/g, '"');
        string = string.replace(/&amp;/g, '&');
        return string;
      },

      goFirstList: function() {
        this.nowPageNum = 1;
        this.$session.set("nowBoardPageNum", 1);
        this.setBoardList(1);
      },
      // boardList 호출
      setBoardList: function (nowPageNum) {
        this.$store.dispatch("setBoardList", {
          nowPageNum: nowPageNum,
          boardId: this.boardId
        })
      },
      // 페이지 번호 누르기
      clickPageNum: function (pageNum) {
        this.nowPageNum = pageNum;
        this.$session.set("nowBoardPageNum", pageNum);
        this.setBoardList(pageNum);
      },
      // 이전 버튼 누르기
      clickPrevButton: function () {
        this.nowPageNum--;
        if (this.nowPageNum === 0) {
          alert("첫 페이지입니다.");
          this.nowPageNum++;
        }
        else {
          this.setBoardList(this.nowPageNum);
        }
        this.$session.set("nowBoardPageNum", this.nowPageNum);
      },
      // 다음 버튼 누르기
      clickNextButton: function () {
        this.nowPageNum++;
        if (this.nowPageNum === this.totalBoardPageNum + 1) {
          alert("마지막 페이지입니다.");
          this.nowPageNum--;
        }
        this.setBoardList(this.nowPageNum);
        this.$session.set("nowBoardPageNum", this.nowPageNum);
      },
      // 보드 선택
      selectBoard: function (boardId) {
        this.boardId = boardId;
        this.$session.set("nowBoardId", boardId);
        for (let i = 0; i < this.boardIdList.length; i++) {
          if (this.boardIdList[i].boardId === this.$session.get("nowBoardId")) {
            this.$router.push(this.boardIdList[i].path)
          }
        }
        this.setBoardList(1)
      },
      // 특정 게시물 선택
      clickSpecificBoard: function (id) {
        this.$session.set("specificBoardId", id);
        for (let i = 0; i < this.boardIdList.length; i++) {
          if (this.boardIdList[i].boardId === this.$session.get("nowBoardId")) {
            this.$router.push(this.boardIdList[i].path + "/" + id)
          }
        }
      },
      // 등록하기 누르기
      registerBoard: function () {

        if(this.$session.get("nowBoardId") !== -1) {
          // 비로그인으로 시도
          if( this.$session.get("token")===null || this.$session.get("token")===undefined || this.$session.get("token")===""){
            if (confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?") === true) {
              this.$router.push('/login');
            }
            else {
              return
            }
          }
          else {
            for (let i = 0; i < this.boardIdList.length; i++) {
              if (this.boardIdList[i].boardId === this.$session.get("nowBoardId")) {
                this.$router.push(this.boardIdList[i].path + "/register")
              }
            }
          }
        }
        else {
          for (let i = 0; i < this.boardIdList.length; i++) {
            if (this.boardIdList[i].boardId === this.$session.get("nowBoardId")) {
              this.$router.push(this.boardIdList[i].path + "/register")
            }
          }
        }

      },
      changeTime: function (time) {
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
      computedTime: function (time) {
        let created = this.changeTime(time);
        let year = created.getFullYear();
        let month = created.getMonth() + 1 < 10 ? "0" + (created.getMonth() + 1) : created.getMonth() + 1;
        let date = (created.getDate() < 10) ? "0" + created.getDate() : created.getDate();

        if (Math.floor((this.today - created) / 60 / 1000 / 60) < 4) {
          return [String(year) + "." + String(month) + "." + String(date), true]
        }

        else {
          return [String(year) + "." + String(month) + "." + String(date), false]
        }
      },
      computedTitle: function (content) {
        return content.length > 29 ? content.substring(0, 29) + "..." : content;
      },
      fetchData: function() {
        console.log("패치 데이터 함수");
        console.log(this.$session.get("nowBoardId"));
        let path = this.$router.history.current.path.split('/');
        console.log(path);
        switch (path[2]) {
          case 'notice':
            this.$session.set("nowBoardId", 4);
            break;
          case 'free':
            this.$session.set("nowBoardId", 1);
            break;
          case 'job':
            this.$session.set("nowBoardId", 2);
            break;
          case 'question':
            this.$session.set("nowBoardId", 10);
            break;
          case 'anonymous':
            // 로그인 기반 익명게시판
            //this.$session.set("nowBoardId", 3);
            // 비로그인 기반 익명게시판 // 신입용
            this.$session.set("nowBoardId", -1);
            break;
        }
        this.boardId = this.$session.get("nowBoardId");
        this.nowPageNum = this.$session.get("nowBoardPageNum") !== undefined ? this.$session.get("nowBoardPageNum") : 1;
        this.setBoardList(this.nowPageNum)
      }
    },
    // 생성자
    created() {
      this.fetchData();
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .list {
    width: 834px;
    float: left;
    margin-right: 40px;
    margin-bottom: 20px;
  }

  .header {
    width: 100%;
    height: 40px;
  }

  .header .title {
    float: left;
    font-size: 30px;
    letter-spacing: -1.5px;
    font-weight: 800;
    color: #175c8e;
    font-family: "NanumSquare", serif;
    margin-bottom: 20px;
    cursor: pointer;
  }

  .write {
    float: right;
    padding: 6px 20px;
    color: white;
    background-color: #175c8e;
    font-size: 13px;
    cursor: pointer;
    letter-spacing: -0.7px;
    border: 1px solid #175c8e;
    position: relative;
    top: 1px;
  }

  .end-write {
    margin-top: -33px;
  }

  table {
    border-top: 2px #175c8e solid;
    border-bottom: 2px #175c8e solid;
    border-collapse: collapse;
    font-size: 13px;
    letter-spacing: -0.8px;
    width: 834px;
    table-layout: fixed;
  }

  table thead tr {
    height: 44px;
    font-size: 13px;
  }

  table thead tr th {
    border-bottom: 1px #175c8e solid;
    font-size: 15px;
    letter-spacing: -0.6px;
    color: #175c8e
  }

  table .id {
    font-size: 13px;
    width: 84px;
  }

  table .title {
    width: 420px;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  table .nickname {
    width: 147px;
  }

  table .date {
    width: 68px;
    font-size: 15px;
  }

  table .hit {
    width: 106px;
  }

  table tbody tr {
    height: 68px;
  }

  table tbody td {
    height: 48px;
    border-bottom: 1px #d2dae2 solid;
    color: #252525;
  }

  table tbody tr {
    cursor: pointer;
  }

  table tbody .title {
    text-align: left;
  }

  table tbody .nickname {
    color: #175c8e;
  }

  table tbody .hit {
    color: #252552;
  }

  tr:hover td {
    background: #f8fafb;
  }

  .pagination {
    margin-top: 22px;
    margin-bottom: 40px;
    background: #ffffff;
    color: #858585;
  }

  .pagination .number {
    border-radius: 0;
    padding-top: 7px;
    padding-bottom: 7px;
    padding-left: 12px;
    padding-right: 12px;
    margin-left: 1px;
    margin-right: 1px;
    border: 1px #edf0f3 solid;
    font-size: 13px;
    color: #858585;
    cursor: pointer;
    background-color: #ffffff;
  }

  .pagination .arrow {
    border-radius: 0;
    padding-top: 7px;
    padding-bottom: 7px;
    padding-left: 14px;
    padding-right: 14px;
    margin-left: 6px;
    margin-right: 6px;
    background: #ffffff;
    border: 1px #edf0f3 solid;
    color: #858585;
    font-size: 13px;
    letter-spacing: -0.7px;
    cursor: pointer;
  }

  .pagination .number:hover, .pagination .arrow:hover {
    background: #175c8e;
    color: white;
  }

  .pagination .active {
    background: #175c8e;
    color: white;
  }
  .title .type {
    font-weight: 600;
  }
  .num {
  }

  button {
    color: #858585;
  }

  .n img {
    margin-left: 10px;
    width: 14.5px;
    height: 15px;
    position: relative;
    top: 3px;
  }

  .comment-count {
    position: relative;
    bottom: 1px;
    font-size: 12px;
    color: #175c8e;
    letter-spacing: -0.6px;
  }

  .mobile__list, .mobile__write {
    display: none;
  }

  @media (max-width: 576px) {
    .top {
      display: none;
    }

    .list {
		min-height: calc(100vh - 115px);
      width: 100%;
      margin-bottom: 0;
    }

    .header {
      display: none;
    }

    table {
      width: 100%;
      border: none;
    }

    thead {
      display: none;
    }

    table tbody tr {
      height: 71px;
    }

    table tbody td {
      display: none;
    }

    .mobile__list {
      display: block;
      padding: 16px 16px 14.5px 16px;
      border-bottom: 1px solid #ececec;
    }

    .mobile__title {
      display: block;
      text-align: left;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mobile__title span {
      font-size: 16px;
      letter-spacing: -0.8px;
      line-height: 1.5;
      font-weight: normal;
      color: rgba(0, 0, 0, 0.87);
    }

    .mobile__title .type{
      font-weight: bold;
    }

    .mobile__title .mobile__comment__count {
      color: #175c8e;
    }

    .mobile__info {
      display: block;
      text-align: left;
    }

    .mobile__info .mobile__hit, .mobile__info .mobile__nickname {
      font-size: 13px;
      font-weight: normal;
      line-height: 1.54;
      letter-spacing: -0.7px;
      color: #a1a1a1;
    }

    .mobile__info .mobile__date {
      float: right;
      font-size: 13px;
      font-weight: 300;
      line-height: 1.54;
      letter-spacing: -0.7px;
      color: #a1a1a1;
    }

    .end-write {
      display: none;
    }

    .mobile__write {
      display: block;
      position: absolute;
      top: 16px;
      right: 16px;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }

    .mobile__write i {
      color: #ffffff;
      width: 24px;
      height: 24px;
    }
    
    .pagination {
      display: flex;
      justify-content: center;
    }

    .pagination .number:hover, .pagination .arrow:hover {
      background: white;
      color: #858585;
    }
    .pagination .active:hover {
      background-color: #175c8e;
      color: white;
    }
  }

  @media (max-width: 360px) {
    .mobile__write {
      left: 312px;
    }
  }
</style>
