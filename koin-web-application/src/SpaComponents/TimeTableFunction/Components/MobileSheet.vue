<template>
    <div
        class="mobile-sheet"
        >
        <div
            class="add-sheet"
            :class="{ 'show': sheetFlag === true}">
            <div class="sheet-head">
                <button
                    v-if="infoSheetFlag"
                    class="delete-text"
                    @click="deleteSubject(clickedSubject)">
                    삭제
                </button>
                <span
                    v-if="!infoSheetFlag"
                    class="sheet-title">
                    수업 추가
                </span>
                <span
                    v-if="infoSheetFlag"
                    class="sheet-title">
                    수업 상세
                </span>
                <!-- <button
                    v-if="infoSheetFlag"
                    class="update-text"
                    @click="updateSubject">
                    수정
                </button> -->
                <button
                    v-if="!infoSheetFlag"
                    class="complete-text"
                    @click="complete">
                    완료
                </button>
            </div>
            <div
                v-if="!infoSheetFlag"
                class="select-table">
                <button class="select-btn">
                    <img
                        @click="toggleMajorModal"
                        class="select-icon"
                        src="http://static.koreatech.in/assets/img/ic-select.png">
                </button>
                <div class="search-bar">
                    <input
                        @keyup="enter"
                        placeholder="수업명을 입력해주세요"
                        class="search"
                        v-model="searchName"
                        type="text">
                    <button
                        @click="searchTable"
                        class="search-btn">
                        <img
                            class="search-icon"
                            src="http://static.koreatech.in/assets/img/ic-search.png">
                    </button>
                </div>
            </div>
            <div class="detail-table">
                <div
                    v-if="infoSheetFlag"
                    class="info-card">
                    <div class="subject-name">
                        {{ clickedSubject.name }}
                    </div>
                    <div class="subject-info">
                        {{ clickedSubject.lecture_class}}분반 / {{ clickedSubject.department }} / {{ clickedSubject.target }}
                    </div>
                    <div class="subject-info">
                        {{ convertClassTime(clickedSubject.class_time) }} / {{ clickedSubject.professor === " " ? "미배정" : clickedSubject.professor }} / {{ clickedSubject.code }}
                    </div>
                    <div class="subject-memo">
                        {{ clickedSubject.memo }}
                    </div>
                </div>
                <div
                    v-if="!infoSheetFlag"
                    class="subject-list">
                    <div
                        class="subject-card"
                        v-for="(subject, idx) in totalTimeTable"
                        :key="idx"
                        :style="{ 'background-color': idx === nowSubjectIndex ? '#f6f6f6' : '#ffffff'}">
                        <div
                            class="subject"
                            @click="selectSubject(subject, idx)">
                            <div class="subject-name">
                                {{ subject.name}}
                            </div>
                            <div class="subject-info">
                                {{ subject.lecture_class}}분반 / {{ subject.department }} / {{ subject.target }}
                            </div>
                            <div class="subject-info">
                                {{ convertClassTime(subject.class_time) }} / {{ subject.professor === " " ? "미배정" : subject.professor }} / {{ subject.code }}
                            </div>
                        </div>
                        <button
                            v-if="!isMySubject(subject)"
                            @click="addSubject(subject, idx)"
                            class="add-btn">
                            <img
                                class="add-icon"
                                src="http://static.koreatech.in/assets/img/ic-add.png">
                        </button>
                        <button
                            v-if="isMySubject(subject)"
                            @click="deleteSubject(subject)"
                            class="delete-btn">
                            <img
                                class="delete-icon"
                                src="http://static.koreatech.in/assets/img/ic-delete.png">
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-if="selectMajorModalFlag"
            class="modal-bg">
            <div
                v-if="selectMajorModalFlag"
                class="major-modal">
                <div class="modal-title">전공 선택</div>
                <div class="modal-body">
                    <button
                        class="major-btn"
                        :class="{ 'selected': nowMajor === major }"
                        v-for="(major, idx) in majors"
                        :key="idx"
                        @click="selectMajor(major)">  
                        {{ major }}
                    </button>
                </div>
                <button
                    class="complete-btn"
                    @click="toggleMajorModal">
                    완료
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
    name: 'MobileSheet',
    props: {
    },
    computed: {
        ...mapGetters({
            totalTimeTable: 'totalTimeTable',
            myTimeTable: 'myTimeTable',
            infoSheetFlag: 'infoSheetFlag',
            clickedSubject: 'clickedSubject',
            sheetFlag: 'sheetFlag'
        }),
    },
    data () {
        return {
            searchName: '',
            selectMajorModalFlag: false,
            nowMajor: '',
            majors: ["컴퓨터공학부", "기계공학부", "전기ㆍ전자ㆍ통신공학부", "에너지신소재화학공학부", "산업경영학부", "메카트로닉스공학부", "디자인ㆍ건축공학부", "교양학부", "HRD", "융합"],
            days: ["월", "화", "수", "목", "금"],
            timeAlias: ["01A", "01B", "02A", "02B", "03A", "03B", "04A", "04B", "05A", "05B", "06A", "06B", "07A", "07B", "08A", "08B", "09A", "09B", "10A", "10B", "11A", "11B"],
            nowSubjectIndex: -1,
            myTimeTableFlag: false,
            selectedSubject: undefined,
            updatedData: this.myTimeTable,
        }
    },
    methods: {
        enter: function (e) {
            if (e.keyCode === 13) this.searchTable();
        },
        toggleMajorModal () {
            this.selectMajorModalFlag = !this.selectMajorModalFlag;
            console.log(this.selectMajorModalFlag);
        },
        setSemester () {
            let date = new Date();
            if (date.getMonth() + 1 <= 6) {
              return `${date.getFullYear()}1`;
            } else if (date.getMonth() + 1 >= 7 && date.getMonth() + 1 <= 12) {
              return `${date.getFullYear()}2`;
            }
        },
        searchTable () {
            this.nowMajor = "전체";
            this.$store.dispatch("searchTimeTable", {
                'searchName': this.searchName,
                'semester': this.setSemester()
            })
        },
        selectMajor (major) {
            if (this.nowMajor === major) {
                this.nowMajor = "전체";
                this.$store.dispatch("selectMajor", {
                    'major': "전체",
                    'semester': this.setSemester()
                });
            } else {
                this.nowMajor = major;
                this.$store.dispatch("selectMajor", {
                    'major': major,
                    'semester': this.setSemester()
                });
            }
        },
        selectSubject (subject, index) {
            this.selectedSubject = subject;
            if (!this.myTimeTableFlag) {
                if (index === this.nowSubjectIndex) {
                    this.nowSubjectIndex = -1;
                    this.$store.dispatch("setSelectTimeTable", {
                        'subject': null,
                        'mobile': true
                    })
                } else {
                    this.nowSubjectIndex = index;
                    this.$store.dispatch("setSelectTimeTable", {
                        'subject': subject,
                        'mobile': true
                    })
                }
            }
        },
        addSubject (subject, index) {
            console.log('add subject');
            console.log(this.myTimeTable);
            this.nowSubjectIndex = -1;
            this.$store.dispatch("addMyTimeTable", {
                'token': this.$session.get("token"),
                'subject': subject,
                'semester': this.setSemester(),
                'mobile': true
            })
            if (this.$session.get("token") === undefined) {
                let expireTime = new Date();
                expireTime.setDate(expireTime.getDate() + 3);
                expireTime.setHours(expireTime.getHours() + 9)
                this.$session.set("timetable", this.myTimeTable);
                console.log("timetable session storage update");
            }
        },
        deleteSubject (subject) {
            console.log('delete subject');
            let index, id;
            for(let i = 0; i < this.myTimeTable.length; i++) {
                if (subject.name === this.myTimeTable[i].name &&
                    JSON.stringify(subject.class_time) == JSON.stringify(this.myTimeTable[i].class_time) &&
                    subject.lecture_class === this.myTimeTable[i].lecture_class) {
                    index = i;
                    id = this.myTimeTable[i].id;
                    break;
                }
            }
            console.log(index, id);
            if (this.infoSheetFlag) {
                if (!confirm("해당 수업을 삭제하시겠습니까?")) {
                    return ;
                }
            }
            this.$store.dispatch("removeMyTimeTable", {
                'token': this.$session.get('token'),
                'index': index,
                'id': id,
            })
            //this.$store.commit("sheetFlagUpdate", false);
            this.$store.commit("infoSheetFlagUpdate", false);
            if (this.$session.get("token") === undefined) {
                let expireTime = new Date();
                expireTime.setDate(expireTime.getDate() + 3);
                expireTime.setHours(expireTime.getHours() + 9)
                this.$session.set("timetable", this.myTimeTable);
            }
        },
        isMySubject (subject) {
            for(let i = 0; i < this.myTimeTable.length; i++) {
                if (subject.lecture_class === this.myTimeTable[i].lecture_class &&
                    subject.name === this.myTimeTable[i].name) {
                        return true;
                } else {
                    continue;
                }
            }
            return false;
        },
        updateSubject () {
            if (confirm("코인 모바일앱을 통해 사용 가능한 서비스입니다. 앱을 설치하시겠습니까?")) {
                window.open("https://play.google.com/store/apps/details?id=in.koreatech.koin", '_blank')
            }
        },
        convertClassTime(classTime) {
            if (classTime.length === 0) {
                return '미정';  
            }
            for (let i = 0; i < classTime.length - 1; i++) {
                if (this.days[parseInt(classTime[i] / 100)] !== this.days[parseInt(classTime[i+1] / 100)]) {
                    return `${this.days[parseInt(classTime[0] / 100)]} ${this.timeAlias[parseInt(classTime[0] % 100)]}~${this.timeAlias[parseInt(classTime[i] % 100)]}, ${this.days[parseInt(classTime[i+1] / 100)]} ${this.timeAlias[parseInt(classTime[i+1] % 100)]}~${this.timeAlias[parseInt(classTime[classTime.length - 1] % 100)]}`
                } else {
                    continue;
                }
            }
            return `${this.days[parseInt(classTime[0] / 100)]} ${this.timeAlias[parseInt(classTime[0] % 100)]}~${this.timeAlias[parseInt(classTime[classTime.length - 1] % 100)]}`;           
        },
        complete () {
            this.$store.commit("sheetFlagUpdate", false);
        }
       
    },
    mounted () {
        
    },
    updated () {
    }
}
</script>

<style scoped>
.mobile-sheet {
    width: 100%;
}
.add-sheet {
    height: 0px;
    width: 100%;
    background: #ffffff;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 16;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1);
    transition: all .3s;
}
.show {
    height: 310px;
}
.sheet-head {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    height: 48px;
    border-bottom: 1px solid #d2dae2;
}
.delete-text {
    background-color: #ffffff;
    border: none;
    font-size: 15px;
    font-weight: normal;
    line-height: 1.13;
    letter-spacing: normal;
    text-align: center;
    color: #f7941e;
    position: absolute;
    left: 17px;
    top: 14px;
    padding: 0;
    cursor: pointer;
}
.complete-text {
    background-color: #ffffff;
    border: none;
    font-size: 15px;
    font-weight: normal;
    line-height: 1.13;
    letter-spacing: normal;
    text-align: center;
    color: #252525;
    position: absolute;
    right: 17px;
    top: 14px;
    padding: 0;
    cursor: pointer;
}
.update-text {
    background-color: #ffffff;
    border: none;
    font-size: 15px;
    font-weight: normal;
    line-height: 1.13;
    letter-spacing: normal;
    text-align: center;
    color: #252525;
    position: absolute;
    right: 17px;
    top: 14px;
    padding: 0;
    cursor: pointer;
}
.sheet-title {
    font-size: 15px;
    font-weight: bold;
    line-height: 1.13;
    letter-spacing: normal;
    color: #175c8e;
}
.select-table {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    height: 48px;
    border-bottom: 1px solid #d2dae2;
    padding: 0 16px;
}
.select-btn {
    width: 24px;
    height: 24px;
    margin-right: 12px;
    cursor: pointer;
    background-color: transparent;
    border: none;
}
.search-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 8px;
    border: solid 1px #d2dae2;
    background-color: #ffffff;
    height: 36px;
    width: calc(100% - 70px);
}

.search {
    border: none;
    background-color: #ffffff;
    padding-left: 10px;
    font-family: NanumBarunGothic;
    font-size: 13px;
    font-weight: normal;
    line-height: 1.85;
    letter-spacing: normal;
    text-align: left;
    color: #252525;
    width: 100%;
}
.search::placeholder {
    font-size: 13px;
    font-weight: normal;
    line-height: 1.85;
    letter-spacing: normal;
    text-align: left;
    color: #d2dae2;
}
.search-btn {
    width: 24px;
    height: 24px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    padding: 0;
}
.search-icon {
    width: 24px;
    height: 24px;
}

.modal-bg {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 17;
    background-color: rgba(0, 0, 0, 0.2);
}
.major-modal {
    width: 300px;
    height: 303px;
    background-color: #ffffff;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    position: fixed;
    top: calc((100% - 300px) / 2);
    left: calc((100% - 300px) / 2);
    z-index: 30;
    padding: auto;
    transition: width 1s height 1s;
}

.modal-title {
    font-size: 15px;
    font-weight: normal;
    line-height: 1.13;
    letter-spacing: -0.6px;
    text-align: left;
    color: #252525;
    padding-left: 14px;
    padding-top: 16px;
}

.modal-body {
    padding: 16px 14px 0px 14px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.major-btn {
    background-color: #ffffff;
    width: 132px;
    height: 30px;
    border-radius: 20px;
    border: solid 1px #d2dae2;
    font-size: 12px;
    font-weight: normal;
    line-height: 2;
    letter-spacing: normal;
    text-align: center;
    color: #858585;
    margin-bottom: 11px;
    padding: 0;
    cursor: pointer;
}

.selected {
    color: #ffffff;
    font-weight: bold;
    background-color: #f7941e;
    border: solid 1px #f7941e;
}

.complete-btn {
    background-color: transparent;
    border: none;
    width: 58px;
    height: 36px;
    padding: 8px 16px;
    margin-top: 3px;
    margin-right: 14px;
    margin-bottom: 9px;
    float: right;
    font-size: 15px;
    font-weight: normal;
    line-height: 1.13;
    letter-spacing: -0.6px;
    text-align: center;
    color: #175c8e;
    cursor: pointer;
}
.detail-table {
    height: 214px;
    overflow: auto;
}
.info-card {
    padding-top: 14px;
    padding-left: 16px;
}
.subject-memo {
    padding-top: 20px;
}
.subject-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    border-bottom: solid 1px #d2dae2;
    height: 59px;
    padding: 10px 16px;
    cursor: pointer;
}
.subject {
    width: 100%;
}
.subject-name {
    font-size: 15px;
    font-weight: bold;
    line-height: 1.6;
    letter-spacing: normal;
    text-align: left;
    color: #252525;
    margin-bottom: 8px;
}

.subject-info {
    font-size: 13px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.46;
    letter-spacing: normal;
    text-align: left;
    color: #252525;
}

.add-btn, .delete-btn {
    background-color: transparent;
    width: 22px;
    height: 22px;
    padding: 0;
    border: none;
    cursor: pointer;
}
.add-icon, .delete-icon {
    width: 22px;
    height: 22px;
}

/* sheet slide */
.add-sheet > * {
    display: none;
}


.show .sheet-head, .show .select-table {
    display: flex;
}

.show .detail-table {
    display: block;
}
</style>
