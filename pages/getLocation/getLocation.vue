<template>
	<view class="getLocation" @tap="show=false">
		<view class="search_list">
			<view class="search_input" @tap.stop="show=true">
				<image src="../../static/img/search.png" mode="widthFix"></image>
				<input type="text" class="input_box" placeholder="输入目标地点" v-model="keywords" @input="bindInput" />
			</view>

			<view class="search_box acitve_search_box" v-if="dataArr.length>0&&show">
				<view class="item" v-for="(item,index) in dataArr" :key="index" @tap="selectAdress(item)">
					<image src="../../static/img/marker_checked.png" mode="widthFix"></image>
					<view class="text_box">
						<view class="top">{{item.name}}</view>
						<view class="bottom">{{item.district}}{{item.address}}{{item.name}}</view>

					</view>
				</view>
			</view>
			<view class="search_box" v-if="dataArr.length===0&&keywords">
				<view class="item" style="text-align: center;">
					暂无查询结果
				</view>
			</view>
			<view class="search_box" v-if="!keywords">
				<view class="item" style="text-align: center;" v-if="!keywords">
					温馨提醒：请输入具体地址，点击可更改用户信息
				</view>
			</view>
		</view>
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map style="width: 100%; height: calc(100vh - 750upx);" :labels="labels" :show-location="true" :markers="markers"
				 @markertap="makertap" :latitude="latitude" :longitude="longitude" scale="16">
				</map>

			</view>
		</view>

	</view>
</template>

<script>
	let amapFile = require('../../common/amap-wx.js');
	let myAmapFun = new amapFile.AMapWX({
		key: '2649cf46ba2417b42f9fe36f53c57f63'
	});
	export default {
		data() {

			return {
				keywords: '',
				setUserData: {},
				show: true,
				markers: [],
				latitude: 23.13,
				longitude: 113.27,
				city: '',
				myAmapFunflag: '',
				dataArr: [],
				maskerClick: false,
				labels: []
			}
		},
		onLoad() {
			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					console.log(res)
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					let markers = []
					myAmapFun.getRegeo({
						iconPath: '../../static/img/marker.png',
						location: res.longitude + ',' + res.latitude, //经纬度
						success: (data) => {
							console.log(data)
							// let markersData = data.markers;

							this.markers = [{
								id: data[0].id,
								latitude: data[0].latitude,
								longitude: data[0].longitude,
								iconPath: data[0].iconPath,
								width: 40,
								height: 60,
								label: {
									content: data[0].name,
									fontSize: 16,
									bgColor: '#fff',
									textAlign: 'left',
									borderRadius: 5,
									padding: 3,
									color: 'red',
									width: 200
								}
							}]

							this.latitude = data[0].latitude

							this.longitude = data[0].longitude
							// that.showMarkerInfo(markersData, 0);
						},
						fail: function(info) {
							uni.showModal({
								title: info.errMsg
							})
						}
					})


				}
			});

		},
		methods: {
			makertap(e) {
				let id = e.markerId;
				let that = this;
				// that.showMarkerInfo(this.markers,id);
				that.changeMarkerColor(this.markers, id);
			},
			changeMarkerColor(data, i) {
				if (!this.maskerClick) {
					console.log(data)

					uni.showModal({
						content: "确定更改地址?",
						success: (res) => {
							if (res.confirm) {
								let that = this;
								let markers = [];
								let labels = []

								data[0].iconPath = "../../static/img/marker_checked.png";
								this.setUserMessage(data[0].label.content)
								this.maskerClick = true

								console.log(data)
								// data[j].iconPath = "../../static/img/marker_checked.png";
								markers.push({
									id: data[0].id,
									latitude: data[0].latitude,
									longitude: data[0].longitude,
									iconPath: data[0].iconPath,
									width: data[0].width,
									height: data[0].height,
									label: {
										content: data[0].label.content || data[0].regeocodeData.formatted_address,
										fontSize: 16,
										bgColor: '#fff',
										textAlign: 'right',
										borderRadius: 5,
										padding: 3,
										color: 'red'
									}
								})


								this.latitude = data[0].latitude

								this.longitude = data[0].longitude
								this.markers = markers
								console.log("可以了")
							}
						}
					})
				}
			},
			selectAdress(item) {
				this.maskerClick = false
				if (item.location.length === 0) {
					uni.showToast({
						title: '请输入具体地址',
						icon: 'none'
					})
					return false
				}
				this.longitude = item.location.split(',')[0]
				this.latitude = item.location.split(',')[1]
				this.show = false
				this.myAmapFunflag.getRegeo({
					iconPath: '../../static/img/marker.png',
					location: this.longitude + ',' + this.latitude, //经纬度
					success: (data) => {
						console.log(data)
						// let markersData = data.markers;
						this.maskerClick = true
						this.markers = [{
							id: data[0].id,
							latitude: data[0].latitude,
							longitude: data[0].longitude,
							iconPath: data[0].iconPath,
							width: 40,
							height: 60,
							label: {
								content: data[0].regeocodeData.formatted_address,
								fontSize: 16,
								bgColor: '#fff',
								textAlign: 'right',
								borderRadius: 5,
								padding: 3,
								color: 'red'
							}
						}]

						this.latitude = data[0].latitude

						this.longitude = data[0].longitude
						// that.showMarkerInfo(markersData, 0);


						uni.showModal({
							content: "确定更改地址?",
							success: (res) => {
								if (res.confirm) {
									let that = this;
									let markers = [];
									let labels = []
									data[0].iconPath = "../../static/img/marker_checked.png";
									markers.push({
										id: data[0].id,
										latitude: data[0].latitude,
										longitude: data[0].longitude,
										iconPath: data[0].iconPath,
										width: data[0].width,
										height: data[0].height,
										label: {
											content: data[0].regeocodeData.formatted_address,
											fontSize: 16,
											bgColor: '#fff',
											textAlign: 'right',
											borderRadius: 5,
											padding: 3,
											color: 'red'
										}
									})
									this.latitude = data[0].latitude
									this.longitude = data[0].longitude
									this.markers = markers
									this.setUserMessage(data[0].regeocodeData.formatted_address)
									console.log("可以了")
								}
							}
						})
					},
					fail: function(info) {
						uni.showModal({
							title: info.errMsg
						})
					}
				})
				console.log(this.myAmapFunflag)
			},

			//設置地址
			setUserMessage(address) {
				let tracePoint = ''
				this.setUserData = uni.getStorageSync('setUserData');
				console.log(this.setUserData)
				if (this.setUserData.role.id === 9 || this.setUserData.role.id === 10 || this.setUserData.role.id === 11) {
					if (this.setUserData.role.id === 9) {
						tracePoint = this.setUserData.merchant.merchantName
					} else {
						tracePoint = this.setUserData.distributeNode.tracePoint
					}
				} else {
					tracePoint = this.setUserData.merchant.merchantName
				}
				this.$common.post('/accountCenter/account/updateNode', {
					"location": address,
					"tracePoint":tracePoint
				}).then((res) => {
					
					if (res.data.statusCode === 200) {
						this.$common.showToast('修改成功', 'success')
						uni.setStorageSync('setUserData', res.data.data);
						setTimeout(() => {
							uni.navigateBack({
								url: -1
							})
						}, 2000)
					} else {
						this.$common.showToast(res.data.statusMsg, 'none')
					}
				})
			},
			bindInput(e) {
				if (!e.detail.value) {
					this.dataArr = []
					return false
				}
				console.log(e)
				this.myAmapFunflag = myAmapFun
				let that = this
				myAmapFun.getInputtips({
					keywords: e.detail.value,
					success: (data) => {
						console.log(data.tips)

						that.dataArr = data.tips
						console.log(that.dataArr)
					}
				})
				let params = {
					iconPathSelected: '../../static/img/marker_checked.png',
					iconPath: '../../static/img/marker.png',
					success: function(data) {
						console.log(data)
					},
				}
				myAmapFun.getPoiAround(params)

			}
		}
	}
</script>

<style lang="less" scoped>
	.getLocation {
		height: 100vh;
		position: relative;
	}

	.search_list {
		position: fixed;
		bottom: 630upx;
		left: 0;
		height: 120upx;
		width: 100%;
		// position: relative;
		z-index: 10;
		background: rgba(255, 255, 255, 1);
		opacity: 0.95;
		border-radius: 20px 20px 0px 0px;

		.search_box {
			z-index: 2000 !important;
			position: relative;
			left: 0;
			top: 0;
			// background: rgb(245, 245, 245);
			width: 100%;
			background: rgba(255, 255, 255, 1);
			opacity: 0.95;

			.item {
				// padding-left: ;
				border-bottom: 1px solid #C0C0C0;
				padding: 15upx 15upx 15upx 15upx;
				font-size: 24upx;
				display: flex;
				flex-direction: row;
				align-items: center;

				image {
					width: 35upx;
					height: 35upx;
					margin: 0 15upx;
					// position: absolute;
					// left: 25upx;
					// top: 20upx;

				}

				.top {
					font-size: 30upx;
				}

				.text_box {
					display: flex;
					flex-direction: column;
				}

			}

			.item:last-child {
				border-bottom: none;
			}

			&.acitve_search_box {
				min-height: 10px !important;
				max-height: calc(800upx) !important;
				overflow: scroll;

			}
		}

		.search_input {
			position: relative;
			left: 0;
			top: 0;
			width: calc(100% - 30upx);
			height: 120upx;

			display: flex;
			justify-content: center;
			padding: 0 15upx;
			align-items: center;

			image {
				width: 35upx;
				height: 35upx;
				position: absolute;
				left: 25upx;

			}

			.input_box {
				height: 80upx;

				padding-left: 50upx;
				border-radius: 10px;
				background: rgba(242, 242, 242, 1);
				// padding-left: 12upx;
				font-size: 24upx;
				flex: 1;
			}
		}
	}
</style>
