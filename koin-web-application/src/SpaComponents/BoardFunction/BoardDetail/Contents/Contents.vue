<template>
  <div
    class="board-content"
    v-html="addMaxWidth(content)">
  </div>
</template>


<script>
  export default {
    name: 'Content',
    props: {
      content: {
        type: String,
        default: ""
      }
    },
    data() {
      return {}
    },
    methods: {
			// content(본문) 출력되는 이미지 크기 조절
			addMaxWidth: function (val) {
				return window.innerWidth > 576 ? val.replace(/<img/gi, "<img style='max-width: 796px' ") : val.replace(/<img/gi, "<img style='max-width: 100%' ")
			},
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

	.board-content {
		text-align: left;
		padding-left: 19px;
		padding-right: 19px;
		font-family: NanumBarunGothic, serif;
		font-size: 15px;
		font-weight: 300;
		font-style: normal;
		font-stretch: normal;
		line-height: 1.73;
		letter-spacing: -0.8px;
		color: #555555;
		height: 100%;
		min-height: 230px;
		overflow: scroll;
		-ms-overflow-style: none;
		user-select: text;
		padding-top: 15px;
	}

	.board-content::-webkit-scrollbar {
		display: none;
	}

	@media (max-width: 576px) {
		.board-content {
			padding-top: 20px;
			padding-bottom: 20px;
			font-size: 14px;
			font-weight: normal;
			line-height: 1.71;
			letter-spacing: -0.7px;
			color: #252525;
			min-height: 500px;
		}
	}
</style>
