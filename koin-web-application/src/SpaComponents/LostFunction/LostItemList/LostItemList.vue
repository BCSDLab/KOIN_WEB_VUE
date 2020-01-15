<template>
  <div class="main">
    <div class="container">
      <div class="list">
        <div class="header">
          <div
            @click="goFirstList"
            class="title">분실물</div>
          <div>
            <button
              class="write"
              type="button"
              @click="registerItem">
              글쓰기
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th class="index-id">번호</th>
              <th class="category">분류</th>
              <th class="title">제목</th>
              <th class="nickname">작성자</th>
              <th class="lost-date">분실 및 습득일</th>
              <th class="date">날짜</th>
              <th class="hit">조회수</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in this.itemList"
              :key="item.id"
              @click="clickSpecificItem(item.id)">
              <td class="id">{{ item.id }}</td>
              <td class="category">
                <span
                  class="type"
                  v-if="item.type === 0">
                  분실물 습득
                </span>
                <span
                  class="type"
                  v-if="item.type === 1">
                  분실물 찾기
                </span>
              </td>
              <td class="title">
                <span>{{ item.title }}</span>
                <span
                  v-if="item.comment_count!==0"
                  class="hit">
                  <span class="comment-count">[{{ item.comment_count }}]</span>
                </span>

                <i
                  v-if="computedTime(item.created_at)[1]"
                  class="n">
                  <img src="https://static.koreatech.in/upload/7f2af097aeeca368b0a491f9e00f80ca.png">
                </i>
              </td>
              <td class="nickname">{{ item.nickname === undefined ? item.author : item.nickname }}</td>
              <td class="lost-date">{{ item.date }}</td>
              <td class="date">{{ computedTime(item.created_at)[0] }}</td>
              <td class="hit">{{ item.hit }}</td>
              <div class="mobile__list">
                <div class="mobile__title">
                  <span>{{ item.title }}</span>
                  <span
                    v-if="item.comment_count!==0"
                    class="mobile__comment__count">
                    ({{ item.comment_count }})
                  </span>
                </div>
                <div class="mobile__info">
                  <span class="mobile__hit">조회 {{ item.hit }} · </span>
                  <span class="mobile__nickname">{{ item.nickname === undefined ? item.author : item.nickname }}</span>
                  <span class="mobile__date">{{ computedTime(item.created_at)[0] }}</span>
                </div>
                <div class="mobile__lost__date">
                  <span>{{ item.type === 0 ? '습득일' : '분실일' }}&nbsp;{{ item.date }}</span>
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
            class="number"
            :class="{ active: nowPageNum === n }"
            v-for="n in totalDisplayPageNumLost"
            :key="n.id"
            @click="clickPageNum(n)"
            v-if="n >= totalDisplayMinNumLost">
            <span class="num">{{ n }}</span>
          </button>
          <button
            class="arrow"
            @click="clickNextButton">다음으로
          </button>
          <div>
            <button
              class="write end-write"
              type="button"
              @click="registerItem">
              글쓰기
            </button>
          </div>
        </div>
        <div
          class="mobile__write"
          @click="registerItem">
          <img src="https://static.koreatech.in/assets/img/mobile__create.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {store} from '../../../stores/store'
  import {mapGetters} from 'vuex';
  import * as LoginCheck from '../../../stores/loginCheck'

  export default {
    name: 'LostItemList',
    data() {
      return {
        nowPageNum: 1,
      }
    },
    computed: {
      ...mapGetters({
        itemList: 'itemList',
        totalDisplayMinNumLost: 'totalDisplayMinNumLost',
        totalDisplayPageNumLost: 'totalDisplayPageNumLost',
      })
    },
    methods: {
      goFirstList: function() {
        this.nowPageNum = 1;
        this.$session.set('nowBoardPageNum', 1);
        this.getLostItems(1);
      },
      getLostItems (nowPageNum) {
        this.$store.dispatch('getLostItems', {
          nowPageNumLost: nowPageNum,
        })
      },
      clickPageNum (pageNum) {
        this.nowPageNum = pageNum;
        this.$session.set('nowBoardPageNum', pageNum);
        this.getLostItems(this.nowPageNum);
      },
      clickPrevButton () {
        this.nowPageNum--;
        if (this.nowPageNum === 0) {
          alert("첫 페이지입니다.");
          this.nowPageNum++;
        } else {
          this.getLostItems(this.nowPageNum);
        }
        this.$session.set('nowBoardPageNum', this.nowPageNum);
      },
      clickNextButton () {
        this.nowPageNum++;
        if (this.nowPageNum === this.totalDisplayPageNumLost + 1) {
          alert('마지막 페이지입니다.');
          this.nowPageNum--;
        }
        this.getLostItems(this.nowPageNum);
        this.$session.set('nowBoardPageNum', this.nowPageNum);
      },
      registerItem () {
        this.$router.push('/lost/register');
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
      clickSpecificItem (id) {
        this.$session.set('specificItemId', id);
        this.$router.push(`/lost/detail/${id}`);
      }
    },
    computedTitle (content) {
      return content.length > 29 ? content.substring(0, 29) + "..." : content;
    },
    created () {
      this.nowPageNum = this.$session.get('nowBoardPageNum') !== undefined ? this.$session.get('nowBoardPageNum') : 1;
      this.getLostItems(this.nowPageNum);
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
    margin-bottom: 20px
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
    width: 1132px;
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

  table .category {
    width: 84px;
  }
  table .title {
    width: 489px;
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
    /* font-size: 15px; */
  }

  table .lost-date {
    width: 140px;
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
    .main {
      border-top: none;
    }
    .container {
      width: 100%;
      margin-top: 0;
    }

    .list {
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
      height: 90px;
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

    .mobile__lost__date {
      display: block;
      text-align: left;
    }

    .mobile__lost__date span {
      font-size: 13px;
      font-weight: normal;
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
