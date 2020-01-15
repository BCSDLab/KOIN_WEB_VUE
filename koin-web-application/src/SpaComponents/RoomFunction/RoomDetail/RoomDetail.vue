<template>
  <div class="container">
    <div v-if="!loadingFlag">
      <v-loading-bar></v-loading-bar>
    </div>
    <div
      class="list">
      <div class="room-header">
        <div class="title">복덕방</div>
      </div>
      <div class="room-name">
        {{ specificRoom.name }}
      </div>


      <div class="card">
        <h2 class="card-title">원룸 정보</h2>
        <table class="info-table">
          <tr>
            <th>월세</th>
            <td :class="{'no-info': specificRoom.monthly_fee===null}">{{ returnNoInfo(specificRoom.monthly_fee) }}</td>
            <th>방 종류</th>
            <td :class="{'no-info': specificRoom.room_type===null}">{{ returnNoInfo(specificRoom.room_type) }}</td>
          </tr>
          <tr class="child">
            <th>전세</th>
            <td>{{ returnNoInfo(specificRoom.charter_fee) }} <span v-if="specificRoom.charter_fee!==null && specificRoom.charter_fee!=='' && specificRoom.charter_fee!==undefined">만원</span> </td>
            <th>보증금</th>
            <td>{{ returnNoInfo(specificRoom.deposit) }}<span v-if="specificRoom.deposit!==null && specificRoom.deposit!=='' && specificRoom.deposit!==undefined">만원</span></td>
          </tr>
          <tr class="child">
            <th>층수</th>
            <td>{{ returnNoInfo(specificRoom.floor) }} <span v-if="specificRoom.floor!==null">층</span></td>
            <th>관리비</th>
            <td>{{ returnNoInfo(specificRoom.management_fee) }}</td>
          </tr>
          <tr class="child">
            <th>방 크기</th>
            <td>{{ returnNoInfo(specificRoom.size) }} <span v-if="specificRoom.size!==null">평</span></td>
            <th>연락처</th>
            <td>{{ returnNoInfo(specificRoom.phone) }}</td>
          </tr>
        </table>
        <div
          v-if="specificRoom.image_urls !== null && specificRoom.image_urls !== undefined"
          class="image-slider">
          <img
            class="left-arrow"
            @click="leftSlide"
            src="https://static.koreatech.in/assets/ic-room/left-arrow.png">
          <img
            class="image"
            oncontextmenu="return false"
            :src="specificRoom.image_urls[imageIndex]">
          <img
            class="right-arrow"
            @click="rightSlide"
            src="https://static.koreatech.in/assets/ic-room/right-arrow.png">
          <div class="pagination">
            {{ this.imageIndex+1 }} / {{ this.specificRoom.image_urls.length }}
          </div>
        </div>
        <div
          class="no-image"
          v-if="specificRoom.image_urls === null">
          <img src="https://static.koreatech.in/assets/ic-room/img.png" alt="">
          <div class="mobile__image__ready">
            이미지 준비 중입니다.
          </div>
        </div>

      </div>


      <div class="card options">
        <h2 class="card-title">원룸 옵션</h2>
        <div
          v-for="option in this.optionImages"
          :key="option.id"
          :class="{'no-select': !specificRoom[option[2]]}"
          class="option">
          <img :src="option[1]">
          {{ option[0] }}
        </div>
      </div>


      <div class="card card-map">
        <h2 class="card-title">원룸 위치</h2>
        <div class="address">
          {{ specificRoom.address }}
          <span v-if="specificRoom.address===null || specificRoom.address==='' || specificRoom.address===undefined">
            원룸위치에 대한 정보가 없습니다.
          </span>
        </div>
        <div class="map">
          <div
            id="map"
            class="naver-map">
          </div>
        </div>
      </div>


    </div>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'RoomDetail',
    data() {
      return {
        score: 0,
        naver,
        draggableFlag: true,
        markers: [],
        infoWindows: [],
        scoreFlag: false,
        loadingFlag: false,
        comment: '',
        commentFlag: false,
        adjustFlag: false,
        adjustScore: 0,
        imageIndex: 0,
        imageLength: 0,
        optionImages: [
          ['에어컨', 'https://static.koreatech.in/assets/ic-room/ic-airconditioner.png', 'opt_air_conditioner'],
          ['냉장고', 'https://static.koreatech.in/assets/ic-room/ic-refrigerator.png', 'opt_refrigerator'],
          ['옷장', 'https://static.koreatech.in/assets/ic-room/ic-closet.png', 'opt_closet'],
          ['TV', 'https://static.koreatech.in/assets/ic-room/ic-tv.png', 'opt_tv'],
          ['전자렌지', 'https://static.koreatech.in/assets/ic-room/ic-microwave-range.png', 'opt_microwave'],
          ['가스렌지', 'https://static.koreatech.in/assets/ic-room/ic-gas-stove.png', 'opt_gas_range'],
          ['인덕션', 'https://static.koreatech.in/assets/ic-room/ic-induction-range.png', 'opt_induction'],
          ['정수기', 'https://static.koreatech.in/assets/ic-room/ic-water-purifier.png', 'opt_water_purifier'],
          ['세탁기', 'https://static.koreatech.in/assets/ic-room/ic-clothes-washer.png', 'opt_washer'],
          ['침대', 'https://static.koreatech.in/assets/ic-room/ic-bed.png', 'opt_bed'],
          ['책상', 'https://static.koreatech.in/assets/ic-room/ic-desk.png', 'opt_desk'],
          ['신발장', 'https://static.koreatech.in/assets/ic-room/ic-shoe-rack.png', 'opt_shoe_closet'],
          ['도어락', 'https://static.koreatech.in/assets/ic-room/ic-doorlock.png', 'opt_electronic_door_locks'],
          ['비데', 'https://static.koreatech.in/assets/ic-room/ic-bidet.png', 'opt_bidet'],
          ['베란다', 'https://static.koreatech.in/assets/ic-room/ic-veranda.png', 'opt_veranda'],
          ['엘레베이터', 'https://static.koreatech.in/assets/ic-room/ic-elevator.png', 'opt_elevator']
        ]
      }
    },
    computed: {
      ...mapGetters({
        specificRoom: 'specificRoom'
      })
    },
    methods: {
      returnNoInfo: function (val) {
        if (val === null) {
          return " - "
        }
        return val
      },
      loadNaverMap() {
        let map = new naver.maps.Map('map', {
          center: new naver.maps.LatLng(this.specificRoom.latitude, this.specificRoom.longitude),
          zoom: 12,
          maxZoom: 15,
          minZoom: 10,
          logoControl: false,
          zoomControl: true,
          scrollWheel: false,
          zoomControlOptions: {
            position: naver.maps.Position.TOP_LEFT
          },
          draggable: this.draggableFlag,
        });

        this.markers[0] = new naver.maps.Marker({
          position: new naver.maps.LatLng(this.specificRoom.latitude, this.specificRoom.longitude),
          map: map,
          clickable: true
        });

        this.infoWindows[0] = new naver.maps.InfoWindow({
          content: `<span style="background-color:#d8f5ff; color:black; font-size:80%; border:1px solid transparent; border-radius:10px;">${this.specificRoom.name}</span>`,
          backgroundColor: 'transparent',
          borderWidth: 0,
          disableAnchor: true
        });

        this.naver.maps.Event.addListener(this.markers[0], "mouseover", (e) => {
          this.infoWindows[0].open(map, this.markers[0]);
        });
      },
      leftSlide: function () {
        if (this.imageIndex === 0) {
          alert("첫 이미지 입니다.")
        }
        else {
          this.imageIndex--;
        }
      },
      rightSlide: function () {
        if (this.imageIndex === this.specificRoom.image_urls.length - 1) {
          alert("마지막 이미지 입니다.")
        }
        else {
          this.imageIndex++;
        }
      },
      registerComment() {
        if (this.comment === '' || this.comment === null) {
          alert('댓글을 입력하세요.');
          this.commentFlag = false;
          return 0;
        } else {
          this.commentFlag = true;
        }
        if (this.score == 0 || this.score == undefined) {
          alert('평점을 선택하세요.');
          this.scoreFlag = false;
          return 0;
        } else {
          this.scoreFlag = true;
        }
        if (this.commentFlag == true && this.scoreFlag == true) {
          this.$store.dispatch('registerRoomComment', {
            content: this.comment,
            score: this.score,
            id: this.$session.get('roomUid'),
            token: this.$session.get('token')
          }).then(data => {
            if (data.status === 200 || data.status === 201 ) {
              alert("댓글이 등록되었습니다.");
              this.commentFlag = false;
              this.scoreFlag = false;
              this.getSpecificRoom();
            } else if (data.status === 401) {
              alert("다시 로그인해주세요.");
            } else if (data.status === 409) {
              alert('계정 당 한번만 작성할수 있습니다.');
            } else {
              alert("서버와의 연결이 끊어졌습니다.");
            }
          }, error => {
            alert("계정 당 한번만 작성할 수 있습니다.");
          })
        }
      },
      removeComment(roomUid) {
        if (confirm('정말 삭제하시겠습니까?') == true) {
          this.$store.dispatch('removeRoomComment', {
            id: roomUid,
            token: this.$session.get('token')
          }).then(data => {
            if (data.status === 200 || data.status === 201) {
              alert('댓글이 삭제되었습니다.');
              this.getSpecificRoom();
            } else if (data.status === 401) {
              alert('다시 로그인해주세요.');
            } else {
              alert('서버와 연결이 끊어졌습니다.');
            }
          }, error => {
            alert('더 이상 데이터를 불러올 수 없습니다.');
          })
        }
      },
      adjustComment(comment, adjustScore, roomUid) {
        if (comment === '' || comment === null) {
          alert('댓글을 입력하세요.');
          this.commentFlag = false;
          return 0;
        } else {
          this.commentFlag = true;
        }
        if (adjustScore == 0 || adjustScore == undefined) {
          alert('평점을 선택하세요.');
          this.scoreFlag = false;
          return 0;
        } else {
          this.scoreFlag = true;
        }
        if (this.commentFlag == true && this.scoreFlag == true) {
          this.$store.dispatch('adjustRoomComment', {
            id: roomUid,
            content: comment,
            score: adjustScore,
            token: this.$session.get('token')
          }).then(data => {
            if (data.status === 200 || data.status === 201) {
              alert("댓글이 수정되었습니다.");
              this.getSpecificRoom();
              this.adjustFlag = false;
            } else if (data.status === 401) {
              alert("다시 로그인해주세요.");
            } else {
              alert("서버와의 연결이 끊어졌습니다.");
            }
          }, error => {
            alert("더 이상 데이터를 불러올 수 없습니다.");
          })
        }
      },
      getSpecificRoom() {
        if (this.$session.get('roomUid') === null) {
          alert("다시 방을 선택해주세요");
          this.$router.go(-1);
        }
        let path = this.$router.history.current.path.split('/');
        this.$store.dispatch('getSpecificRoom', {
          specificRoomId: path[2],
        }).then(data => {
          if (data.image_urls != null)
            this.imageLength = data.image_urls.length;
          this.loadNaverMap();
          this.loadingFlag = true;
        })
      },
      getStoredData(comment) {
        if (this.adjustFlag == true) {
          this.adjustFlag = false;
        } else {
          this.adjustFlag = true;
        }
      },
      slider(n) {
        this.imageIndex += n;
        if (this.imageIndex < 0) {
          this.imageIndex = this.imageLength - 1;
        } else if (this.imageIndex > this.imageLength - 1) {
          this.imageIndex = 0;
        }
      }
    }
    ,
    created() {
      // LoginCheck.loginCheck(this.$session.get("token")).then((flag) => {
      //   if (!flag) this.$router.replace('/login');
      // })
      this.loadingFlag = false;
      this.draggableFlag = window.innerWidth > 1132;
      this.getSpecificRoom();

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    border-top: #f7941e 5px solid;
    width: 100%;
  }

  .list {
    width: 1132px;
    margin-top: 68px;
    margin-left: auto;
    margin-right: auto;
    min-height: 800px;
  }

  .room-name {
    height: 224px;
    line-height: 224px;
    font-family: NanumBarunGothic, serif;
    font-size: 30px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    text-align: center;
    color: #252525;
  }

  .card {
    background-color: #ffffff;
    border: 1px #d2dae2 solid;
    margin-bottom: 20px;
    padding: 60px 211px;
    text-align: center;
    height: 100%;
  }

  .card-title {
    font-family: NanumBarunGothic, serif;
    font-size: 24px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1;
    letter-spacing: -0.5px;
    text-align: center;
    color: #252525;
  }

  table {
    margin-top: 30px;
    width: 710px;
    border-top: #175c8e 1px solid;
    border-bottom: #175c8e 1px solid;
    font-family: NanumBarunGothic, serif;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.71;
    letter-spacing: normal;
    color: #828282;
    border-collapse: collapse;
    user-select: text;
  }

  table td {
    height: 40px;
    color: #252525;
    font-size: 15px;
    line-height: 1.6;
  }

  th {
    text-align: left;
    padding-left: 20px;
    width: 50px;
  }

  td {
    width: 280px;
  }

  .child th, .child td {
    border-top: #175c8e4d 1px solid;
  }

  .image-slider {
    margin-top: 34px;
    width: 710px;
    text-align: center;
  }

  .no-image {
    margin-top: 34px;
    width: 710px;
    height: 400px;
    line-height: 400px;
    color: white;
    background: #bebebe;
  }

  .pagination {
    width: 54px;
    height: 23px;
    opacity: 0.8;
    border-radius: 12px;
    background-color: #252525;
    font-family: NanumBarunGothic, serif;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 2;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    bottom: 35px;
  }

  .no-image h3 {

  }
  .image-slider {
    width: 100%;
  }
  .image-slider .image {
    max-width: 560px;
    height: 400px;
  }

  .left-arrow {
    postion: relative;
    margin-bottom: 175px;
    margin-right: 20px;
    cursor: pointer;
  }

  .right-arrow {
    postion: relative;
    margin-bottom: 175px;
    margin-left: 20px;
    cursor: pointer;
  }

  .options {
    padding-left: 230px;
    padding-right: 230px;
  }

  .option img {
    width: 70px;
    height: 70px;
    margin-bottom: 8px;
    margin-top: 20px;
  }

  /*options(:부모) div의 높이 확장*/
  .options:after {
    content: '';
    display: block;
    clear: both;
  }

  .option {
    width: 80px;
    float: left;
    padding-left: 27px;
    padding-right: 27px;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #828282;
  }

  .no-select {
    opacity: 0.2;
  }

  .address {
    height: 16px;
    font-family: NanumBarunGothic, serif;
    font-size: 14px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.71;
    letter-spacing: normal;
    text-align: center;
    color: #828282;
    margin-bottom: 30px;
    user-select: text;
  }

  .card-map .card-title {
    margin-bottom: 10px;
  }

  #map {
    border: 1px #d2dae2 solid;
  }

  .naver-map {
    width: 710px;
    height: 400px;
  }

  .room-header {
    height: 56px;
    border-bottom: 2px #175c8e solid;
  }

  .room-header .title {
    text-align: left;
    float: left;
    font-family: NanumSquare, serif;
    font-size: 30px;
    font-weight: 800;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #175c8e;
    width: 100%;
    height: 32px;
    margin-bottom: 21px;
  }

  .no-info {
    opacity: 0.3;
  }

  .mobile__image__ready {
    display: none;
  }

  @media (max-width: 576px) {
    .container {
      border-top: none;
    }

    .list {
      width: 100%;
      min-height: auto;
      margin: 0;
      font-family: NanumBarunGothic;
    }

    .room-header {
      display: none;
    }

    .room-name {
      font-size: 20px;
      font-weight: bold;
      line-height: 1.2;
      letter-spacing: normal;
      color: #252525;
      margin-top: 50px;
      margin-bottom: 40px;
      height: auto;
    }

    .card {
      border: none;
      width: calc(100% - 32px);
      margin: 0 16px;
      padding: 0;
    }

    .card-title {
      font-size: 16px;
      font-weight: 300;
      line-height: 0.69;
      letter-spacing: -0.3px;
      text-align: center;
      color: #252525;
      margin-bottom: 11px;
      margin-top: 0;
    }

    .info-table {
      width: 100%;
      padding: 0;
    }

    th {
      width: 52px;
      font-size: 13px;
      font-weight: normal;
      line-height: 0.77;
      letter-spacing: normal;
      text-align: left;
      color: #828282;
      padding-left: 14px;
    }

    td {
      width: auto;
    }

    table td {
      font-size: 12px;
      font-weight: normal;
      line-height: 0.92;
      letter-spacing: normal;
      text-align: left;
      color: #252525;
    }

    .no-image {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      width: 100%;
      margin: 20px 0 0 0;
      height: 184px;
      background-color: #f8f8f8;
      border: 1px solid #d2dae2;
    }

    .no-image img {
      display: none;
    }

    .no-image .mobile__image__ready {
      display: block;
      font-size: 13px;
      font-weight: bold;
      line-height: 0.77;
      letter-spacing: normal;
      text-align: center;
      color: #ffffff;
      background-color: #f7941e;
      width: 132px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .image-slider {
      width: 100%;
      height: 184px;
      position: relative;
      border: 1px solid #d2dae2;
    }

    .left-arrow, .right-arrow{
      width: 30px;
      height: 30px;
      margin: 0;
      position: absolute;
      top: calc(50% - 15px);
      bottom: calc(50% - 15px);
    }

    .left-arrow {
      left: 0;
    }

    .right-arrow {
      right: 0;
    }

    .image-slider .image {
      width: 100%;
      height: 100%;
    }

    .pagination {
      position: absolute;
      bottom: 10px;
      width: 40px;
      height: 18px;
      opacity: 0.8;
      border-radius: 12px;
      background-color: #252525;
      font-size: 11px;
      font-weight: normal;
      line-height: 1.45;
      letter-spacing: normal;
      color: #ffffff;
      left: calc(50% - 20px);
      right: calc(50% - 20px);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .options {
      border: 1px solid #d2dae2;
      margin-top: 40px;
      padding-bottom: 35px;
    }

    .options .card-title {
      margin-top: 25px;
    }

    .option {
      font-size: 10px;
      font-weight: normal;
      line-height: 0.9;
      letter-spacing: normal;
      text-align: center;
      color: #828282;
      width: 25%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0
    }

    .option img {
      width: 30px;
      height: 30px;
    }

    .card-map {
      margin: 40px 0 16px 0;
      width: 100%;
    }

    .card-map .card-title {
      margin-bottom: 10px;
    }

    .address {
      font-size: 14px;
      font-weight: 300;
      line-height: 1.71;
      letter-spacing: normal;
      color: #828282;
      margin-bottom: 20px;
    }

    .map, #map {
      width: 100%;
      height: 165px;
    }
  }
</style>
