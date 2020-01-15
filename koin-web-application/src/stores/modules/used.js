import * as api from "../../api/api";

const defaultState = {
  marketList: [],
  marketItemCount: 0,

  totalmarketPageNumMarket: 0,
  marketId: 1,
  specificMarketId: 0,
  specificmarket: "",

  //pagination
  nowPageNumMarket: 1,
  PAGE_MAX_SIZE: 5,
  totalDisplayPageNumMarket: 5,
  totalDisplayMinNumMarket: 1,

  //index
  indexMarket: [],
};

const actions = {
  adjustMarketComment(state, payload, conetext) {
    return new Promise(
      (resolve, reject) => {
        let body = {
          'content': payload.content
        };
        api.adjustMarketComment(payload.articleId, payload.id, payload.token, body)
          .then(res => {
            resolve(res);
          }, error => {
            reject(false);
          })
      })
  },
  removeMarketComment(state, payload, conetext) {
    return new Promise(
      (resolve, reject) => {
        api.removeMarketComment(payload.articleId, payload.id, payload.token)
          .then(res => {
            resolve(res);
          }, error => {
            resolve(error)
          })
      })
  },
  registerMarketComment(state, payload, conetext) {
    return new Promise(
      (resolve, reject) => {
        let body = {
          'content': payload.content
        };
        api.registerMarketComment(payload.articleId, payload.token, body)
          .then(res => {
            resolve(res);
          }, error => {
            reject(false);
          })
      })
  },
  adjustMarket(state, payload, conetext) {
    return new Promise(
      (resolve, reject) => {
        let body = {
          'state': payload.state,
          'market_id': payload.marketId,
          'title': payload.title,
          'content': payload.content,
          "is_phone_open": payload.is_phone_open,
        };

        if (payload.price !== "")
          body["price"] =payload.price;
        if (payload.is_phone_open === 1 || payload.is_phone_open)
          body["phone"] = payload.phone;
        console.log("py thumbnail: ", payload.thumbnail);
        console.log(payload);
        if ( payload.thumbnail !== null && payload.thumbnail !==undefined && payload.thumbnail.length !== 0 ){
          body["thumbnail"] = payload.thumbnail[0];
        }
        console.log(body);
        api.adjustMarket(payload.specificMarketId, payload.token, body)
          .then(res => {
            resolve(res);
          }, error => {
            reject(false);
          })
      })
  },
  removeMarket(state, payload, conetext) {
    return new Promise(
      (resolve, reject) => {
        api.removeMarket(payload.articleId, payload.token)
          .then(res => {
            resolve(res);
          }, error => {
            reject(false);
          })
      })
  },
  grantCheckMarket(state, payload, context) {
    return new Promise(
      (resolve, reject) => {
        let body = {
          "item_id": payload.articleId
        };
        api.grantCheckMarket(payload.token, body)
          .then(res => {
            resolve(res);
          }, error => {
            if(error.message.indexOf("403") !== -1)
              reject(403);
          })
      })
  },
  registerMarket(state, payload, context) {
    return new Promise(
      (resolve, reject) => {
        let body = {
          "title": payload.title,
          "type": payload.marketId,
          "content": payload.content,
          "is_phone_open": payload.is_phone_open,
        };

        if (payload.price !== "")
          body["price"] =payload.price;
        if (payload.is_phone_open === 1)
            body["phone"] = payload.phone;
        if (payload.thumbnail !== null && payload.thumbnail !==undefined && payload.thumbnail.length !== 0 ){
          body["thumbnail"] = payload.thumbnail[0];
        }
        api.registerMarket(payload.token, body)
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
  setMyMarketList(context, payload) {
    let state = context.state;

    return new Promise(
      (resolve, reject) => {
        api.setMyMarketList(payload.nowPageNumMarket, payload.marketId, payload.token)
          .then(res => {
            context.commit("totalDisplayPageNumMarketUpdate", res.data.totalPage);
            context.commit("nowPageNumMarketUpdate", payload.nowPageNumMarket);
            // 1,2,3 인경우
            if(state.nowPageNumMarket<(state.PAGE_MAX_SIZE/2+1)){
              if(res.data.totalPage >= state.PAGE_MAX_SIZE)
                state.totalDisplayPageNumMarket = state.PAGE_MAX_SIZE;
              context.commit('totalDisplayMinNumMarketUpdate',1)
            }
            // 4,5,6,7,8,9,10~~인경우
            else{
              // 2,3,4,5,6
              if( state.totalmarketPageNumMarket - payload.nowPageNumMarket >= parseInt(state.PAGE_MAX_SIZE/2)){
                context.commit('totalDisplayMinNumMarketUpdate', state.nowPageNumMarket - parseInt(state.PAGE_MAX_SIZE/2))
                context.commit('totalDisplayPageNumMarketUpdate', state.nowPageNumMarket + parseInt(state.PAGE_MAX_SIZE/2))
              }
              else {
                // 3,4,5,6,7
                context.commit('totalDisplayMinNumMarketUpdate', res.data.totalPage - state.PAGE_MAX_SIZE + 1);
                context.commit('totalDisplayPageNumMarketUpdate', res.data.totalPage);
              }
            }

            context.commit("totalmarketPageNumMarketUpdate", res.data.totalPage);
            context.commit("nowPageNumMarketUpdate", payload.nowPageNumMarket);
            context.commit("marketListUpdate", res.data.items);
            context.commit("marketItemCountUpdate", res.data.totalItemCount);
          }, error => {
            reject(false);
          })
      })
  },
  setMarketList(context, payload) {
    let state = context.state;

    return new Promise(
      (resolve, reject) => {
        api.setMarketList(payload.nowPageNumMarket, payload.marketId)
          .then(res => {
            context.commit("totalDisplayPageNumMarketUpdate", res.data.totalPage);
            context.commit("nowPageNumMarketUpdate", payload.nowPageNumMarket);
            // 1,2,3 인경우
            if(state.nowPageNumMarket<(state.PAGE_MAX_SIZE/2+1)){
              if(res.data.totalPage >= state.PAGE_MAX_SIZE)
                state.totalDisplayPageNumMarket = state.PAGE_MAX_SIZE;
              context.commit('totalDisplayMinNumMarketUpdate',1)
            }
            // 4,5,6,7,8,9,10~~인경우
            else{
              // 2,3,4,5,6
              if( state.totalmarketPageNumMarket - payload.nowPageNumMarket >= parseInt(state.PAGE_MAX_SIZE/2)){
                context.commit('totalDisplayMinNumMarketUpdate', state.nowPageNumMarket - parseInt(state.PAGE_MAX_SIZE/2))
                context.commit('totalDisplayPageNumMarketUpdate', state.nowPageNumMarket + parseInt(state.PAGE_MAX_SIZE/2))
              }
              else {
                // 3,4,5,6,7
                context.commit('totalDisplayMinNumMarketUpdate', res.data.totalPage - state.PAGE_MAX_SIZE + 1);
                context.commit('totalDisplayPageNumMarketUpdate', res.data.totalPage);
              }
            }

            context.commit("totalmarketPageNumMarketUpdate", res.data.totalPage);
            context.commit("nowPageNumMarketUpdate", payload.nowPageNumMarket);
            context.commit("marketListUpdate", res.data.items);
            context.commit("marketItemCountUpdate", res.data.totalItemCount);
          }, error => {
            reject(false);
          })
      })
  },
  setSpecificMarket(context, payload) {
    let state = context.state;
    return new Promise(
      (resolve, reject) => {
        api.setSpecificMarket(payload.specificMarketId, payload.token)
          .then(res => {
            if (res.status === 200) {
              context.commit("specificmarketUpdate", res.data);
              resolve(state.specificmarket)
            }
            else {
              resolve(res.status);
            }
          }, error => {
            reject(false);
          })
      })
  },
   async setIndexMarket(context) {
    for(let nowPageNum = 1; context.state.indexMarket.length < 4; nowPageNum++) {
      await api.setIndexMarketList(nowPageNum)
        .then(res => {
          if (res.status === 200) {
            context.commit("indexMarketUpdate", res.data.items);
            return res.data.items;
          }
        });
    }
  }
};

const mutations = {
  marketItemCountUpdate: (state, data) => {
    state.marketItemCount = data;
  },
  marketListUpdate: (state, data) => {
    state.marketList = [];
    state.marketList = data;
  },
  specificmarketUpdate: (state, data) => {
    state.specificmarket = data
  },
  totalmarketPageNumMarketUpdate: (state, data) => {
    state.totalmarketPageNumMarket = data;
  },
  nowPageNumMarketUpdate: (state, data) => {
    state.nowPageNumMarket = data;
  },
  totalDisplayMinNumMarketUpdate: (state, data) => {
    state.totalDisplayMinNumMarket = data;
  },
  totalDisplayPageNumMarketUpdate: (state, data) => {
    state.totalDisplayPageNumMarket = data;
  },
  indexMarketUpdate: (state, data) => {
    if(state.indexMarket.length === undefined)
      state.indexMarket = [];
    for(let i = 0; state.indexMarket.length < 5 && i < 10; i++){
      if(data[i] !== undefined && data[i] !== null && data[i].state === 0)
        state.indexMarket.push(data[i]);
    }
  }
};

const getters = {
  marketList: state => state.marketList,
  specificmarket: state => state.specificmarket,
  totalmarketPageNumMarket: state => state.totalmarketPageNumMarket,
  nowPageNumMarket: state => state.nowPageNumMarket,
  totalDisplayMinNumMarket: state => state.totalDisplayMinNumMarket,
  totalDisplayPageNumMarket: state => state.totalDisplayPageNumMarket,
  indexMarket: state => state.indexMarket,
  marketItemCount: state => state.marketItemCount
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};

