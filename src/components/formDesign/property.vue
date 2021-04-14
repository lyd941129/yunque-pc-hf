<!-- 表单设计右边编辑展示 -->
<template>
	<div class="propertyElement" v-if="judge">
		<div class="property-box" v-for="(item, key, index) in editData" :key="key+index">
			<div class="title">{{titleFun(key)}} <span class="tip" v-show="key === 'title' || key === 'prompt'">最多20字</span></div>
			<!-- 标题 -->
			<el-input v-if="key === 'title'" maxlength="20" v-model="editData[key]" placeholder="请输入标题"></el-input>
			<!-- 提示文字 -->
			<el-input v-if="key === 'prompt'" maxlength="20" v-model="editData[key]" placeholder="请输入提示文字"></el-input>
			<!-- 默认值 -->
			<!-- <el-input v-if="key === 'value' && editData.element != 'Choice' && editData.element != 'Site' && editData.element != 'File' && editData.element != 'Money'" :type="(editData.element === 'Num' || editData.element === 'Money') ? 'number': ''" v-model="editData[key]" placeholder="请输入默认值"></el-input> -->
			<!-- 是否必填 -->
			<el-switch v-if="key === 'isRequired'" @change="switchChange($event, key)" :value="editData[key] == '1'" active-color="rgba(16, 179, 124, 1)"></el-switch>
			<!-- 是否可写 -->
			<el-switch v-if="key === 'status'" @change="switchChange($event, key)" :value="editData[key] == '1'" active-color="rgba(16, 179, 124, 1)"></el-switch>
			<!-- 是否隐藏 -->
			<el-switch v-if="key === 'isHidden'" v-model="editData[key]" active-color="rgba(16, 179, 124, 1)"></el-switch>
			<!-- 数据来源 -->
			<el-select v-if="key === 'fromId'" v-model="editData[key]" filterable placeholder="请选择" :no-data-text="optionTitle"
			@change="fromIdChange">
				<el-option label="不使用" value=""></el-option>
				<el-option v-for="(value, key, index) in originOption" :key="key" :label="value" :value="key"></el-option>
			</el-select>
			<!-- 限制输入最大值 -->
			<el-input type="number" v-if="key === 'maxNum'" v-model="editData[key]" placeholder="请输入标题"></el-input>
			<!-- 是否多选 -->
			<el-switch v-if="key === 'type'" @change="switchMultipleChange($event, key)" :value="editData[key] == 'multiple'" active-color="rgba(16, 179, 124, 1)"></el-switch>
			<!-- 选项 -->
			<div v-if="key === 'option' && !editData.isDict" class="phone-within">
				<draggable v-model="editData[key]" group="option" animation="300" handle=".icon-draggable">
					<transition-group>
							<div class="option-box" v-for="(item, index) in editData[key]" :key="index">
								<i class="icon icon-draggable"></i>
								<el-input v-model="editData[key][index]" placeholder="请输入..."></el-input>
								<i class="el-icon-delete" @click="deleOption(index)"></i>
							</div>
					</transition-group>
				</draggable>
				<div class="option-empty" v-if="editData[key].length == 0">请添加数据</div>
				<el-button type="text" @click="addOption">添加选项</el-button>
			</div>
			<!-- 日期类型 -->
			<el-select v-if="key === 'dataType'" v-model="editData[key]" filterable placeholder="请选择">
				<el-option label="年-月-日" value="date"></el-option>
				<el-option label="时:分" value="time"></el-option>
			</el-select>
			<!-- 金额单位 -->
			<el-select v-if="key === 'unit'" v-model="editData[key]" filterable placeholder="请选择">
				<el-option label="$" value="$"></el-option>
				<el-option label="￥" value="￥"></el-option>
			</el-select>
			<!-- 是否转大写 -->
			<el-switch v-if="key === 'rmb' && editData.unit == '￥'" v-model="editData[key]" active-color="rgba(16, 179, 124, 1)"></el-switch>
			<!-- 是千分位显示 -->
			<el-switch v-if="key === 'thousandth'" v-model="editData[key]" active-color="rgba(16, 179, 124, 1)"></el-switch>
			<!-- 是否显示默认时间 -->
			<el-switch v-if="key === 'defaultTime'" v-model="editData[key]" active-color="rgba(16, 179, 124, 1)"></el-switch>
			<!-- 数据类型 -->
			<el-radio-group v-if="key === 'isDict'" v-model="editData[key]">
				<el-radio :label="false">自填</el-radio>
				<el-radio :label="true">基础数据</el-radio>
			</el-radio-group>
			<!-- 基础数据参数值 -->
			<!-- <el-input v-if="key === 'code' && editData.isDict" v-model="editData[key]" placeholder="请输入参数值"></el-input> -->
			<el-select v-if="key === 'code' && editData.isDict" v-model="editData[key]" filterable placeholder="请选择" :no-data-text="optionTitle"
			@change="seleChangeCode">
				<el-option v-for="item in codeOption" :key="item.dict_type" :label="item.dict_name" :value="item.dict_type">{{item.dict_name}}</el-option>
			</el-select>
			<!-- 是否合计 -->
			<el-switch v-if="key === 'is_total'" @change="switchChange($event, key)" :value="editData[key] == '1'" active-color="rgba(16, 179, 124, 1)"></el-switch>
			<!-- 关联字段 -->
			<div v-if="key === 'relevance'">
				<div class="relevance-box" v-for="(item, index) in editData[key]" :key="index">
					<div class="relevance-box-div">
						<div style="width: 50%;">{{item.tit || item.field_name}}</div>
					</div>
					<i class="el-icon-remove-outline" @click="deleRelevance(index, item.id)"></i>
				</div>
				<el-button type="text" @click="addRelevance">修改字段</el-button>
			</div>
			<!-- 关联组件 -->
		<!-- 	<div v-if="key === 'relevance' && editData.element == 'Bringback'">
				 <el-checkbox-group v-model="checkListrelevance" @change="bringbackChange">
					<el-checkbox v-for="item in associatedComponents" :label="item.value" :value="item.value">{{item.label}}</el-checkbox>
				</el-checkbox-group>
			</div> -->
			<!-- 目标字段 -->
			<el-select v-if="key === 'target' && editData.element != 'Bringback' && editData.element != 'Think'" v-model="editData[key]" filterable placeholder="请选择" :no-data-text="optionTitle"
			@change="seleChange">
				<el-option v-for="item in targetOption" :key="item.app_id" :label="item.app_name" :value="item.app_id">{{item.app_name}}</el-option>
			</el-select>
			<!-- 目标字段(联想组件) -->
			<el-select v-if="key === 'target' && editData.element == 'Think'" v-model="editData[key]" filterable placeholder="请选择" :no-data-text="optionTitle"
			@change="seleChange">
				<el-option v-for="item in targetOption" :key="item.relation_id" :label="item.relation_name" :value="item.relation_id">{{item.relation_name}}</el-option>
			</el-select>
			<!-- 选择接口 -->
			<el-select v-if="key === 'target' && editData.element == 'Bringback'" v-model="editData[key]" filterable placeholder="请选择" @change="seleChangeBack">
				<el-option v-for="item in targetOption" :key="item.sign" :label="item.name" :value="item.sign">{{item.name}}</el-option>
			</el-select>
			<!-- 辅助语 -->
			<el-input v-if="key === 'paralanguage'" type="textarea" autosize placeholder="请输入辅助内容" v-model="editData[key]"></el-input>
			<!-- 是否验证唯一性 -->
			<el-switch v-if="key === 'isVerify'" v-model="editData[key]" active-color="rgba(16, 179, 124, 1)"></el-switch>
			<!-- 是否自动生成 -->
			<el-switch v-if="key === 'isAutomatic'" v-model="editData[key]" active-color="rgba(16, 179, 124, 1)"></el-switch>
			<!-- 仅图片 -->
			<el-switch v-if="key === 'onlyPictures'" v-model="editData[key]" active-color="rgba(16, 179, 124, 1)"></el-switch>
			<!-- 仅文档 -->
			<el-switch v-if="key === 'onlyDocuments'" v-model="editData[key]" active-color="rgba(16, 179, 124, 1)"></el-switch>
		</div>
		<!-- 关联字段弹框 -->
		<el-dialog title="修改字段" :visible.sync="centerDialogVisibleDesign" append-to-body  v-loading="loadingDia">
			<el-checkbox-group v-model="checkList">
				<el-checkbox v-for="(item, index) in checkOption" :key="item.field_sign || index" :label="item.field_sign || item.value" :value="item.field_sign || item.value">{{item.field_name || item.label}}</el-checkbox>
			</el-checkbox-group>
			<h3 v-if="checkList.length && (editData.element === 'Think' || editData.element === 'Bringback')">入口</h3>
			<el-radio-group v-model="radioList" v-if="checkList.length && (editData.element === 'Think' || editData.element === 'Bringback')">
				<el-radio v-for="(item, index) in radioOption(checkOption, checkList)" :key="item.field_sign || index" :label="item.field_sign || item.value" :value="item.field_sign || item.value">{{item.field_name || item.label}}</el-radio>
			</el-radio-group>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="saveRelevance()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import draggable from 'vuedraggable';	//导入draggable组件
	import Network from '../../api/network.js';
	export default{
		mounted() {
			// this.editData.element == 'Bringback' &&	this.getBringback();
		},
		components: {
			draggable,
		},
		props:{
			editData:{},
			codeOption: {},
			targetOption: {},
			originOption: {},
			formDesignData: {},
			clearArr: [],
			isListEdit: {},
			listIndex: {},
			createCode:{},
			deepClone:{},
			createid:{},
			judge: {},
			associatedComponents: {},
		},
		data(){
			return{
				options: [],
				centerDialogVisibleDesign: false,
				checkOption: [],
				checkList: [],
				optionTitle: '暂无数据',
				loadingDia: false,
				checkListrelevance: [],
				radioList: [],
			}
		},
		computed:{
			titleFun: function() {
				return function (type){
					var title = '';
					switch(type){
						case "title":
							title = '标题';
							break;
						case 'prompt':
							title = '提示文字';
							break;
						case "value":
							// (this.editData.element != 'Choice' && this.editData.element != 'Site' && this.editData.element != 'File' && this.editData.element != 'Money') && (title = '默认值');
							break;
						case "isRequired":
							title = '是否必填';
							break;
						case "status":
							title = '是否可写';
							break;
						case "isHidden":
							title = '是否隐藏';
							break;
						case "fromId":
							title = '数据来源';
							break;
						case "maxNum":
							title = '限制输入最大值';
							break;
						case "type":
							title = '是否多选';
							break;
						case "option":
							!this.editData.isDict && (title = '选项');
							break;
						case "dataType":
							title = '日期类型';
							break;
						case "unit":
							title = '金额单位';
							break;
						case "rmb":
							this.editData.unit == '￥' && (title = '是否大写');
							break;
						case "thousandth":
							title = '是否千分位显示';
							break;
						case "isDict":
							title = '数据类型';
							break;
						case "code":
							this.editData.isDict && (title = '基础数据参数值');
							break;
						case "is_total":
							title = '是否合计';
							break;
						case "relevance":
							title = '关联字段';
							// this.editData.element == "Bringback" && (title = '关联字段');
							break;
						case "target":
							title = '目标字段';
							this.editData.element == "Bringback" && (title = '选择接口');
							break;
						case "defaultTime":
							title = '是否默选中当前时间';
							break;
						case "paralanguage":
							title = '辅助语';
							break;
						case "isVerify":
							title = '验证唯一性';
							break;
						case "isAutomatic":
							title = '自动生成';
							break;
						case "onlyPictures":
							title = '仅图片';
							break;
						case "onlyDocuments":
							title = '仅文档';
							break;
					}
					return title;
				}
			},
			radioOption: function(){
				return function(val, check){
					let arr = val.filter((e) => {
						return check.indexOf(e.field_sign || e.value) != -1;
					});
					return arr;
				}
			}
		},
		methods:{
			seleChangeCode(){
				// console.log(this.editData.code);
			},
			switchChange(e, key){// 开关变化后改变值
				e ? (this.$set(this.editData, key, 1)) : (this.$set(this.editData, key, 0));
			},
			switchMultipleChange(e, key){// 多选切换赋值
				e ? (this.$set(this.editData, key, 'multiple')) : (this.$set(this.editData, key, 'single'));
			},
			deleOption(i){// 删除选项
				if(this.editData.option.length == 1){
					this.$message.error('至少保留一个选项！');
					return
				}
				this.editData.option.splice(i, 1);
			},
			addOption(){// 添加选项
				this.editData.option.push('选项'+this.editData.option.length);
			},
			deleRelevance(i, id){// 删除关联数据
				let that = this;
				this.editData.relevance.splice(i, 1);
				if(!that.isListEdit){
					// 处理总数据里面的关系组件数据
					that.formDesignData.map((f_item, f_index) => {
						if((f_item.element === "Textbox" || f_item.element === "Binding") && f_item.relevanceId == that.editData.id && id == f_item.id){
							that.formDesignData.splice(f_index, 1);
						}
					});
				}else{
					// 处理总数据里面的关系组件数据
					that.formDesignData[that.listIndex].listData.header.map((f_item, f_index) => {
						if((f_item.element === "Textbox" || f_item.element === "Binding") && f_item.relevanceId == that.editData.id && id == f_item.id){
							that.formDesignData[that.listIndex].listData.header.splice(f_index, 1);
						}
					});
				}
			},
			addRelevance(){// 打开修改关联字段弹框
				let that = this;
				switch(that.editData.element){
					case "Think":
						let arrThink = [];
						let postObjThink = {
							relation_id: that.editData.target,
						}
						that.centerDialogVisibleDesign = true;
						that.loadingDia = true;
						that.editData.relevance.length && that.editData.relevance.map((item) => {
							arrThink.push(item.id || item.field_sign);
						});
						that.$set(that, 'checkList', arrThink);
						that.$set(that, 'checkOption', []); 
						Network.post('/admin/form/relationField', postObjThink).then(datas => {
							let newData = [];
							datas.data.length && datas.data.map((item) => {
								newData.push({
									field_name: item.field_name,
									field_sign: item.field_key
								})
							});
							that.$set(that, 'checkOption', newData);
							that.loadingDia = false;
						}).catch(msg => {
							that.$message.error(msg);
							that.loadingDia = false;
						});	
						break;
					case "Bringback":
						let arrBack = [];
						that.editData.relevance.length && that.editData.relevance.map((item) => {
							arrBack.push(item.id || item.field_sign);
						});
						that.$set(that, 'checkList', arrBack);
						that.centerDialogVisibleDesign = true;
						that.$set(that, 'checkOption', []);
						that.$set(that, 'checkOption', that.associatedComponents);
						break;
					default:
						let arr = [];
						let postObj = {
							app_id: that.editData.target,
						}
						that.centerDialogVisibleDesign = true;
						that.loadingDia = true;
						that.editData.relevance.length && that.editData.relevance.map((item) => {
							arr.push(item.id || item.field_sign);
						});
						that.$set(that, 'checkList', arr);
						that.$set(that, 'checkOption', []); 
						Network.post('/admin/form/appSign', postObj).then(datas => {
							that.$set(that, 'checkOption', datas.data);
							that.loadingDia = false;
						}).catch(msg => {
							that.$message.error(msg);
							that.loadingDia = false;
						});	
				}
			},
			saveRelevance(){// 保存修改关联字段
				if((this.editData.element === 'Think' || this.editData.element === 'Bringback') && this.checkList.length && !this.radioList.length){
					this.$message.error('请选择入口组件');
					return
				}
				let that = this;
				let objData = that.checkOption.filter(function(s){
					return that.checkList.indexOf(s.field_sign || s.value) != -1;
				});
				let objAfter = that.editData.relevance;
				let arr = [];
				objData.length && objData.map((item) => {// 处理入口组件
					if(this.radioList && this.radioList.indexOf(item.field_sign || item.value) != -1 && (that.editData.element === 'Think' || that.editData.element === 'Bringback')){
						that.$set(that.editData, 'title', (item.field_name || item.label));
						arr.push({
							id: that.editData.id,
							tit: item.field_name || item.label,
							val: item.field_sign || item.value,
						});
					}else{
						arr.push({
							id: that.createid(),
							tit: item.field_name || item.label,
							val: item.field_sign || item.value,
						});
					}
				});
				that.$set(that.editData, 'relevance', arr);
				that.centerDialogVisibleDesign = false;
				if(!that.isListEdit){
					// 处理总数据里面的关系组件数据
					objAfter.length && objAfter.map((item) => {
						that.formDesignData.map((f_item, f_index) => {
							if((f_item.element === "Textbox" || f_item.element === "Binding") && f_item.relevanceId == that.editData.id && item.id == f_item.id){
								that.formDesignData.splice(f_index, 1);
							}
						});
					});
					arr.length && arr.map((item) => {
						switch(that.editData.element){
							case "Bringback":
							case "Think":
								if(item.id != that.editData.id){
									that.formDesignData.push({
										element: "Textbox",
										id: item.id || item.field_sign || item.value,
										title: item.tit || item.field_name || item.lable,
										value: "",
										prompt: '请输入...',// 提示语
										isSource: '',// 数据来源
										paralanguage: '',// 问号里面显示的内容
										fromId: '',// 来源id
										relevanceId: that.editData.id,
										status: '1',// 组件状态：‘0’为不可填状态，‘1’为可写状态
										isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
										isHidden: false,// 是否隐藏
									});
								}
								break;
							default:
								that.formDesignData.push({
									element: "Binding",
									id: item.id || item.field_sign,
									title: item.tit || item.field_name,
									value: "",
									relevanceId: that.editData.id,
								});
						}
					});
				}else{
					// 处理总数据里面的关系组件数据
					objAfter.length && objAfter.map((item) => {
						that.formDesignData[that.listIndex].listData.header.map((f_item, f_index) => {
							if((f_item.element === "Textbox" || f_item.element === "Binding") && f_item.relevanceId == that.editData.id && item.field_sign == f_item.id){
								that.formDesignData[that.listIndex].listData.header.splice(f_index, 1);
							}
						});
					});
					arr.length && arr.map((item) => {
						switch(that.editData.element){
							case "Bringback":
							case "Think":
								if(item.id != that.editData.id){
									that.formDesignData[that.listIndex].listData.header.push({
										element: "Textbox",
										id: item.id || item.field_sign || item.value,
										title: item.tit || item.field_name || item.lable,
										value: "",
										prompt: '请输入...',// 提示语
										isSource: '',// 数据来源
										paralanguage: '',// 问号里面显示的内容
										fromId: '',// 来源id
										relevanceId: that.editData.id,
										status: '1',// 组件状态：‘0’为不可填状态，‘1’为可写状态
										isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
										isHidden: false,// 是否隐藏
									});
								}
								break;
							default:
								that.formDesignData[that.listIndex].listData.header.push({
									element: "Binding",
									id: item.id || item.field_sign,
									title: item.tit || item.field_name,
									value: "",
									relevanceId: that.editData.id,
									prompt: '请输入...',// 提示语
									status: '1',// 组件状态：‘0’为不可填状态，‘1’为可写状态
									isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
									isHidden: false,// 是否隐藏
								});
						}
					});
				}
				this.radioList = [];
			},
			seleChange(){// 切换目标字段之后需要重置关系数据
				let that = this;
				if(!that.isListEdit){
					// 处理总数据里面的关系组件数据
					that.editData.relevance.length && that.editData.relevance.map((item) => {
						that.formDesignData.map((f_item, f_index) => {
							if((f_item.element === "Textbox" || f_item.element === "Binding") && f_item.relevanceId == that.editData.id && item.id == f_item.id){
								that.formDesignData.splice(f_index, 1);
							}
						});
					});
					that.$set(that.editData, 'relevance', []);
				}else{
					// 处理总数据里面的关系组件数据
					that.editData.relevance.length && that.editData.relevance.map((item) => {
						that.formDesignData[that.listIndex].listData.header.map((f_item, f_index) => {
							if((f_item.element === "Textbox" || f_item.element === "Binding") && f_item.relevanceId == that.editData.id && item.id == f_item.id){
								that.formDesignData[that.listIndex].listData.header.splice(f_index, 1);
							}
						});
					});
					that.$set(that.editData, 'relevance', []);
				}
			},
			fromIdChange(){
				this.editData.fromId ? 
				(this.$set(this.editData, 'isSource', this.originOption[this.editData.fromId]))
				: (this.$set(this.editData, 'isSource', ''));
			},
			seleChangeBack(){// 选择接口变化，关联组件数据变化
				let that = this;
				if(that.editData.target){
					let obj = that.targetOption.filter((s) => {
						return s.sign == that.editData.target;
					});
					this.$emit('update:associatedComponents', obj[0].data);
				}
				this.bringbackClear();
			},
			bringbackChange(val){
				// console.log(this.checkListrelevance);
				this.bringbackDispose();
			},
			bringbackDispose(){// 数据变化更改关联数据和外部组件数据
				let that = this;
				let objAfter = that.editData.relevance;
				let arr = [];
				let objData = that.associatedComponents.filter(function(s){
					return that.checkListrelevance.indexOf(s.value) != -1;
				});
				objData.length && objData.map((item) => {
					arr.push({
						id: that.createid(),
						tit: item.label,
						val: item.value,
					});
				});
				that.$set(that.editData, 'relevance', arr);
				if(!that.isListEdit){
					// 处理总数据里面的关系组件数据
					objAfter.length && objAfter.map((item) => {
						that.formDesignData.map((f_item, f_index) => {
							if((f_item.element === "Textbox" || f_item.element === "Binding") && f_item.relevanceId == that.editData.id && item.id == f_item.id){
								that.formDesignData.splice(f_index, 1);
							}
						});
					});
					arr.length && arr.map((item) => {
						that.formDesignData.push({
							element: "Binding",
							id: item.id,
							title: item.tit,
							value: "",
							relevanceId: that.editData.id,
						});
					});
				}else{
					// 处理总数据里面的关系组件数据
					objAfter.length && objAfter.map((item) => {
						that.formDesignData[that.listIndex].listData.header.map((f_item, f_index) => {
							if((f_item.element === "Textbox" || f_item.element === "Binding") && f_item.relevanceId == that.editData.id && item.id == f_item.id){
								that.formDesignData[that.listIndex].listData.header.splice(f_index, 1);
							}
						});
					});
					arr.length && arr.map((item) => {
						that.formDesignData[that.listIndex].listData.header.push({
							element: "Binding",
							id: item.id,
							title: item.tit,
							value: "",
							relevanceId: that.editData.id,
						});
					});
				}
			},
			bringbackClear(){// 清除关系数据以及外部关联数据
				let that = this;
				let objAfter = that.editData.relevance;
				that.$set(that, 'checkListrelevance', []);
				that.$set(that.editData, 'relevance', []);
				if(!that.isListEdit){
					// 处理总数据里面的关系组件数据
					objAfter.length && objAfter.map((item) => {
						that.formDesignData.map((f_item, f_index) => {
							if((f_item.element === "Textbox" || f_item.element === "Binding") && f_item.relevanceId == that.editData.id && item.id == f_item.id){
								that.formDesignData.splice(f_index, 1);
							}
						});
					});
				}else{
					// 处理总数据里面的关系组件数据
					objAfter.length && objAfter.map((item) => {
						that.formDesignData[that.listIndex].listData.header.map((f_item, f_index) => {
							if((f_item.element === "Textbox" || f_item.element === "Binding") && f_item.relevanceId == that.editData.id && item.field_sign == f_item.id){
								that.formDesignData[that.listIndex].listData.header.splice(f_index, 1);
							}
						});
					});
				}
			},
			checkUpdate(val){
				this.$set(this, 'checkListrelevance', val);
				// console.log(this.checkListrelevance)
			},
		},
	}
</script>

<style lang="less" scoped="scoped">
	.propertyElement{
		height: 100%;
		padding: 20px 15px;
		box-sizing: border-box;
		overflow: auto;
		&::-webkit-scrollbar{
			width: 4px;
			height: 4px;
			background-color: #f8f8f8;
		}
		&::-webkit-scrollbar-thumb{
			border-radius: 16px;
			background-color: #e8e8e8;
		}
		.el-select {
			width: 100%;
		}
		.property-box{
			margin-bottom: 10px;
			.title{
				margin-bottom: 10px;
				color: rgba(51, 51, 51, 1);
				font-size: 16px;
				.tip{
					color: rgba(166, 166, 166, 1);
					font-size: 12px;
				}
			}
			.option-box{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 10px;
				.el-icon-s-grid{
					font-size: 24px;
					margin-right: 5px;
					cursor: move;
				}
				.el-icon-delete{
					margin-left: 5px;
					cursor: pointer;
					&:hover{
						color: #0089ff;
					}
				}
			}
			.relevance-box{
				display: flex;
				align-items: center;
				margin-bottom: 8px;
				.relevance-box-div{
					display: flex;
					align-items: center;
					width: 214px;
					height: 34px;
					padding: 0 8px;
					background: rgba(25, 31, 37, 0.04);
					border-radius: 4px;
					font-size: 12px;
					color: #000;
				}
				i{
					font-size: 20px;
					margin-left: 10px;
					cursor: pointer;
					&:hover{
						color: #0089ff;
					}
				}
			}
			.option-empty{
				color: #a6a6a6;
				text-align: center;
			}
		}
	}
</style>
