// 一些公共的方法可以抽离放到这里
import Vue from 'vue';

Vue.mixin({
	created() {
		let protocol = window.location.protocol; //协议
		let host = window.location.host; //主机
		let reg = /^localhost+/;
		if (reg.test(host)) {
			//若本地项目调试使用
			this.allUrl = 'http://192.168.66.36:9501';
		} else {
			//动态请求地址             协议               主机
			this.allUrl  = protocol + "//" + host ;
		}
		if(localStorage.getItem('tokenTime') == null){
			this.$router.push('/log');
		}
		this.loginData = localStorage.getItem("loginData") ? JSON.parse(localStorage.getItem("loginData")) : {};
	},
	data(){
		return {
			allUrl: 'http://yqadmin.taozizi.cn',
			loginData: {},
		}
	},
	computed: {
		getLocalTime: function() {// 时间转化
			return function(nS) {
				return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
			}
		},
	}
});