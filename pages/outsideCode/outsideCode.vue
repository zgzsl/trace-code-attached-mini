<template>
	<view class="outSide">
		<view class="outSide_item">
			<view class="header">
				设置转化为外码的号段
			</view>
			<view class="context">
				<view class="context_item">
					<view class="title">开始编号：</view>
					<input type="number" v-model="info.outCodeStart" />
				</view>
				<view class="context_item">
					<view class="title">结束编号：</view>
					<input type="number" v-model="info.outCodeEnd" />
				</view>
			</view>
		</view>
		<view class="outSide_item">
			<view class="header">
				设置内码号段
			</view>
			<view class="context">
				<view class="context_item">
					<view class="title">开始编号：</view>
					<input type="number" v-model="info.inCodeStart" />
				</view>
				<view class="context_item">
					<view class="title">结束编号：</view>
					<input type="number" v-model="info.inCodeEnd" />
				</view>
			</view>
		</view>
		<view class="text">
			备注：编号数不可交叉，设置的外码及内码是一对一对应关系
		</view>
		<view class="btn_box">
			<button type="primary" class="btn" @tap="confirm">确定变更</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {
					outCodeStart: '',
					outCodeEnd: '',
					inCodeStart: '',
					inCodeEnd: ''
				}

			}
		},
		methods: {
			confirm() {
				if (!this.info.outCodeStart) {

					this.$common.showToast("请输入外码开始编号", 'none')

					return;
				}
				if (!this.info.outCodeEnd) {

					this.$common.showToast("请输入外码结束编号", 'none')
					return;
				}
				if (Number(this.info.outCodeStart) > Number(this.info.outCodeEnd)) {

					this.$common.showToast("外码结束编号不能小于开始编号", 'none')
					return;
				}
				if (!this.info.inCodeStart) {

					this.$common.showToast("请输入内码开始编号", 'none')
					return;
				}
				if (!this.info.inCodeEnd) {

					this.$common.showToast("请输入内码结束编号", 'none')
					return;
				}
				if (Number(this.info.inCodeStart) > Number(this.info.inCodeEnd)) {

					this.$common.showToast("内码结束编号不能小于开始编号", 'none')
					return;
				}
				if ((Number(this.info.inCodeEnd) - Number(this.info.inCodeStart)) !== (Number(this.info.outCodeEnd) - Number(this.info
						.outCodeStart))) {

					this.$common.showToast("外码与内码比值为1", 'none')
					return;
				}
			
				this.$common.post("/trace-api/trace/changOutCodeBatch", this.info).then((res) => {
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
			}
		}
	}
</script>

<style lang="less">
	.outSide {
		padding: 15px 15px 0;
	}


	.outSide_item {
		.header {
			font-size: 16px;
		}

		.context {
			margin: 10px 10px;

			.context_item {
				border-radius: 10px;
				border: 1px solid #ccc;
				display: flex;
				font-size: 14px;
				padding: 10px 10px;
				align-items: center;
				margin: 10px 0;
				.title{
					font-size: 28upx;
				}

			}
		}
	}

	.text {
		font-size: 14px;
		font-family: PingFang-SC-Medium;
		font-weight: 500;
		color: rgba(246, 58, 72, 1);
		padding: 15px 15px 0;
	}

// 	.btn_box {
// 		display: flex;
// 		position: fixed;
// 		bottom: 0;
// 		left: 0;
// 		width: 100%;
// 
// 		.btn {
// 			flex: 1;
// 			color: #fff;
// 			background: linear-gradient(to left, #f53647, #fd973c);
// 			line-height: 3;
// 			border-radius: 49px;
// 			margin: 10px 15px;
// 		}
// 
// 	}
</style>
