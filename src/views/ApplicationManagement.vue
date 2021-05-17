<!-- 应用管理页面 -->
<template>
	<div class="application">
		<el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
			<el-tab-pane v-for="(item, index) in editableTabs" :key="item.name" :label="item.title" :name="item.name">
				<component :ref="'applicat'+ index" :is="item.type" :key="item.type" :adhibitionFun="adhibitionFun" :csadhibitionFun="csadhibitionFun" :itemData="item" :editableTabs.sync="editableTabs" :editableTabsValue.sync="editableTabsValue"></component>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import management from '../components/ApplicationManagement/management.vue';
	import formSet from '../components/ApplicationManagement/formSet.vue';
	import printTemplate from '../components/ApplicationManagement/printTemplate.vue';
	import custom from '../components/custom/custom.vue';
	export default {
		components: {
			management,
			formSet,
			printTemplate,
			custom,
		},
		data() {
			return {
				editableTabsValue: '1',
				editableTabs: [{
					title: '应用管理',
					name: '1',
					type: 'management'
				}, ],
				addNum: '2',
			}
		},
		methods: {
			csadhibitionFun(){// 测试
				let that = this;
				that.editableTabs.push({
					title: '公告',
					name: 'gg',
					type: 'custom',
					id: 'customgg',
					lengthNum: that.editableTabs.length
				});
				that.editableTabsValue = 'gg';
			},
			adhibitionFun(objData, type) {// 添加新的页签
				let that = this;
				let obj = that.editableTabs.filter(function(s) {
					return objData.id == s.id;
				});
				if (obj.length > 0) {
					that.editableTabsValue = obj[0].name + '';
					return
				}
				that.editableTabs.push({
					title: objData.app_name,
					name: that.addNum + '',
					type: objData.custom_status ? 'custom' : type,
					id: objData.id,
					lengthNum: that.editableTabs.length,
					custom_url: objData.custom_url ? objData.custom_url : '',
				});
				that.editableTabsValue = that.addNum + '';
				that.addNum = ++that.addNum;
			},
			removeTab(targetName) {// 移除页签
				let tabs = this.editableTabs;
				let activeName = this.editableTabsValue;
				if (targetName == 1) {
					return
				}
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
								activeName = nextTab.name;
							}
						}
					});
				}
				this.editableTabsValue = activeName;
				this.editableTabs = tabs.filter(tab => tab.name !== targetName);
			},
		}
	}
</script>

<style lang="less">
	.application{
		height: 100%;
		.el-tabs {
			height: 100%;
		
			.el-tabs__header {
				border: 0 !important;
				margin: 0;
		
				.el-tabs__nav {
					border: 0 !important;
		
					.el-tabs__item {
						background: rgba(64, 169, 255, 1) !important;
						border: 0 !important;
						border-radius: 7px 7px 0 0;
						color: white;
		
						&.is-active {
							background: white !important;
							color: rgba(51, 51, 51, 1);
						}
					}
				}
			}
		
			.el-tabs__content {
				height: calc(100% - 80px);
				background: white;
				padding: 20px;
		
				.el-tab-pane {
					height: 100%;
		
					.enterprise-box-index {
						overflow: auto !important;
		
						.surface {
							border: 1px solid rgba(240, 240, 240, 1);
							border-radius: 4px;
							display: flex;
							padding: 20px 0;
		
							.surface-box {
								display: flex;
								flex-direction: column;
								margin-left: 20px;
								justify-content: center;
								align-items: center;
								min-width: 100px;
		
								span {
									margin-top: 10px;
								}
							}
						}
		
						.adhibition {
							display: flex;
							flex-wrap: wrap;
							.adhibition-box {
								display: flex;
								padding: 10px;
								border: 1px solid #f2f2f2;
								border-radius: 4px;
								margin-right: 20px;
								min-width: 200px;
								margin-bottom: 20px;
								cursor: pointer;
								align-items: center;
		
								span {
									margin-left: 20px;
								}
							}
						}
					}
		
					.enterprise-box {
						width: 100%;
						height: 100%;
						overflow: hidden;
						&::-webkit-scrollbar{
							width: 4px;
							height: 4px;
							background-color: #f8f8f8;
						}
						&::-webkit-scrollbar-thumb{
							border-radius: 16px;
							background-color: #e8e8e8;
						}
						.tac {
							width: 200px;
							display: inline-block;
							height: 100%;
							background: #F3F5F7;
							border: 1px solid #E9EBEB;
							margin-right: 20px;
		
							.el-col-12 {
								width: 100%;
		
								.el-menu {
									border: 0;
									background: #F3F5F7;
									height: 100%;
									padding: 10px 0;
		
									.el-menu-item {
										height: 40px;
										line-height: 40px;
		
										&.is-active {
											background-color: rgba(63, 169, 255, 1);
											color: white;
										}
									}
								}
							}
						}
		
						.enterprise-right {
							width: calc(100% - 220px);
							height: 100%;
							display: inline-block;
							overflow: auto;
		
							&.gry {
								background-color: #f5f5f7;
							}
						}
					}
		
				}
		
			}
		}
	}
</style>
