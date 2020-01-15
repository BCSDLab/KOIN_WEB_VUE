import * as api from "../../api/api";
import * as TIMETABLE from '../../static/busTimeTable';

const defaultState = {
  cityBusData: [],
  timetable: TIMETABLE.default,
  today: new Date(),

  fastestDaesungTime: -1,
  nextFastestDaesungTime: -1,
  fastestShuttleTime: -1,
  nextFastestShuttleTime: -1,

  daesungTime: [{ "hour": 0, "minute": 0}, { "hour": 0, "minute": 0}],
  shuttleTime: [{ "hour": 0, "minute": 0, "day": []}, { "hour": 0, "minute": 0, "day": []}]
};

const actions = {
  setCityBusData: (context, payload) => {
    api.setCityBus(payload.depart, payload.arrival)
      .then(res => {
      if (res.status === 200) {
        context.commit("cityBusUpdate", res.data);
      }
      else {
        alert("네트워크를 확인해주세요");
      }
    })
  },
  setBusTime: (context, payload) => {
    let state = context.state;
    let today = new Date;
    //today.setHours(23)
    //오늘 시간 특정
    let fastestDaesungTime = 0;
    let nextFastestDaesungTime = 0;
    let fastestShuttleTime = 0;
    let nextFastestShuttleTime = 0;
    //시간
    let daesungTime = [{ "hour": 0, "minute": 0}, { "hour": 0, "minute": 0}];
    let shuttleTime = [{ "hour": 0, "minute": 0}, { "hour": 0, "minute": 0}];
    let route = payload.depart+payload.arrival;
    let daesungTimeTable = [];
    let shuttleTimeTable = [];

    if(state.timetable[route].daesung==="none"){
      fastestDaesungTime="미운행";
      nextFastestDaesungTime="미운행";
    }
    else{
      daesungTimeTable = state.timetable[route].daesung;
      //대성
      for(let i=0; i<daesungTimeTable.length; i++){

        let routeTime = new Date()
        routeTime.setHours(daesungTimeTable[i].hour);
        routeTime.setMinutes(daesungTimeTable[i].minute);
        routeTime.setSeconds(0)

        if(routeTime.getTime() - today.getTime() > 0){
          fastestDaesungTime = routeTime.getTime() - today.getTime();
          daesungTime[0].hour = daesungTimeTable[i].hour;
          daesungTime[0].minute = daesungTimeTable[i].minute;
          if(i < daesungTimeTable.length-1){
            routeTime.setHours(daesungTimeTable[i+1].hour);
            routeTime.setMinutes(daesungTimeTable[i+1].minute);
            daesungTime[1].hour = daesungTimeTable[i+1].hour;
            daesungTime[1].minute = daesungTimeTable[i+1].minute;

            nextFastestDaesungTime = routeTime.getTime() - today.getTime();
          }
          break;
        }
      }
    }

    if(state.timetable[route].shuttle === "none"){
      fastestShuttleTime="미운행";
      nextFastestShuttleTime="미운행";
    }
    else{
      shuttleTimeTable = state.timetable[route].shuttle;
      //셔틀
      for(let i=0; i<shuttleTimeTable.length; i++){
        let routeTime = new Date()
        // 버스 시간의 날짜 체크.
        if (shuttleTimeTable[i].day.indexOf(routeTime.getDay()) !== -1) {
          routeTime.setHours(shuttleTimeTable[i].hour);
          routeTime.setMinutes(shuttleTimeTable[i].minute);
          routeTime.setSeconds(0)
        } else {
          continue;
        }

        if(routeTime.getTime() - today.getTime() > 0){
          fastestShuttleTime = routeTime.getTime() - today.getTime();
          shuttleTime[0].hour = shuttleTimeTable[i].hour;
          shuttleTime[0].minute = shuttleTimeTable[i].minute;
          shuttleTime[0].day = shuttleTimeTable[i].day;
          if(i < shuttleTimeTable.length-1){
            routeTime.setHours(shuttleTimeTable[i+1].hour);
            routeTime.setMinutes(shuttleTimeTable[i+1].minute);
            shuttleTime[1].hour = shuttleTimeTable[i+1].hour;
            shuttleTime[1].minute = shuttleTimeTable[i+1].minute;
            shuttleTime[1].day = shuttleTimeTable[i+1].day;

            nextFastestShuttleTime = routeTime.getTime() - today.getTime();
          }
          break;
        }
      }
    }

    context.commit("TimeUpdate",[fastestDaesungTime, nextFastestDaesungTime, fastestShuttleTime, nextFastestShuttleTime, daesungTime, shuttleTime]);

  }
};

const mutations = {
  cityBusUpdate: (state, data) => {
    state.cityBusData = data;
  },
  TimeUpdate: (state, data) => {
    state.fastestDaesungTime = data[0];
    state.nextFastestDaesungTime = data[1];
    state.fastestShuttleTime = data[2];
    state.nextFastestShuttleTime = data[3];
    state.daesungTime = data[4];
    state.shuttleTime = data[5];
  },
};

const getters = {
  cityBusData: state => state.cityBusData,
  fastestDaesungTime: state => state.fastestDaesungTime,
  nextFastestDaesungTime: state => state.nextFastestDaesungTime,
  fastestShuttleTime: state => state.fastestShuttleTime,
  nextFastestShuttleTime: state => state.nextFastestShuttleTime,
  daesungTime: state => state.daesungTime,
  shuttleTime: state => state.shuttleTime,
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
