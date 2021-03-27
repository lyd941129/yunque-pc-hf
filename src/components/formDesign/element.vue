<!-- 表单设计中间组件展示 -->
<template>
	<div class="element" :class="[{'element-list': (information.element === 'List')}, {'active': (selectId == information.id)}]" @click.stop="openEdit(information, parentIndex)">
		<i class="icon icon-ensconce" v-if="information.isHidden"></i>
		<div class="operation" :class="{'active': (selectId == information.id)}">
			<el-tooltip v-if="information.element != 'List'" effect="dark" content="复制" placement="bottom">
				<i class="el-icon-document-copy" @click.stop="copyElement"></i>
			</el-tooltip>
			<div class="wire" v-if="information.element != 'List'"></div>
			<el-tooltip effect="dark" content="删除" placement="bottom">
				<i class="el-icon-delete" @click.stop="deleElement(information.id, information)"></i>
			</el-tooltip>
		</div>
		<div class="box" :class="{'box-isRequired': information.isRequired == '1'}" v-if="information.element === 'Textbox'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip">{{information.value ? information.value : information.prompt}}</div>
		</div>
		<div class="box caption-box" v-if="information.element === 'Caption'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
		</div>
		<div class="box describe-box" :class="{'box-isRequired': information.isRequired == '1'}" v-if="information.element === 'Describe'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip">{{information.value ? information.value : information.prompt}}</div>
		</div>
		<div class="box" :class="{'box-isRequired': information.isRequired == '1'}" v-if="information.element === 'Num'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip">{{information.value ? information.value : information.prompt}}</div>
		</div>
		<div class="box choice-box" :class="{'box-isRequired': information.isRequired == '1'}" v-if="information.element === 'Choice' || information.element === 'Data' || information.element === 'Association' || information.element === 'Bringback'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip"><div>{{information.value ? information.value : information.prompt}}</div><i class="el-icon-arrow-right"></i></div>
			<div class="relevance-box" v-if="information.relevance">
				<div class="relevance-item" v-for="(item, index) in information.relevance" :key="index">{{item.field_name || item.tit}}</div>
			</div>
		</div>
		<div class="box" v-if="information.element === 'Money'" :class="{'box-isRequired': information.isRequired == '1'}">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip">{{information.prompt}}</div>
			<div class="capital" v-if="information.rmb">大写</div>
		</div>
		<div class="box ensconce-box" v-if="information.element === 'Ensconce'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip">这是一个隐藏组件，无需修改</div>
		</div>
		<div class="box file-box" v-if="information.element === 'File'" :class="{'box-isRequired': information.isRequired == '1'}">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip">+</div>
		</div>
		<div class="box site-box" v-if="information.element === 'Site'" :class="{'box-isRequired': information.isRequired == '1'}">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="tip tip-choce"><div>请输选择</div><i class="el-icon-arrow-right"></i></div>
			<div class="title" :class="{'no-write': information.status == '0'}">详细地址</div>
			<div class="tip">请输入...</div>
		</div>
		<div class="box list-box" v-if="information.element === 'List'">
			<div class="title" :class="{'no-write': information.status == '0'}">{{information.title}}</div>
			<div class="phone-within" v-if="information.listData" :class="{'phone-within-no': (information.listData.header.length == 0)}">
				<draggable v-model="information.listData.header" group="site" animation="300" @add='addFun' ghostClass="ghost" @end="endRight" :move="moveRight">
					<transition-group>
						<subassemblyElement v-for="(item, index) in information.listData.header" :key="item.id" :information="item" :openEdit="openEditList"
						:addFun="addFun" :deepClone="deepClone" :createid="createid" :createCode="createCode" :selectId.sync="selectIdChild"
						:parentData.sync="information.listData.header" :parentIndex="index"
						:postTarget="postTarget" :judge.sync="judgeChild" :getBringback="getBringback"></subassemblyElement>
					</transition-group>
				</draggable>
			</div>
			<div class="tip tip-list"><i class="el-icon-plus"></i>添加</div>
		</div>
	</div>
</template>

<script>
	import draggable from 'vuedraggable';	//导入draggable组件
	import subassemblyElement from '../formDesign/element.vue';
	import componentData from '../../../static/js/componentData.js';
	export default{
		name: "subassemblyElement",
		components: {
			draggable,
			subassemblyElement,
		},
		props:{
			information:{},
			createCode:{},
			// addFun:{},
			deepClone:{},
			createid:{},
			openEdit: {},
			selectId:{},
			parentIndex:{},
			parentData:{},
			listEditData: {},
			isListEdit:{},
			postTarget:{},
			judge: {},
			getBringback: {},
		},
		data(){
			return {
				selectIdChild: this.selectId,
				judgeChild: this.judge
			}
		},
		computed:{
			
		},
		methods:{
			addFun(e){// 拖拽完成后更新右边数据
				// 这个是用于判断拖动的是否是表哥与非表格之间，是则不需要重新创建数据
				if(e.from.parentNode.parentNode.parentNode.className === "phone" && e.to.parentNode.parentNode.parentNode.className === "box list-box"){
					return false;
				}
				// 这个是用于判断拖动的是否是表哥与非表格之间，是则不需要重新创建数据END
				let obj = this.deepClone(componentData[this.information.listData.header[e.newDraggableIndex].element]);
				obj.id = this.createid();
				(obj.element == 'Num' || obj.element == 'Money') && (obj.is_total = '0');
				this.$set(this.information.listData.header, e.newDraggableIndex, obj);
				// console.log(this.information.listData.header);
				this.$emit('update:listEditData', obj);
				this.$emit('update:isListEdit', true);
				this.$emit('update:selectId', obj.id);
				this.$emit('update:listIndex', this.parentIndex);
				if(obj.element === "Bringback"){
					this.getBringback();
				}
				// console.log(e);
			},
			openEditList(e){// 点击编辑
				// console.log(e);
				if(e.element === "Association"){
					this.postTarget();
				}else if(e.element === "Bringback"){
					this.getBringback(e);
				}
				this.$emit('update:listEditData', e);
				this.$emit('update:isListEdit', true);
				this.$emit('update:selectId', e.id);
				this.$emit('update:listIndex', this.parentIndex);
			},
			copyElement(){// 点击复制
				let that = this;
				let obj = this.deepClone(this.information);
				obj.id = this.createid();
				this.parentData.push(obj);
				(obj.relevance && obj.relevance.length) && obj.relevance.map((item) => {// 此操作是为了赋值过程中有关系数据则需要在父级数据加入相关数据
					item.id = that.createid();
					that.parentData.push({
						element: "Binding",
						id: item.id || item.field_sign,
						title: item.tit || item.field_name,
						value: "",
						relevanceId: obj.id,
					});
				});
				this.$emit('update:parentData', this.parentData);
			},
			deleElement(id, itself){// 点击删除
				let that = this;
				// 当删除关联表单组件要将关系里绑定的组件也去掉，不然数据会错乱
				(itself.relevance && itself.relevance.length) && itself.relevance.map((item) => {
					that.parentData.map((f_item, f_index) => {
						if(f_item.element === "Binding" && f_item.relevanceId == itself.id && item.id == f_item.id){
							that.parentData.splice(f_index, 1);
						}
					});
				});
				this.parentData.splice(this.parentIndex, 1);
				if(id == this.selectId){
					this.$emit('update:selectId', '-1');
				}
				this.$emit('update:parentData', this.parentData);
				// 此操作是为了解决在删除一些复杂组件时造成dom刷新不及时以至于影响右边编辑栏的显示问题
				this.$emit('update:judge', false);
				this.$nextTick(function(){
					this.$emit('update:judge', true);
				});
			},
			endRight(e){
				// console.log(e)
			},
			moveRight(e){// 用于判断复杂组件是否在表格与非表格间拖动，是则不允许
				let isDarggable = true;
				if((e.draggedContext.element.element === "Bringback" || e.draggedContext.element.element === "Association") && e.from.parentNode.parentNode.parentNode.className === "box list-box" && e.to.parentNode.parentNode.parentNode.className === "phone"){
					isDarggable = false;
				}
				return isDarggable;
			},
		},
		watch:{
			selectId(val){
				this.selectIdChild = val;
			},
			selectIdChild(val){
				this.$emit('update:selectId', val);
			},
			judge(val){
				this.judgeChild = val;
			},
			judgeChild(val){
				this.$emit('update:judge', true);
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.element{
		background-color: white;
		margin: 0 2px;
		margin-bottom: 10px;
		cursor: pointer;
		border-left: 3px solid #fff;
		position: relative;
		// transition: border-left-color 0.3s;
		&.element-list{
			border: 1px dashed #ccc;
			border-left-width: 3px;
		}
		&.active{
			border-left: 3px solid rgba(0, 133, 255, 1);
		}
		&:hover{
			border-left: 3px solid #bfc1c2;
			box-shadow: 0 1px 10px 0 rgba(226, 226, 226, 0.5);
			cursor: grab;
		}
		&.active:hover{
			border-left: 3px solid rgba(0, 133, 255, 1);
		}
		.box{
			padding: 16px;
			position: relative;
			.title{
				color: rgba(51, 51, 51, 1);
				font-size: 16px;
				margin-bottom: 10px;
				&.no-write{
					color: #a6a6a6;
				}
			}
			.capital{
				color: rgba(51, 51, 51, 1);
				font-size: 16px;
				margin-top: 10px;
			}
			.tip{
				color: rgba(166, 166, 166, 1);
				font-size: 16px;
			}
			.relevance-item{
				margin-top: 5px;
				padding: 8px 0;
				border-top: 1px solid #ececec;
			}
			&.caption-box{
				position: relative;
				&::after{
					display: inline-block;
					content: '';
					position: absolute;
					width: 100%;
					height: 1px;
					border-bottom: 1px dashed rgba(24, 144, 255, 1);
					left: 0;
				}
				.title{
					position: relative;
					color: rgba(24, 144, 255, 1);
					padding-left: 10px;
					&::after{
						display: inline-block;
						content: '';
						width: 2px;
						height: 100%;
						background-color: rgba(24, 144, 255, 1);
						position: absolute;
						left: 0;
						border-radius: 2px;
					}
				}
			}
			&.describe-box{
				.tip{
					min-height: 50px;
				}
			}
			&.choice-box{
				.tip{
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			}
			&.ensconce-box{
				.title{
					color: rgba(166, 166, 166, 1);
				}
			}
			&.file-box{
				.tip{
					width: 46px;
					height: 46px;
					background: #F6F6F6;
					font-size: 32px;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
			&.list-box{
				.tip-list{
					text-align: center;
					margin-top: 10px;
				}
				.phone-within{
					&.phone-within-no{
						height: 64px;
						position: relative;
						background-color: #ddeff3;
					}
					&.phone-within-no::before{
						content: '拖入组件';
						display: inline-block;
						position: absolute;
						color: #ccc;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}
				}
				.element{
					box-shadow: 0 1px 10px 0 rgba(226, 226, 226, 0.5);
				}
			}
			&.site-box{
				.tip{
					display: flex;
					justify-content: space-between;
					align-items: center;
					&.tip-choce{
						margin-bottom: 10px;
					}
				}
			}
			&.box-isRequired::after{
				content: "*";
				display: inline-block;
				position: absolute;
				color: red;
				top: 22px;
				left: 8px;
			}
		}
		.operation{
			position: absolute;
			top: 16px;
			right: 16px;
			display: none;
			align-items: center;
			justify-content: center;
			padding: 4px 8px;
			border-radius: 16px;
			background: rgba(17, 31, 44, 0.04);
			z-index: 1;
			&.active{
				display: flex;
			}
			i{
				cursor: pointer;
				&:hover{
					color: #0089ff;
				}
			}
			.wire{
				display: inline-block;
				margin: 0 10px;
				width: 1px;
				border-left: 1px solid #DDDDDD;
				height: 14px;
			}
		}
		.icon-ensconce{
			top: 0;
			left: 0;
		}
	}
</style>
