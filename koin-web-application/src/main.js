// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'es6-promise/auto'
import Vue from 'vue'
import App from './App'
import { router } from './router'
import vueTopprogress from 'vue-top-progress'
import VueSessionStorage from 'vue-sessionstorage'
import VCalendar from 'v-calendar';
import './static/v-calendar.css';
import './static/quill.snow.css';
import VueCookies from 'vue-cookies'
import 'beautify-scrollbar/dist/index.css';
import lazyLoadList from 'vue-lazy-load-list';
import VueImgOrientationChanger from 'vue-img-orientation-changer'

if(process.env.FONT_FLAG){
  import ('./assets/style.css');
}
require('es6-promise').polyfill();

Vue.use(vueTopprogress);
Vue.use(VueSessionStorage);
Vue.use(VCalendar);
Vue.use(VueCookies);
Vue.use(lazyLoadList);
Vue.use(VueImgOrientationChanger);

import {store} from './stores/store'
import BusLookUp from './SpaComponents/BusFunction/Components/BusLookUp.vue';
import BusTimeTable from './SpaComponents/BusFunction/Components/BusTimeTable.vue';
import IndexBoard from './SpaComponents/IndexFunction/Components/IndexBoard.vue';
import IndexMarket from './SpaComponents/IndexFunction/Components/IndexMarket.vue';
import BoardRank from './SpaComponents/BoardFunction/BoardRank/BoardRank.vue';
import StoreCategory from './SpaComponents/StoreFunction/Components/StoreCategory.vue';
import LoadingBar from './SharedComponents/LoadingBar/LoadingBar.vue';
import VueProgressBar from 'vue-progressbar'

import IndexTopBoard from './SpaComponents/IndexFunction/Components/IndexTopBoard';
import IndexBoardList from './SpaComponents/IndexFunction/Components/IndexBoardList';
import IndexRecommend from './SpaComponents/IndexFunction/Components/IndexRecommend';
import IndexBus from './SpaComponents/IndexFunction/Components/IndexBus';
import IndexDiet from './SpaComponents/IndexFunction/Components/IndexDiet';
import IndexCardNews from './SpaComponents/IndexFunction/Components/IndexCardNews';

const options = {
  color: '#f7941e',
  failedColor: '#874b4b',
  thickness: '4px',
  transition: {
    speed: '0.4s',
    opacity: '0.3s',
    termination: 300
  },
  location: 'top',
}

Vue.config.productionTip = false;
Vue.component('v-bus-lookup', BusLookUp);
Vue.component('v-bus-timetable', BusTimeTable);
Vue.component('v-index-board', IndexBoard);
Vue.component('v-index-market', IndexMarket);
Vue.component('v-board-rank', BoardRank);
Vue.component('v-store-category', StoreCategory);
Vue.component('v-loading-bar', LoadingBar);
Vue.component('v-index-top-board', IndexTopBoard);
Vue.component('v-index-board-list', IndexBoardList);
Vue.component('v-index-recommend', IndexRecommend);
Vue.component('v-index-bus', IndexBus);
Vue.component('v-index-diet', IndexDiet);
Vue.component('v-index-card-news', IndexCardNews);

Vue.use(VueProgressBar, options)

new Vue({
  el: '#app',
  router,
  store,
  components: {App, BusLookUp, BusTimeTable, IndexBoard, IndexMarket, BoardRank, StoreCategory, LoadingBar},
  template: '<App/>',
})
