<template>
	<view class="sellerMessage">
		<view class="line">
			<view class="left">
				手机号码：
			</view>
			<view class="center">
				{{setUserData.mobile}}
			</view>

		</view>

		<view class="line">
			<view class="left">
				流通名称：
			</view>
			<view class="center">
				<!-- <text class="center_text" v-if="!showPopupBottom">{{tracePoint}}</text> -->
				<input   type="text" :disabled="editorOr" :focus="showPopupBottom" @blur="blurChangeName" v-model="tracePoint" class="sellerName" />
			</view>
			<view class="right" @tap="changeName" v-if="!editorOr">
				<image src="../../static/edtor.png" mode="aspectFill"></image>
			</view>
		</view>
		<view class="line">
			<view class="left">
				流通地址：
			</view>
			<view class="center">
				{{location || '暂无地址'}}
			</view>
			<view class="right" @tap="tapWeizhi" v-if="!editorOr">
				<image src="../../static/wz.png" mode="aspectFill"></image>
			</view>
		</view>
	</view>
</template>

<script>
	// getLocation(OBJECT)
	export default {
		data() {
			return {
				location: '',
				startName: '',
				tracePoint: '广东皮草批发部',
				showPopupBottom: false,
				setUserData: {},
				editorOr:true,
			}
		},
		onShow() {

			this.setUserData = uni.getStorageSync('setUserData');
			console.log(this.setUserData)
			if (this.setUserData.role) {
				if (this.setUserData.role.id === 9||this.setUserData.role.id === 10 || this.setUserData.role.id === 11) {
					
				
					if(this.setUserData.role.id===9){
						this.location = this.setUserData.subMerchant.location
						this.tracePoint = this.setUserData.merchant.merchantName
						this.startName = this.tracePoint
						
					}else{
						this.location = this.setUserData.distributeNode.location
						this.tracePoint = this.setUserData.distributeNode.tracePoint
						this.startName = this.tracePoint
					}
					this.editorOr=false
				}else{
					this.location = this.setUserData.merchant.merchantDetailSite
					this.tracePoint = this.setUserData.merchant.merchantName
					this.startName = this.tracePoint
					this.editorOr=true
				}
			}

		},
		methods: {

			tapWeizhi() {
				uni.navigateTo({
					url: '../getLocation/getLocation'
				})
			},
			changeName(e) {
				this.showPopupBottom = true
			},
			setUserMessage() {
				this.$common.post('/accountCenter/account/updateNode', {
					"location": this.location,
					"tracePoint": this.tracePoint
				}).then((res) => {
					
					if(res.data.statusCode===200){
						this.$common.showToast("修改成功",'success')
						uni.setStorageSync('setUserData', res.data.data);
						this.showPopupBottom=false
					}else{
						this.$common.showToast(res.data.statusMsg,'none')
					}
				})
			},
			blurChangeName() {
				if (this.startName !== this.tracePoint) {
					uni.showModal({
						title: '此操作',
						content: "确定要更改用户信息?",
						success: (res) => {
							console.log(res.confirm)
							if (res.confirm) {
								this.startName = this.tracePoint
								this.setUserMessage()
							}

						}
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
		color: #808080;

		.line {
		
			padding: 10px 0;
			display: flex;
			border-bottom: 1upx solid #808080;
			justify-content: center;
			align-items: center;
			flex-direction: row;
			flex-wrap: wrap;

			.left {
				width: 150upx;
				text-align: right;
			}

			.center {
				flex: 1;
				.center_text{
					cursor: auto;
					display: block;
					height: 1.4rem;
					text-overflow: clip;
					overflow: hidden;
					white-space: nowrap;
					font-family: UICTFontTextStyleBody;
					min-height: 1.4rem;
					line-height: 1.4rem

				}
			}

			.right {
				padding-right: 15upx;

				image {
					width: 100%;
					height: 100%;
				}

				width: 46upx;
				height: 46upx;
			}
		}
	}
</style>
