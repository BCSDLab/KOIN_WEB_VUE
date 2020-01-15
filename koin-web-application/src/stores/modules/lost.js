import * as api from "../../api/api";

const defaultState = {
  itemList: [],
  lostItemCount: 0,

  totalItemPageNum: 0,
  itemId: 1,
  specificItemId: 0,
  specificItem: "",

  //pagination
  nowPageNumLost: 1,
  PAGE_MAX_SIZE: 5,
  totalDisplayPageNumLost: 5,
  totalDisplayMinNumLost: 1,

  //index
  indexItem: [],
};

const actions = {
    getLostItems(context, payload) {
        let state = context.state;

        return new Promise(
            (resolve, reject) => {
            api.getLostItems(payload.nowPageNumLost, payload.type)
            .then(res => {
                console.log(res.data);
                context.commit("totalDisplayPageNumLostUpdate", res.data.totalPage);
                context.commit("nowPageNumLostUpdate", payload.nowPageNumLost);
                // 1,2,3 인경우
                if(state.nowPageNumLost<(state.PAGE_MAX_SIZE/2+1)){
                    if(res.data.totalPage >= state.PAGE_MAX_SIZE)
                    state.totalDisplayPageNumLost = state.PAGE_MAX_SIZE;
                context.commit('totalDisplayMinNumLostUpdate',1)
                }
                // 4,5,6,7,8,9,10~~인경우
                else{
                    // 2,3,4,5,6
                    if( state.totalItemPageNum - payload.nowPageNumLost >= parseInt(state.PAGE_MAX_SIZE/2)){
                        context.commit('totalDisplayMinNumLostUpdate', state.nowPageNumLost - parseInt(state.PAGE_MAX_SIZE/2))
                        context.commit('totalDisplayPageNumLostUpdate', state.nowPageNumLost + parseInt(state.PAGE_MAX_SIZE/2))
                    }
                    else {
                        // 3,4,5,6,7
                        context.commit('totalDisplayMinNumLostUpdate', res.data.totalPage - state.PAGE_MAX_SIZE + 1);
                        context.commit('totalDisplayPageNumLostUpdate', res.data.totalPage);
                    }
                }

                context.commit("totalItemPageNumUpdate", res.data.totalPage);
                context.commit("nowPageNumLostUpdate", payload.nowPageNumLost);
                context.commit("itemListUpdate", res.data.lostItems);
                context.commit("lostItemCountUpdate", res.data.totalItemCount);
            }, error => {
                reject(false);
            })
        })
    },
    getMyLostItem (context, payload) {
        let state = context.state;

        return new Promise(
        (resolve, reject) => {
            api.getMyLostItem(payload.nowPageNumLost, payload.itemId, payload.token)
            .then(res => {
                context.commit("totalDisplayPageNumLostUpdate", res.data.totalPage);
                context.commit("nowPageNumLostUpdate", payload.nowPageNumLost);
                // 1,2,3 인경우
                if(state.nowPageNumLost<(state.PAGE_MAX_SIZE/2+1)){
                    if(res.data.totalPage >= state.PAGE_MAX_SIZE)
                        state.totalDisplayPageNumLost = state.PAGE_MAX_SIZE;
                    context.commit('totalDisplayMinNumLostUpdate',1)
                }
                // 4,5,6,7,8,9,10~~인경우
                else{
                // 2,3,4,5,6
                    if( state.totalItemPageNum - payload.nowPageNumLost >= parseInt(state.PAGE_MAX_SIZE/2)){
                        context.commit('totalDisplayMinNumLostUpdate', state.nowPageNumLost - parseInt(state.PAGE_MAX_SIZE/2))
                        context.commit('totalDisplayPageNumLostUpdate', state.nowPageNumLost + parseInt(state.PAGE_MAX_SIZE/2))
                    }
                    else {
                    // 3,4,5,6,7
                        context.commit('totalDisplayMinNumLostUpdate', res.data.totalPage - state.PAGE_MAX_SIZE + 1);
                        context.commit('totalDisplayPageNumLostUpdate', res.data.totalPage);
                    }
                }

                context.commit("totalItemPageNumUpdate", res.data.totalPage);
                context.commit("nowPageNumLostUpdate", payload.nowPageNumLost);
                context.commit("itemListUpdate", res.data.lostItems);
                context.commit("lostItemCountUpdate", res.data.totalItemCount);
            }, error => {
                reject(false);
            })
        })
    },
    getSpecificLostItem(context, payload) {
        let state = context.state;
        
        return new Promise(
            (resolve, reject) => {
            api.getSpecificLostItem(payload.token, payload.specificItemId)
            .then(res => {
                if (res.status === 200) {
                    context.commit("specificItemUpdate", res.data);
                    resolve(state.specificItem)
                } else {
                    resolve(res.status);
                }
            }, error => {
                reject(false);
            })
        })
    },
    registerLostItem(state, payload, context) {
        return new Promise(
        (resolve, reject) => {
            let body = {
                title: payload.title,
                type: payload.type,
                date: payload.date,
                location: payload.location,
                is_phone_open: payload.is_phone_open,
                phone: payload.phoneNumber,
                content: payload.content
            }
            api.registerLostItem(payload.token, body)
            .then(res => {
                if (res.status === 200) {
                    resolve(res)
                }
                else {
                    resolve(res)
                }
            }, error => {
                reject(false);
            })
        })
    },
    adjustLostItem (state, payload, conetext) {
        return new Promise(
            (resolve, reject) => {
                let body = {
                    title: payload.title,
                    type: payload.type,
                    date: payload.date,
                    location: payload.location,
                    is_phone_open: payload.is_phone_open,
                    phone: payload.phoneNumber,
                    content: payload.content
                }
                console.log(body);
                api.adjustLostItem(payload.token, payload.id, body)
                .then(res => {
                    console.log(res);
                    resolve(res);
                }, error => {
                    reject(false);
                })
            })
    },
    deleteLostItem(state, payload, conetext) {
        return new Promise(
            (resolve, reject) => {
            api.deleteLostItem(payload.token, payload.id)
            .then(res => {
                resolve(res);
            }, error => {
                reject(false);
            })
        })
    },
    grantCheckLost (state, payload, context) {
        return new Promise(
            (resolve, reject) => {
            let body = {
                'lostItem_id': payload.id
            };
            api.grantCheckLost(payload.token, body)
            .then(res => {
                resolve(res);
            }, error => {
                if(error.message.indexOf("403") !== -1)
                    reject(403);
            })
        })
    },
    registerLostComment (state, payload, conetext) {
        return new Promise(
            (resolve, reject) => {
                let body = {
                    'content': payload.content
                };
                api.registerLostComment(payload.token, payload.itemId, body)
                .then(res => {
                    console.log(res);
                    resolve(res);
                }, error => {
                    reject(false);
                })
            })
    },
    adjustLostComment (state, payload, conetext) {
        return new Promise(
            (resolve, reject) => {
                let body = {
                    'content': payload.content
                };
                api.adjustLostComment(payload.token, payload.itemId, payload.id, body)
                .then(res => {
                    resolve(res);
                }, error => {
                    reject(false);
                })
            })
    },
    deleteLostComment (state, payload, conetext) {
        return new Promise(
            (resolve, reject) => {
                api.deleteLostComment(payload.token, payload.itemId, payload.id)
                    .then(res => {
                        resolve(res);
                    }, error => {
                        resolve(error)
                    })
            })
    },
};

const mutations = {
  lostItemCountUpdate: (state, data) => {
    state.lostItemCount = data;
  },
  itemListUpdate: (state, data) => {
    state.itemList = [];
    state.itemList = data;
  },
  specificItemUpdate: (state, data) => {
    state.specificItem = data
  },
  totalItemPageNumUpdate: (state, data) => {
    state.totalItemPageNum = data;
  },
  nowPageNumLostUpdate: (state, data) => {
    state.nowPageNumLost = data;
  },
  totalDisplayMinNumLostUpdate: (state, data) => {
    state.totalDisplayMinNumLost = data;
  },
  totalDisplayPageNumLostUpdate: (state, data) => {
    state.totalDisplayPageNumLost = data;
  },
  indexItemUpdate: (state, data) => {
    state.indexItem = [];
    for( let i=0; i<4; i++ ){
      if(data[i] !== undefined && data[i] !== null)
        state.indexItem.push(data[i]);
    }
  }
};

const getters = {
  itemList: state => state.itemList,
  specificItem: state => state.specificItem,
  totalItemPageNum: state => state.totalItemPageNum,
  nowPageNumLost: state => state.nowPageNumLost,
  totalDisplayMinNumLost: state => state.totalDisplayMinNumLost,
  totalDisplayPageNumLost: state => state.totalDisplayPageNumLost,
  indexItem: state => state.indexItem,
  lostItemCount: state => state.lostItemCount
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};

