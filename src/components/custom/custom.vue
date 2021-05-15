<!-- 用于展示自定义表单 -->
<template>
	<div class="custom" style="width: 100%; height: 100%;display: flex;justify-content: center;">
		<iframe :src="src" style="width: 375px; height: 667px;"></iframe>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				src: 'http://localhost:8080/#/pages/custom/announcement?type=look'
			}
		}
	}
</script>

<style>
</style>
