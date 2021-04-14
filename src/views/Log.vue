<template>
	<div class="log">
		<el-container>
			<el-header>
				<div class="header-left">
					<div class="logo"></div>
					<span style="margin-left: 20px;">后台管理</span>
				</div>
			</el-header>
			<el-main>
				<div class="img-bg">
					<div class="log-empty"></div>
					<div class="log-box-out">
						<div class="log-box" v-loading="loading">
							<div class="log-btn">
								<el-button type="text">账号登录</el-button>
							</div>
							<div class="log-transition">
								<transition name="fade">
									<div class="log-id" v-if="pattern == 'id'">
										<div class="log-input">
											<el-form :model="ruleForm" :rules="rules" ref="ruleForm">
												<el-form-item label="" prop="phone">
													<el-input v-model="ruleForm.phone" placeholder="账号" clearable
													@keyup.enter.native="registerIng"></el-input>
												</el-form-item>
												<el-form-item prop="pass">
													<el-input type="password" v-model="ruleForm.pass" autocomplete="off" placeholder="登录密码" show-password
													@keyup.enter.native="registerIng"></el-input>
												</el-form-item>
												<el-form-item>
												    <el-button type="primary" class="log-register" @click="registerIng">登录</el-button>
												</el-form-item>
											</el-form>
										</div>
									</div>
								</transition>
							</div>
						</div>
					</div>
				</div>
			</el-main>
			<el-footer>公司版权信息</el-footer>
		</el-container>
	</div>
</template>

<script>
	import Network from '../api/network.js';// 请求的封装方法
	export default {
		mounted() {
		},
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			return {
				ruleForm: {
					phone: '',
					pass: ''
				},
				rules: {
					phone: [{
							required: true,
							message: '请输入账号',
							trigger: 'blur'
						},
						{
							min: 0,
							message: '账号不可为空',
							trigger: 'blur'
						}
					],
					pass: [{
						validator: validatePass,
						trigger: 'blur'
					}]
				},
				pattern: 'id',
				loading: false,
				poll: null,
				qr_image: '',
				loadingImg: false,
				titleTip: "请使用云雀扫二维码登录",
				scan_code: '',
			}
		},
		methods: {
			registerIng(){// 手机号密码登录
				let that = this;
				that.$refs.ruleForm.validate((valid) => {
					if (valid) {
						that.loading = true;
						Network.post('/admin/login/login',{
							password: that.ruleForm.pass,
							account: that.ruleForm.phone,
						}, {},true).then(data => {
							if(data.code === 1){
								that.$message({
									message: '登陆成功！',
									type: 'success'
								});
								setTimeout(function(){
									that.$router.push('/');
								}, 1000)
								localStorage.setItem("loginData", JSON.stringify(data.data));
								// let timedate = new Date().getTime() + ((data.expires/60/60) * 3600 * 1000);
								// localStorage.setItem('tokenTime', timedate);
							}else{
								that.$message({
									message: data.msg,
									type: 'error'
								});
							}
							that.loading = false;
						}).catch(err => {
							that.$message({
								message: err,
								type: 'error'
							});
							that.loading = false;
						})
					} else {
						return false;
					}
				});
			},
		},
	}
</script>

<style lang="less" scoped="scoped">
	.fade-enter-active, .fade-leave-active {
		transition: opacity .3s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
	}
	.el-container {
		.el-header {
			display: flex;
			justify-content: flex-start;
			align-items: center;

			.logo {
				display: inline-block;
				width: 133px;
				height: 40px;
				background: url(../assets/img/logo2.png) no-repeat;
			}

			.el-button--primary {
				height: 34px;
				display: flex;
				align-items: center;
			}
		}
		
		.el-main {
			height: 600px;
			padding: 0;
			overflow: hidden;

			.img-bg {
				height: 100%;
				width: 100%;
				background-image: url(../assets/img/logBg.png);
				background-repeat: no-repeat;
				background-position: center;
				background-size: cover;
				display: flex;
				justify-content: space-around;
				align-items: center;

				.log-box-out {
					width: 480px;
					height: 450px;
					background: rgba(255, 255, 255, 0.3);
					border: 2px solid rgba(0, 61, 153, 0.3);
					right: 300px;
					display: flex;
					justify-content: center;
					align-items: center;

					.log-box {
						width: 464px;
						height: 434px;
						background: #FFFFFF;
						border: 2px solid #003D99;
						box-sizing: border-box;
						padding: 50px 70px;

						.log-btn {
							position: relative;
							display: flex;
							justify-content: center;

							.el-button {
								font-size: 22px;
								color: #010101FF;
								font-weight: 400;
								transition: all .3s;

								&:hover,
								&.active {
									color: #007FE1FF;
								}
							}

							.log-vertical {
								position: absolute;
								left: 50%;
								top: 50%;
								transform: translate(-50%, -50%);
								background-color: #D7D7D7FF;
								width: 1px;
								height: 27px;
							}
						}

						.log-input {
							margin-top: 50px;
							.el-form-item{
								margin-bottom: 25px;
							}
						}
						.log-register{
							width: 100%;
							height: 50px;
							margin-top: 40px;
						}
						.log-transition{
							position: relative;
							width: 100%;
							height: calc(100% - 48px);
							.log-id{
								position: absolute;
								width: 100%;
								height: 100%;
							}
							.log-qr{
								position: absolute;
								display: flex;
								flex-direction: column;
								align-items: center;
								margin-top: 15px;
								width: 100%;
								height: 100%;
								.log-qr-tip{
									margin-top: 15px;
									font-size: 14px;
									color: #A6A6A6FF;
									.el-icon-refresh{
										color: #409EFF;
										margin: 0 5px;
									}
								}
							}
							.log-underway{
								position: absolute;
								width: 100%;
								height: 100%;
								margin-top: 40px;
								display: flex;
								flex-direction: column;
								align-items: center;
								img{
									width: 78px;
									height: 78px;
									border-radius: 50%;
								}
								.log-underway-name{
									margin-top: 20px;
									margin-bottom: 30px;
									font-size: 16px;
									font-weight: 400;
									color: #000000;
								}
								.log-underway-status{
									color: #8C8C8CFF;
									font-size: 14px;
									margin-bottom: 10px;
								}
								.log-usnderway-statusing{
									color: #8C8C8CFF;
									font-size: 14px;
									margin-bottom: 10px;
								}
							}
						}
					}
				}
			}
		}
		@media screen and (max-width: 1400px) {
			.el-main{
				height: 500px;
			}
		}
		.el-footer {
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 16px;
			color: #636363FF;
		}
	}
</style>
<style>
	/* 去掉数字输入框上下箭头 */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}

	input[type="number"] {
		-moz-appearance: textfield;
	}
</style>
