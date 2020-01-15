import * as api from "../../api/api";

const defaultState = {
  storeList: [],
  storeCategoryList: [],
  specificStore: null,
  checkboxs: [false, false, false],
  tag: ""
};

const actions = {
  setCheckBoxs: (context, payload) => {
    context.commit("checkboxsUpdate", [payload.bank, payload.card, payload.delivery]);
  },
  setCategoryStoreList: (context, payload) => {
    if (payload.card !== undefined) {
      context.state.checkboxs = [];
      context.state.checkboxs.push(payload.bank)
      context.state.checkboxs.push(payload.card)
      context.state.checkboxs.push(payload.delivery)
    }

    let tmp = [];

    if (payload.tag !== "-1") {
      context.state.tag = payload.tag
      for (let i = 0; i < context.state.storeList.length; i++) {
        if (context.state.storeList[i].category === context.state.tag) {
          tmp.push(context.state.storeList[i])
        }
      }
    }
    else {
      context.state.tag = "";
      tmp = context.state.storeList;
    }
    let tmp2 = [];
    if (context.state.checkboxs[0]) {
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].pay_bank) {
          tmp2.push(tmp[i])
        }
      }
    }
    else {
      tmp2 = tmp
    }


    let tmp3 = [];

    if (context.state.checkboxs[1]) {
      for (let i = 0; i < tmp2.length; i++) {
        if (tmp2[i].pay_card) {
          tmp3.push(tmp2[i])
        }
      }
    }
    else {
      tmp3 = tmp2;
    }

    let tmp4 = [];
    if (context.state.checkboxs[2]) {
      for (let i = 0; i < tmp3.length; i++) {
        if (tmp3[i].delivery) {
          tmp4.push(tmp3[i])
        }
      }
    }
    else {
      tmp4 = tmp3;
    }

    context.commit("storeCategoryListUpdate", tmp4);
  },

  setStoreList: (context, payload) => {
    return new Promise(
      (resolve, reject) => {
        api.setStoreList()
          .then((res) => {

            if(payload.tag){
              for (let i = res.data.shops.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                let temp = res.data.shops[i];
                res.data.shops[i] = res.data.shops[j];
                res.data.shops[j] = temp;
              }
              context.commit("storeListUpdate", res.data.shops);
            }

            resolve("-1");
          }, (error) => {
            alert("요청하신 페이지를 찾을 수 없습니다.");
            resolve(false);
          })
      })
  },

  setSpecificStore(context, payload) {
    return new Promise(
      (resolve, reject) => {
        api.setSpecificStore(payload.specificStoreId)
          .then(res => {
            console.log(res.data);
            if (res.status === 200) {
              context.commit("updateSpecificStore", res.data);
              resolve(true);
            }
            else {
              resolve(res.status)
            }
          }, error => {
            reject(false);
          })
      })
  }

};

const mutations = {
  tagUpdate: (state,data) => {
    state.tag = data;
  },
  checkboxsUpdate: (state, data) => {
    state.checkboxs = data;
  },
  storeCategoryListUpdate: (state, data) => {
    state.storeCategoryList = data;
  },
  storeListUpdate: (state, data) => {
    state.storeList = data;
  },
  updateSpecificStore: (state, data) => {
    state.specificStore = data;
  }
};

const getters = {
  storeCategoryList: state => state.storeCategoryList,
  storeList: state => state.storeList,
  indexStoreList: state => state.storeList.filter(
    (value) => {
      return !(value.category === "S000" || value.category === "S001" || value.category === "S009")
    }
  ),
  checkboxs: state => state.checkboxs,
  tag: state => state.tag,
  specificStore: state => state.specificStore
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
