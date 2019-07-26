<template>
	<view class="deliverGoods">
		<view class="context">
			<view class="header">
				<view class="left">外码编号：WM20190913787681001</view>
				<button type="text" size="mini">关联子码</button>
			</view>
			<view class="content">
				<!-- <view class="item" v-for="(item,index) in 100" :key="index" >
					编号：778877777979797979797979
				</view> -->
				<view class="item" style="color: rgba(128,128,128,1);">
					暂无关联的子码
				</view>
			</view>
		</view>
		<view class="btn_box">
			<button type="primary" class="btn" @tap="jump">下一步</button>
		</view>
	</view>
</template>

<script>
	export default {
		methods:{
			jump(){
				uni.navigateTo({
					url:'../deliverFinish/deliverFinish'
				})
			}
		}
	}
</script>

<style lang="less">
	.deliverGoods {
		padding: 15px 15px 0;

		.context {
			overflow-y: hidden;
			border: 1px solid #ccc;
			border-radius: 10px;

			.header {
				justify-content: center;
				align-items: center;
				display: flex;
				color: rgba(255, 255, 255, 1);
				padding: 10px;
				background: linear-gradient(to left, #f53647, #fd973c);
				font-size: 14px;

				button {
					color: #F53747;
					border-radius: 10px;
				}
			}

			.content {
				overflow-y: scroll;
				height: calc(100vh - 320rpx);
				font-size: 14px;
				background: rgba(242, 242, 242, 1);
				margin: 10px;

				.item {
					padding: 10px;
					text-align: center;
				}
			}
		}

	}

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
</style>
