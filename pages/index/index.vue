<template>
	<view class="container">
		<view class="box">
			<view class="item" v-for="(item,index) in menuList" :key="index" @tap="router(item.router)">
				<view class="item_header">
					<image :src="item.src" mode=""></image>
				</view>
				<view class="item_body">{{item.name}}</view>
				<view class="item_bottom">{{item.desc}}</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				menuList: [{
						src: '../../static/images/prink.png',
						name: "打印外码",
						desc: "此功能需连接打印机",
						router: '../print/print'
					},
					{
						src: '../../static/images/code.png',
						name: "内码变成外码",
						desc: "功能适用于无接入打印机",
						router: '../codeChange/codeChange'
					},
					{
						src: '../../static/images/link.png',
						name: "关联编码",
						desc: "关联子码",
						router: '../relation/relation'
					}, {
						src: '../../static/images/logo1.png',
						name: "发货",
						desc: "扫码发货",
						router: '../deliverGoods/deliverGoods'
					}
				]
			}
		},
		onLoad() {

		},
		methods: {
			router(router) {
				uni.navigateTo({
					url: router
				})
			}
		}
	}
</script>

<style lang="less">
	.container {

		.box {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 10px;

			.item {
				border-radius: 10px;
				width: 48%;
				height: 212upx;
				background: red;
				margin: 5px 0;
				background: linear-gradient(to left, #f53647, #fd973c);
				font-size: 12px;
				display: flex;
				align-items: center;
				flex-direction: column;
				justify-content: center;
				color: rgba(255, 255, 255, 1);

				.item_header {
					width: 88upx;
					height: 88upx;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}


	}
</style>
