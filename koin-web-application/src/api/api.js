import axios from "axios/index";

const API_PATH = process.env.ROOT_API;

// #user auth part
export function refresh(token){
  return axios.get(API_PATH + 'user/refresh', {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function login(body){
  return axios.post(API_PATH + 'user/login', body)
}

export function logout(token){
  return axios.post(API_PATH + 'user/logout', { }, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

export function nicknameCheck(nickname) {
  return axios.get(API_PATH + 'user/check/nickname/' + nickname)
}

export function signUp(body){
  return axios.post(API_PATH + 'user/register', body)
}

export function findPw(body){
  return axios.post(API_PATH + 'user/find/password', body)
}

export function adjustUserInfo(token, body){
  return axios.put(API_PATH + 'user/me', body,{
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function userWithdrawal(token) {
  return axios.delete(API_PATH + 'user/me', {
    headers: {
      "Authorization": "Bearer "+token
    }
  });
}
export function adjustOwnerInfo(token, body) {
  return axios.put(API_PATH + 'user/owner/me', body, {
    headers: {
      "Authorization": "Bearer "+token
    }
  });
}

// #board part
export function setHotBoardList() {
  return axios.get(API_PATH + 'articles/hot/list');
}

export function setBoardList(nowPageNum, boardId) {
  // 신입생용 익명게시판이 아닌 경우
  if(boardId !== -1){
    return axios.get(API_PATH + 'articles?page=' + nowPageNum + '&boardId=' + boardId)
  }
  // 신입생용 익명게시판인 경우
  else {
    return axios.get(API_PATH + 'temp/articles?page=' + nowPageNum)
  }
}

export function getArticles (articleId) {
  return axios.get(API_PATH + 'articles/' +articleId );
}

export function setSpecificBoard(specificBoardId, token, boardId) {
  if(boardId !== -1){
    return axios.get(API_PATH + 'articles/' + specificBoardId, {
      headers: {
        "Authorization": "Bearer "+token
      }
    })
  }
  else {
    return axios.get(API_PATH + 'temp/articles/' + specificBoardId)
  }
}
export function setIndexFirstBoard(boardId) {
  return axios.get(API_PATH + 'articles/new/list?offset=1&boardId=' + boardId)
}

export function registerBoard(token, body, boardId){
  if(boardId !== -1){
    return axios.post(API_PATH + 'articles', body, {
      headers: {
        "Authorization": "Bearer "+token
      }
    })
  }
  else {
    return axios.post(API_PATH + 'temp/articles', body)
  }

}

export function removeBoard(articleId, token){
  return axios.delete(API_PATH + 'articles/' + articleId, {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}
export function removeTempBoard(articleId, password){
  return axios.delete(API_PATH + 'temp/articles/' + articleId, {
    headers: {
      "password": password
    }
  })
}

export function adjustBoard(articleId, token, body, boardId){
  //console.log(boardId);
  if(boardId !== -1){
    return axios.put(API_PATH + 'articles/' + articleId, body ,{
      headers: {
        "Authorization": "Bearer "+token
      }
    })
  }
  else {
    return axios.put(API_PATH + 'temp/articles/' + articleId, body)
  }

}

export function grantCheckBoard(token, body, boardId){
  if(boardId !== -1){
    return axios.post(API_PATH + 'articles/grant/check', body, {
      headers: {
        "Authorization": "Bearer "+token
      }
    })
  }
  else {
    return axios.post(API_PATH + 'temp/articles/grant/check', body)
  }
}

export function uploadImageForAnonymousBoard(formData) {
  return axios.post(`${API_PATH}temp/items/image/upload`, formData)
}

// #comment part
export function adjustComment(articleId, id, token, body, boardId){
  if(boardId !== -1){
    return axios.put(API_PATH + 'articles/' + articleId + '/comments/' + id, body , {
      headers: {
        "Authorization": "Bearer "+token
      }
    })
  }
  else {
    return axios.put(API_PATH + 'temp/articles/' + articleId + '/comments/' + id, body )
  }

}

export function removeComment(articleId, id, token, boardId, password){
  if( boardId !== -1 ){
    return axios.delete(API_PATH + 'articles/' + articleId + '/comments/' + id, {
      headers: {
        "Authorization": "Bearer "+token
      }
    })
  }
  else {
    return axios.delete(API_PATH + 'temp/articles/' + articleId + '/comments/' + id, {
      headers: {
        "password": password
      }
    })
  }
}

export function registerComment(articleId, token, body, boardId){
  if(boardId !== -1){
    return axios.post(API_PATH + 'articles/' + articleId + '/comments', body ,{
      headers: {
        "Authorization": "Bearer "+token
      }
    })
  }
  else {
    return axios.post(API_PATH + 'temp/articles/' + articleId + '/comments', body)
  }
}

// #city bus part
export function setCityBus(depart, arrival){
  return axios.get(API_PATH + 'buses/?depart='+depart +'&arrival=' + arrival)
}

// #diet part
export function setDiets(apiToday){
  return axios.get(API_PATH + 'dinings/?date=' + apiToday)
}

// #Faq part
export function setFaqList(pageNum){
  return axios.get(API_PATH + 'faqs?page=' + pageNum)
}

// #store part
export function setStoreList(){
  return axios.get(API_PATH + 'shops')
}

export function setSpecificStore(specificStoreId){
  return axios.get(API_PATH + 'shops/' + specificStoreId)
}

// #login check part
export function loginCheck(token){
  return axios.get(API_PATH + 'user/me', {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}
// #room part
export function getRoomList(pageNum){
  return axios.get(API_PATH + 'lands');
}

export function getSpecificRoom(specificRoomId){
  return axios.get(API_PATH + `lands/${specificRoomId}`)
}

export function registerRoomComment(id, token, body){
  return axios.post(API_PATH + `lands/evaluate/${id}`, body)
}

export function adjustRoomComment(id, token, body){
  return axios.put(API_PATH + `lands/evaluate/${id}`, body)
}

export function removeRoomComment(id, token) {
  return axios.delete(API_PATH + `lands/evaluate/`)
}

// #market part

export function setMarketList(nowPageNum, type) {
  return axios.get(API_PATH + 'market/items?page=' + nowPageNum + '&type=' + type + '&limit=12')
}

export function setMyMarketList(nowPageNum, type, token) {
  return axios.get(API_PATH + 'market/my/items?page=' + nowPageNum + '&type=' + type + '&limit=12', {
    headers: {
      "Authorization": "Bearer "+token
    }
  });
}

export function setIndexMarketList(nowPageNum) {
  return axios.get(API_PATH + 'market/items?page=' + nowPageNum);
}

export function setSpecificMarket(specificBoardId, token) {
  return axios.get(API_PATH + 'market/items/' + specificBoardId, {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function registerMarket(token, body){
  return axios.post(API_PATH + 'market/items', body , {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function removeMarket(articleId, token){
  return axios.delete(API_PATH + 'market/items/' + articleId, {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function adjustMarket(articleId, token, body){
  return axios.put(API_PATH + 'market/items/' + articleId, body, {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function grantCheckMarket(token, body){
  return axios.post(API_PATH + 'market/items/grant/check', body , {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function adjustMarketComment(articleId, id, token, body){
  return axios.put(API_PATH + 'market/items/' + articleId + '/comments/' + id, body , {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function removeMarketComment(articleId, id, token){
  return axios.delete(API_PATH + 'market/items/' + articleId + '/comments/' + id, {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function registerMarketComment(articleId, token, body){
  return axios.post(API_PATH + 'market/items/' + articleId + '/comments', body, {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function uploadImage(token, formdata){
  return axios.post(API_PATH + "market/items/image/upload", formdata, {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function uploadThumbnailImage(token, formdata){
  return axios.post(API_PATH + "market/items/image/thumbnail/upload", formdata , {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function getSchedules(year) {
  return axios.get(API_PATH + "calendars/?year="+year)
}

// #circle part
export function setCircleList(){
  return axios.get(API_PATH + 'circles/?limit=999')
}

export function setSpecificCircle(specificCircleId){
  return axios.get(API_PATH + 'circles/' + specificCircleId)
}

// #lost part

export function getLostItems (nowPageNum, type) {
  return axios.get(`${API_PATH}lost/lostItems?page=${nowPageNum}&limit=10`)
}

export function getMyLostItem (nowPageNum, type, token) {
  return axios.get(`${API_PATH}lost/my/lostItems?page=${nowPageNum}&type=${type}&limit=10`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export function getSpecificLostItem (token, id) {
  return axios.get(`${API_PATH}lost/lostItems/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export function registerLostItem (token, body) {
  return axios.post(`${API_PATH}lost/lostItems`, body, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export function deleteLostItem (token, id) {
  return axios.delete(`${API_PATH}lost/lostItems/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export function adjustLostItem (token, id, body) {
  return axios.put(`${API_PATH}lost/lostItems/${id}`, body, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export function grantCheckLost (token, body) {
  return axios.post(`${API_PATH}lost/lostItems/grant/check`, body, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export function registerLostComment (token, itemId, body) {
  return axios.post(`${API_PATH}lost/lostItems/${itemId}/comments`, body, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export function adjustLostComment (token, itemId, id, body) {
  return axios.put(`${API_PATH}lost/lostItems/${itemId}/comments/${id}`, body, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export function deleteLostComment (token, itemId, id) {
  return axios.delete(`${API_PATH}/lost/lostItems/${itemId}/comments/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export function uploadLostThumbnail (token, formdata) {
  return axios.post(`${API_PATH}lost/lostItems/image/thumbnail/upload`, formdata, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export function getAllLecture (id) {
  return axios.get(`${API_PATH}lectures/?semester_date=${id}`)
}

export function addSubject (token, body) {
  return axios.post(`${API_PATH}timetables`, body, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export function getMyTimetable (token, id) {
  return axios.get(`${API_PATH}timetables?semester=${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export function deleteSubject (token, id) {
  return axios.delete(`${API_PATH}timetable?id=${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
}

export function getVersion (type) {
  return axios.get(`${API_PATH}versions/${type}`);
}

// #search part
export function searchArticle (page, searchType, query) {
  return axios.get(`${API_PATH}articles/search?page=${page}&searchType=${searchType}&query=${query}`);
}

export function searchStore (page, searchType, query) {
  return axios.get(`${API_PATH}shops/search?page=${page}&searchType=${searchType}&query=${query}`);
}

// #card news part

export function getCardNews () {
  return axios.get(`${API_PATH}cardNews`);
}

// #promotion part
export function setPromotionList(nowPageNum, limit) {
  return axios.get(API_PATH + 'events/?page=' + nowPageNum + '&limit=' + limit)
}
export function setPendingPromotionList(nowPageNum,limit) {
  return axios.get(API_PATH + 'events/pending/?page=' + nowPageNum + '&limit=' + limit)
}
export function setClosedPromotionList(nowPageNum, limit) {
  return axios.get(API_PATH + 'events/closed/?page=' + nowPageNum + '&limit=' + limit)
}
export function checkMyPromotion(token) {
  return axios.get(API_PATH + 'events/pending/my?page=1&limit=12', {
    headers: {
      "Authorization": "Bearer "+  token
    }
  });
}

export function setMyStore(token) {
  return axios.get(API_PATH + 'events/my/shops', {
    headers: {
      "Authorization": "Bearer "+  token
    }
  });
}

export function setSpecificPromotion(articleId, token) {
  return axios.get(API_PATH + 'events/' + articleId, {
    headers: {
      "Authorization": "Bearer " + token
    }
  });
}

export function registerPromotion(token, body){
  return axios.post(API_PATH + 'events', body , {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function removePromotion(articleId, token){
  return axios.delete(API_PATH + 'events/' + articleId, {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function adjustPromotion(articleId, token, body){
  return axios.put(API_PATH + 'events/' + articleId, body, {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function grantCheckPromotion (token, body){
  return axios.post(API_PATH + 'events/grant/check', body , {
    headers: {
      "Authorization": "Bearer " + token
    }
  })
}

export function adjustPromotionComment (articleId, id, token, body){
  return axios.put(API_PATH + 'events/' + articleId + '/comments/' + id, body , {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function removePromotionComment(articleId, id, token){
  return axios.delete(API_PATH + 'events/' + articleId + '/comments/' + id, {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function registerPromotionComment(articleId, token, body){
  return axios.post(API_PATH + 'events/' + articleId + '/comments', body, {
    headers: {
      "Authorization": "Bearer "+token
    }
  })
}

export function setRandomPendingPromotion(){
  return axios.get(API_PATH + 'events/pending/random')
}
