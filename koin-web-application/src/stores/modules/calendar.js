import axios from "axios/index";
import * as api from "../../api/api";

const defaultState = {
    oneDayScheduleContent: [],
    oneDayScheduleDate: [],
    longTimeScheduleContent: [],
    longTimeScheduleDate: []
}
const actions = {
  getAllSchedule: (context, payload) => {
    return new Promise((resolve, reject) => {
        api.getSchedules(payload.year).then(res => {
            resolve(res.data);
        }, error => {
            console.log(error);
            reject(error);
        })
    })
  },
  getOneDaySchedules: (context, payload) => {
    let state = context.state;
    return new Promise((resolve, reject) => {
        api.getSchedules(payload.year).then(res => {
            context.commit("oneDaySchedulesUpdate", res.data);
            resolve([state.oneDayScheduleContent, state.oneDayScheduleDate]);
        }, error => {
            console.log(error);
            reject(error);
        })
    }) 
  },
  getLongTimeSchedules: (context, payload) => {
    let state = context.state;
    return new Promise((resolve, reject) => {
        api.getSchedules(payload.year).then(res => {
            context.commit("longTimeSchedulesUpdate", res.data);
            resolve([state.longTimeScheduleContent, state.longTimeScheduleDate]);
        }, error => {
            console.log(error);
            reject(error);
        })
    })
  }
};

const mutations = {
    oneDaySchedulesUpdate: (state, data) => {
        state.oneDayScheduleContent = [];
        state.oneDayScheduleDate = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].is_continued == 0) {
                state.oneDayScheduleContent.push(data[i].schedule);
                state.oneDayScheduleDate.push(new Date(2018, data[i].start_month-1, data[i].start_day));
            }
        }
    },
    longTimeSchedulesUpdate: (state, data) => {
        state.longTimeScheduleContent = [];
        state.longTimeScheduleDate = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].is_continued == 1) {
                state.longTimeScheduleContent.push(data[i].schedule);
                state.longTimeScheduleDate.push( {start: new Date(2018, data[i].start_month-1, data[i].start_day), end: new Date(2018, data[i].end_month-1, data[i].end_day)});
            }
        }
    }
};

const getters = {
    oneDaySchedule: state => state.oneDaySchedule,
    longTimeSchedule: state => state.longTimeSchedule
};

export default {
    state: defaultState,
    getters,
    actions,
    mutations
};
