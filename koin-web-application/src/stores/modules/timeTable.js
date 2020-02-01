import * as api from "../../api/api";

const defaultState = {
  totalTimeTable: [],
  myTimeTable: [],
  selectTimeTable: [],
  myTimeTableGrade: [0, 0, 0, 0, 0],
  layout: [],
  selectedLayout: [],
  clickedLayout: [],
  colors: ["#ffa9b7", "#fdbcf5", "#fedb8f", "#c2eead", "#60e4c1", "#8ae9ff", "#72b0ff", "#b4bfff", "#e0e5eb", "#175c8e", "#f7941e", "#ffffff" ],
  removedColors: [],
  colorIndex: 0,
  infoSheetFlag: false,
  clickedSubject: {},
  sheetFlag: false,
  tdHeight: 0,
  totalSemester: [],
  selectedSemester: ''
};

const actions = {
  getTimeTableVersionCheck: (context, payload) => {
    return new Promise((resolve, reject) => {
      api.getVersion('timetable').then(res => {
        if (res.status === 200) {
          resolve(res.data.updated_at);
        }
      })
    })
  },
  initTimeTable: (context, payload) => {
    context.commit("myTimeTableUpdate", []);
    context.commit("myTimeTableGradeUpdate", [0, 0, 0, 0, 0]);
    context.state.removedColors = [];
    context.state.colorIndex = 0;
  },
  clickSubjectOnTimeTable: (context, payload) => {
    context.commit("infoSheetFlagUpdate", payload.flag);
  },
  selectClickedSubject: (context, payload) => {
    for(let i = 0; i < context.state.myTimeTable.length; i++) {
      if (payload === context.state.myTimeTable[i].id || payload === context.state.myTimeTable[i].code + context.state.myTimeTable[i].lecture_class) {
        context.commit("clickedSubjectUpdate", context.state.myTimeTable[i]);
      } else {
        continue;
      }
    }
  },
  setTotalSemester: ({commit}) => {
    return api.getAllSemester().then((res) => {
      commit("totalSemesterUpdate", res.data)
    })
  },
  selectSemester: (context, payload) => {
    return new Promise(resolve => {
      context.commit("selectedSemesterUpdate", payload);
      resolve()
    })
  },
  //total table
  setTotalTimeTable: (context, payload) => {
    return new Promise((resolve, reject)=> {
      api.getAllLecture(context.state.selectedSemester).then((res)=> {
        context.commit("totalTimeTableUpdate", res.data);
        resolve(true)
      }, error => {
        alert("네트워크 문제가 발생했습니다.")
        resolve(false)
      })
    })

  },
  searchMyTimeTableInfo: (context, payload) => {
    let subject = payload.subject;
    subject = subject.length === 0 ? context.state.myTimeTable : subject;
    if (payload.mobile) {
      context.state.removedColors = [];
      context.state.colorIndex = 0;
    }
    let color;
    subject.map(
      value => {
        if(context.state.removedColors.length === 0) {
          color = context.state.colors[context.state.colorIndex];
          context.state.colorIndex++;
        }
        else {
          color = context.state.removedColors[0];
          context.state.removedColors.splice(0,1);
        }
        context.dispatch("addLayout", {
          "subject" : value,
          "color": color,
          "mobile": payload.mobile
        });
      }
    )
    console.log("subject:", subject);
    context.commit("myTimeTableUpdate", subject);
  },
  removeMyTimeTable: (context, payload) => {
    console.log(payload.index);
    //context.state.colorIndex = 0
    console.log(context.state.myTimeTable);
    let removeCode = context.state.myTimeTable[payload.index].code + context.state.myTimeTable[payload.index].lecture_class;
    return new Promise((resolve, reject) => {
      if (payload.token !== undefined) {
        api.deleteSubject(payload.token, payload.id).then(res => {
          console.log(res);
          resolve(true)
        }, error => {
          console.log(error.message);
          resolve(false);
        })
      }
      context.commit("myTimeTableRemove", payload.index);
      let tmpLayout = []
      console.log(context.state.layout);
      for(let i=0; i<context.state.layout.length; i++) {
        if(context.state.layout[i].code !== removeCode) {
          tmpLayout.push(context.state.layout[i])
        }
        else {
          if(context.state.removedColors.length !== 0 ){
            if(context.state.removedColors[context.state.removedColors.length-1] !== context.state.layout[i].backgroundColor) {
              context.state.removedColors.push(context.state.layout[i].backgroundColor)
            }
          }
          else {
            context.state.removedColors.push(context.state.layout[i].backgroundColor)
          }
        }
      }
      context.dispatch("setMyTimeTableGrade");
      console.log(tmpLayout);
      context.commit("layoutChange", tmpLayout);
    }).then((resolve)=> {
      console.log(resolve);
    })
  },
  addLayout: (context, payload) => {
    return new Promise((resolve, reject) => {
      let times = []
      let titleArr = [];
      let classArr = [];
      let profArr = [];
      let nowColors = [];
      let time = []

      for (let j = 0; j < payload.subject.class_time.length; j++) {
        if (j === payload.subject.class_time.length - 1) {
          time.push(payload.subject.class_time[j])
          times.push(time)
          titleArr.push(payload.subject.name);
          classArr.push(payload.subject.lecture_class);
          profArr.push(payload.subject.professor);
        }
        else {
          if (payload.subject.class_time[j + 1] - payload.subject.class_time[j] === 1) {
            time.push(payload.subject.class_time[j]);
          }
          else {
            time.push(payload.subject.class_time[j]);
            times.push(time);
            titleArr.push(payload.subject.name);
            classArr.push(payload.subject.lecture_class);
            profArr.push(payload.subject.professor);
            time = [];
          }

        }
      }

      for (let k = 0; k < times.length; k++) {
        let layoutStyle = {
          'start': { x: parseInt(times[k][0] / 100) + 2, y: parseInt(times[k][0] % 100) },
          'end': { x: parseInt(times[k][times[k].length - 1] / 100) + 2, y: parseInt(times[k][times[k].length - 1] % 100) },
          'backgroundColor': payload.color,
          'borderBottomColor': payload.color,
          'id': payload.subject.id === undefined ? `${payload.subject.code + payload.subject.lecture_class}` : payload.subject.id,
          'title': titleArr[k],
          "info": (classArr[k] === undefined ? "" : classArr[k]) + " "+(profArr[k] === undefined ? "" : profArr[k]),
          'code': payload.subject.code + payload.subject.lecture_class
        }
        context.commit("layoutUpdate", layoutStyle);
      }
    })
  },

  resetLayout: (context, payload) => {
    return new Promise((resolve, reject)=> {
      context.state.layout = [];
      context.commit("layoutReset");
      resolve();
    })
  },
  // 내 시간표 불러오기
  getMyTimeTable: (context, payload) => {
    return new Promise((resolve, reject) => {
      if (payload.token !== undefined) {
        api.getMyTimetable(payload.token, context.state.selectedSemester).then(res => {
          console.log(res.data.timetable);

          if (res.data.timetable.length !== 0) {
            let timetable = res.data.timetable;
            let color;
            if (payload.mobile) {
              context.state.removedColors = [];
              context.state.colorIndex = 0;
            }
            for(let i = 0; i < timetable.length; i++) {
              timetable[i].name = timetable[i].class_title;
              delete timetable[i].class_title;

              if(context.state.removedColors.length === 0) {
                color = context.state.colors[context.state.colorIndex];
                context.state.colorIndex++;
              }
              else {
                color = context.state.removedColors[0];
                context.state.removedColors.splice(0,1);
              }
              context.dispatch("addLayout", {
                "subject" : timetable[i],
                "color": color,
                "mobile": payload.mobile
              });
            }
            context.commit("myTimeTableUpdate", timetable);
            context.dispatch("setMyTimeTableGrade");
            resolve(true);
          }
        })
      } else {
      }

    })
  },

  //My TimeTable
  addMyTimeTable: (context, payload) => {
    console.log(payload);
    context.commit("selectTimeTableReset");
    context.commit("selectedLayoutReset");
    let body = {
      "timetable": [{
        "class_title": payload.subject.name,
        "class_time": payload.subject.class_time,
        "professor": payload.subject.professor,
        "grades": payload.subject.grades,
        "department": payload.subject.department,
        "design_score": payload.subject.design_score,
        "code": payload.subject.code,
        "lecture_class": payload.subject.lecture_class,
        "target": payload.subject.target,
        "regular_number": payload.subject.regular_number,
        "isEdited": false,
      }],
      "semester": context.state.selectedSemester
    }
    return new Promise((resolve, reject) => {
      let newSubject = payload.subject;
      for (let i = 0; i < context.state.myTimeTable.length; i++) {
        //중첩 과목 발생
        if (context.state.myTimeTable[i].name === payload.subject.name) {
          alert("중첩된 과목입니다!");
          return;
        }
        //시간 중복 발생
        for (let j = 0; j < context.state.myTimeTable[i].class_time.length; j++) {
          for (let k = 0; k < newSubject.class_time.length; k++) {
            if (newSubject.class_time[k] == context.state.myTimeTable[i].class_time[j]) {
              alert(newSubject.name + " 과목과 " + context.state.myTimeTable[i].name + " 과목의 시간이 중복됩니다.")
              return;
            }
          }
        }
      }
      let color;
      if(context.state.removedColors.length === 0) {
        color = context.state.colors[context.state.colorIndex];
        context.state.colorIndex++;
      }
      else {
        color = context.state.removedColors[0];
        context.state.removedColors.splice(0,1);
      }

      context.dispatch("addLayout", {
        "subject" : payload.subject,
        "color": color,
        "mobile": payload.mobile
      });
      if (payload.token !== undefined) {
        api.addSubject(payload.token, body).then(res => {
          console.log(res);
          if (res.status === 201) {
            let addedSubject = res.data.timetable[res.data.timetable.length - 1];
            addedSubject.name = addedSubject.class_title;
            delete addedSubject.class_title;
            context.commit("myTimeTableAdd", addedSubject);
            console.log(context.state.myTimeTable);
            context.dispatch("setMyTimeTableGrade");
          }
        });
      } else {
        context.commit("myTimeTableAdd", newSubject);
        context.dispatch("setMyTimeTableGrade");
      }
    })
  },
  // select subject
  setSelectTimeTable: (context, payload) => {
    context.commit("selectTimeTableReset");
    context.commit("selectedLayoutReset");
    if(payload.subject === null){
      return;
    }

    context.commit("selectTimeTableUpdate", payload.subject);
    context.dispatch("setSelectedLayer", {
      subject: payload.subject,
      firstFlag: true,
      mobile: payload.mobile
    })

    for (let i = 0; i < context.state.totalTimeTable.length; i++) {
      if (
        context.state.totalTimeTable[i].name === payload.subject.name &&
        context.state.totalTimeTable[i] !== payload.subject &&
        context.state.totalTimeTable[i].department === payload.subject.department &&
        context.state.totalTimeTable[i].class_time !== payload.subject.class_time
      ) {
        context.commit("selectTimeTableUpdate", context.state.totalTimeTable[i])
        context.dispatch("setSelectedLayer", {
          subject: context.state.totalTimeTable[i],
          firstFlag: false,
          mobile: payload.mobile
        });
        //
      }
    }
  },
  setSelectedLayer: (context, payload) => {
    let times = []
    let titleArr = [];
    let classArr = [];
    let profArr = [];

    let time = []
    for (let j = 0; j < payload.subject.class_time.length; j++) {
      if (j === payload.subject.class_time.length - 1) {
        time.push(payload.subject.class_time[j])
        times.push(time)
        titleArr.push(payload.subject.name);
        classArr.push(payload.subject.lecture_class);
        profArr.push(payload.subject.professor);
      }
      else {
        if (payload.subject.class_time[j + 1] - payload.subject.class_time[j] === 1) {
          time.push(payload.subject.class_time[j]);
        }
        else {
          time.push(payload.subject.class_time[j]);
          times.push(time);
          titleArr.push(payload.subject.name);
          classArr.push(payload.subject.lecture_class);
          profArr.push(payload.subject.professor);
          time = [];
        }

      }
    }
    for (let k = 0; k < times.length; k++) {
      let layoutStyle = {
        'start': { x: parseInt(times[k][0] / 100) + 2, y: parseInt(times[k][0] % 100) },
        'end': { x: parseInt(times[k][times[k].length - 1] / 100) + 2, y: parseInt(times[k][times[k].length - 1] % 100) },
        'id': payload.subject.id === undefined ? `${payload.subject.code + payload.subject.lecture_class}` : payload.subject.id,
        "selected": false
      }
      if (payload.firstFlag) {
        layoutStyle.selected = true;
      }
      context.commit("selectedLayoutUpdate", layoutStyle);
    }

  },
  resetSelectedLayer: (context, payload) => {
    return new Promise((resolve, reject) => {
      api.getAllLecture(context.state.selectedSemester).then((res)=> {
        context.commit("selectTimeTableReset");
        context.commit("selectedLayoutReset");
        resolve(true);
      })
    })
  },
  //grade 계산
  setMyTimeTableGrade: (context, payload) => {
    let grades = [0, 0, 0, 0, 0];
    for (let i = 0; i < context.state.myTimeTable.length; i++) {
      grades[0] += parseInt(context.state.myTimeTable[i].grades);
      if (context.state.myTimeTable[i].department === "융합학과") {
        grades[4] += parseInt(context.state.myTimeTable[i].grades);
      }
      else if (context.state.myTimeTable[i].department === "교양학부") {
        grades[2] += parseInt(context.state.myTimeTable[i].grades);
      }
      else if (context.state.myTimeTable[i].department === "HRD학과") {
        grades[3] += parseInt(context.state.myTimeTable[i].grades);
      }
      else {
        grades[1] += parseInt(context.state.myTimeTable[i].grades);
      }
    }
    context.commit("myTimeTableGradeUpdate", grades);
  },

  // select Major
  selectMajor: (context, payload) => {
    return new Promise((resolve, reject)=> {
      context.dispatch("setTotalTimeTable", {
        semester: context.state.selectedSemester
      }).then(()=>{
        let selectedData = [];
        if (payload.major === "전체") {
          return;
        }
        for (let i = 0; i < context.state.totalTimeTable.length; i++) {
          if (context.state.totalTimeTable[i].department.indexOf(payload.major) !== -1) {
            selectedData.push(context.state.totalTimeTable[i])
          }
        }
        context.commit("totalTimeTableUpdate", selectedData);
      });
      resolve(true);
    })
  },

  // search Subject
  searchTimeTable: (context, payload) => {
    context.dispatch("setTotalTimeTable", {
      semester: context.state.selectedSemester
    }).then((resolve)=> {
      let searchedData = []
      for (let i = 0; i < context.state.totalTimeTable.length; i++) {
        if (context.state.totalTimeTable[i].name.toLowerCase().indexOf(payload.searchName) !== -1 || context.state.totalTimeTable[i].name.toUpperCase().indexOf(payload.searchName) !== -1 || context.state.totalTimeTable[i].name.indexOf(payload.searchName) !== -1 ) {
          searchedData.push(context.state.totalTimeTable[i])
        }
      }
      if (searchedData.length === 0) {
        context.dispatch("setTotalTimeTable", {
          semester: context.state.selectedSemester
        })
        alert("검색어를 포함하는 과목이 존재하지 않습니다.")
      }
      else {
        context.commit("totalTimeTableUpdate", searchedData);
      }
    });
  },
  // sort Column
  sortTimeTableColumn: (context, payload) => {
    // payload.myTimeTableFlag // 전체 테이블인지 구분
    // payload.column // 헤더 이름
    // payload.flag // 오름 내림 구분
    let reverse = payload.flag ? -1 : 1;

    console.log(payload.columnIndex);
    let selectedColumnKey = "";
    switch (payload.columnIndex) {
      case 0:
        selectedColumnKey = 'code';
        break;
      case 1:
        selectedColumnKey = 'name';
        break;
      case 2:
        selectedColumnKey = 'grades';
        break;
      case 3:
        selectedColumnKey = 'lecture_class';
        break;
      case 4:
        selectedColumnKey = 'regular_number';
        break;
      case 5:
        selectedColumnKey = 'department';
        break;
      case 6:
        selectedColumnKey = 'target';
        break;
      case 7:
        selectedColumnKey = 'professor';
        break;
      case 8:
        selectedColumnKey = '';
        break;
      case 9:
        selectedColumnKey = 'design_score';
        break;
    }
    let beforeSortedData = payload.myTimeTableFlag ? context.state.myTimeTable : context.state.totalTimeTable;
    let sortedData = []
    if (payload.columnIndex !== 8) {
      sortedData = beforeSortedData.sort(function (a, b) {
        return a[selectedColumnKey] < b[selectedColumnKey] ? reverse * -1 : reverse * 1;
      })
    }
    if (payload.columnIndex === 8) {
      sortedData = beforeSortedData.sort(function (a, b) {
        return a.is_elearning + a.is_english < b.is_elearning + b.is_english ? reverse * -1 : reverse * 1;
      })
    }

    if (payload.myTimeTableFlag) {
      context.commit("myTimeTableUpdate", sortedData);
    }
    else {
      context.commit("totalTimeTableUpdate", sortedData);
    }
  },
};

const mutations = {
  totalTimeTableUpdate: (state, data) => {
    state.totalTimeTable = data;
  },
  //my time table
  myTimeTableUpdate: (state, data) => {
    state.myTimeTable = data;
  },
  myTimeTableAdd: (state, data) => {
    state.myTimeTable.push(data);
  },
  myTimeTableRemove: (state, data) => {
    state.myTimeTable.splice(data, 1);
  },
  //select time table
  selectTimeTableReset: (state) => {
    state.selectTimeTable = [];
  },
  selectTimeTableUpdate: (state, data) => {
    state.selectTimeTable.push(data);
  },
  // grade table update
  myTimeTableGradeUpdate: (state, data) => {
    state.myTimeTableGrade = data;
  },
  // layout
  layoutReset: (state, data) => {
    state.layout = [];
  },
  layoutUpdate: (state, data) => {
    state.layout.push(data);
  },
  layoutChange: (state, data) => {
    state.layout = data;
  },
  selectedLayoutReset: (state, data) => {
    state.selectedLayout = []
  },
  selectedLayoutUpdate: (state, data) => {
    state.selectedLayout.push(data);
  },
  infoSheetFlagUpdate: (state, data) => {
    state.infoSheetFlag = data;
  },
  clickedSubjectUpdate: (state, data) => {
    state.clickedSubject = data;
  },
  sheetFlagUpdate: (state, data) => {
    state.sheetFlag = data;
  },
  totalSemesterUpdate: (state, data) => {
    state.totalSemester = data;
  },
  selectedSemesterUpdate: (state, data) => {
    state.selectedSemester = data;
  },
};

const getters = {
  totalTimeTable: state => state.totalTimeTable,
  myTimeTable: state => state.myTimeTable,
  selectTimeTable: state => state.selectTimeTable,
  myTimeTableGrade: state => state.myTimeTableGrade,
  selectedLayout: state => state.selectedLayout,
  displayLayout: state => state.layout,
  infoSheetFlag: state => state.infoSheetFlag,
  clickedSubject: state => state.clickedSubject,
  sheetFlag: state => state.sheetFlag,
  semesters: state => state.totalSemester,
  selectedSemester: state => state.selectedSemester,
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};
