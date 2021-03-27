<template>
	<div id="app">
		<router-view />
	</div>
</template>

<script>
	export default {
		//注册draggable组件
		components: {
		},
		data() {
			return {

			};
		},
		methods: {

		},
	};
</script>

<style lang="less">
	html,body{
		height: 100%;
		margin: 0;
	}
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		height: 100%;
	}

	#nav {
		padding: 30px;

		a {
			font-weight: bold;
			color: #2c3e50;

			&.router-link-exact-active {
				color: #42b983;
			}
		}
	}

	/*被拖拽对象的样式*/
	.item {
		padding: 6px;
		background-color: #fdfdfd;
		border: solid 1px #eee;
		margin-bottom: 10px;
		cursor: move;
	}

	/*选中样式*/
	.chosen {
		border: solid 2px #3089dc !important;
	}
</style>
