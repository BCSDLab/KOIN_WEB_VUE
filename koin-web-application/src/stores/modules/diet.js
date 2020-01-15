import * as api from "../../api/api";

const defaultState = {
  diets: [],
  month: "",
  date: "",
  year: ""
};

const actions = {
  setDiets: (context, payload) => {
    return new Promise(
      (resolve, reject) => {
        payload.apiToday = String(payload.apiToday);
        let month = payload.apiToday.substring(2,3) === '0' ? payload.apiToday.substring(3,4) : payload.apiToday.substring(2,4);
        let isAfternoon = new Date();
        let date = payload.apiToday.substring(4,6);
        let year = payload.apiToday.substring(0,2);
        let isLastDay = 0;
        if(isAfternoon.getHours() >= 19) {
          if (month === '1' || month === '3' || month === '5' || month === '7' || month === '8' || month === '10' || month === '12'){
            isLastDay = 31
          }
          else if (month === '4' || month === '6' || month === '9' || month === '11' ){
            isLastDay = 30
          }
          else if (month === '2'){
            // 윤년
            if(year % 4 === 0){
              isLastDay = 29
            }
            isLastDay = 28
          }
          if(Number(date) + 1 > isLastDay){
            if(month === '12'){
              month = '1';
              date = '01';
              year = Number(year) + 1;
            }
            else {
              month = Number(month) + Number(1);
              date = '01';
            }
          }
          else {
            date = Number(date)+ 1;
            if(Number(date) < 10){
              date = '0'+String(date);
            }
          }
        }
        if(Number(month) < 10){
          month = '0' + String(month);
        }
        if(Number(date) < 10){
          //date = '0' + String(date);
        }
        payload.apiToday = String(year).concat(month,date);
        api.setDiets(payload.apiToday)
          .then((res) => {
            let morning = [];
            let lunch = [];
            let dinner = [];
            for (let i = 0; i < res.data.length; i++) {
              switch (res.data[i].type) {
                case 'BREAKFAST':
                  morning.push(res.data[i]);
                  break;
                case 'LUNCH':
                  lunch.push(res.data[i]);
                  break;
                case 'DINNER':
                  dinner.push(res.data[i]);
                  break;
              }
            }
            let tmp = [];
            tmp.push(morning);
            tmp.push(lunch);
            tmp.push(dinner);
            context.commit("dietUpdate", tmp);
            context.commit("monthUpdate", month);
            context.commit("dateUpdate", date);
            context.commit("yearUpdate",year);
            resolve(true);
          }, (error) => {
            alert("더 이상 데이터를 불러올 수 없습니다.");
            resolve(false);
          })
      })
  }
};

const mutations = {
  dietUpdate: (state, data) => {
    state.diets = data;
  },
  monthUpdate: (state, data) => {
    state.month = data;
  },
  dateUpdate: (state, data) => {
    state.date = data;
  },
  yearUpdate: (state, data) => {
    state.year = data;
  }
};

const getters = {
  diets: state => state.diets,
  month: state => state.month,
  date: state => state.date,
  year: state => state.year,
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
