import axios from "axios/index";
import * as api from "../../api/api";

const defaultState = {
    roomList: [],
    specificRoom: ''
}
const actions = {
  getRoomList: (context, payload) => {
    let state = context.state;
    return new Promise((resolve, reject) => {
      api.getRoomList()
        .then((res) => {
          context.commit("roomListUpdate", res.data.lands);
          resolve(state.roomList);
        }, (error) => {
          resolve(false);
        })
    })
  },
  getSpecificRoom: (context, payload) => {
    let state = context.state;
    return new Promise((resolve, reject) => {
      api.getSpecificRoom(payload.specificRoomId)
        .then(res => {
        if (res.status === 200) {
          context.commit("specificRoomUpdate", res.data)
          resolve(state.specificRoom);
        }
        else {
          resolve(res.status);
        }
      }, error => {
        reject(false);
      })
    })
  },
  registerRoomComment: (state, payload, context) => {
    return new Promise((resolve, reject) => {
      let body = {
        'content': payload.content,
        'score': payload.score
      }
      api.registerRoomComment(payload.id, payload.token, body)
        .then(res => {
        resolve(res);
      }, err => {
        resolve(err.response);
      })
    })
  },
  adjustRoomComment: (state, payload, context) => {
    return new Promise((resolve, reject) => {
      let body = {
        'content': payload.content,
        'score': payload.score
      };
      api.adjustRoomComment(payload.id, payload.token, body)
        .then(res => {
        resolve(res);
      }, error => {
        reject(false);
      })
    })
  },
  removeRoomComment: (state, payload, context) => {
    return new Promise((resolve, reject) => {
      api.removeRoomComment(payload.id, payload.token)
        .then(res => {
        resolve(res);
      }, error => {
        reject(false);
      })
    })
  }
};

const mutations = {
  roomListUpdate: (state, data) => {
    state.roomList = data;
  },
  specificRoomUpdate: (state, data) => {
    state.specificRoom = data
  },
};

const getters = {
  roomList: state => state.roomList,
  specificRoom: state => state.specificRoom,
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations
};
