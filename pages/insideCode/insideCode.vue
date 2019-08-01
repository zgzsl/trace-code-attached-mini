<template>
	<view class="insideCode">
		<view class="in" v-if="zscode">
			<view class="setting_insideCode">
				<view class="item">
					<view class="name">内码编号：</view>
					<text>{{zscode|| ""}}</text>
				</view>
			</view>
			<view class="btn_box">
				<button type="primary" class="btn" @tap='scode'>重新扫一扫</button>
				<button type="primary" class="btn" @tap="confirm">确定变更</button>
			</view>
		</view>
		<view class="out" v-if="!zscode">
			<button style="background:linear-gradient(to left, #f53647, #fd973c);color: #FFFFFF;" @tap="createdClick">扫一扫获取内部编码</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				zscode: '',
			}
		},

		methods: {
			createdClick(){
				this.scode()
			},
			confirm() {
				this.$common.get("/trace-api/trace/changeOutCode?outCode=" + this.zscode).then((res) => {
					console.log(res)
					if (Number(res.data.code) === 200) {
						uni.showToast({
							title: res.data.message,
							duration: 2000
						});
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 1500)
					} else {
						uni.showToast({
							title: res.data.message,
							duration: 2000,
							icon: "none"
						});
					}
				})
			},
			scode() {
				uni.scanCode({
					success: (res) => {
						this.$common.tip("扫码成功", "success")
						this.zscode = res.result
					}
				});
			}
		}
	}
</script>

<style lang="less">
	.insideCode {
		padding: 15px 15px 0;

		.btn_box {
			display: flex;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;

			.btn {
				flex: 1;
				color: #fff;
				background: linear-gradient(to left, #f53647, #fd973c);
				line-height: 3;
				border-radius: 49px;
				margin: 10px 15px;
			}

		}
	}

	.setting_insideCode {
		.item {
			border: 1px solid rgba(204, 204, 204, 1);
			border-radius: 20px;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			padding: 10px 5px;
			justify-content: space-around;

			text {
				flex: 1;
			}

			.name {
				padding: 0 0 0 15rpx;
				width: 180rpx;
			}

			.btn {
				margin-left: 10px;
				width: 100px;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(245, 53, 71, 1);
			}
		}


	}
</style>
