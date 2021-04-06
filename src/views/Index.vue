<template>
	<div class="index" v-if="loginData" v-loading="loading">
		<el-container>
			<el-aside width="220px">
				<div class="logo"></div>
				<el-row class="tac" text-color="white">
					<el-col>
						<el-menu class="el-menu-vertical-demo" :default-active="$router.path" router>
							<el-menu-item :index="item.rout" v-for="(item, index) in menu" :key="index">
								<i :class="item.icon"></i>
								<span slot="title">{{item.title}}</span> 
							</el-menu-item>
						</el-menu>
					</el-col>
				</el-row>
			</el-aside>
			<el-container>
				<el-header style="justify-content: space-between;">
					<div class="title">后台管理</div>
					<el-col :span="10">
						<el-dropdown @command="handleCommand">
							<span 说 class="el-dropdown-link">
								<el-image style="width: 36px;height: 36px;margin-right: 10px;border-radius: 10px;" >
									<div slot="error" class="image-slot">
										<i class="icon icon-exit"></i>
									</div>
								</el-image>
								{{loginData.user_info ? loginData.user_info.username : ''}}<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item>个人信息</el-dropdown-item>
								<el-dropdown-item>修改密码</el-dropdown-item>
								<el-dropdown-item>更换主管理员</el-dropdown-item>
								<el-dropdown-item>注销账户</el-dropdown-item>
								<el-dropdown-item command="logout">退出</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-col>
				</el-header>
				<el-main>
					<router-view></router-view>
				</el-main>
			</el-container>
		</el-container>
	</div>
</template>

<script>
	import Network from '../api/network.js';// 请求的封装方法
	export default {
		created() {
			// console.log(this.$store.state.loginData)
		},
		data(){
			return{
				menu:[{
					title: "我的桌面",
					rout: "/MyDesktop",
					icon: "icon icon-desktop",
				},{
					title: "应用管理",
					rout: "/Application",
					icon: "icon icon-application",
				}],
				loading: false,
				loginData: {},
			}
		},
		methods: {
			handleCommand(command){
				let that = this;
				// console.log(that.loginData.token)
				switch(command){
					case "logout":// 退出登录
						that.loading = true;
						Network.post('/admin/user/logout', '', {
							headers: {
								'content-type': 'application/json',
								"token": that.loginData.token  //token换成从缓存获取
							}
						}).then(data => {
							if(data.code === 1){
								that.$message({
									message: data.msg,
									type: 'success'
								});
								setTimeout(function(){
									that.$router.push('/log');
									localStorage.setItem("loginData", "");
									localStorage.clear();
								}, 1000)
							}else{
								setTimeout(function(){
									that.$router.push('/log');
									localStorage.setItem("loginData", "");
									localStorage.clear();
								}, 1000)
								that.$message.error(data.msg);
							}
							that.loading = false;
						}).catch(msg => {
							that.$message.error(msg);
							that.loading = false;
						});
						break;
				}
				
			}
		}
	}
</script>

<style lang="less">
	// @import "../../static/css/general.less";
	.index {
		height: 100%;
	}

	.el-container {
		height: 100%;

		.el-aside {
			background: linear-gradient(180deg, #52A0FF, #5B60FE);

			.logo {
				display: inline-block;
				width: 133px;
				height: 40px;
				margin: 30px 40px;
				background: url(../assets/img/logo.png) no-repeat;
			}
			.el-menu{
				background-color: transparent;
				border: none;
				.el-menu-item{
					text-align: left;
					color: white;
					height: 46px;
					line-height: 46px;
					padding-left: 30px !important;
					i{
						color: white;
					}
				}
				.el-menu-item.is-active{
					color: white;
					background-color: #7eb9f9;
				}
				.el-menu-item:focus{
					background-color: #7eb9f9;
				}
			}
		}
		.el-header{
			display: flex;
			align-items: center;
			justify-content: space-between !important;
			.el-col-10{
				width: auto !important;
			}
			.el-dropdown{
				span{
					display: flex;
					align-items: center;
				}
			}
		}
		.el-main{
			background-color: RGBA(245, 245, 245, 1);
		}
	}
</style>
