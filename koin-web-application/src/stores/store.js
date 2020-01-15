import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import Faq from './modules/faq';
import CityBus from './modules/cityBus';
import Diet from './modules/diet';
import Store from './modules/store';
import Authentification from './modules/auth';
import Board from './modules/board';
import Room from './modules/room';
import Market from './modules/used';
import Calendar from './modules/calendar';
import Circle from './modules/circle';
import Lost from './modules/lost';
import TimeTable from './modules/timeTable';
import Search from './modules/search';
import Promotion from './modules/promotion'
Vue.use(Vuex);

//카테고리용 모듈
const Category = {
  state: {
    nowCategory: "",
    nowRoutingPath: "",
    footerCategoryFlag: false,
    nowFooterCategory: 0,
    darkBackGround: false
  },
  getters: {
    getNowCategory: function (state) {
      return state.nowCategory
    },
    nowRoutingPath: state => state.nowRoutingPath,
    footerCategoryFlag: state => state.footerCategoryFlag,
    nowFooterCategory: state => state.nowFooterCategory,
    darkBackGround: state => state.darkBackGround
  },
  actions: {
    setNowRoutingPath: (context, payload) => {
      context.commit("updateNowRoutingPath", payload.path);
    },
    setFooterCategory: (context, payload) => {
      context.commit("toggleFooterCategoryFlag", context.state.footerCategoryFlag);
    },
    setNowFooterCategory: (context, payload) => {
      context.commit("updateNowFooterCategory", payload.footerCategoryIndex);
    }
  },
  mutations: {
    setNowCategory: function (state, payload) {
      state.nowCategory = payload.title
    },
    updateNowRoutingPath: (state, data) => {
      state.nowRoutingPath = data
    },
    toggleFooterCategoryFlag: (state, data) => {
      state.footerCategoryFlag = !data
    },
    updateNowFooterCategory: (state, data) => {
      state.nowFooterCategory = data;
    },
    darkenBackGround: (state, data) => {
      state.darkBackGround = data;
    }

  }
}
export const store = new Vuex.Store({
  modules: {
    Authentification: Authentification,
    Category: Category,
    Diet: Diet,
    Faq: Faq,
    CityBus: CityBus,
    Store: Store,
    Board: Board,
    Room: Room,
    Market: Market,
    Calendar: Calendar,
    Circle: Circle,
    Lost: Lost,
    TimeTable: TimeTable,
    Search: Search,
    Promotion: Promotion
  }
});
