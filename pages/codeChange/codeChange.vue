<template>
	<view class="codeChange">
		<view class="item" @tap="Jump(0)">
			<text>单独替换内码为外码</text>
			<text>只需扫一扫即可</text>
		</view>
		<view class="item" @tap="Jump(1)">
			<text>批量替换内码为外码</text>
			<text>需输入对应的内码编码段</text>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			//选择外码
			Jump(type) {
				if (type) {
					uni.navigateTo({
						url: '../outsideCode/outsideCode'
					})
				} else {
					uni.navigateTo({
						url: '../insideCode/insideCode'
					})
				}

			}
		}
	}
</script>

<style lang="less">
	.codeChange {
		padding: 15px 15px;
		color: #fff;
		font-size: 13px;
	}

	.item {
		margin-bottom: 10px;
		display: flex;
		flex-direction: column;
		border-radius: 50px;
		text-align: center;
		padding: 5px;
		font-size: 26rpx;
		background: linear-gradient(to left, #f53647, #fd973c);

		text:first-child {
			font-size: 28rpx;
		}
	}

	.item:last-child {
		margin-bottom: 10px;
		display: flex;
		flex-direction: column;
		border-radius: 50px;
		text-align: center;
		padding: 5px;
		font-size: 26rpx;
		background: linear-gradient(to right, #f53647, #fd973c);
	}
</style>
