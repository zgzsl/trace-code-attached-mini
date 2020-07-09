<template>
	<view class="container">
		<view class="box">
			<!-- <view class="item" v-for="(item,index) in menuList" :key="index" @tap="router(item.router)">
				<view class="item_header">
					<image :src="item.src" mode=""></image>
				</view>
				<view class="item_body">{{item.name}}</view>
				<view class="item_bottom">{{item.desc}}</view>
			</view> -->

			<uni-list>
				<uni-list-item v-for="(item,index) in menuList" :key="index" :router="item.router" @select='router' :title="item.name"
				 :note="item.desc" show-badge="true" :show-arrow="false">

				</uni-list-item>

			</uni-list>
		</view>

	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'

	export default {
		components: {
			uniList,
			uniListItem
		},
		data() {
			return {
				menuList: [],
				type: 0
			}
		},
		onShow() {
			// console.log(Addaction)
		
			
			this.isLogin()
		},
		methods: {
			select(val) {

			},
			isLogin() {

				//判断缓存中是否登录过，直接登录
				try {
					const value = uni.getStorageSync('setUserData');
					console.log(value)
					if (!value) {
						//有登录信息
						console.log("已登录用户：", value);
						uni.redirectTo({
							url: '../login/login'
						})
					}else{
						const setuserData = uni.getStorageSync('setUserData');
						console.log(setuserData)
						if(setuserData.role){
							if (setuserData.role.id === 8 || setuserData.role.id === 9) {
								this.type = 0
							} else {
								this.type = 1
							}
							if (this.type === 0) {
								this.menuList = [
									// {
									// 	src: '../../static/images/prink.png',
									// 	name: "打印外码",
									// 	desc: "此功能需连接打印机",
									// 	router: '../print/print'
									// },
									 {
										src: '../../static/images/logo1.png',
										name: "商户信息",
										desc: "此功能用于修改商户资料",
										router: '../sellerMessage/sellerMessage'
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
									// , {
									// 	src: '../../static/images/logo1.png',
									// 	name: "标签码录入信息",
									// 	desc: "标签码录入信息",
									// 	router: '../codeInformation/codeInformation'
									// }
								]
							} else {
								this.menuList = [
									{
										src: '../../static/images/logo1.png',
										name: "商户信息",
										desc: "此功能用于修改商户资料",
										router: '../sellerMessage/sellerMessage'
									},{
									src: '../../static/images/logo1.png',
									name: "发货",
									desc: "扫码发货",
									router: '../deliverSellerNode/deliverSellerNode'
								}]
							}
						}else{
							this.$common.showToast("用户信息获取失败", "none")
						}
					}
				} catch (e) {
					// error
				}
			},
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
		.uni-list-cell__extra {
			flex: 0.5 !important;
		}
	}
</style>
