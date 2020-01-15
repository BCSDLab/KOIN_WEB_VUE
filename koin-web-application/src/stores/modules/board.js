import * as api from "../../api/api";

const defaultState = {
  boardList: [],
  hotBoardList: [],
  totalBoardPageNum: 0,
  boardId: 1,
  specificBoardId: 0,
  specificBoard: "",

  //pagination
  nowPageNum: 1,
  PAGE_MAX_SIZE: 5,
  totalDisplayPageNum: 5,
  totalDisplayMinNum: 1,

  //index
  indexFreeBoard: [],
  indexJobBoard: [],
  indexAnonymousBoard: [],
  indexNoticeBoard: [],
  indexQuestionBoard: [],
  commentHotBoard: [],
  timeHotBoard: [],
  newBoardList: [],
};

const actions = {
  adjustComment(state, payload, conetext) {
    return new Promise(
      (resolve, reject) => {
        let body = {
          'content': payload.content
        };
        if(payload.boardId ===-1){
          body['password'] = payload.anonymousCommentPassword
        }
        api.adjustComment(payload.articleId, payload.id, payload.token, body, payload.boardId)
          .then(res => {
            resolve(res);
          }, error => {
            reject(error.response.status);
          })
      })
  },
  removeComment(state, payload, conetext) {
    return new Promise(
      (resolve, reject) => {
        api.removeComment(payload.articleId, payload.id, payload.token, payload.boardId, payload.anonymousCommentPassword)
          .then(res => {
            resolve(res);
          }, error => {
            reject(error.response.status);
          })
      })
  },
  registerComment(state, payload, context) {
    return new Promise(
      (resolve, reject) => {
        let body = {
          'content': payload.content
        };
        if( payload.boardId === -1 ){
          body['nickname'] = payload.anonymousCommentNickname;
          body['password'] = payload.anonymousCommentPassword;
        }
        api.registerComment(payload.articleId, payload.token, body, payload.boardId)
          .then(res => {
            resolve(res);
          }, error => {
            reject(error);
          })
      })
  },
  adjustBoard(state, payload, conetext) {
    return new Promise(
      (resolve, reject) => {
        let body = {
          'board_id': payload.boardId,
          'title': payload.title,
          'content': payload.content
        };
        if( payload.boardId === -1 ){
          body = {
            'title': payload.title,
            'content': payload.content,
            "password": payload.tempPw
          };
        }
        api.adjustBoard(payload.articleId, payload.token, body, payload.boardId)
          .then(res => {
            resolve(res);
          }, error => {
            console.log(error);
            reject(false);
          })
      })
  },
  removeBoard(state, payload, conetext) {
    return new Promise(
      (resolve, reject) => {

        if( payload.boardId !== -1) {
          api.removeBoard(payload.articleId, payload.token )
            .then(res => {
              resolve(res);
            }, error => {
              reject(false);
            })
        }
        else {
          api.removeTempBoard(payload.articleId, payload.anonymousSpecificBoardPassword )
            .then(res => {
              resolve(res);
            }, error => {
              reject(false);
            })
        }

      })
  },
  grantCheckBoard(state, payload, context) {
    return new Promise(
      (resolve, reject) => {
        let body = {
          "article_id": payload.articleId
        };
        //임시용 게시판인 경우
        if(payload.boardId === -1){
          body['password'] = payload.anonymousSpecificBoardPassword
        }

        api.grantCheckBoard(payload.token, body, payload.boardId)
          .then(res => {
            resolve(res);
          }, error => {
            if (error.message.indexOf("403") != -1)
              reject(403);
          })
      })
  },
  registerBoard(state, payload, context) {
    return new Promise(
      (resolve, reject) => {
        let body = {
          "title": payload.title,
          "content": payload.content,
          "board_id": payload.boardId
        };
        if(payload.boardId === -1){
          body = {
            "title": payload.title,
            "content": payload.content,
            "nickname": payload.tempNick,
            "password": payload.tempPw
          };
        }
        api.registerBoard(payload.token, body, payload.boardId)
          .then(res => {
            if (res.status === 200 || res.status === 201) {
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
  setHotBoardList(context, payload){
    return new Promise(
      (resolve, reject) => {
        api.setHotBoardList().then(res=>{
          context.commit("hotBoardListUpdate", res.data);
        })
      }
    )
  },
  setBoardList(context, payload) {
    let state = context.state;

    return new Promise(
      (resolve, reject) => {
        api.setBoardList(payload.nowPageNum, payload.boardId)
          .then(res => {
            context.commit("totalDisplayPageNumUpdate", res.data.totalPage);
            context.commit("nowPageNumUpdate", payload.nowPageNum);
            // 1,2,3 인경우
            if (state.nowPageNum < (state.PAGE_MAX_SIZE / 2 + 1)) {
              if (res.data.totalPage >= state.PAGE_MAX_SIZE)
                state.totalDisplayPageNum = state.PAGE_MAX_SIZE;
              context.commit('totalDisplayMinNumUpdate', 1)
            }
            // 4,5,6,7,8,9,10~~인경우
            else {
              // 2,3,4,5,6
              if (state.totalBoardPageNum - payload.nowPageNum >= parseInt(state.PAGE_MAX_SIZE / 2)) {
                context.commit('totalDisplayMinNumUpdate', state.nowPageNum - parseInt(state.PAGE_MAX_SIZE / 2))
                context.commit('totalDisplayPageNumUpdate', state.nowPageNum + parseInt(state.PAGE_MAX_SIZE / 2))
              }
              else {
                // 3,4,5,6,7
                context.commit('totalDisplayMinNumUpdate', res.data.totalPage - state.PAGE_MAX_SIZE + 1);
                context.commit('totalDisplayPageNumUpdate', res.data.totalPage);
              }
            }

            context.commit("totalBoardPageNumUpdate", res.data.totalPage);
            context.commit("nowPageNumUpdate", payload.nowPageNum);
            context.commit("boardListUpdate", res.data.articles);
          }, error => {
            reject(false);
          })
      })
  },
  setSpecificBoard(context, payload) {
    let state = context.state;
    return new Promise(
      (resolve, reject) => {
        api.setSpecificBoard(payload.specificBoardId, payload.token, payload.boardId)
          .then(res => {
            if (res.status === 200) {
              context.commit("specificBoardUpdate", res.data);
              resolve(state.specificBoard);
            }
            else {
              resolve(res.status)
            }
          }, error => {
            reject(false);
          })
      })
  },
  getIndexHotBoard(context, payload) {
    return new Promise(
      (resolve, reject) => {
        api.setHotBoardList().then(res => {
          let idArray = [];
          for (let i = 0; i < 4; i++) {
            idArray.push(res.data[i].id)
          }

          let articleComment = [];
          let time = [];

          for(let i = 0; i < 4; i++) {
            api.getArticles(idArray[i]).then(res => {
              articleComment.push(res.data.comment_count);
              time.push(res.data.created_at);
            })
          }
          context.commit("commentHotBoardUpdate", articleComment);
          context.commit("timeHotBoardUpdate", time);
        })
      })
  }, 
  getIndexNewBoard(context, payload) {
    let boards = [];
    let newArticles = [];
    let newBoards = [];
    api.setIndexFirstBoard(1).then(res => {
      boards.push(res.data)
      return api.setIndexFirstBoard(2).then(res => {
        boards.push(res.data)
        return api.setIndexFirstBoard(10).then(res => {
          boards.push(res.data)
          return api.setBoardList(1, -1).then(res => {
            boards.push(res.data.articles);
          })
        })
      })
    }).then(res => {
      for (let articles of boards) {
        for (let article of articles) {
          newArticles.push({
            id: article["id"],
            time: article["created_at"],
            title: article["title"],
            comment: article["comment_count"],
            board_id: article["board_id"] === undefined ? -1 : article["board_id"]
          })
        }
      }
      newArticles.sort((lhs, rhs) => {
        let lhsDate = new Date(lhs['time'].replace(' ','T'));
        let rhsDate = new Date(rhs['time'].replace(' ','T'));
        return rhsDate - lhsDate
      })
      for (let i = 0; i < 4; ++i) {
        newBoards.push(newArticles[i])
      }
    })
    context.commit("newBoardUpdate", newBoards);
  },
  setIndexBoard(context, payload) {
    api.setBoardList(1, 1)
      .then(res => {
        if (res.status === 200) {
          return new Promise((resolve, reject) => {
            api.setIndexFirstBoard(1).then(resFirstIndex => {
              return(resFirstIndex.data[0].summary);
            }).then((data) => {
              res.data.articles[0]["content"] = data;
              context.commit("indexFreeBoardUpdate", res.data.articles);
            })
          });
        }
      });
    api.setBoardList(1, 2)
      .then(res => {
        if (res.status === 200) {
          return new Promise((resolve, reject) => {
            api.setIndexFirstBoard(2).then(resFirstIndex => {
              return(resFirstIndex.data[0].summary);
            }).then((data) => {
              res.data.articles[0]["content"] = data;
              context.commit("indexJobBoardUpdate", res.data.articles);
            })
          });
        }
      })
    api.setBoardList(1, 4)
      .then(res => {
        if (res.status === 200) {
          return new Promise((resolve, reject) => {
            api.setIndexFirstBoard(4).then(resFirstIndex => {
              return(resFirstIndex.data[0].summary);
            }).then((data) => {
              res.data.articles[0]["content"] = data;
              context.commit("indexNoticeBoardUpdate", res.data.articles);
            })
          });
        }
      })
    api.setBoardList(1, -1)
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          context.commit("indexAnonymousBoardUpdate", res.data.articles);
        }
      })
    api.setBoardList(1, 10)
      .then(res => {
        if (res.status === 200) {
          return new Promise((resolve, reject) => {
            api.setIndexFirstBoard(10).then(resFirstIndex => {
              return(resFirstIndex.data[0].summary);
            }).then((data) => {
              res.data.articles[0]["content"] = data;
              context.commit("indexQuestionBoardUpdate", res.data.articles);
            })
          });
        }
      })
  }
};

const mutations = {
  hotBoardListUpdate: (state, data) => {
    state.hotBoardList = data;
  },
  boardListUpdate: (state, data) => {
    state.boardList = data;
  },
  specificBoardUpdate: (state, data) => {
    state.specificBoard = data;
  },
  totalBoardPageNumUpdate: (state, data) => {
    state.totalBoardPageNum = data;
  },
  nowPageNumUpdate: (state, data) => {
    state.nowPageNum = data;
  },
  totalDisplayMinNumUpdate: (state, data) => {
    state.totalDisplayMinNum = data;
  },
  totalDisplayPageNumUpdate: (state, data) => {
    state.totalDisplayPageNum = data;
  },
  indexFreeBoardUpdate: (state, data) => {
    state.indexFreeBoard = [];
    for (let i = 0; i < 5; i++) {
      if (data[i] !== undefined && data[i] !== null)
        state.indexFreeBoard.push(data[i]);
    }
  },
  indexAnonymousBoardUpdate: (state, data) => {
    state.indexAnonymousBoard = [];
    for (let i = 0; i < 5; i++) {
      if (data[i] !== undefined && data[i] !== null)
        state.indexAnonymousBoard.push(data[i]);
    }
  },
  indexJobBoardUpdate: (state, data) => {
    state.indexJobBoard = [];
    for (let i = 0; i < 5; i++) {
      if (data[i] !== undefined && data[i] !== null)
        state.indexJobBoard.push(data[i]);
    }
  },
  indexNoticeBoardUpdate: (state, data) => {
    state.indexNoticeBoard = [];
    for (let i = 0; i < 5; i++) {
      if (data[i] !== undefined && data[i] !== null)
        state.indexNoticeBoard.push(data[i]);
    }
  },
  indexQuestionBoardUpdate: (state, data) => {
    state.indexQuestionBoard = [];
    for (let i = 0; i < 5; i++) {
      if (data[i] !== undefined && data[i] !== null)
        state.indexQuestionBoard.push(data[i]);
    }
  },
  commentHotBoardUpdate: (state, data) => {
    state.commentHotBoard = data;
  },
  timeHotBoardUpdate: (state, data) => {
    state.timeHotBoard = data;
  },
  newBoardUpdate: (state, data) => {
    state.newBoardList = data;
  },

  
};

const getters = {
  hotBoardList: state => state.hotBoardList,
  boardList: state => state.boardList,
  specificBoard: state => state.specificBoard,
  totalBoardPageNum: state => state.totalBoardPageNum,
  nowPageNum: state => state.nowPageNum,
  totalDisplayMinNum: state => state.totalDisplayMinNum,
  totalDisplayPageNum: state => state.totalDisplayPageNum,
  indexFreeBoard: state => state.indexFreeBoard,
  indexAnonymousBoard: state => state.indexAnonymousBoard,
  indexJobBoard: state => state.indexJobBoard,
  indexNoticeBoard: state=> state.indexNoticeBoard,
  indexQuestionBoard: state => state.indexQuestionBoard,
  commentHotBoard: state => state.commentHotBoard,
  timeHotBoard: state => state.timeHotBoard,
  newBoardList: state => state.newBoardList,
};

export default {
  state: defaultState,
  getters,
  actions,
  mutations,
};

