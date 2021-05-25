<!-- 应用管理 -->
<template>
	<div class="enterprise-box enterprise-box-index" v-loading="loading">
		<div class="btn-box">
			<el-button type="primary" @click="addApp">创建应用</el-button>
		</div>
		<h6>已发布</h6>
		<div v-for="(item, index) in isEnabled" v-show="item.child.length > 0" :key="index">
			<h5>{{item.title}}</h5>
			<div class="adhibition">
				<div class="adhibition-box" v-for="(item_c, index_c) in item.child" :key="index_c" @mouseover="over('is', index_c, index)"
				 @mouseleave="leave('is', index_c, index)">
					<img class="icon-img" v-if="item_c.app_style" :src="allUrl+'/'+item_c.app_style">
					<i v-else class="icon" :class="item_c.icon_url"></i>
					<span>{{item_c.app_name}}</span>
					<div class="operation">
						<ul v-if="item_c.operation">
							<li @click="adhibitionFun(item_c, 'formSet')">进入</li>
							<li @click="seting(item_c.id)">设置</li>
							<li @click="stopApp(item_c.id)">停用</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<h6>未发布</h6>
		<div class="adhibition">
			<div class="adhibition-box" v-for="(item, index) in noEnabled" :key="index" @mouseover="over('no', index)"
			 @mouseleave="leave('no', index)">
				<img class="icon-img" v-if="item.app_style" :src="allUrl+'/'+item.app_style">
				<i v-else class="icon" :class="item.icon_url"></i>
				<span>{{item.app_name}}</span>
				<div class="operation">
					<ul v-if="item.operation">
						<li @click="adhibitionFun(item, 'formSet')">进入</li>
						<li @click="seting(item.id)">设置</li>
						<li @click="stopApp(item.id)">停用</li>
					</ul>
				</div>
			</div>
		</div>
		<!-- 弹框 -->
		<el-dialog :title="title" :visible.sync="centerDialogVisible" center width='80%' :destroy-on-close="true" top="10vh" @closed="closed">
			<el-dialog width="400px" title="选择图标" :visible.sync="innerVisible" append-to-body class="icon-dialog">
				<div class="icon-div" v-for="(item, index) in arrIcon" :key="index" :class="{'active': item == form.iconUrl}" @click="selectIcon(item)">
					<i class="icon" :class="item">
						<i v-show="item == form.iconUrl" class="el-icon-circle-check"></i>
					</i>
				</div>
				<span slot="footer" class="dialog-footer">
				    <el-button @click="innerVisible = false">关 闭</el-button>
				  </span>
			</el-dialog>
			<el-form :model="form" :rules="rules" ref="form" label-width="110px" v-loading="loading">
				<el-form-item label="图标类型" prop="iconType">
					<el-radio-group v-model="form.iconType">
						<el-radio label="1">自定义上传</el-radio>
						<el-radio label="0">系统图标</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-show="form.iconType == '1'" label="应用图标" prop="icon">
					<el-upload class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false" ref="upload" :on-change="handleAvatarSuccess"
					 :before-upload="beforeAvatarUpload" :http-request="imageChange">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						<div slot="tip" class="el-upload__tip">建议使用40*40,1M内的jpg、png图片</div>
					</el-upload>
				</el-form-item>
				<el-form-item v-show="form.iconType == '0'" label="应用图标" prop="iconUrl">
					<div class="icon-box">
						<i class="icon" :class="form.iconUrl"></i>
						<el-button size="mini" round @click="innerVisible = true">选择</el-button>
					</div>
					<el-input v-model="form.iconUrl" style="display: none;" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="应用名称" prop="name" style="width: 400px;">
					<el-input v-model="form.name" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="应用标识" prop="app_sign" style="width: 400px;">
					<el-input v-model="form.app_sign" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="应用分组" prop="grouping" style="width: 400px;">
					<el-select v-model="form.grouping" placeholder="请选择应用分组">
						<el-option v-for="item in options" :key="item.dict_value" :label="item.dict_label" :value="item.dict_value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="列表类型" prop="list_type" style="width: 400px;">
					<el-select v-model="form.list_type" placeholder="请选择应用分组">
						<el-option v-for="item in listtypes" :key="item.value" :label="item.lable" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item v-if="form.list_type == 'list_img'" label="回复功能" prop="reply_status">
					<el-radio-group v-model="form.reply_status">
						<el-radio label="1">开启</el-radio>
						<el-radio label="0">不开启</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="form.reply_status == '1' && form.list_type == 'list_img'" label="回复功能标题" prop="reply_title" style="width: 400px;">
					<el-input v-model="form.reply_title" autocomplete="off" placeholder="请输入回复功能标题" clearable></el-input>
				</el-form-item>
				<el-form-item label="是否发布" prop="scope">
					<el-radio-group v-model="form.scope">
						<el-radio label="1">发布</el-radio>
						<el-radio label="0">未发布</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="项目应用" prop="app_project">
					<el-radio-group v-model="form.app_project">
						<el-radio label="1">是</el-radio>
						<el-radio label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="应用自定义" prop="custom_status">
					<el-radio-group v-model="form.custom_status">
						<el-radio label="1">启用</el-radio>
						<el-radio label="0">未启用</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-show="form.custom_status == '1'" label="自定义路由" prop="custom_url" style="width: 400px;">
					<el-input v-model="form.custom_url" autocomplete="off" clearable></el-input>
				</el-form-item>
				<el-form-item label="应用简介" style="width: 400px;">
					<el-input type="textarea" :rows="2" v-model="form.introduce"></el-input>
				</el-form-item>
				<el-form-item label="应用详情">
					<div class="ueditor-box" ref="editor">
						<div id="div1"></div>
					</div>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" class="btn-dialog" @click="createAn('form')">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import Network from '../../api/network.js';// 请求的封装方法
	import E from 'wangeditor';
	export default {
		props: {
			adhibitionFun: {},// 打开新页签方法
			editableTabs: {},
			editableTabsValue: {},
		},
		data() {
			return {
				title: '创建应用',
				imageUrl: '',
				loading: true,
				isEnabled: [],
				noEnabled: [],
				centerDialogVisible: false,
				form: {
					iconUrl: 'icon-project',
					iconType: '0',
					name: '',
					grouping: '',
					list_type: '',
					scope: '',
					introduce: '',
					icon: '',
					id: '',
					app_project: '',
					app_sign: '',
					app_detail: '',
					custom_status: '',
					custom_url: '',
					reply_status: '',
					reply_title: '',
				},
				rules: {
					name: [{
						required: true,
						message: '请输入应用名称',
						trigger: 'blur'
					}],
					app_sign: [{
						required: true,
						message: '请输入应用标识',
						trigger: 'blur'
					}],
					grouping: [{
						required: true,
						message: '请选择应用分组',
						trigger: 'change'
					}],
					list_type: [{
						required: true,
						message: '请选择列表类型',
						trigger: 'change'
					}],
					scope: [{
						required: true,
						message: '请选择应用是否发布',
						trigger: 'change'
					}],
					app_project: [{
						required: true,
						message: '请选择是否项目应用',
						trigger: 'change'
					}],
					reply_title: [{
						required: true,
						message: '请输入回复功能标题',
						trigger: 'blur'
					}]
				},
				options: [{
					dict_label: "开工准备",
					dict_value: "1",
					is_default: "N",
				}],
				listtypes:[{
						value: 'list_text',
						lable: '文字列表',
					},
					{
						value: 'list_img',
						lable: '图文列表',
					},
					{
						value: 'list_down',
						lable: '文档列表',
					},
					{
						value: 'list_shop',
						lable: '商品展示列表',
					},
				],
				isSelectImg: false,
				innerVisible: false,
				arrIcon: [
					"icon-project",
					"icon-means",
					"icon-purchase",
					"icon-personnel",
					"icon-moneylist",
					"icon-construction",
					"icon-right",
					"icon-coin",
					"icon-q",
					"icon-architecture",
					"icon-time",
					"icon-notice",
					"icon-badge",
					"icon-maintain",
					"icon-register",
					"icon-pen",
					"icon-pass",
					"icon-stamp",
					"icon-tally",
					"icon-materials",
					"icon-menu",
					"icon-procurement",
					"icon-shopping",
					"icon-exchange",
					"icon-people",
					"icon-doctor",
					"icon-record",
					"icon-pack",
					"icon-nail",
					"icon-tag",
					"icon-pape",
					"icon-rw",
					"icon-calendar",
					"icon-timeplan",
					"icon-card",
					"icon-tower",
				],
				config: {
					UEDITOR_HOME_URL: '/ueditor/', // 需要令此处的URL等于对应 ueditor.config.js 中的配置。
					autoHeightEnabled: true,
					autoFloatEnabled: true,
					initialFrameWidth: '100%',
					initialFrameHeight: '100%',
				},
				msg: '',
				editor: null,
			}
		},
		mounted() {
			this.refreshApi();
		},
		methods: {
			refreshApi() { // 刷新应用
				var that = this;
				Network.post('/admin/application/app', {
					uid: that.loginData.user_info.id
				}).then(data => {
					that.$set(that, 'options', data.data.config.sys_app_group);
					that.isEnabled = [];
					data.data.config.sys_app_group.length && data.data.config.sys_app_group.map((item) => {
						let obj = {
							title: item.dict_label,
							child: []
						}
						data.data.app.enable.length && data.data.app.enable.map((app_item) => {
							if (app_item.app_group == item.dict_value) {
								obj.child.push(app_item);
							}
						});
						that.isEnabled.push(obj);
					});
					data.data.app.disable && that.$set(that, 'noEnabled', data.data.app.disable);
					that.loading = false;
				}).catch(msg => {
					that.$message.error(msg);
					that.loading = false;
				});
			},
			over(type, index_c, index) { // 应用滑入显示操作栏
				if (type === 'is') {
					this.$set(this.isEnabled[index].child[index_c], 'operation', true);
				} else {
					this.$set(this.noEnabled[index_c], 'operation', true);
				}
			},
			leave(type, index_c, index) { // 应用滑出隐藏操作栏
				if (type === 'is') {
					this.$set(this.isEnabled[index].child[index_c], 'operation', false);
				} else {
					this.$set(this.noEnabled[index_c], 'operation', false);
				}
			},
			createAn(formName) { // 点击确认创建或者编辑应用
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.isSelectImg ? (this.$refs.upload.submit()) : (this.imageChange({file: {}}));
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			handleAvatarSuccess(file) { // 上传图片选取触发
				let that = this;
				this.imageUrl = URL.createObjectURL(file.raw);
				that.$set(that.form, 'icon', this.imageUrl);
				this.isSelectImg = true;
			},
			beforeAvatarUpload(file) { // 上传文件前的限制
				const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png') ? true : false;
				const isLt2M = file.size / 1024 / 1024 < 1;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG或者PNG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 1MB!');
				}
				return isJPG && isLt2M;
			},
			addApp() { // 打开创建应用模态框
				let that = this;
				that.$set(that, 'title', '创建应用');
				that.$set(that, 'centerDialogVisible', true);
				this.isSelectImg = false;
				let obj = {
					iconUrl: 'icon-project',
					iconType: '0',
					name: '',
					grouping: '',
					list_type: '',
					scope: '',
					introduce: '',
					icon: '',
					id: '',
					app_project: '',
					app_sign: '',
					app_detail: '',
					custom_status: "",
					custom_url: "",
					reply_status: '',
					reply_title: '',
				}
				that.$set(that, 'form', obj);
				that.$set(that, 'imageUrl', '');
				that.createEditor();
			},
			seting(id) { // 打开编辑应用模态框
				let that = this;
				that.loading = true;
				Network.post('/admin/application/editApp', {
					uid: that.loginData.user_info.id,
					id: id
				}).then(data => {
					that.$set(that, 'title', '设置应用');
					that.$set(that, 'centerDialogVisible', true);
					that.isSelectImg = false;
					let obj = {
						iconUrl: data.data.icon_url ? data.data.icon_url : 'icon-project',
						iconType: data.data.app_style ? '1' : '0',
						name: data.data.app_name,
						app_sign: data.data.app_sign,
						grouping: data.data.app_group + "",
						list_type: data.data.list_type + "",
						scope: data.data.installed + "",
						introduce: data.data.describe,
						app_detail: data.data.app_detail,
						icon: data.data.app_style,
						id: id,
						app_project: data.data.app_project + "",
						custom_status: data.data.custom_status + "",
						custom_url: data.data.custom_url,
						reply_status: data.data.reply_status ? data.data.reply_status+"" : '0',
						reply_title: data.data.reply_title ? data.data.reply_title : '',
					}
					that.$set(that, 'form', obj);
					that.$set(that, 'imageUrl', that.allUrl+'/' + data.data.app_style);
					if(!data.data.app_style){
						that.$set(that, 'imageUrl', '');
					}
					that.createEditor(data.data.app_detail);
					that.loading = false;
				}).catch(msg => {
					that.$message.error(msg);
					that.loading = false;
				});
			},
			stopApp(id) { // 停运应用
				let that = this;
				this.$confirm('确认停用此应用？')
				.then(() => {
					that.loading = true;
					Network.post('/admin/application/stopApp', {
						uid: that.loginData.user_info.id,
						id: id
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
				})
				.catch(() => {});
			},
			imageChange(param) { // 自定义上传
				let that = this;
				let formData = new FormData();
				if(this.imageUrl){
					formData.append('files', param.file);
				}else{
					formData.append('files', '');
				}
				formData.append('uid', that.loginData.user_info.id);
				that.form.id && (formData.append('id', that.form.id));
				formData.append('app_name', that.form.name);
				formData.append('app_group', that.form.grouping);
				formData.append('list_type', that.form.list_type);
				formData.append('installed', that.form.scope);
				formData.append('describe', that.form.introduce);
				formData.append('app_detail', that.editor.txt.html());
				formData.append('app_project', that.form.app_project);
				formData.append('app_sign', that.form.app_sign);
				formData.append('icon_url', that.form.iconUrl);
				formData.append('custom_status', that.form.custom_status);
				that.form.custom_status == '1' && (formData.append('custom_url', that.form.custom_url));
				that.form.list_type == 'list_img' && (formData.append('reply_status', that.form.reply_status));
				(that.form.list_type == 'list_img' && that.form.reply_status == '1') && (formData.append('reply_title', that.form.reply_title));
				that.loading = true;
				// console.log(formData);
				// return
				Network.post('/admin/application/saveApp', formData).then(data => {
					that.$message({
						message: data.msg,
						type: 'success'
					});
					that.$set(this, 'centerDialogVisible', false);
					that.refreshApi();
				}).catch(msg => {
					that.$message.error(msg);
					that.loading = false;
				});
			},
			selectIcon(val){
				this.form.iconUrl = val;
			},
			ready (editorInstance) {// 富文本初始化完成后，获取富文本实例
				// console.log(`编辑器实例${editorInstance.key}: `, editorInstance);
				this.$set(this, 'editor', editorInstance);
				// this.editor.setHeight(this.$refs.editor.offsetHeight-106);
			},
			createEditor(html){
				let that = this;
				that.$nextTick(function(){
					that.editor = new E( document.getElementById('div1') );
					that.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
					    // resultFiles 是 input 中选中的文件列表
					    // insertImgFn 是获取图片 url 后，插入到编辑器的方法
						// console.log(resultFiles);
						let formData = new FormData();
						for (var i=0;i<resultFiles.length;i++){
							formData.append("file",resultFiles[i])
						}
						that.editor.config.uploadImgMaxLength = 1; // 一次最多上传 1 个图片
						Network.post('/admin/upload/file', formData).then(data => {
							// console.log(data);
							let str = 'http://yqadmin.taozizi.cn/'+data.data.url;
							console.log(str);
							insertImgFn(str);
							// let arr = [];
							// data.data.length && data.data.map((e) => {
							// 	arr.push(e.url);
							// });
							// insertImgFn(arr);
						}).catch(msg => {
							that.$message.error(msg);
							that.loading = false;
						});
					    // 上传图片，返回结果，将图片插入到编辑器中
						// insertImgFn(imgUrl)
					}
					that.editor.create();
					html && (that.editor.txt.html(html));
				})
			},
			closed(){
				this.editor.destroy();
				this.editor = null;
			},
			// 测试
			csseting(){
				
			},
			csstopApp(){
				
			},
		},
		watch:{
			'form.iconType':{
				handler (val) {
					if(val == '0'){
						this.imageUrl = '';
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	// @import "../../../static/css/general.less";

	.enterprise-box {
		.icon-box{
			display: flex;
			align-items: center;
			i{
				margin-right: 10px;
			}
		}
		.btn-dialog {
			width: 150px;
		}

		.el-select {
			width: 100%;
		}

		.avatar-uploader-icon {
			// width: 20px;
			// height: 20px;
			background-color: rgba(238, 240, 255, 1);
			padding: 8px;
			border-radius: 5px;
			display: flex;
			align-items: center;
			justify-content: center;

			&::before {
				color: rgba(157, 177, 254, 1);
				font-size: 24px;
			}
		}

		.avatar {
			width: 40px;
			height: 40px;
			border-radius: 5px;
		}

		.avatar-uploader {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.el-upload__tip {
			color: rgba(250, 173, 20, 1);
			margin: 0;
		}
	}

	.btn-box {
		text-align: left;
		padding-bottom: 10px;
		border-bottom: 1px solid #f2f2f2;

		.el-button--primary {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 80px;
			height: 30px;
		}
	}

	h5 {
		text-align: left
	}

	h6 {
		color: rgba(166, 166, 166, 1);
		text-align: left
	}

	.adhibition-box {
		position: relative;
		.icon-img{
			width: 40px;
			height: 40px;
		}
		.operation {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 50px;
			display: flex;
			justify-content: center;
			background-color: RGBA(250, 250, 250, 1);
			box-shadow: 0px 3px 5px gainsboro;
			z-index: 1;

			ul {
				padding: 0;

				li {
					padding: 10px 20px;
					transition: all 0.3s;
					color: rgba(103, 106, 109, 1);
					font-size: 14px;

					&:hover {
						// background-color: RGBA(240, 240, 240, 1);
						opacity: 0.25;
					}
				}
			}
		}
	}
</style>
<style lang="less">
	.el-form-item__content{
		z-index: 1;
	}
	.el-dialog__header {
		background: linear-gradient(90deg, #1890FF, #40A9FF);
		padding: 10px;

		.el-dialog__close,
		.el-dialog__title {
			color: rgba(255, 255, 255, 1);
		}
		.el-dialog__headerbtn{
			top: 15px;
		}
	}

	.el-dialog--center .el-dialog__body {
		padding: 20px 60px;
	}
	
	.el-upload {
		height: 40px;
	}
	
	.icon-dialog{
		.icon-div{
			display: inline-block;
			position: relative;
			padding: 10px;
			border-radius: 8px;
			transition: all .3s;
			margin: 0 5px 5px 0;
			&:hover{
				background-color: #ffe8e8;
			}
			.el-icon-circle-check{
				position: absolute;
				top: 0px;
				right: 0px;
				color: #1890ff;
				margin: 0;
			}
			&.active{
				background-color: #ffe8e8;
			}
		}
	}
</style>
