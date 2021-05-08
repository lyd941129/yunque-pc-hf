<!-- 表单设置 -->
<template>
	<div ref="formset" class="formset" v-loading="loading">
		<el-form :inline="true" :model="formInline" class="demo-form-inline">
			<el-form-item label="表单名称">
				<el-input @keyup.enter.native="onScreen" v-model="formInline.name" placeholder="请输入表单名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="生成单据前缀">
				<el-input @keyup.enter.native="onScreen" v-model="formInline.sn_prefix" placeholder="请输入生成单据前缀" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button class="btn-wihte" type="primary" @click="onScreen">确认筛选</el-button>
			</el-form-item>
		</el-form>
		<el-row>
			<el-button type="primary" class="btn-blue" @click="formAdd">新增</el-button>
			<el-button type="primary" class="btn-blue" @click="formEdit">编辑</el-button>
			<el-button type="primary" class="btn-blue" @click="openDesign">表单设计</el-button>
			<el-button type="primary" class="btn-blue" @click="openFormJs">表单JS</el-button>
			<el-button type="primary" class="btn-blue" @click="openPrint">打印模板</el-button>
			<el-button type="primary" class="btn-blue" @click="openList">列表模板设置</el-button>
			<el-button type="primary" class="btn-blue" @click="openMsg">消息推送模板</el-button>
			<el-button type="danger" class="btn-red" @click="deleteTable">删除</el-button>
		</el-row>
		<div class="table-box">
			<el-table ref="multipleTable" :border='true' :data="tableData" tooltip-effect="dark" style="width: 100%"
			 :select-on-indeterminate='false' height="100%" @row-click="on_select">
				<el-table-column type="selection" width="55"></el-table-column>
				<el-table-column label="表单名称" prop="table_name" align="center"></el-table-column>
				<el-table-column label="生成单据前缀" prop="sn_prefix" align="center"></el-table-column>
				<el-table-column label="描述" prop="describe" align="center"></el-table-column>
				<el-table-column label="是否启用" align="center">
					<template slot-scope="scope">
						<div style="margin-left: 10px">{{ scope.row.installed == '1' ? '是' : '否' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="是否默认" align="center">
					<template slot-scope="scope">
						<div style="margin-left: 10px">{{ scope.row.is_default == '1' ? '是' : '否' }}</div>
					</template>
				</el-table-column>
				<!-- <el-table-column label="最后修改人" prop="people" align="center"></el-table-column> -->
				<el-table-column label="最后修改时间" align="center">
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
		<el-dialog :title="title" :visible.sync="centerDialogVisible" center width='530px'>
			<el-form :model="form" :rules="rules" ref="form" label-width="110px">
				<el-form-item label="表单名称" prop="name">
					<el-input v-model="form.name" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="生成单据前缀" prop="prefix">
					<el-input v-model="form.prefix" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="是否启用" prop="enable">
					<el-radio-group v-model="form.enable">
						<el-radio label="1">启用</el-radio>
						<el-radio label="0">停用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否默认" prop="is_default">
					<el-radio-group v-model="form.is_default">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="描述">
					<el-input type="textarea" :rows="6" v-model="form.introduce"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="btn-dialog" @click="createAn('form')">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="表单设计" :visible.sync="centerDialogVisibleDesign" center :fullscreen="true" class="dialog-design">
			<formDesign v-if="centerDialogVisibleDesign" :formDesignData.sync="formDesignData" :centerDialogVisibleDesign.sync="centerDialogVisibleDesign" :app_id="itemData.id" :formId="formId" :formNamedes="formNamedes"></formDesign>
		</el-dialog>
		<!-- 表单js设计弹框 -->
		<el-dialog title="表单JS-设计" :modal="false" :visible.sync="centerDialogVisibleJsDesign" center :fullscreen="true" 
		class="dialog-design-js" v-loading="loadingJs">
			<div class="ueditor-box" ref="editor">
				<vue-ueditor-wrap v-model="matterJs" :config="configJs" @ready="ready"></vue-ueditor-wrap>
			</div>
			<div class="set-content-box">
				<div class="search-box">
					<el-input placeholder="请输入要搜索的内容" v-model="search" @input="searchInput" clearable>
						<i slot="prefix" class="el-input__icon el-icon-search"></i>
					</el-input>
				</div>
				<div class="set-content">
					<div class="set-content-div" v-for="item in fieldArr" :key="item.field_sign">
						<div :title="item.field_name" @click="setText(item.field_sign)">{{item.field_name}}</div>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="foemJsSave">保存</el-button>
			</span>
		</el-dialog>
		<!-- 列表设置弹框 -->
		<el-dialog title="表单列表-设计" :modal="false" :visible.sync="centerDialogVisiblelist" center :fullscreen="true" 
		class="dialog-design-js" v-loading="loadingList" :destroy-on-close="true">
			<msgTemplate key="search" :selectData="fieldSelect" :list_type="list_type" :templateData.sync="templateData" :searchData="searchData" 
			searchJudge="yes"></msgTemplate>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="foemListSave">保存</el-button>
			</span>
		</el-dialog>
		<!-- 消息模板设置弹框 -->
		<el-dialog title="消息推送模板-设计" :modal="false" :visible.sync="centerDialogVisiblemsg" center :fullscreen="true" 
		class="dialog-design-js" v-loading="loadingList" :destroy-on-close="true">
			<msgTemplate key="msg" :selectData="fieldSelect" :list_type="list_type" :templateData.sync="templateData" :searchData="searchData" 
			searchJudge="no"></msgTemplate>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="foemMsgSave">保存</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import Network from '../../api/network.js';// 引用请求的方法
	import formDesign from '../FormSet/formDesign.vue';// 表单设计组件
	import msgTemplate from './msgTemplate.vue';// 列表设置组件
	// import componentData from '../../../static/js/componentData.js';
	export default {
		created() {
			this.refreshApi(true);// 进入页面进行数据请求
		},
		props: {
			adhibitionFun: {},// 主页添加页签方法
			itemData: {},// 该页签需要的数据
			editableTabs: {},
			editableTabsValue: {},
		},
		components: {
			formDesign,
			msgTemplate,
		},
		data() {
			return {
				loading: true,
				loadingJs: false,
				loadingList: false,
				title: '新增表单',
				centerDialogVisible: false,
				centerDialogVisibleDesign: false,
				centerDialogVisibleJsDesign: false,
				centerDialogVisiblelist: false,
				centerDialogVisiblemsg: false,
				form: {
					name: '',
					prefix: '',
					// rank: '',
					enable: '',
					introduce: '',
					is_default: '',
				},
				rules: {
					name: [{
						required: true,
						message: '请输入表单名称',
						trigger: 'blur'
					}],
					prefix: [{
						required: true,
						message: '请输入表单生成单据前缀',
						trigger: 'blur'
					}],
					// rank: [{
					// 	required: true,
					// 	message: '请输入...',
					// 	trigger: 'blur'
					// }],
					enable: [{
						required: true,
						message: '请选择是否启用',
						trigger: 'change'
					}]
				},
				formInline: {
					name: '',
					sn_prefix: ''
				},
				tableData: [],
				currentPage: 1,
				pageSize: 10,
				total: 0,
				page: 1,
				formDesignData: [],
				formId: '',
				editorJs: null,
				matterJs: '',
				height: 0,
				configJs: {
					UEDITOR_HOME_URL: '/ueditor/', // 需要令此处的URL等于对应 ueditor.config.js 中的配置。
					autoHeightEnabled: true,
					autoFloatEnabled: true,
					initialFrameWidth: '100%',
					initialFrameHeight: '100%',
					toolbars: [['insertcode', 'cleardoc']],
				},
				search: '',
				fieldArr: [],
				invariant: [],
				formNamedes: '',
				templateData: '',
				fieldSelect: [],
				searchData: [],
				list_type: '',
				editId: '',
			}
		},
		methods: {
			refreshApi(type) {// 数据刷新
				var that = this;
				that.loading = true;
				let postObj = {
					uid: that.loginData.user_info.id,// 人员id
					app_id: this.itemData.id,// 页签id
					page: this.page,// 页数
					page_size: this.pageSize,// 每页显示条数
				}
				// 判断是否有搜索条件，有则需要加入请求数据之中
				that.formInline.name != '' && (postObj.table_name = that.formInline.name);
				that.formInline.sn_prefix != '' && (postObj.sn_prefix = that.formInline.sn_prefix);
				Network.post('/admin/form/list', postObj).then(data => {
					if(type){
						that.$set(that, 'pageSize', data.data.page_size);
						that.$set(that, 'total', data.data.total);
					}
					that.$set(that, 'tableData', data.data.list);
					if(data.code != 1){
						setTimeout(function(){
							if(that.editableTabs.length>1){// 如果请求失败则返回上个页签
								let deldata = that.editableTabs.pop();
								that.$emit('updata:editableTabs', deldata);
								that.$emit('update:editableTabsValue', '1');
							}
						}, 1000);
					}
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
			formAdd() { // 打开新增表单模态框
				let obj = {
					id: '',
					name: '',
					sign: '',
					prefix: '',
					// rank: '',
					enable: '',
					introduce: '',
					is_default: '',
				};
				this.$set(this, 'form', obj);
				this.$set(this, 'title', '新增表单');
				this.$set(this, 'centerDialogVisible', true);
			},
			formEdit() { // 打开编辑表单模态框
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
					app_id: this.itemData.id,
					id: selectData[0].id
				}
				that.formInline.name != '' && (postObj.table_name = that.formInline.name);
				that.formInline.sn_prefix != '' && (postObj.sn_prefix = that.formInline.sn_prefix);
				Network.post('/admin/form/edit', postObj).then(data => {
					let obj = {
						name: data.data.table_name,
						prefix: data.data.sn_prefix,
						// rank: '',
						enable: data.data.installed + '',
						is_default: data.data.is_default + '',
						introduce: data.data.describe,
						id: data.data.id,
					};
					that.$set(that, 'form', obj);
					that.$set(that, 'title', '编辑表单');
					that.$set(that, 'centerDialogVisible', true);
					that.loading = false;
				}).catch(msg => {
					that.$message.error(msg);
					that.loading = false;
				});
			},
			createAn(formName) { // 确认新建表单
				let that = this;
				this.$refs[formName].validate((valid) => {// 判断是否通过了表单验证
					if (valid) {
						that.loading = true;
						let objPost = {
							"app_id": this.itemData.id,
							"uid": that.loginData.user_info.id,
							"table_name": this.form.name,
							"table_tpl": '',
							"sn_prefix": this.form.prefix,
							"installed": this.form.enable,
							"is_default": this.form.is_default,
							"describe": this.form.introduce,
						}
						if (this.form.id) {
							objPost.id = this.form.id;
						}
						Network.post('/admin/form/save', objPost).then(data => {
							that.$message({
								message: data.msg,
								type: 'success'
							});
							that.refreshApi();
						}).catch(msg => {
							that.$message.error(msg);
							that.loading = false;
						});
						this.$set(this, 'centerDialogVisible', false);
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			openPrint() { // 打开打印模板页签
				let selectData = this.getSelected();
				let that = this;
				if (selectData.length > 1) {
					that.$message.error('只能选择一项！');
					return
				} else if (selectData.length == 0) {
					that.$message.error('请选择一项！');
					return
				}
				let obj = {
					app_name: '打印模板-'+selectData[0].table_name,
					type: 'printTemplate',
					id: selectData[0].id
				}
				this.adhibitionFun(obj, 'printTemplate');
			},
			openList(){// 打开列表设置
				let selectData = this.getSelected();
				let that = this;
				if (selectData.length > 1) {
					that.$message.error('只能选择一项！');
					return
				} else if (selectData.length == 0) {
					that.$message.error('请选择一项！');
					return
				}
				let objPost = {
					"app_id": this.itemData.id,
					"table_id": selectData[0].id
				}
				that.loading = true;
				Network.post('/admin/list/design', objPost).then(data => {
					that.loading = false;
					that.list_type = data.data.base.list_type;
					that.editId = data.data.base.id;
					if(Array.isArray(data.data.list) && !data.data.list.length){
						switch(that.list_type){
							case "list_text":
								that.templateData = {
									'table_id': data.data.base.table_id,
									'field_main': '',//主标题(主标题设置)
									'field_main_title': '',
									'field_main_show': '',
									'field_vice': '',//副标题（两列显示）
									'field_vice_title': '',
									'field_vice_show': '',
								}
								break;
							case "list_img":
								that.templateData = {
									'table_id': data.data.base.table_id,
									'field_main': '',//主标题(主标题设置)
									'field_main_title': '',
									'field_main_show': '',
									'field_content': '',//内容标题（一列显示）
									'field_content_title': '',
									'field_content_show': '',
									'field_vice': '',//副标题（两列显示）
									'field_vice_title': '',
									'field_vice_show': '',
									'field_url': [],// 图片配置
								}
								break;
							case "list_down":
								that.templateData = {
									'table_id': data.data.base.table_id,
									'field_main': '',//主标题(主标题设置)
									'field_main_title': '',
									'field_main_show': '',
									'field_content': '',//内容标题（一列显示）
									'field_content_title': '',
									'field_content_show': '',
									'field_vice': '',//副标题（两列显示）
									'field_vice_title': '',
									'field_vice_show': '',
									'field_url': '',// 附件配置
								}
								break;
							case "list_shop":
								that.templateData = {
									'table_id': data.data.base.table_id,
									'field_main': '',//主标题(主标题设置)
									'field_main_title': '',
									'field_main_show': '',
									'field_content': '',//内容标题（一列显示）
									'field_content_title': '',
									'field_content_show': '',
									'field_vice': '',//副标题（两列显示）
									'field_vice_title': '',
									'field_vice_show': '',
									'field_url': '',// 图片配置
								}
								break;
						}
					}else{
						switch(that.list_type){
							case "list_text":
								that.templateData = {
									'table_id': data.data.base.table_id,
									'field_main': data.data.list.field_main ? data.data.list.field_main : [],//主标题(主标题设置)
									'field_main_title': data.data.list.field_main_title ? data.data.list.field_main_title : '',
									'field_main_show': data.data.list.field_main_show ? data.data.list.field_main_show : '',
									'field_vice': data.data.list.field_vice ? data.data.list.field_vice : [],//副标题（两列显示）
									'field_vice_title': data.data.list.field_vice_title ? data.data.list.field_vice_title : '',
									'field_vice_show': data.data.list.field_vice_show ? data.data.list.field_vice_show : '',
								}
								break;
							case "list_img":
								that.templateData = {
									'table_id': data.data.base.table_id,
									'field_main': data.data.list.field_main ? data.data.list.field_main : [],//主标题(主标题设置)
									'field_main_title': data.data.list.field_main_title ? data.data.list.field_main_title : '',
									'field_main_show': data.data.list.field_main_show ? data.data.list.field_main_show : '',
									'field_content': data.data.list.field_content ? data.data.list.field_content : [],//内容标题（一列显示）
									'field_content_title': data.data.list.field_content_title ? data.data.list.field_content_title : '',
									'field_content_show': data.data.list.field_content_show ? data.data.list.field_content_show : '',
									'field_vice': data.data.list.field_vice ? data.data.list.field_vice : [],//副标题（两列显示）
									'field_vice_title': data.data.list.field_vice_title ? data.data.list.field_vice_title : '',
									'field_vice_show': data.data.list.field_vice_show ? data.data.list.field_vice_show : '',
									'field_url': data.data.list.field_url ? data.data.list.field_url : [],// 图片配置
								}
								break;
							case "list_down":
							case "list_shop":
								that.templateData = {
									'table_id': data.data.base.table_id,
									'field_main': data.data.list.field_main ? data.data.list.field_main : [],//主标题(主标题设置)
									'field_main_title': data.data.list.field_main_title ? data.data.list.field_main_title : '',
									'field_main_show': data.data.list.field_main_show ? data.data.list.field_main_show : '',
									'field_content': data.data.list.field_content ? data.data.list.field_content : [],//内容标题（一列显示）
									'field_content_title': data.data.list.field_content_title ? data.data.list.field_content_title : '',
									'field_content_show': data.data.list.field_content_show ? data.data.list.field_content_show : '',
									'field_vice': data.data.list.field_vice ? data.data.list.field_vice : [],//副标题（两列显示）
									'field_vice_title': data.data.list.field_vice_title ? data.data.list.field_vice_title : '',
									'field_vice_show': data.data.list.field_vice_show ? data.data.list.field_vice_show : '',
									'field_url': data.data.list.field_url ? data.data.list.field_url : '',// 图片配置
								}
								break;
						}
						// that.templateData = data.data.list;
					}
					that.fieldSelect = data.data.field;
					that.searchData = data.data.search;
					that.$nextTick(function(){
						that.centerDialogVisiblelist = true;
					})
				}).catch(msg => {
					that.$message.error(msg);
					that.loading = false;
				});
			},
			openMsg(){// 打开消息模板设置
				let selectData = this.getSelected();
				let that = this;
				if (selectData.length > 1) {
					that.$message.error('只能选择一项！');
					return
				} else if (selectData.length == 0) {
					that.$message.error('请选择一项！');
					return
				}
				let objPost = {
					"app_id": this.itemData.id,
					"table_id": selectData[0].id
				}
				that.loading = true;
				Network.post('/admin/list/template', objPost).then(data => {
					that.loading = false;
					that.editId = data.data.base.id;
					if(Array.isArray(data.data.template) && !data.data.template.length){
						that.templateData = {
							'table_id': data.data.base.table_id,
							'field_main': '',//主标题(主标题设置)
							'field_main_title': '',
							'field_main_show': '',
							'field_vice': '',//副标题（两列显示）
							'field_vice_title': '',
							'field_vice_show': '',
						}
					}else{
						// that.templateData = data.data.template;
						that.templateData = {
							'table_id': data.data.base.table_id,
							'field_main': data.data.template.field_main ? data.data.template.field_main : [],//主标题(主标题设置)
							'field_main_title': data.data.template.field_main_title ? data.data.template.field_main_title : '',
							'field_main_show': data.data.template.field_main_show ? data.data.template.field_main_show : '',
							'field_vice': data.data.template.field_vice ? data.data.template.field_vice : [],//副标题（两列显示）
							'field_vice_title': data.data.template.field_vice_title ? data.data.template.field_vice_title : '',
							'field_vice_show': data.data.template.field_vice_show ? data.data.template.field_vice_show : '',
						}
					}
					that.fieldSelect = data.data.field;
					that.centerDialogVisiblemsg = true;
					console.log(data);
				}).catch(msg => {
					that.$message.error(msg);
					that.loading = false;
				});
			},
			openFormJs(){// 打开表单js设计
				let selectData = this.getSelected();
				let that = this;
				if (selectData.length > 1) {
					that.$message.error('只能选择一项！');
					return
				} else if (selectData.length == 0) {
					that.$message.error('请选择一项！');
					return
				}
				that.loadingJs = true;
				let postObj = {
					uid: that.loginData.user_info.id,
					table_id: selectData[0].id
				}
				Network.post('/admin/js/design', postObj).then(data => {
					that.$set(that, 'centerDialogVisibleJsDesign', true);
					let str = data.data.js ? data.data.js : '';
					that.$set(that, 'matterJs', str);
					that.$set(that, 'fieldArr', []);
					that.$set(that, 'invariant', []);
					// 处理右边字段渲染数据
					data.data.field.length && data.data.field.map((item) => {
						if(item.header){
							item.header.map((e) => {
								that.fieldArr.push({
									field_name: item.field_name+'-'+e.field_name,
									field_sign: e.field_sign,
									field_style: e.field_style,
								});
								that.invariant.push({
									field_name: item.field_name+'-'+e.field_name,
									field_sign: e.field_sign,
									field_style: e.field_style,
								})
							});
						}else{
							that.fieldArr.push(item);
							that.invariant.push(item);
						}
					});
					// that.$set(that, 'fieldArr', data.data.field);
					// that.$set(that, 'invariant', data.data.field);
					// console.log(data)
					that.loadingJs = false;
				}).catch(msg => {
					that.$message.error(msg);
					that.loadingJs = false;
				});
			},
			foemJsSave(){// 表单js设计保存
				// console.log(this.editorJs.getContentTxt());
				let that = this;
				let selectData = this.getSelected();
				that.loadingJs = true;
				let objPost = {
					uid: that.loginData.user_info.id,
					table_id: selectData[0].id,
					js_content: this.editorJs.getContentTxt()
				}
				Network.post('/admin/js/designSave', objPost).then(data => {
					that.$message({
						message: data.msg,
						type: 'success'
					});
					that.loadingJs = false;
					this.$set(this, 'centerDialogVisibleJsDesign', false);
				}).catch(msg => {
					that.$message.error(msg);
					that.loadingJs = false;
				});
			},
			foemListSave(){// 表单列表设置保存
				let that = this;
				that.loadingList = true;
				let objPost = {
					'id': that.editId,
					"app_id": that.itemData.id,
					"table_id": that.templateData.table_id,
					"list": that.templateData,
					"search": that.searchData,
				}
				console.log(objPost);
				Network.post('/admin/list/save', objPost).then(data => {
					that.$message({
						message: data.msg,
						type: 'success'
					});
					that.loadingList = false;
					this.$set(this, 'centerDialogVisiblelist', false);
				}).catch(msg => {
					that.$message.error(msg);
					that.loadingList = false;
				});
			},
			foemMsgSave(){// 消息模板设置保存
				let that = this;
				that.loadingList = true;
				let objPost = {
					'id': that.editId,
					"app_id": that.itemData.id,
					"table_id": that.templateData.table_id,
					"template": that.templateData,
				}
				console.log(objPost);
				Network.post('/admin/list/templateSave', objPost).then(data => {
					that.$message({
						message: data.msg,
						type: 'success'
					});
					that.loadingList = false;
					this.$set(this, 'centerDialogVisiblemsg', false);
				}).catch(msg => {
					that.$message.error(msg);
					that.loadingList = false;
				});
			},
			on_select(val) { // 让表格点击行可以选中
				this.$refs.multipleTable.toggleRowSelection(val);
			},
			getSelected() { // 获取表格选中的数据
				return this.$refs.multipleTable.selection;
			},
			openDesign() { // 打开表单设计
				let selectData = this.getSelected();
				let that = this;
				if (selectData.length > 1) {
					that.$message.error('只能选择一项进行设计！');
					return
				} else if (selectData.length == 0) {
					that.$message.error('请选择要设计的选项！');
					return
				}
				that.centerDialogVisibleDesign = true;
				that.formId = selectData[0].id;
				that.formNamedes = selectData[0].table_name;
			},
			deleteTable() { // 删除表单
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
				this.$confirm('确认删除选中表单？').then(() => {
					that.loading = true;
					Network.post('/admin/form/del', {
						'uid': that.loginData.user_info.id,
						"id": that.itemData.id,
						'table_id': arrId
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
			handleCurrentChange(val) {// 切换页
				this.page = val;
				this.refreshApi();
				// console.log(`当前页: ${val}`);
			},
			ready (editorInstance) {// 富文本初始化完成后，获取富文本实例
				// console.log(`编辑器实例${editorInstance.key}: `, editorInstance);
				this.$set(this, 'editorJs', editorInstance);
				this.editorJs.setHeight(this.$refs.editor.offsetHeight-58);
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
			setText(val){// 为富文本附上组件的标识值
				this.editorJs.execCommand('inserthtml', val);
			},
			sizeChange(val){// 切换每页条数后需重新请求数据刷新页面
				this.$set(this, 'pageSize', val);
				this.refreshApi();
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.formset {
		text-align: left;
		height: 100%;

		.el-row {
			margin-bottom: 20px;

			.btn-blue {
				background-color: rgba(105, 158, 236, 1);

				&:hover {
					opacity: 0.5;
				}
			}

			.btn-red {
				background-color: white;
				color: rgba(245, 34, 45, 1);

				&:hover {
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
		.el-pagination{
			text-align: center;
			margin-top: 10px;
			.el-pagination__sizes{
				display: none;
			}
		}
		.ueditor-box{
			height: 100%;
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
				justify-content: space-between;
				.set-content-div{
					display: flex;
					align-items: center;
					justify-content: space-between;
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
	}
</style>
<style lang="less">
	.el-table--border {
		th {
			background-color: #e4e4e4;
		}
	}

	.dialog-design {
		.el-dialog__body {
			padding: 0;
			height: calc(100% - 44px);
			 -webkit-user-select: none;
			-moz-user-select: none;
			-o-user-select: none;
			user-select: none;
		}
	}
	.dialog-design-js{
		overflow: hidden;
		z-index: 2 !important;
		.el-dialog__body {
			padding: 0;
			height: calc(100% - 114px);
			display: flex;
		}
		.is-fullscreen{
			overflow: hidden;
		}
	}
</style>
