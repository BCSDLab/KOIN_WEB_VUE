import * as BOARD_ID_LIST from '../../../static/boardId';

export default {
  data() {
    return {
      boardIdList: BOARD_ID_LIST.default,
      urlR: /^(http\:\/\/)?((\w+)[.])+(asia|biz|cc|cn|com|de|eu|in|info|jobs|jp|kr|mobi|mx|name|net|nz|org|travel|tv|tw|uk|us)(\/(\w*))*$/i,
    }
  },
  methods: {
    // board refresh
    refreshSpecificBoard: function (boardId) {
      this.$store.dispatch('setSpecificBoard', {
        specificBoardId: this.$session.get("specificBoardId"),
        token: this.$session.get("token"),
        boardId: boardId
      })
    },

    /**
     *  시간 변환 함수
     * @param inputTime
     * @returns 시간을 ~ 시간 전 + new logo 출력 flag 리턴
     */
    computedTime: function (inputTime) {
      if (inputTime === null || inputTime === undefined || inputTime === "") {
        return ["", false]
      }
      inputTime = inputTime.split(" ");
      let datePart = inputTime[0].split("-");
      let timePart = inputTime[1].split(":");

      let today = new Date();

      let covertedTime = new Date();
      covertedTime.setFullYear(datePart[0]);
      covertedTime.setMonth(datePart[1] - 1);
      covertedTime.setDate(datePart[2]);
      covertedTime.setHours(timePart[0]);
      covertedTime.setMinutes(timePart[1]);
      covertedTime.setSeconds(timePart[2]);

      if (Math.ceil((today - covertedTime) / 1000 / 60) < 60)
        return [Math.ceil((today - covertedTime) / 1000 / 60) < 0 ? 0 + "분 전" : Math.ceil((today - covertedTime) / 1000 / 60) + "분 전", true];

      if (Math.floor((today - covertedTime) / 60 / 1000 / 60) < 4)
        return [Math.floor((today - covertedTime) / 60 / 60 / 1000) + "시간 전", true];

      else if (Math.floor((today - covertedTime) / 60 / 1000 / 60) < 24)
        return [Math.floor((today - covertedTime) / 60 / 1000 / 60) + "시간 전", false];

      else {
        let year = covertedTime.getFullYear();
        let month = covertedTime.getMonth() + 1 < 10 ? "0" + (covertedTime.getMonth() + 1) : covertedTime.getMonth() + 1;
        let date = (covertedTime.getDate() < 10) ? "0" + covertedTime.getDate() : covertedTime.getDate();
        let hour = covertedTime.getHours() < 10 ? "0" + covertedTime.getHours() : covertedTime.getHours();
        let minutes = covertedTime.getMinutes() < 10 ? "0" + covertedTime.getMinutes() : covertedTime.getMinutes();
        return [String(year) + "." + String(month) + "." + String(date) + " " + String(hour) + ":" + String(minutes), false]
      }
    },

    // String type(api response) 날짜만 계산
    computedOnlyDate(createdAt) {
      createdAt = createdAt.split(" ");
      let date = createdAt[0].replace("-", '.');
      date = date.replace("-", '.')
      return date;
    },

    // Date type 변수 날짜만 계산
    computedOnlyDateByDateType(date) {
      let d = new Date(date), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('. ');
    },

    // 시간만 계산
    computedOnlyTime(createdAt) {
      let time = createdAt.split(" ");
      return time[1];
    },

    // 스크립트, html tag 삭제 함수
    removeScriptTag(string) {
      string = string.replace(/<(\/script|script|\/style|style|\/!DOCTYPE|\/abbr|\/acronym|\/address|\/applet|\/area|\/article|\/aside|\/audio|\/b|\/base|\/basefont|\/bdi|\/bdo|\/big|\/blockquote|\/body|\/br|\/button|\/canvas|\/caption|\/center|\/cite|\/code|\/col|\/colgroup|\/data|\/datalist|\/dd|\/del|\/details|\/dfn|\/dialog|\/dir|\/div|\/dl|\/dt|\/em|\/embed|\/fieldset|\/figcaption|\/figure|\/font|\/footer|\/form|\/frame|\/frameset|\/h1-|\/h6|\/head|\/header|\/hr|\/html|\/i|\/iframe|\/img|\/input|\/ins|\/kbd|\/label|\/legend|\/li|\/link|\/main|\/map|\/mark|\/meta|\/meter|\/nav|\/noframes|\/noscript|\/object|\/ol|\/optgroup|\/option|\/output|\/p|\/param|\/picture|\/pre|\/progress|\/q|\/rp|\/rt|\/ruby|\/s|\/samp|\/script|\/section|\/select|\/small|\/source|\/span|\/strike|\/strong|\/style|\/sub|\/summary|\/sup|\/svg|\/table|\/tbody|\/td|\/template|\/textarea|\/tfoot|\/th|\/thead|\/time|\/title|\/tr|\/track|\/tt|\/u|\/ul|\/var|\/video|\/wbr|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdi|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|dialog|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1-|h6|head|header|hr|html|i|iframe|img|input|ins|kbd|label|legend|li|link|main|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|svg|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video|wbr)([^>]*)>/gi, "");
      return string;
    },

    // entity code 변환 함수
    convertTextToEntity: function (string) {
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

    // url 타입 a tag로 변환하는 함수
    convertUrlTypeStringToAtag(val) {
      val = val.replace(this.urlR, (match) => {
        if (match.match('http') !== null)
          return `<a href="${match}" target="_blank">${match}</a>`
        else
          return `<a href="//${match}" target="_blank">${match}</a>`;
      });
      return val;
    },

    // 태그, entity 제거 코드
    convertCleanString: function (string) {
      return this.convertTextToEntity(this.removeScriptTag(string))
    },

    // string, null, 빈값 체크
    // 빈값이면 true,
    checkStringNull: function (string) {
      string = string.replace(/ /gi, "");
      return !string;
    },

    // 공지사항 앞부분 [??공지] 변경 함수
    convertNoiceTitle: function (type) {
      let convertedKorean = "";

      switch (type) {
        case 5:
          convertedKorean = "[일반공지]";
          break;
        case 6:
          convertedKorean = "[장학공지]";
          break;
        case 7:
          convertedKorean = "[학사공지]";
          break;
        case 8:
          convertedKorean = "[취업공지]";
          break;
        case 9:
          convertedKorean = "[코인공지]";
          break;
      }

      return convertedKorean;
    },

    // boardId 기준 특정 게시판 리스트로 이동
    goUpperCategoryBoardList(boardId) {
      if (boardId !== -1) {
        for (let i = 0; i < this.boardIdList.length; i++) {
          if (boardId === this.boardIdList[i].boardId) {
            this.$router.push(this.boardIdList[i].path);
          } else if (boardId > 4) {
            this.$router.push(this.boardIdList[3].path);
          }
        }
      } else {
        this.$router.push('/board/anonymous')
      }
    },

    // 입력 값 유효성 검사
    // 유효하지 않은 경우 true
    // 유효한 경우 false
    checkInputValid: function (inputString, stringKorean, maxLength) {
      //ES5식 Default parameter
      maxLength = maxLength || 0;
      // script 제거
      inputString = this.removeScriptTag(inputString);
      // entity 변환
      inputString = this.convertTextToEntity(inputString);
      // 빈값 제거 후 체크
      if (this.checkStringNull(inputString)) {
        alert(stringKorean + '에 빈값은 입력할 수 없습니다.')
        return false;
      }
      // 최대 크기 체크
      if (maxLength !== 0) {
        if (inputString.length > maxLength) {
          alert(stringKorean + "의 최대 글자수는 " + maxLength + "자 입니다.");
          return false;
        }
      }
      return true;
    },

    checkOnlyNullCheck: function(inputString) {
      // script 제거
      inputString = this.removeScriptTag(inputString);
      // entity 변환
      inputString = this.convertTextToEntity(inputString);
      // 빈값 제거 후 체크
      if (this.checkStringNull(inputString)) {
        return true;
      }
      return false;
    }
  }
};
