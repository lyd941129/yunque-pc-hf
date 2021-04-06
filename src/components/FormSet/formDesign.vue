<!-- 表单设计组件 -->
<template>
	<div class="formdesign" v-loading="loading">
		<div class="part">
			<h5>基础组件</h5>
			<draggable v-model="partArr" animation="300" :options="{group:{name: 'site',pull:'clone'},sort: false}" @end="endRight">
				<transition-group>
					<div class="part-chunk" v-for="item in partArr" :key="item.id" @click="addElement(item)">
						<i :class="item.icon"></i>
						{{item.title}}
					</div>
				</transition-group>
			</draggable>
			<h5>复杂组件</h5>
			<draggable v-model="partComplexArr" animation="300" :options="{group:{name: 'site',pull:'clone'},sort: false}" @end="endRight">
				<transition-group>
					<div class="part-chunk part-chunk-complex" v-for="item in partComplexArr" :key="item.id" @click="addElement(item)">
						<i :class="item.icon"></i>
						{{item.title}}
					</div>
				</transition-group>
			</draggable>
		</div>
		<div class="subassembly">
			<div class="title-form">{{formNamedes}}</div>
			<div class="phone">
				<div class="phone-within">
					<draggable v-model="formDesignData" group="site" animation="300" @add='addFun' ghostClass="ghost" delay="50" @end="endRight" :move="moveRight">
						<transition-group>
								<subassemblyElement v-for="(item, index) in formDesignData" :key="index" :information="item" :openEdit="openEdit"
								:addFun="addFun" :deepClone="deepClone" :createid="createid" :createCode="createCode" :selectId.sync="selectId"
								:parentData.sync="formDesignData" :parentIndex="index" :listEditData.sync="listEditData" :isListEdit.sync="isListEdit"
								:postTarget="postTarget" :listIndex.sync="listIndex" :judge.sync="judge" :getBringback="getBringback"></subassemblyElement>
						</transition-group>
					</draggable>
					<i class="empty" v-show="formDesignData.length == 0">点击或拖拽添加控件</i>
				</div>
			</div>
			<div>
				<el-button type="primary" @click="saveDesign" :loading="loadingBtn">保存设计</el-button>
				<el-button type="danger" @click="clearDesign">清空设计</el-button>
			</div>
		</div>
		<div class="property">
			<div class="component-type" v-if="selectId != -1 && formDesignData[selectIndex]">[{{selectId != -1 ? titleText[formDesignData[selectIndex].element] : ''}}]</div>
			<property ref="property" :editData="isListEdit ? (selectId == -1 ? {} : listEditData) : (selectId == -1 ? {} : formDesignData[selectIndex])"
			:targetOption="targetOption" :codeOption="codeOption" :associatedComponents.sync="associatedComponents" :formDesignData.sync="formDesignData" :isListEdit="isListEdit" :listIndex="listIndex"
			:deepClone="deepClone" :createid="createid" :createCode="createCode" :judge="judge"
			:originOption="originOption"></property>
		</div>
	</div>
</template>

<script>
	import draggable from 'vuedraggable';	//导入draggable组件
	import subassemblyElement from '../formDesign/element.vue';
	import property from '../formDesign/property.vue';
	import componentData from '../../../static/js/componentData.js';
	import Network from '../../api/network.js';
	export default {
		props:{
			// formDesignData: {},
			formId: {},
			app_id: {},
			centerDialogVisibleDesign:{},
			formNamedes: {},
		},
		created() {// 请求表单设计的数据
			let that = this;
			let postObj = {
				uid: that.loginData.user_info.id,
				id : that.app_id,
				table_id: that.formId
			}
			that.loading = true;
			that.formDesignData = [];
			Network.post('/admin/form/design', postObj).then(datas => {
				datas.data.length && datas.data.map((item) => {
					if(item.element === 'List'){// 处理列表组件内数据兼容最新数据字段
						item.listData.header.length && item.listData.header.map((list_item, list_index) => {
							let l_obj = new Object();
							let n_obj = Object.assign(l_obj, componentData[list_item.element], list_item);
							item.listData.header[list_index] = n_obj;
						});
					}
					// 处理组件内数据兼容最新数据字段
					let c_obj = new Object();
					let obj = Object.assign(c_obj, componentData[item.element], item);
					that.formDesignData.push(obj);
					
				});
				that.loading = false;
			}).catch(msg => {
				that.$message.error(msg);
				that.loading = false;
			});
		},
		//注册draggable组件
		components: {
			draggable,
			subassemblyElement,
			property,
		},
		data() {
			return {
				partArr: [{
						element: 'Textbox',
						title: '单行输入框',
						id: '1',
						icon: 'icon icon-text'
					},
					{
						element: 'Describe',
						title: '多行输入框',
						id: '2',
						icon: 'icon icon-describe'
					},
					{
						element: 'Num',
						title: '数字输入框',
						id: '3',
						icon: 'icon icon-num'
					},
					{
						element: 'Choice',
						title: '选择组件',
						id: '4',
						icon: 'icon icon-choice'
					},
					{
						element: 'Data',
						title: '日期组件',
						id: '5',
						icon: 'icon icon-data'
					},
					{
						element: 'Caption',
						title: '标题组件',
						id: '6',
						icon: 'icon icon-caption'
					},
					{
						element: 'List',
						title: '列表组件',
						id: '7',
						icon: 'icon icon-list'
					},
					{
						element: 'Money',
						title: '货币',
						id: '8',
						icon: 'icon icon-money'
					},
					{
						element: 'Ensconce',
						title: '隐藏',
						id: '9',
						icon: 'icon icon-ensconce'
					},
					{
						element: 'Site',
						title: '地址',
						id: '10',
						icon: 'icon icon-site'
					},
					{
						element: 'File',
						title: '文件上传',
						id: '11',
						icon: 'icon icon-file'
					},
				],
				partComplexArr: [{
						element: 'Bringback',
						title: '选择带回',
						id: '12',
						icon: 'icon icon-bringback'
					},{
						element: 'Association',
						title: '表单关联',
						id: '13',
						icon: 'icon icon-association'
					},{
						element: 'Think',
						title: '联想组件',
						id: '14',
						icon: 'icon icon-association'
					},
				],
				titleText: {
					'Textbox': '单行输入框',
					'Describe': '多行输入框',
					'Num': '数字输入框',
					'Choice': '选择组件',
					'Data': '日期组件',
					'Caption': '标题组件',
					'List': '列表组件',
					'Money': '货币',
					'Ensconce': '隐藏',
					'Site': '地址',
					'File': '文件上传',
					'Bringback': '选择带回',
					'Association': '表单关联',
					'Think': '联想组件',
				},
				formDesignData: [],
				selectId: -1,
				selectIndex: -1,
				listEditData: {},
				isListEdit: false,
				loadingBtn: false,
				loading: false,
				targetOption: [],
				codeOption: [],
				originOption: null,
				listIndex: -1,
				judge: true,
				associatedComponents: [],
			};
		},
		methods: {
			moveRight(e){// 用于判断复杂组件是否在表格与非表格间拖动，是则不允许
				let isDarggable = true;
				if((e.draggedContext.element.element === "Bringback" || e.draggedContext.element.element === "Association") && e.from.parentNode.parentNode.parentNode.className === "phone" && e.to.parentNode.parentNode.parentNode.className === "box list-box"){
					isDarggable = false;
				}
				return isDarggable;
			},
			endRight(e) {//右边往左边拖动时的事件
				// console.log(e)
				if(e.from.firstChild.className != 'part-chunk' && e.to.firstChild.className != 'part-chunk part-chunk-complex'){// 不允许右边组件往左边拖入
					e.to.firstChild.className === 'part-chunk' && (this.partArr.splice(e.newDraggableIndex, 1));
					e.to.firstChild.className === 'part-chunk part-chunk-complex' && (this.partComplexArr.splice(e.newDraggableIndex, 1));
				}else if(e.from.firstChild.className == 'part-chunk' && e.to.firstChild.className == 'part-chunk part-chunk-complex'){// 不允许右边组件往左边拖入
					e.to.firstChild.className === 'part-chunk part-chunk-complex' && (this.partComplexArr.splice(e.newDraggableIndex, 1));
				}else if(e.from.firstChild.className != 'part-chunk part-chunk-complex' && e.from.firstChild.className != 'part-chunk' && e.to.firstChild.className == 'part-chunk part-chunk-complex'){// 不允许右边组件往左边拖入
					e.to.firstChild.className === 'part-chunk part-chunk-complex' && (this.partComplexArr.splice(e.newDraggableIndex, 1));
				}
			},
			addElement(e){// 点击添加组件
				let obj = this.deepClone(componentData[e.element]);
				obj.id = this.createid();
				this.formDesignData.push(obj);
			},
			addFun(e){// 拖拽完成后更新右边数据
				// 这个是用于判断拖动的是否是表哥与非表格之间，是则不需要重新创建数据
				if(e.from.parentNode.parentNode.parentNode.className === "box list-box" && e.to.parentNode.parentNode.parentNode.className === "phone"){
					return false;
				}
				// 这个是用于判断拖动的是否是表哥与非表格之间，是则不需要重新创建数据END
				let obj = this.deepClone(componentData[this.formDesignData[e.newDraggableIndex].element]);
				obj.id = this.createid();
				this.$set(this, 'judge', true);
				this.$set(this, 'selectId', obj.id);
				this.$set(this, 'selectIndex', e.newDraggableIndex);
				this.$set(this.formDesignData, e.newDraggableIndex, obj);
				this.$set(this, 'isListEdit', false);
				obj.element === 'Choice' && (this.postCode());
				obj.element === 'Think' && (this.postTarget('think'));
				obj.element === 'Association' && (this.postTarget());
				obj.element === 'Textbox' && (this.postOrigin());
				obj.element === 'Bringback' && (this.getBringback());
				// console.log(e)
			},
			deepClone(data) { // 对象深拷贝
				let obj = {};
				obj = JSON.parse(JSON.stringify(data));
				return obj;
			},
			createid() {// 创建id
				const timestamp = new Date().getTime(); //获取当前时间戳
				let chars = "0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ-~".split("")
				let qutient = +timestamp;
				const radix = chars.length, arr = [];
				do {
					let mod = qutient % radix;
					qutient = (qutient - mod) / radix;
					arr.unshift(chars[mod]);
				} while (qutient);
				const zid = (arr.join("") + this.createCode()).split("~").join("");
				return zid.replace('-', '_');
			},
			createCode() {//随机验证码 4位数
				//首先默认code为空字符串
				var code = "";
				//设置长度，这里看需求，我这里设置了4
				var codeLength = 4;
				//设置随机字符
				var random = "0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ-~".split("");
				//循环codeLength 我设置的4就是循环4次
				for (var i = 0; i < codeLength; i++) {
					//设置随机数范围,这设置为0 ~ 64
					var index = Math.floor(Math.random() * 64);
					//字符串拼接 将每次随机的字符 进行拼接
					code += random[index];
				}
				//将拼接好的字符串赋值给展示的Value
				return code;
			},
			openEdit(e, i){// 编辑组件
				e.element === 'Choice' && (this.postCode());
				e.element === 'Think' && (this.postTarget('think'));
				e.element === 'Association' && (this.postTarget());
				e.element === 'Textbox' && (this.postOrigin());
				e.element === 'Bringback' && (this.getBringback(e));
				this.$set(this, 'judge', true);
				this.$set(this, 'selectId', e.id);
				this.$set(this, 'isListEdit', false);
				this.$set(this, 'selectIndex', i);
			},
			saveDesign(){// 保存设计
				let that = this;
				let postObj = {
					uid: that.loginData.user_info.id,
					id : that.app_id,
					table_id: that.formId,
					form_design: that.formDesignData,
				}
				// console.log(postObj);
				// console.log(JSON.stringify(postObj));
				// return
				that.loadingBtn = true;
				Network.post('/admin/form/designSave', postObj).then(data => {
					that.$message({
						message: data.msg,
						type: 'success'
					});
					that.loadingBtn = false;
					that.$emit("update:centerDialogVisibleDesign", false);
				}).catch(msg => {
					that.$message.error(msg);
					that.loadingBtn = false;
				});
			},
			postTarget(type){// 对关联应用数据进行请求
				let that = this;
				switch(type){
					case "think":
						// 联想组件
						Network.get('/admin/form/relation').then(datas => {
							that.$set(that, 'targetOption', datas.data);
						}).catch(msg => {
							that.$message.error(msg);
						});
						break;
					default:
						// 表单关联
						let postObj = {
							uid: that.loginData.user_info.id,
						}
						Network.post('/admin/form/appName', postObj).then(datas => {
							that.$set(that, 'targetOption', datas.data);
						}).catch(msg => {
							that.$message.error(msg);
						});
				}
			},
			postOrigin(){// 对数据源数据进行请求
				let that = this;
				Network.post('/admin/form/source').then(datas => {
					that.$set(that, 'originOption', datas.data);
				}).catch(msg => {
					that.$message.error(msg);
				});
			},
			postCode(){// 对基础数据参数进行请求
				let that = this;
				Network.get('/admin/code/dict').then(datas => {
					that.$set(that, 'codeOption', datas.data);
				}).catch(msg => {
					that.$message.error(msg);
				});
			},
			clearDesign(){// 清空设计
				let that = this;
				this.$confirm('确定清空设计？').then(() => {
					that.$set(that, 'formDesignData', []);
					that.$set(that, 'isListEdit', false);
				}).catch(() => {});
			},
			getBringback(val){// 选择带回组件接口数据
				let that = this;
				let postObj = {}
				Network.post('/admin/form/back', postObj).then(datas => {
					that.$set(that, 'targetOption', datas.data);
					if(val && val.target){
						let obj = that.targetOption.filter((s) => {
							return s.sign == val.target;
						});
						that.$set(that, 'associatedComponents', obj[0].data);
						let arr = [];
						val.relevance.map((item) => {
							arr.push(item.val);
						});
						this.$refs.property.checkUpdate(arr);
					}else{
						that.$set(that, 'associatedComponents', []);
					}
				}).catch(msg => {
					that.$message.error(msg);
				});
			},
		}
	};
</script>

<style lang="less" scoped="scoped">
	.formdesign {
		display: flex;
		height: 100%;
		
		.part {
			flex: 1;
			background-color: rgba(245, 246, 246, 1);
			max-width: 304px;

			h5 {
				margin-left: 16px;
			}

			.part-chunk {
				width: 124px;
				height: 40px;
				background: #FFFFFF;
				border-radius: 5px;
				display: inline-block;
				margin: 6px;
				padding: 5px;
				box-sizing: border-box;
				line-height: 30px;
				cursor: grab;
				margin-left: 16px;
				border: 1px solid transparent;
				padding-left: 26px;
				position: relative;
				transition: all 0.3s;
				&:hover{
					border-color: #0089ff;
					box-shadow: 0 4px 8px 0 rgba(17, 31, 44, 0.08);
					color: #0089ff;
				}
			}
		}
		.subassembly {
			flex: 2;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			flex-direction: column;
			align-items: center;

			.title-form {
				height: 46px;
				width: calc(100% - 80px);
				text-align: center;
				line-height: 46px;
				border-bottom: 1px solid rgba(217, 217, 217, 1);
				margin: 0 40px;
				box-sizing: border-box;
				font-size: 16px;
				margin-bottom: 20px;
			}

			.phone {
				width: 100%;
				height: calc(100% - 130px);
				width: 400px;
				box-shadow: #666 0px 0px 10px;
				border-radius: 20px;
				padding: 14px;
				box-sizing: border-box;

				.phone-within {
					width: 100%;
					height: 100%;
					background-color: rgba(242, 244, 245, 1);
					border-radius: 20px;
					padding-top: 15px;
					position: relative;
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
					.empty{
						position: absolute;
						top: 0;
						display: flex;
						align-items: center;
						justify-content: center;
						width: calc(100% - 48px);
						height: 90px;
						margin-left: 18px;
						margin-top: 16px;
						padding-left: 12px;
						border: 1px dashed rgba(25, 31, 37, 0.12);
						border-radius: 4px;
					}
				}
			}
			.el-button--danger,
			.el-button--primary{
				margin-top: 10px;
				width: 200px;
			}
		}

		.property {
			flex: 1;
			max-width: 304px;
			border-left: 1px solid rgba(235, 235, 235, 1);
			position: relative;
			.component-type{
				position: absolute;
				right: 15px;
				top: 10px;
				color: #1890ff;
			}
		}
	}
</style>
<style lang="less">
	.phone-within>div:first-child {
		height: 100%;
	}
	.phone-within>div:first-child>span {
		display: inline-block;
		width: 100%;
		min-height: 100%;
	}
	.ghost{
		background-color: #0089ff !important;
		height: 2px !important;
		font-size: 0 !important;
		overflow: hidden;
		.icon{
			display: none;
		}
	}
	.chosenClass{
		display: none !important;
	}
</style>
