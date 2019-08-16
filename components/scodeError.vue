<template>
	<view class="error">
		<view class="icon">
			<image src="../static/images/error.png" mode="widthFix"></image>
		</view>
		<view class="text">
			{{text}}
		</view>
		<button type="primary" class="btn" @tap="childMethod">重新扫一扫</button>
	</view>
</template>

<script>
	export default {
		props: ['text', "type"],
		

		methods: {
			childMethod() {
				console.log(this.type)
				this.$emit(this.type);
			}
		}
	}
</script>

<style lang="less">
	.error {
		margin-top: 10%;

		.text {
			margin: 30 rpx 0 0 0;
			font-family: PingFang-SC-Regular;
			font-weight: 400;
			color:#ccc;
			text-align: center;
			font-size: 26rpx;
		}

		.icon {
			margin: 0 auto;
			width: 150rpx;
			height: 150rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.btn {
			margin-top: 10%;
			background: linear-gradient(to left, #f53647, #fd973c);
			width: 50%;
			border-radius: 20px;
		}
	}
</style>
