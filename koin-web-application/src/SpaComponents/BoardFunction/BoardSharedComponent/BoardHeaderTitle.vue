<template>
  <div
    class="board-name"
    @click="goFirstList()">
    {{ title }}
  </div>
</template>

<script>
  import BoardMixin from '../BoardMixins/boardMixin'

  export default {
    name: 'BoardHeaderTitle',
    mixins: [BoardMixin],
    props: {
      boardId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {}
    },
    computed: {
      title: function() {
        return this.boardIdList.find((boardInfo)=>{
          return boardInfo.boardId === this.boardId
        }).title;
      }
    },
    methods: {
      // 타이틀 클릭시 1page로 귀환
      goFirstList: function () {
        this.$session.set("nowBoardPageNum", 1);
        this.goUpperCategoryBoardList(this.$session.get("nowBoardId"));
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .board-name {
    float: left;
    font-family: NanumSquare, serif;
    font-size: 30px;
    font-weight: 800;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: -1.5px;
    margin-bottom: 20px;
    color: #175c8e;
    cursor: pointer;
  }

	@media (max-width: 576px) {
	}
</style>