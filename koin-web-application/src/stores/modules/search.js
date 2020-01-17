import * as api from '../../api/api';

const defaultState = {
    searchBarFlag: false,
    searchResult: [],
    searchWord: '',

    // pagination
    PAGE_MAX_SIZE: 5,
    nowResultPageNum: 1,
    totalResultPageNum: 0,
    totalDisplayResultPageNum: 5,
    totalDisplayResultMinNum: 1,

    recentSearchWords: []
}

const actions = {
    toggleSearchBarAction(context, payload) {
        context.commit("toggleSearchBar", payload);
    },
    searchArticle(context, payload) {
        const { page, searchType, searchWord } = payload;
        const state = context.state;
        return new Promise((resolve, reject) => {
            api.searchArticle(page, searchType, encodeURIComponent(searchWord)).then(res => {
                console.log(res);
                if (res.status === 200) {
                    context.commit("updateSearchResult", res.data.articles);
                    context.commit("updateNowPageNum", page);
                    context.commit("updateTotalDisplayPageNum", res.data.totalPage);

                    // 1,2,3
                    if (state.nowResultPageNum < (state.PAGE_MAX_SIZE / 2 + 1)) {
                        if (res.data.totalPage >= state.PAGE_MAX_SIZE)
                            state.totalDisplayResultPageNum = state.PAGE_MAX_SIZE;
                        context.commit("updateTotalDisplayMinNum", 1);
                    } else {
                        // 2,3,4,5,6
                        if (state.totalResultPageNum - page >= parseInt(state.PAGE_MAX_SIZE / 2)) {
                            context.commit("updateTotalDisplayMinNum", state.nowResultPageNum - parseInt(state.PAGE_MAX_SIZE / 2));
                            context.commit("updateTotalDisplayPageNum", state.nowResultPageNum + parseInt(state.PAGE_MAX_SIZE / 2));
                        } else {
                            // 3,4,5,6,7
                            context.commit("updateTotalDisplayMinNum", res.data.totalPage - state.PAGE_MAX_SIZE + 1);
                            context.commit("updateTotalDisplayPageNum", res.data.totalPage);
                        }
                    }
                    context.commit("updateTotalResultPageNum", res.data.totalPage);
                    context.commit("updateNowPageNum", page);

                    resolve(true);
                }
            }).catch(err => {
                reject(err);
            })
        })
    },

}

const mutations = {
    toggleSearchBar: (state, data) => {
        state.searchBarFlag = data;
    },
    updateSearchResult: (state, data) => {
        state.searchResult = data;
    },
    updateNowPageNum: (state, data) => {
        state.nowResultPageNum = data;
    },
    updateTotalDisplayPageNum: (state, data) => {
        state.totalDisplayResultPageNum = data;
    },
    updateTotalDisplayMinNum: (state, data) => {
        state.totalDisplayResultMinNum = data;
    },
    updateTotalResultPageNum: (state, data) => {
        state.totalResultPageNum = data;
    },
    updateRecentSearchWords: (state, data) => {
        const idx = state.recentSearchWords.indexOf(data);
        if (idx !== -1) {
            state.recentSearchWords.splice(idx, 1);
        }
        state.recentSearchWords.unshift(data);
    },
    setRecentSearchWords: (state, data) => {
        state.recentSearchWords = data;
    },
    removeSearchWord: (state, data) => {
        const idx = state.recentSearchWords.indexOf(data);
        state.recentSearchWords.splice(idx, 1);
    }
}

const getters = {
    searchBarFlag: state => state.searchBarFlag,
    searchResult: state => state.searchResult,
    nowResultPageNum: state => state.nowResultPageNum,
    totalDisplayResultPageNum: state => state.totalDisplayResultPageNum,
    totalDisplayResultMinNum: state => state.totalDisplayResultMinNum,
    totalResultPageNum: state => state.totalResultPageNum,
    recentSearchWords: state => state.recentSearchWords
}

export default {
    state: defaultState,
    getters,
    actions,
    mutations
}
