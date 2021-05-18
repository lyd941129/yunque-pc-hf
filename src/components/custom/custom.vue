<!-- 用于展示自定义表单 -->
<template>
	<div class="custom" style="width: 100%; height: 100%;display: flex;justify-content: center;">
		<iframe v-if="src" :src="src" style="width: 375px; height: 667px;"></iframe>
	</div>
</template>

<script>
	export default {
		props:{
			itemData:{}
		},
		created() {
			this.src = `http://yqflow.taozizi.cn/custom/index.html#${this.itemData.custom_url}?type=look`;
			// this.src = `http://localhost:8080/#${this.itemData.custom_url}?type=look`;
		},
		data() {
			return {
				src: ''
			}
		}
	}
</script>

<style>
</style>
