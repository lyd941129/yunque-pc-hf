<!-- 打印模板 -->
<template>
	<div ref="printSet" class="printSet">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="模板名称">
				<el-input v-model="formInline.name" placeholder="请输入模板名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button class="btn-wihte" type="primary" @click="onSubmit">确认筛选</el-button>
			</el-form-item>
		</el-form>
		<el-row>
			<el-button type="primary" class="btn-blue" @click="printAdd">新增</el-button>
			<el-button type="primary" class="btn-blue" @click="printEdit">编辑</el-button>
			<el-button type="primary" class="btn-blue" @click="printDesign">设计</el-button>
			<el-button type="danger" class="btn-red">删除</el-button>
		</el-row>
		<div class="table-box">
			<el-table ref="multipleTable" :border='true' :data="tableData" tooltip-effect="dark" style="width: 100%"
			 :select-on-indeterminate='false' height="100%" @row-click="on_select">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column label="表单名称" prop="name" align="center"></el-table-column>
				<el-table-column label="表单标识" prop="sign" align="center"></el-table-column>
				<el-table-column label="生成单据前缀" prop="prefix" align="center"></el-table-column>
				<el-table-column label="描述" prop="dsc" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="是否启用" prop="enable" align="center"></el-table-column>
				<el-table-column label="最后修改人" prop="people" align="center"></el-table-column>
				<el-table-column label="最后修改时间" prop="time" align="center" show-overflow-tooltip></el-table-column>
			</el-table>
		</div>
		<!-- 弹框 -->
		<el-dialog :title="title" :visible.sync="centerDialogVisible" center width='530px' center>
			<el-form :model="form" :rules="rules" ref="form" label-width="110px">
				<el-form-item label="模板名称" prop="name">
					<el-input v-model="form.name" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="模板描述" prop="dec">
					<el-input v-model="form.dec" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否启用" prop="enable">
					<el-radio-group v-model="form.enable">
						<el-radio label="启用"></el-radio>
						<el-radio label="停用"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否默认模板" prop="default">
					<el-radio-group v-model="form.default">
						<el-radio label="是"></el-radio>
						<el-radio label="否"></el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="btn-dialog" @click="createAn('form')">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 打印设计弹框 -->
		<el-dialog title="打印设计" :visible.sync="centerDialogVisibleDesign" center :fullscreen="true" class="dialog-design" @opened="openDialog"
		@closed="closeDialog" ref="editor">
			<vue-ueditor-wrap v-model="msg" :config="config"></vue-ueditor-wrap>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props: {
			adhibitionFun: {},
		},
		data() {
			return {
				title: '新增打印模板',
				centerDialogVisible: false,
				centerDialogVisibleDesign: false,
				form: {
					name: '',
					dec: '',
					enable: '',
					default: '',
				},
				rules: {
					name: [{
						required: true,
						message: '请输入模板名称',
						trigger: 'blur'
					}],
					dec: [{
						required: true,
						message: '请输入模板描述',
						trigger: 'blur'
					}],
					enable: [{
						required: true,
						message: '请选择是否启用',
						trigger: 'blur'
					}],
					default: [{
						required: true,
						message: '请选择是否默认模板',
						trigger: 'blur'
					}]
				},
				formInline: {
					name: '',
				},
				tableData: [{
					name: '项目报销表单1',
					sign: 'xmbx1',
					prefix: 'XMBX',
					dsc: '适合装饰行业',
					enable: '是',
					people: '管理员',
					time: '2020-12-15 13:20',
				}],
				search: '',
				editor: null,
				msg: '',
				height: 0,
				config: {
					UEDITOR_HOME_URL: '/ueditor/', // 需要令此处的URL等于对应 ueditor.config.js 中的配置。
					initialFrameHeight: this.height,
				},
			}
		},
		components:{
		},
		methods: {
			onSubmit() {

			},
			printAdd(){// 打开新增打印模板
				let obj = {
					name: '',
					dec: '',
					enable: '',
					default: '',
				};
				this.$set(this, 'title', '新增打印模板');
				this.$set(this, 'centerDialogVisible', true);
				this.$set(this, 'form', obj);
			},
			printEdit(){// 打开编辑打印模板
				let obj = {
					name: '测试模板',
					dec: '用来测试的模板',
					enable: '停用',
					default: '否',
				};
				this.$set(this, 'title', '编辑打印模板');
				this.$set(this, 'centerDialogVisible', true);
				this.$set(this, 'form', obj);
				this.getSelected();
			},
			createAn(formName){// 确认创建打印模板
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$set(this, 'centerDialogVisible', false);
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			on_select(val){// 表格点击行选中
				this.$refs.multipleTable.toggleRowSelection(val);
			},
			getSelected() {// 获取表格选中数据
				// console.info(this.$refs.multipleTable.selection);
			},
			printDesign(){
				this.$set(this, 'centerDialogVisibleDesign', true);
			},
			openDialog(){
				// 设置编辑区域高度为 500px
				this.$set(this, 'height', document.getElementsByClassName('el-dialog__body')[0].clientHeight)
				// this.$refs.editor.offsetHeight-42;
			},
			closeDialog(){
				// 销毁编辑器
				
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.printSet {
		text-align: left;
		height: 100%;
		.el-row{
			margin-bottom: 20px;
			.btn-blue{
				background-color: rgba(105, 158, 236, 1);
				&:hover{
					opacity: 0.5;
				}
			}
			.btn-red{
				background-color: white;
				color: rgba(245, 34, 45, 1);
				&:hover{
					opacity: 0.5;
				}
			}
		}
		.btn-wihte {
			background-color: white;
			color: rgba(24, 144, 255, 1);

			&:hover {
				opacity: 0.5;
			}
		}
		.table-box {
			height: calc(100% - 122px);
		}
		#editor{
			flex: 3;
		}
		.set-content-box{
			flex: 1;
			border: 1px solid #d4d4d4;
			margin-left: 10px;
			max-width: 280px;
			ul{
				padding: 0;
				width: 100%;
				max-height: 100%;
				display: flex;
				flex-wrap: wrap;
				overflow: auto;
				justify-content: center;
				li{
					margin: 5px;
					width: 120px;
					background-color: #f0f0f0;
					color: #666;
					font-size: 12px;
					height: 30px;
					text-align: center;
					line-height: 30px;
					border-radius: 3px;
					cursor: pointer;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					transition: all 0.3s;
					&:hover{
						background-color: #d2d0d0;
					}
				}
			}
			.search-box{
				margin: 10px;
			}
		}
	}
</style>
<style lang="less">
	// @import "../../../static/css/general.less";
	.el-table--border {
		th {
			background-color: #e4e4e4;
		}
	}
	.printSet{
		.dialog-design{
			.el-dialog__body{
				display: flex;
				padding: 10px;
				box-sizing: border-box;
			}
		}
	}
</style>
