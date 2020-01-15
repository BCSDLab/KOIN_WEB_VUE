import * as api from "../../api/api";

const defaultState = {
  circleList: [],
  displayCircleList: [],
  specificCircle: "",
};

const actions = {
  setCircleList( context, payload ) {
    return new Promise(
      (resolve, reject) => {
        api.setCircleList().then(res => {
          console.log(res.data.circles);
            context.commit("circleListUpdate", res.data.circles);
            context.commit("displayCircleListUpdate", res.data.circles);
            resolve(true);
          }, error => {
            reject(false);
          })
      })
  },
  setTag( context, payload ) {
    let tmpCircleList = [];
    if(payload.tag === null || payload.tag === undefined){
      tmpCircleList = context.state.circleList;
    }
    else {
      for(let i=0; i< context.state.circleList.length; i++){
        if( payload.tag === context.state.circleList[i].category){
          tmpCircleList.push(context.state.circleList[i]);
        }
      }
    }
    context.commit("displayCircleListUpdate", tmpCircleList);
  },
  setSpecificCircle( context, payload ) {
    return new Promise(
      (resolve, reject) => {
        api.setSpecificCircle(payload.specificCircleId)
          .then(res => {
            context.commit("specificCircleUpdate", res.data);
            resolve(true);
          }, error => {
            resolve(false);
          })
      })
  },
};

const mutations = {
  circleListUpdate: (state, data) => {
    state.circleList = data;
  },
  displayCircleListUpdate: (state, data) => {
    state.displayCircleList = data;
  },
  specificCircleUpdate: (state, data) => {
    state.specificCircle = data;
  },
};

const getters = {
  circleList: state => state.circleList,
  displayCircleList: state => state.displayCircleList,
  specificCircle: state => state.specificCircle
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};

const Circle = {
  state: {},
  getters: {},
  actions: {}
};
