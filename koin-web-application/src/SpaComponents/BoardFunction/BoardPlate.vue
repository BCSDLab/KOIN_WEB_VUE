<template>
  <div class="main">
    <!-- progress bar -->
    <vue-topprogress
      color="#f7941e"
      ref="topProgress">
    </vue-topprogress>

    <div class="container">
      <transition 
        name="slide" 
        mode="out-in">
        <router-view></router-view>
      </transition>
    </div>


    <div class="top">
      <v-board-rank></v-board-rank>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'BoardPlate',
    methods: {

    },
    data() {
			return {

			}
    },
    computed: {

    },
    created: function() {

    }
  }
</script>

<style scoped>
	.main {
		border-top: #f7941e 5px solid;
		width: 100%;
	}

	.container {
		margin-top: 61px;
		width: 1132px;
		margin-left: auto;
		margin-right: auto;
	}

	.top {
		width: 258px;
		float: left;
		text-align: left;
		margin-bottom: 20px
	}
	.slide-leave-active,
	.slide-enter-active {
		transition: 0.2s;
	}
	.slide-enter {
		transform: translate(1em, 0);
		opacity: 0;
	}
	.slide-leave-to {
		opacity: 0;
	}
	@media (max-width: 576px) {
		.main {
			border-top: none;
		}

		.container {
			width: 100%;
			margin-top: 0;
		}

		.top {
			display: none;
		}
	}
</style>
