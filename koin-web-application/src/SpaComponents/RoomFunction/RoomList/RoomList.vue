<template>
  <div class="container">
    <div class="list">
      <div class="room-header">
        <div class="title">복덕방</div>
      </div>

      <div class="list-row">
        <!--왼쪽 지도-->
        <div class="map">
          <div
            id="map"
            class="naver-map">
          </div>
        </div>
        <!--오른쪽 카드리스트-->
        <div class="card-list">
          <div
            class="card"
            @click="clickList(room.id)"
            :class="{'odd': index%2===0}"
            v-for="(room, index) in roomList"
            :key="room.id">
            <!--card 상단부-->
            <div
              class="card-top">
              <div class="card-title">
                {{ room.name }}
              </div>
            </div>
            <!--card 하단부-->
            <div class="card-bottom">
              <div class="month">
                <div class="badge badge-monthly">
                  월세
                </div>
                <span class="fee-number" v-if="room.monthly_fee!==null">{{ room.monthly_fee }}</span>
                <span class="fee-number" v-if="room.monthly_fee===null">정보없음</span>
              </div>
              <div class="charter">
                <div class="badge badge-charter">
                  전세
                </div>
                <span v-if="room.charter_fee!==null"> {{ room.charter_fee }}만원 </span>
                <span v-if="room.charter_fee===null"> - </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 오른쪽 카드리스트 끝 -->
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'RoomList',
    data() {
      return {
        msg: 'room list',
        naver,
        markers: [],
        infoWindows: [],
        roomDisplayList: [],
        draggableFlag: true,
      }
    },
    computed: {
      ...mapGetters({
        roomList: 'roomList'
      })
    },
    created() {
      this.draggableFlag = true;
      this.$Progress.start();
      this.$store.dispatch('getRoomList').then((data) => {
        this.roomDisplayList = data;
        this.loadNaverMap();
        this.$Progress.finish();
      })
    },

    methods: {
      callRoomList: function () {
        this.$Progress.start();
        this.$store.dispatch('getRoomList').then((data) => {
          this.roomDisplayList = data;
          this.loadNaverMap();
          this.$Progress.finish();
        })
      },

      loadNaverMap() {
        let map = new naver.maps.Map('map', {
          center: new naver.maps.LatLng(36.764617, 127.2831540),
          zoom: this.draggableFlag ? 11 : 10,
          maxZoom: 15,
          minZoom: 10,
          logoControl: false,
          zoomControl: true,
          scrollWheel: false,
          zoomControlOptions: {
            position: naver.maps.Position.TOP_LEFT,
          },
          draggable: this.draggableFlag
        });
        for (let i = 0; i < this.roomDisplayList.length; i++) {
          this.markers[i] = new naver.maps.Marker({
            position: new naver.maps.LatLng(this.roomDisplayList[i].latitude, this.roomDisplayList[i].longitude),
            map: map,
            clickable: true
          });
          this.infoWindows[i] = new naver.maps.InfoWindow({
            content: `<span style="background-color:#d8f5ff; color:black; font-size:80%; border:1px solid transparent; border-radius:10px;">${this.roomDisplayList[i].name}</span>`,
            backgroundColor: 'transparent',
            borderWidth: 0,
            disableAnchor: true
          })
          naver.maps.Event.addListener(this.markers[i], "mouseover", (e) => {
            this.infoWindows[i].open(map, this.markers[i]);
          })
          naver.maps.Event.addListener(this.markers[i], "click", (e) => {
            this.clickList(this.roomDisplayList[i].id);
          })
        }
      },
      clickList: function (roomUid) {
        // if (this.$session.get("token") == undefined) {
        //   alert('로그인이 필요한 서비스입니다.');
        //   this.$router.push('/login');
        // } else {
        //   this.$session.set('roomUid', roomUid);
        //   this.$router.push('/room-detail');
        // }
        this.$session.set('roomUid', roomUid);
        this.$router.push('/room/' + roomUid);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    border-top: #f7941e 5px solid;
    width: 100%;
  }

  .naver-map {
    width: 100%;
    max-width:752px;
    height:876px;
  }

  .list {
    width: 1132px;
    min-height: 950px;
    margin: 68px auto 84px;
  }

  .list-row {
    margin-top: 18px;
    width: 1132px;
  }

  .map {
    border: 1px #d2dae2 solid;
    width: 752px;
    float: left;
    z-index: 0;
  }

  .map div {
    z-index: 2;
  }
  .card-list {
    margin-left: 13px;
    width: 363px;
    float: left;
    height: 878px;
    overflow: scroll;
    -ms-overflow-style: none;
  }
  .card-list::-webkit-scrollbar {
    display: none !important;
  }

  .card {
    width: 173px;
    float: left;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    height: 164px;
    background-color: #ffffff;
    margin-bottom: 12px;
    border: 1px #d2dae2 solid;
    cursor: pointer;
  }

  .card:hover {
    border: 1px solid #f7941e;
  }

  .card .card-top {
    height: 96px;
    line-height: 98px;
    font-family: NanumBarunGothic, serif;
    font-size: 16px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    color: #252525;
  }

  .card .card-bottom {
    height: 48px;
    background-color: #f9f9f9;
    font-size: 12px;
    font-family: NanumBarunGothic, serif;
    text-align: left;
    padding: 10px 0 10px 14px;
    color: #858585;
  }

  .card .badge {
    border-radius: 15px;
    background-color: #4db297;
    width: 50px;
    height: 22px;
    font-family: NanumBarunGothic, serif;
    font-size: 12px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 2;
    letter-spacing: normal;
    text-align: center;
    color: #f3f3f3;
    display: inline-block;
    margin-right: 9px;
  }

  .card .badge-charter {
    margin-top: 4px;
    background-color: #f7941e;
  }

  .odd {
    margin-right: 12px;
  }

  .pagination {
    width: 1132px;
    text-align: right;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
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
    padding-left: 8px;
    padding-right: 8px;
    margin-left: 3px;
    margin-right: 3px;
    background: #ffffff;
    border: 1px #edf0f3 solid;
    color: #858585;
    font-size: 13px;
    letter-spacing: -0.7px;
    cursor: pointer;
  }

  .pagination .number:hover {
    background: #175c8e;
    color: white;
  }

  .pagination .active {
    background: #175c8e;
    color: white;
  }

  .pagination img {
    width: 12px;
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

  @media (max-width: 576px) {
    .container {
      border: none;
      width: 100%;
    }

    .list {
      width: 100%;
      height: 100%;
      margin: 0;
    }

    .room-header {
      display: none;
    }

    .list-row {
      margin: 0;
      width: 100%;
    }

    .map {
      width: 100%;
      border: none;
      height: 300px;
    }

    #map {
      height: 300px;
    }

    .card-list {
      margin-top: 16px;
      margin-left: 16px;
      margin-right: 16px;
      width: calc(100% - 32px);
      height: 100%;
    }

    .card {
      min-width: 158px;
      width: calc(50% - 6px);
      height: 125px;
      box-shadow: none;
    }

    .odd {
      margin-right: 8px;
    }

    .card .card-top {
      height: 61px;
      line-height: 61px;
      font-size: 14px;
      font-weight: 400;
    }

    .card .card-bottom {
      height: 48px;
      padding-top: 8px;
      padding-bottom: 8px;
      padding-left: 12px;
    }

    .card-title {
      height: 61px;
    }

    .card .badge {
      margin-right: 3px;
    }

    .card-bottom {
      padding-left: 13px;
    }

    .card .badge {
      width: 40px;
    }
  }

</style>
