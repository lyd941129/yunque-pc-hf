<!-- 打印模板 -->
<template>
	<div ref="printSet" class="printSet" v-loading="loading">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="模板名称">
				<el-input v-model="formInline.name" placeholder="请输入模板名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button class="btn-wihte" type="primary" @click="onScreen">确认筛选</el-button>
			</el-form-item>
		</el-form>
		<el-row>
			<el-button type="primary" class="btn-blue" @click="printAdd">新增</el-button>
			<el-button type="primary" class="btn-blue" @click="printEdit">编辑</el-button>
			<el-button type="primary" class="btn-blue" @click="printDesign">设计</el-button>
			<el-button type="danger" class="btn-red" @click='printDele'>删除</el-button>
		</el-row>
		<div class="table-box">
			<el-table ref="multipleTable" :border='true' :data="tableData" tooltip-effect="dark" style="width: 100%"
			 :select-on-indeterminate='false' height="100%" @row-click="on_select">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column label="模板名称" prop="print_name" align="center"></el-table-column>
				<el-table-column label="模板描述" prop="describe" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column label="是否为默认模板" prop="print_default" align="center">
					<template slot-scope="scope">
						<div style="margin-left: 10px">{{ scope.row.print_default == '1' ? '是' : '否' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="是否启用" prop="installed" align="center">
					<template slot-scope="scope">
						<div style="margin-left: 10px">{{ scope.row.installed == '1' ? '是' : '否' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="最后修改时间" prop="update_time" align="center" show-overflow-tooltip>
					<template slot-scope="scope">
						<div style="margin-left: 10px">{{getLocalTime(scope.row.update_time)}}</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-pagination @current-change="handleCurrentChange" :current-page="currentPage" @size-change="sizeChange"
		:page-size="pageSize" layout="sizes, total, prev, pager, next, jumper" :total="total">
		</el-pagination>
		<!-- 弹框 -->
		<el-dialog :title="title" :visible.sync="centerDialogVisible" center width='530px' center>
			<el-form :model="form" :rules="rules" ref="form" label-width="135px">
				<el-form-item label="模板名称" prop="name">
					<el-input v-model="form.name" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="模板描述" prop="dec">
					<el-input v-model="form.dec" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否启用" prop="enable">
					<el-radio-group v-model="form.enable">
						<el-radio label="1">启用</el-radio>
						<el-radio label="0">停用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否默认模板" prop="default">
					<el-radio-group v-model="form.default">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="btn-dialog" @click="createAn('form')">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 打印设计弹框 -->
		<el-dialog title="打印设计" :modal="false" :visible.sync="centerDialogVisibleDesign" center :fullscreen="true" 
		class="dialog-design" v-loading="loadingDesign">
			<el-tabs v-model="activeName" type="card">
				<!-- 打印模板设计 -->
				<el-tab-pane label="打印模板" name="first">
					<div class="ueditor-box" ref="editor">
						<vue-ueditor-wrap v-model="msg" :config="config" @ready="ready"></vue-ueditor-wrap>
					</div>
					<div class="set-content-box">
						<div class="search-box">
							<el-input placeholder="请输入要搜索的内容" v-model="search" @input="searchInput" clearable>
								<i slot="prefix" class="el-input__icon el-icon-search"></i>
							</el-input>
						</div>
						<div class="set-content">
							<div class="set-content-div" v-for="item in fieldArr" :key="item.field_sign">
								<div @click="setText(item.field_name, false)">{{item.field_name}}</div>
								<div v-if="item.field_style != 'Caption'" @click="setText(item.field_sign, true)">{{item.field_name}}-值</div>
							</div>
							<div class="set-content-div">
								<div @click="setText('审批节点', false)">审批节点</div>
								<div @click="setText('approve', true)">审批节点-值</div>
							</div>
						</div>
					</div>
				</el-tab-pane>
				<!-- 模板明细表规则设计 -->
				<el-tab-pane label="明细表规则" name="second">
					<h5 class="tip">
						<i class="sign">*</i>配置需要显示的明细表字段，不配置则为空，将会显示整个明细表字段！
					</h5>
					<el-select v-model="statementValue" filterable placeholder="请选择" size="mini" @change="statementChange">
						<el-option v-for="item in statement" :key="item.field_sign" :label="item.field_name" :value="item.field_sign"></el-option>
					</el-select>
					<el-select v-model="tableHeaderValue" filterable placeholder="请选择" size="mini">
						<el-option v-for="item in tableHeader" :key="item.field_sign" :label="item.field_name" :value="item.field_sign"></el-option>
					</el-select>
					<el-button type="primary" size="mini" @click="addRule">确定</el-button>
					<div class="header-list" v-for="item in ruleList" :key="item.sign">
						<div class="title">
							<h3>{{item.name}}</h3>
							<i @click="deleRule(item.sign)" class="el-icon-delete-solid"></i>
						</div>
						<div class="content">
							<el-tag  @close="handleClose(item.sign, index)" v-for="(tag, index) in item.header" :key="tag.sign" closable :type="tag.sign"> {{tag.name}}</el-tag>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="printSave">保存设计</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import Network from '../../api/network.js';// 请求封装的方法
	export default {
		props: {
			adhibitionFun: {},
			itemData: {},
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
						trigger: 'change'
					}],
					default: [{
						required: true,
						message: '请选择是否默认模板',
						trigger: 'change'
					}]
				},
				formInline: {
					name: '',
				},
				tableData: [],
				search: '',
				editor: null,
				msg: '',
				height: 0,
				config: {
					UEDITOR_HOME_URL: '/ueditor/', // 需要令此处的URL等于对应 ueditor.config.js 中的配置。
					autoHeightEnabled: true,
					autoFloatEnabled: true,
					initialFrameWidth: '100%',
					initialFrameHeight: '100%',
				},
				loading: true,
				pageSize: 10,
				total: 0,
				page: 1,
				currentPage: 1,
				loadingDesign: false,
				fieldArr: [],
				invariant: [],
				activeName: 'first',
				statement: [],
				tableHeader: [],
				statementValue: '',
				tableHeaderValue: '',
				ruleList: {},
			}
		},
		created() {
			this.refreshApi(true);
		},
		components:{
		},
		methods: {
			refreshApi(type) {// 数据刷新
				var that = this;
				that.loading = true;
				let postObj = {
					uid: that.loginData.user_info.id,
					table_id: that.itemData.id,
					page: this.page,
					page_size: this.pageSize,
				}
				that.formInline.name != '' && (postObj.print_name = that.formInline.name);
				Network.post('/admin/template/list', postObj).then(datas => {
					if(type){
						that.$set(that, 'total', datas.data.total);
						that.$set(that, 'pageSize', datas.data.page_size);
					}
					that.$set(that, 'tableData', datas.data.list);
					that.loading = false;
				}).catch(msg => {
					that.$message.error(msg);
					that.loading = false;
				});
			},
			onScreen() {// 筛选确认
				this.page = 1;
				this.refreshApi();
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
				let selectData = this.getSelected();
				let that = this;
				if (selectData.length > 1) {
					that.$message.error('只能选择一项进行编辑！');
					return
				} else if (selectData.length == 0) {
					that.$message.error('请选择要编辑的选项！');
					return
				}
				that.loading = true;
				let postObj = {
					uid: that.loginData.user_info.id,
					id: selectData[0].id
				}
				Network.post('/admin/template/edit', postObj).then(data => {
					let obj = {
						name: data.data.print_name,
						dec: data.data.describe,
						enable: data.data.installed + '',
						default: data.data.print_default + '',
						id: data.data.id,
					};
					that.$set(that, 'form', obj);
					that.$set(that, 'title', '编辑打印模板');
					that.$set(that, 'centerDialogVisible', true);
					that.loading = false;
				}).catch(msg => {
					that.$message.error(msg);
					that.loading = false;
				});
			},
			createAn(formName){// 确认创建打印模板
				let that = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						that.loading = true;
						let objPost = {
							"id": '',//打印模板id
							"table_id": this.itemData.id,
							"print_name": this.form.name,
							"describe": this.form.dec,
							"print_default": this.form.default,
							"installed": this.form.enable, 
							"uid": that.loginData.user_info.id
						}
						if (this.form.id) {
							objPost.id = this.form.id;
						}
						Network.post('/admin/template/save', objPost).then(data => {
							that.$message({
								message: data.msg,
								type: 'success'
							});
							this.$set(this, 'centerDialogVisible', false);
							that.refreshApi();
						}).catch(msg => {
							that.$message.error(msg);
							that.loading = false;
						});
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			printDele(){// 删除打印模板
				let selectData = this.getSelected();
				let that = this;
				if (selectData.length == 0) {
					that.$message.error('请选择要删除的选项！');
					return
				}
				let arrId = [];
				selectData.map((item) => {
					arrId.push(item.id);
				});
				this.$confirm('确认删除选中的模板？').then(() => {
					that.loading = true;
					Network.post('/admin/template/del', {
						'uid': that.loginData.user_info.id,
						'id': arrId
					}).then(data => {
						that.$message({
							message: data.msg,
							type: 'success'
						});
						that.refreshApi();
					}).catch(msg => {
						that.$message.error(msg);
						that.loading = false;
					});
				}).catch(() => {});
			},
			on_select(val){// 表格点击行选中
				this.$refs.multipleTable.toggleRowSelection(val);
			},
			getSelected() {// 获取表格选中数据
				return this.$refs.multipleTable.selection;
			},
			printDesign(){// 打开打印模板设计
				let selectData = this.getSelected();
				let that = this;
				if (selectData.length > 1) {
					that.$message.error('只能选择一项进行设计！');
					return
				} else if (selectData.length == 0) {
					that.$message.error('请选择要设计的选项！');
					return
				}
				that.loadingDesign = true;
				let postObj = {
					uid: that.loginData.user_info.id,
					id: selectData[0].id,
					table_id: that.itemData.id,
				}
				Network.post('/admin/template/design', postObj).then(datas => {
					that.$set(that, 'centerDialogVisibleDesign', true);
					// console.log(datas)
					// that.editor.setContent('数据！！！！！！！');
					that.$set(that, 'msg', Array.isArray(datas.data.main) ? '' : datas.data.main);
					that.$set(that, 'fieldArr', datas.data.field);
					that.$set(that, 'invariant', datas.data.field);
					!Array.isArray(datas.data.rules) && that.$set(that, 'ruleList', datas.data.rules);
					let field_list = that.invariant.filter((s) => {
						return s.field_style === 'List';
					});
					that.$set(that, 'statement', field_list);
					that.loadingDesign = false;
				}).catch(msg => {
					that.$message.error(msg);
					that.loadingDesign = false;
				});
			},
			setText(val, type){// 设计右边点击为富文本赋值
				type ? (this.editor.execCommand('inserthtml', '{{printData.'+val+'}}'))
				: (this.editor.execCommand('inserthtml', val));
			},
			ready (editorInstance) {// 富文本初始化完成后，获取富文本实例
				// console.log(`编辑器实例${editorInstance.key}: `, editorInstance);
				this.$set(this, 'editor', editorInstance);
				this.editor.setHeight(this.$refs.editor.offsetHeight-106);
			},
			handleCurrentChange(val) {// 切换页
				this.page = val;
				this.refreshApi();
				// console.log(`当前页: ${val}`);
			},
			printSave(){// 保存打印设计 
				// console.log(this.editor.getContent())
				let selectData = this.getSelected();
				let that = this
				that.loadingDesign = true;
				let postObj = {
					uid: that.loginData.user_info.id,
					id: selectData[0].id,
					main: this.msg,
					rules: this.ruleList
				}
				// console.log(postObj);
				Network.post('/admin/template/designSave', postObj).then(data => {
					that.$message({
						message: data.msg,
						type: 'success'
					});
					this.$set(this, 'centerDialogVisibleDesign', false);
					that.loadingDesign = false;
				}).catch(msg => {
					that.$message.error(msg);
					that.loadingDesign = false;
				});
			},
			searchInput(){// 模板设计右边搜索
				let that = this;
				if(that.search.length){
					let arr = this.invariant.filter((s) => {
						return s.field_name.indexOf(that.search) != -1;
					});
					this.$set(this, 'fieldArr', arr);
				}else{
					this.$set(this, 'fieldArr', this.invariant);
				}
			},
			statementChange(val){// 明细规则选择
				let list = this.statement.filter((s) => {
					return s.field_sign == val;
				});
				list.length && this.$set(this, 'tableHeader', list[0].header);
				this.$set(this, 'tableHeaderValue', '');
			},
			addRule(){// 确定添加规则
				if(this.statementValue == ''){// 判断是否选择明细表
					this.$message({
						message: '请选择明细表！',
						type: 'warning'
					});
				}else if(this.tableHeaderValue == ''){// 判断是否选择明细表表头
					this.$message({
						message: '请选择明细表表头！',
						type: 'warning'
					});
				}else{// 添加规则
					let list = this.statement.filter((s) => {
						return s.field_sign == this.statementValue;
					});
					let listHeader = this.tableHeader.filter((s) => {
						return s.field_sign == this.tableHeaderValue;
					});
					if(this.ruleList[list[0].field_sign]){// 判断创建新规则还是在已有的规则中添加
						let isExist = this.ruleList[list[0].field_sign].header.filter((s) => {
							return s.sign == listHeader[0].field_sign;
						});
						isExist.length == 0 ? (this.ruleList[list[0].field_sign].header.push({// 判断是否重复添加了表头
							name: listHeader[0].field_name,
							sign: listHeader[0].field_sign,
						})) : (this.$message({
							message: '表头已添加！',
							type: 'warning'
						}));
					}else{
						this.$set(this.ruleList, this.statementValue, {
							name: list[0].field_name,
							sign: list[0].field_sign,
							header: [{
								name: listHeader[0].field_name,
								sign: listHeader[0].field_sign,
							}]
						})
					}
				}
			},
			deleRule(sign){// 删除规则
				this.$delete(this.ruleList, sign);
			},
			handleClose(sign, index){// 删除规则表头
				this.ruleList[sign].header.splice(index, 1);
			},
			sizeChange(val){
				this.$set(this, 'pageSize', val);
				this.refreshApi();
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
			height: calc(100% - 154px);
		}
		#editor{
			flex: 3;
		}
		.set-content-box{
			flex: 1;
			border: 1px solid #d4d4d4;
			margin-left: 10px;
			max-width: 280px;
			width: 280px;
			.set-content{
				padding: 0;
				width: 100%;
				max-height: calc(100% - 60px);
				display: flex;
				flex-wrap: wrap;
				overflow: auto;
				justify-content: center;
				.set-content-div{
					width:  100%;
					display: flex;
					align-items: center;
					justify-content: center;
					div{
						display: inline-block;
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
			}
			.search-box{
				margin: 10px;
			}
		}
		.ueditor-box{
			flex: 3;
		}
		.el-pagination{
			text-align: center;
			margin-top: 10px;
			.el-pagination__sizes{
				display: none;
			}
		}
		.tip{
			margin-top: 0;
			.sign{
				color: red;
				margin-right: 6px;
			}
		}
		.el-select{
			margin-right: 10px;
		}
		.header-list{
			border: 1px solid #DDDDDD;
			margin-top: 20px;
			.title{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 10px;
				border-bottom: 1px solid #DDDDDD;
				i:hover{
					cursor: pointer;
					color: #409EFF;
				}
			}
			.content{
				padding: 10px;
				.el-tag{
					margin: 0 10px 10px 0;
				}
				min-height: 100px;
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
			z-index: 2 !important;
			.el-dialog__body{
				.el-tabs{
					width: 100%;
					box-sizing: border-box;
				}
				display: flex;
				box-sizing: border-box;
				height: calc(100% - 114px);
				background-color: #DDDDDD;
				.el-tabs__content{
					height: calc(100% - 40px);
					width: 100%;
					box-sizing: border-box;
					.el-tab-pane:first-child{
						display: flex;
					}
				}
			}
		}
	}
</style>
