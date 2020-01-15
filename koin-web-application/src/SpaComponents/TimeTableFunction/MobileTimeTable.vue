<template>
    <div
        class="container"
        :style="{ 'background-color': selectMajorModalFlag ? 'rgba(0, 0, 0, 0.2)' : 'transparent'   }">
        <div
            class="mobile__write"
            @click="toggleSheet">
            <img src="https://static.koreatech.in/assets/img/mobile__create.png" alt="">
        </div>
        <mobile-time-table-image>
        </mobile-time-table-image>
        <mobile-sheet>
        </mobile-sheet>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import * as DB from '../../static/timeTableDB'
import MobileTimeTableImage from './Components/MobileTimeTableImage';
import MobileSheet from './Components/MobileSheet';
export default {
    name: 'MobiletimeTable',
    components: {
        'mobile-time-table-image': MobileTimeTableImage,
        'mobile-sheet': MobileSheet
    },
    computed: {
      ...mapGetters({
        totalTimeTable: 'totalTimeTable',
        myTimeTable: 'myTimeTable',
        myTimeTableGrade: 'myTimeTableGrade',
        sheetFlag: 'sheetFlag'
      })
    },
    data () {
        return {
            addSheetFlag: false,
            searchName: undefined,
            selectMajorModalFlag: false,
            nowMajor: '',
            majors: ["컴퓨터공학부", "기계공학부", "전기ㆍ전자ㆍ통신공학부", "에너지신소재화학공학부", "산업경영학부", "메카트로닉스공학부", "디자인ㆍ건축공학부", "교양학부", "HRD", "융합"],
            nowSubjectIndex: -1,
            myTimeTableFlag: false,
            selectedSubject: undefined,
            selectedSubjectId: -1
        }
    },
    methods: {
        toggleSheet () {
            if (this.sheetFlag) this.$store.commit("sheetFlagUpdate", false);
            else this.$store.commit("sheetFlagUpdate", true);
        },
        setSemester () {
            let date = new Date();
            if (date.getMonth() + 1 <= 6) {
              return `${date.getFullYear()}1`;
            } else if (date.getMonth() + 1 >= 7 && date.getMonth() + 1 <= 12) {
              return `${date.getFullYear()}2`;
            }
        },
        getMyTimetable: function() {
            this.$store.dispatch("getMyTimeTable", {
                token: this.$session.get("token"),
                semester: this.setSemester(),
                mobile: true
            })
        },
    },
    mounted() {
        console.log('mobile time table');
        if (window.innerWidth < 577) {
            this.$store.dispatch("initTimeTable");
            this.$store.dispatch("resetLayout");
            this.$store.dispatch("setTotalTimeTable", {
                timeTableData: DB.default,
                semester: this.setSemester()
            }).then((resolve, reject)=> {
                if(resolve) {
                    this.$store.dispatch("resetLayout");
                    this.loadingFlag=true;
                    if (this.$session.get("token") !== undefined) {
                        this.getMyTimetable();
                    } else if (this.$session.get("timetable") !== undefined) {
                        this.$store.dispatch("searchMyTimeTableInfo", {
                            subject: this.$session.get("timetable"),
                            mobile: true
                        })
                    }
                }
            })
        }
        
        this.$nextTick(() => {
            window.addEventListener('resize', () => {
                if (this.selectedSubject !== undefined) {
                    this.$store.dispatch("setSelectTimeTable", {
                        'subject': this.selectedSubject,
                        'mobile': true
                    })
                }
                if (window.innerWidth <= 577) {
                    this.$store.dispatch("resetLayout");
                    this.$store.dispatch("searchMyTimeTableInfo", {
                        'subject': this.myTimeTable,
                        'mobile': true
                    })
                }
                
            })
        })
    }
}
</script>

<style scoped>

@media (max-width: 360px) {
    .mobile__write {
        left: 312px;
    }
}

.mobile__write {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 24px;
    height: 24px;
    cursor: pointer;
}
</style>
