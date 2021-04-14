// 封装自己的get/post方法
export default {
	Caption: {
		element: 'Caption',// 标题组件
		title: '标题组件',// 组件名称
		id: '1',// 组件标识
		paralanguage: '',// 问号里面显示的内容
	},
	Textbox: {
		element: 'Textbox',// 文本组件
		title: '单行输入框',// 组件名称
		prompt: '请输入...',// 提示语
		value: '',// 组件值
		isSource: '',// 数据来源
		paralanguage: '',// 问号里面显示的内容
		fromId: '',// 来源id
		isVerify: false,// 是否开启验证
		isAutomatic: false,// 是否自动生成
		status: '1',// 组件状态：‘0’为不可填状态，‘1’为可写状态
		id: '2',// 组件标识
		isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
		isHidden: false,// 是否隐藏
	},
	Money: {
		element: 'Money',// 金额组件
		title: '货币',
		prompt: '请输入...',// 提示语
		value: '',
		unit: '￥',// 金额单位
		paralanguage: '',// 问号里面显示的内容
		status: '1',
		isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
		id: '4',// 组件标识
		rmb: false,// 是否转化为人民币大写
		thousandth: true,// 是否千分位显示
		isHidden: false,// 是否隐藏
	},
	Num: {
		element: 'Num',// 数字组件
		title: '数字输入框',
		prompt: '请输入...',// 提示语
		paralanguage: '',// 问号里面显示的内容
		value: '',
		status: '1',
		isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
		id: '88',// 组件标识
		isHidden: false,// 是否隐藏
	},
	Describe: {
		element: 'Describe',// 描述组件
		title: '多行输入框',
		prompt: '请输入...',// 提示语
		value: '',
		maxNum: '50',// 限制输入的最大值
		paralanguage: '',// 问号里面显示的内容
		status: '1',
		id: '6',// 组件标识
		isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
		isHidden: false,// 是否隐藏
	},
	Choice: {
		element: 'Choice',// 选择组件(单选)
		title: '选择组件',
		prompt: '请选择...',// 提示语
		paralanguage: '',// 问号里面显示的内容
		isDict: false,
		option: ['选项一', '选项二'], // 组件打开选择页面的数据
		value: '',// 如果type为multiple，则为多选，值是数组：['中国', '美国']
		code: '',
		status: '1',
		type: 'single',// single：单选；multiple：多选
		isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
		id: '11',
		isHidden: false,// 是否隐藏
	},
	Data: {
		element: 'Data',// 时间组件
		title: '日期组件',
		prompt: '请选择...',// 提示语
		paralanguage: '',// 问号里面显示的内容
		dataType: 'time',// date：年月日；time：时分秒；
		value: '',// 如果为日期，则value为2020-8-12
		status: '1',
		id: '13',
		isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
		isHidden: false,// 是否隐藏
		defaultTime: false,// 是否显示默认时间
	},
	Association: {// 表单关联组件数据
		element: 'Association',// 表单关联组件
		title: '表单关联',
		prompt: '请选择...',// 提示语
		paralanguage: '',// 问号里面显示的内容
		id: 'lh1WGWXfyW',
		target: '',
		relevance: [],
		value: '',
		status: '1',
		isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
		isHidden: false,// 是否隐藏
	},
	Bringback: {// 选择带回组件数据
		element: 'Bringback',// 选择带回组件
		title: '选择带回',
		prompt: '请选择...',// 提示语
		paralanguage: '',// 问号里面显示的内容
		isSource: '',// 数据来源
		fromId: '',// 来源id
		id: 'lh1WGWXfyW',
		target: '',
		relevance: [],
		value: '',
		status: '1',
		isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
		isHidden: false,// 是否隐藏
	},
	File: {
		element: 'File',// 上传文件组件
		title: '文件上传',
		paralanguage: '',// 问号里面显示的内容
		id: '31',
		limit: '20',// 上传个数限制
		onlyPictures: false,// 仅图片
		onlyDocuments: false,// 仅文档
		status: '1',
		isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
		value: [],
		isHidden: false,// 是否隐藏
	},
	Site: {
		element: 'Site',// 地址组件
		title: '地址',
		paralanguage: '',// 问号里面显示的内容
		id: '33',
		value: ['', '', '', ''],
		status: '1',
		isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
		inDetailTitle: '详细地址',// 详细地址标题
		inDetail: '详细房门号',// 详细地址内容
		isHidden: false,// 是否隐藏
	},
	List: {
		element: 'List',// 明细表组件
		title: '列表组件',
		paralanguage: '',// 问号里面显示的内容
		id: '33',
		status: '1',
		isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
		list: true,// 前端使用
		listData: {
			subheading: '明细表',
			summation: [],
			rowData: [],
			header: []
		},
		isHidden: false,// 是否隐藏
	},
	Ensconce: {
		element: 'Ensconce',// 隐藏组件
		title: '隐藏',
		value: '',
		id: '4',// 组件标识
	},
	Binding: {
		element: "Binding",// 被关系绑定组件，不做显示
		id: '12345',
		title: '项目名称',
		value: "",
		relevanceId: '11',// 关联表单的id
	},
	Think: {
		element: "Think",// 被关系绑定组件，不做显示
		id: '6',
		title: '联想组件',
		value: "",
		prompt: '请选择...',// 提示语
		paralanguage: '',// 问号里面显示的内容
		target: '',
		relevance: [],
		status: '1',
		isRequired: '0',// 是否必填‘0’：非必填；‘1’：必填
		isHidden: false,// 是否隐藏
	}
};
