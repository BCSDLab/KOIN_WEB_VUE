import * as api from "../../api/api";

const defaultState = {
  promotionList: [],

  totalPageNumPromotion: 0,
  nowPageNumPromotion: 1,
  specificPromotion: {},
  specificPromotionCommentList: [],

  //pagination
  PAGE_MAX_SIZE: 5,

  //store
  storePromotion: {}
};

const actions = {
  adjustPromotionComment(context, payload) {
    return api.adjustPromotionComment(payload.articleId, payload.id, payload.token, {content: payload.content})
  },
  removePromotionComment(context, payload) {
    return api.removePromotionComment(payload.articleId, payload.id, payload.token)
  },
  registerPromotionComment(context, payload) {
    console.log(payload)
    return api.registerPromotionComment(payload.articleId, payload.token, {content: payload.content})
  },
  adjustPromotion(context, payload) {
    let body = {
      'title': payload.title,
      'event_title': payload.summary,
      'content': payload.content,
      'shop_id': payload.shopId,
      'start_date': payload.startDate.replace(/\./g, '-'),
      'end_date': payload.endDate.replace(/\./g, '-')
    };

    if (payload.thumbnail !== undefined) {
      body["thumbnail"] = payload.thumbnail;
    }
    console.log(body);
    return api.adjustPromotion(payload.specificPromotionId, payload.token, body)
  },
  removePromotion(context, payload) {
    return api.removePromotion(payload.articleId, payload.token)
      .then(
        res => {
          console.log(res);
          return res.data
        },
        err => {
          console.log(error);
          throw error;
        }
      )
  },
  grantCheckPromotion(context, payload) {
    return api.grantCheckPromotion(payload.token, {'article_id': payload.articleId})
      .then(res => {
        return res
      }, error => {
        if(error.message.indexOf("403") !== -1)
          throw new Error('403')
        throw error
      })
  },
  registerPromotion(context, payload) {
    let body = {
      'title': payload.title,
      'event_title': payload.summary,
      'content': payload.content,
      'shop_id': payload.shopId,
      'start_date': payload.startDate.replace(/\./g, '-'),
      'end_date': payload.endDate.replace(/\./g, '-')
    };

    if (payload.thumbnail !== undefined) {
      body["thumbnail"] = payload.thumbnail;
    }
    console.log(body);
    return api.registerPromotion(payload.token, body)
  },
  checkMyPromotion(context, payload) {
    return api.checkMyPromotion(payload.token)
  },
  setMyStore(context, payload) {
    return api.setMyStore(payload)
      .then(
        res => {
          return res.data
        },
        error => {
          console.error(error)
          throw error
        }
      )
  },
  setPromotionList(context, payload) {
    let functionName = ['setPendingPromotionList', 'setClosedPromotionList', 'setPromotionList']
    return api[functionName[payload.type - 1]](payload.nowPageNumPromotion, payload.limit)
      .then(res => {
        context.commit("totalPageNumPromotionUpdate", res.data.totalPage);
        context.commit("promotionListUpdate", res.data['event_articles']);
        return res
      }, error => {
        throw error
      })
  },
  setSpecificPromotion(context, payload) {
    return api.setSpecificPromotion(payload.articleId, payload.token)
      .then(res => {
        if (res.status === 200) {
          context.commit("specificPromotionUpdate", res.data);
          return res.data
        } else {
          return res.status
        }
      }, error => {
        throw error;
      })
  },
  //주변 상점
  setStorePromotion (context) {
    return api.setRandomPendingPromotion()
      .then(
        res => {
          context.commit('storePromotionUpdate', res.data)
          return res.data
        },
        error => {
          throw error
        }
      )
  }
};

const mutations = {
  promotionListUpdate: (state, data) => {
    state.promotionList = data;
    console.log(state.promotionList)
  },
  specificPromotionUpdate: (state, data) => {
    state.specificPromotion = data
  },
  totalPageNumPromotionUpdate: (state, data) => {
    state.totalPageNumPromotion = data;
  },
  storePromotionUpdate: (state, data) => {
    state.storePromotion = data;
  }
};

const getters = {
  promotionList: state => state.promotionList,
  specificPromotion: state => state.specificPromotion,
  specificPromotionCommentList: state => state.specificPromotionCommentList,
  totalPageNumPromotion: state => state.totalPageNumPromotion,
  storePromotion: state => state.storePromotion
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};

