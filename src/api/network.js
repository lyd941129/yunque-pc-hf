// 导入axios
import axios from 'axios';
import router from "../router/index.js"
// import {
// 	tokenExpressInTime
// } from '../../static/js/utils.js'
import {
	Message
} from 'element-ui'

// 进行一些全局配置
// 公共路由(网络请求地址)
// axios.defaults.baseURL = 'http://yqadmin.taozizi.cn';
let protocol = window.location.protocol; //协议
let host = window.location.host; //主机
let reg = /^localhost+/;
if (reg.test(host)) {
	//若本地项目调试使用
	axios.defaults.baseURL = 'http://yqadmin.taozizi.cn';
} else {
	//动态请求地址             协议               主机
	axios.defaults.baseURL = protocol + "//" + host;
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'; //配置请求头信息。
// 请求响应超时时间
axios.defaults.timeout = 5000;
// http request 请求拦截器
axios.interceptors.request.use(config => {
	if(window.location.hash != "#/log"){
		let loginData = localStorage.getItem("loginData") ? JSON.parse(localStorage.getItem("loginData")) : {};
		config.headers['token'] = loginData.token;  //config里就是可以统一配置request请求的参数，headers就可以在这设置
	}
	return config
},
	error => Promise.reject(error)
);
// axios.interceptors.request.use(config => {
// 	// 在发送请求之前做些什么
// 	if(window.location.hash != "#/log" && !localStorage.getItem('tokenTime') == null){
// 		router.push('/log');
// 	}
// 	if (window.location.hash != "#/log" && tokenExpressInTime() && localStorage.getItem('tokenTime')) {
// 		Message({
// 			type: 'error',
// 			center: true,
// 			message: '登录超时请重新登录',
// 			duration: 2000
// 		})
// 		setTimeout(() => {
// 			router.push('/log');
// 			setTimeout(function(){
// 				localStorage.clear();
// 			}, 100);
// 		}, 1500)
// 		return false
// 	}
// 	return config;
// }, error => {
// 	// 对请求错误做些什么
// 	console.log('error request:', error)
// 	return Promise.reject(error);
// });
// 封装自己的get/post方法
export default {
	get: function(path = '', data = {}, istype) {
		return new Promise(function(resolve, reject) {
			axios.get(path, {
					params: data
				})
				.then(function(response) {
					// 按需求来，这里我需要的是response.data，所以返回response.data，一般直接返回response
					if (response.data.code === 1 || response.data.code === 7001 || response.data
						.code === 7002 || response.data.code === 7003) {
						resolve(response.data);
					} else if (response.data.code === 2001) {
						// Message({ 
						// 	type: 'error',
						// 	center: true,
						// 	message: '登录超时请重新登录',
						// 	duration: 2000
						// })
						setTimeout(() => {
							router.push('/log');
							setTimeout(function(){
								localStorage.clear();
							}, 100);
						}, 1500);
						// reject(response.data.msg);
					} else if (response.data.code === 2002) {
						reject(response.data.msg);
					} else {
						reject(response.data.msg);
					}
				})
				.catch(function(error) {
					reject(error);
				});
		});
	},
	post: function(path = '', data = {}, istype) {
		return new Promise(function(resolve, reject) {
			axios.post(path, data)
				.then(function(response) {
					// 按需求来，这里我需要的是response.data，所以返回response.data，一般直接返回response
					if (response.data.code === 1) {
						resolve(response.data);
					} else if (response.data.code === 2001) {
						// Message({
						// 	type: 'error',
						// 	center: true,
						// 	message: '登录超时请重新登录',
						// 	duration: 2000
						// })
						setTimeout(() => {
							router.push('/log');
							setTimeout(function(){
								localStorage.clear();
							}, 100);
						}, 1500);
						reject(response.data.msg);
					} else if (response.data.code === 2002) {
						reject(response.data.msg);
					} else {
						reject(response.data.msg);
					}
				})
				.catch(function(error) {
					reject(error);
				});
		});
	}
};
