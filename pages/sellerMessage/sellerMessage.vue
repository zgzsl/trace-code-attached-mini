<template>
	<view class="sellerMessage">
		<view class="line">
			<view class="left">
				手机号码：
			</view>
			<view class="center">
				13246432412
			</view>

		</view>

		<view class="line">
			<view class="left">
				名称：
			</view>
			<view class="center">
				<input type="text"  :focus="showPopupBottom" @blur="blurChangeName" v-model="sellerName" class="sellerName"/>
			</view>
			<view class="right" @tap="changeName">
				<image src="../../static/edtor.png" mode="aspectFill"></image>
			</view>
		</view>
		<view class="line">
			<view class="left">
				流通地址：
			</view>
			<view class="center">
				广东省汕头市某某区....
			</view>
			<view class="right" @tap="tapWeizhi">
				<image src="../../static/wz.png" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
	// getLocation(OBJECT)
	export default{
		data(){
			return {
					startName:'',
					sellerName:'广东皮草批发部',
					showPopupBottom:false
			}
		},
		created(){
			this.startName=this.sellerName
		},
		methods:{
			
			tapWeizhi(){
				uni.navigateTo({
					url:'../getLocation/getLocation'
				})
			},
			changeName(e){
				this.showPopupBottom=true
			
			},
			blurChangeName(){
				console.log(this.startName)
					console.log(this.sellerName)
				if(this.startName===this.sellerName){
					
				}else{
					uni.showModal({
						content:"asdsad"
					})
				}
				
			}
		}
	}
</script>

<style lang="less">
	.sellerMessage {
		padding: 15upx 30upx 0;
		font-size: 28upx;
		color:#808080;
		.line {
			padding: 10px 0;
			display: flex;
			border-bottom:1upx solid #808080;
			justify-content: center;
			align-items: center;
			.left {
				width: 150upx;
				text-align: right;
			}
			.center{
				flex: 1;
			}
			.right{
				padding-right:15upx;
				image{
					width: 100%;
					height: 100%;
				}
				width: 46upx;
				height: 46upx;
			}
		}
	}
</style>
