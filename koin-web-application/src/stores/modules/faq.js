import * as api from "../../api/api";

const defaultState = {
  faqList: [],
  totalPageNum: 1
};

const actions = {
  setFaqList: (context, payload) => {
    api.setFaqList(payload.pageNum)
      .then((res) => {
        if (res.status === 200) {
          context.commit("faqUpdate", res.data);
        }
        else {
          alert("네트워크를 확인해주세요");
        }
      })
  }
};

const mutations = {
  faqUpdate: (state, data) => {
    state.faqList = data.faqs;
    state.totalPageNum = data.totalPage;
  },
};

const getters = {
  faqList: state => state.faqList,
  totalPageNum: state => state.totalPageNum
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};

