<template>
	<view class="login">
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="../../static/logo.png" mode="widthFix"></image>
			</view>
			<!-- 主体表单 -->
			<view class="main">
				<!-- <wInput  type="text" placeholder="商家账号"></wInput> -->
				<view class="main-list main-list oBorder oBorder">
					<input class="main-name" @input="inputText" type="text" v-model="phoneData" placeholder="商家账号" />
				</view>

				<wInput v-model="passData" type="password" isShowPass="true" placeholder="商家密码"></wInput>
			</view>
			<wButton text="登 录" :bgColor="bgColor" :rotate="isRotate" @click.native="startLogin()"></wButton>

		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button

	export default {
		data() {
			return {
				//logo图片 base64
				phoneData: '', //用户/电话
				passData: '', //密码
				isRotate: false, //是否加载旋转
				bgColor: '#A82127'
			};
		},
		components: {
			wInput,
			wButton,
		},
		mounted() {
			// this.isLogin();
		},
		methods: {
			inputText(e){
	
				this.phoneData=e.detail.value
			},
			startLogin() {
				//登录
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.phoneData.length == "") {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请输入商家账号'
					});
					return;
				}
				if (this.passData.length == "") {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请输入商家密码'
					});
					return;
				}

				this.isRotate = true
				setTimeout(function() {
					this.isRotate = false
				}, 3000)
				// uni.showToast({
				// 		icon: 'success',
				// 		position: 'bottom',
				// 		title: '登录成功'
				// 	});
				let param = {
					"accountName": this.$common.trim(this.phoneData),
					"password": this.$common.trim(this.passData)
				}
				uni.showLoading({
					title: '登录中'
				});

				this.$common.post(this.$common.goLogin, param).then((res) => {
					if (Number(res.data.statusCode) === 200) {
						uni.setStorageSync('setUserData', res.data.data);
						setTimeout(() => {
							this.$common.success("登陆成功")
						}, 1000)

						setTimeout(() => {
							this.isRotate = false
							uni.redirectTo({
								url: '../index/index'
							})
						}, 1000)

					} else {
						this.$common.showToast(res.data.statusMsg, "none")
						this.isRotate = false

					}
					setTimeout(() => {
						uni.hideLoading();
					}, 1500)

				}).catch(err => {
					uni.hideLoading();
				})

			}
		}
	}
</script>

<style lang="less">
	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");

	.main-list {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 36upx;
		/* Input 高度 */
		color: #333333;
		padding: 32upx;
		margin-top: 24upx;
		margin-bottom: 24upx;
	}

	.main-name {
		padding-left: 18upx;
		font-size: 28upx;

	}

	.img {
		width: 32upx;
		height: 32upx;
		font-size: 32upx;
	}

	.main-input {
		flex: 1;
		text-align: left;
		font-size: 28upx;
		/* line-height: 100upx; */
		padding-right: 10upx;
		margin-left: 20upx;
	}

	.vercode {
		color: rgba(0, 0, 0, 0.7);
		font-size: 24upx;
		line-height: 100upx;
	}

	.vercode-run {
		color: rgba(0, 0, 0, 0.4) !important;
	}

	.oBorder {
		border: none;
		border-radius: 2.5rem;
		-webkit-box-shadow: 0 0 60upx 0 rgba(43, 86, 112, .1);
		box-shadow: 0 0 60upx 0 rgba(43, 86, 112, .1);
	}
</style>
