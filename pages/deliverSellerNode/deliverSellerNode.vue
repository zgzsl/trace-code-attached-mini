<template>
	<view class="good">
		<view class="box" v-if="!showError">
			<view class="deliverGoods" v-if="Number(active)===0">
				<view class="context">
					<view class="header">
						<view class="left">列表</view>
						<view class="btn" @tap="scanCode">添加编号</view>
					</view>
					<view class="content">
						<view class="item" style="position: relative;" v-for="(item,index) in codeArr" v-if="codeArr.length>0" :key="index">
							<text style="font-size: 26rpx;">子码编号：</text><text style="font-size: 26rpx;">{{item.traceSubCodeNumber||""}}</text>
							<icon type="cancel" size="26" @tap="deleteCode(index)" />
							<text style="position: absolute;left: 86upx;bottom: -5px;">sid : {{item.traceSid}}</text>
						</view>
						<view class="item" style="color: rgba(128,128,128,1);" v-if="codeArr.length===0">
							暂无编号
						</view>
					</view>
				</view>

			</view>
			<view class="deliverFinish" v-if="Number(active)===1">
				<view class="context">
					<radio-group @change="radioChange">
						<view class="title_header">
							模式
						</view>
						<view class="context_item">
							<radio style="margin-left: 10px;" color='rgb(246, 64, 70)' value="0" :checked="0 === current" />
							<view class="title">已经出售</view>


						</view>
						<view class="context_item">
							<radio style="margin-left: 10px;" color='rgb(246, 64, 70)' value="1" :checked="1 === current" />
							<view class="title">添加节点</view>

						</view>
						<view v-if="1===current">
							<view class="title_header">
								节点信息
							</view>
							<view class="context_item">
							
								<view class="title">手机号码：</view>
								<input type="text" v-model="contactNumber" placeholder="输入手机号码" />
							</view>
							<view class="context_item">
							
								<view class="title">追溯点名称：</view>
								<input type="text" v-model="otherMerchant.tracePointName" :disabled="sellerNameSelect" placeholder="输入名称" />
							</view>
							<view class="context_item">
							
								<view class="title">负责人：</view>
								<input type="text" v-model="otherMerchant.personInCharge" :disabled="userNameSelect" placeholder="输入名称" />
							</view>
						</view>
					</radio-group>

				</view>

			</view>
			<view class="btn_box">
				<button type="primary" class="btn" @tap="active=0" v-if=" active===1">上一步</button>
				<button type="primary" class="btn" @tap="next" v-if="active===0">下一步</button>
				<button type="primary" class="btn" v-if="active===1" @tap="nextConfirm">完成</button>
			</view>
		</view>
		<error :text="text" v-if="showError" :type="type" @scanCode='scanCode'></error>
	</view>

</template>

<script>
	import error from '../../components/scodeError.vue'
	export default {
		components: {
			error
		},
		data() {
			return {
				sellerNameSelect: true, //是否被禁止输入
				userNameSelect: false, //是否被禁止输
				userName: '', //用户名信息
				type: 'scanCode', //扫码类型
				text: '扫码错误', //错误信息
				showError: false, //错误判断
				current: 0, //索引
				codeArr: [], //码的数组
				arr: [],
				index: 0,
				active: 0, //切换上下页
				count: 0,
				timeId: '',
				mobileInfo: {},
				orSearch: false,
				otherMerchant: {
					tracePointName: '',
					personInCharge: ''
				},
				contactNumber: '',
				activity: '',
				flag: '',
				info: {}
			}
		},
		watch: {

			//深度监听数组
			"codeArr": {
				handler(value) {
					let count = 0;
					for (let item of this.codeArr) {
						count += item.count
					}
					this.count = count
				},
				deep: true
			},
			'contactNumber'() {
				this.getMoblieUserMess()

			}

		},
		onShow() {
			//扫码枪的使用
			// #ifdef APP-PLUS

			let main = plus.android.runtimeMainActivity(); //获取activity  
			this.activity = main
			let context = plus.android.importClass('android.content.Context'); //上下文  
			let receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
				onReceive: doReceive
			});
			this.flag = receiver
			let IntentFilter = plus.android.importClass('android.content.IntentFilter');
			let Intent = plus.android.importClass('android.content.Intent');
			let filter = new IntentFilter();

			//针对优博讯安卓PDA-i6300A添加监听，其它优博讯的型号应该一样或类似
			filter.addAction("android.intent.ACTION_DECODE_DATA"); //监听扫描


			main.registerReceiver(receiver, filter); //注册监听  
			let that = this

			function doReceive(context, intent) {

				//通过intent实例引入intent类，方便以后的‘.’操作  
				plus.android.importClass(intent);

				//条码内容
				let barcodeBytes = intent.getByteArrayExtra("barcode");
				let barcode = byteToString(barcodeBytes);

				//条码长度
				let barcodeLength = intent.getIntExtra("length", 0);
				//var myArray = new ArrayBuffer(0);
				//条码类型
				let barcodeTypeBytes = intent.getByteExtra("barcodeType", (0 | 0));
				let barcodeType = byteToString(barcodeTypeBytes);

				if (barcode && barcode.indexOf(that.$common.host_name) > -1) {
					let sid = barcode.split(that.$common.host_name)[1]
					that.getzsCodeMumber(sid)
				} else {
					that.showError = true
					that.text = "关联子码获取失败"
					that.type = 'scanCode'
				}
				//console.log(barcode);  
				//main.unregisterReceiver(receiver);//取消监听  
			}

			function byteToString(arr) {
				if (typeof arr === 'string') {
					return arr;
				}
				var str = '',
					_arr = arr;
				for (var i = 0; i < _arr.length; i++) {
					var one = _arr[i].toString(2),
						v = one.match(/^1+?(?=0)/);
					if (v && one.length == 8) {
						var bytesLength = v[0].length;
						var store = _arr[i].toString(2).slice(7 - bytesLength);
						for (var st = 1; st < bytesLength; st++) {
							store += _arr[st + i].toString(2).slice(2);
						}
						str += String.fromCharCode(parseInt(store, 2));
						i += bytesLength - 1;
					} else {
						str += String.fromCharCode(_arr[i]);
					}
				}
				return str;
			}

			// #endif

		},

		destroyed() {
			// #ifdef APP-PLUS
			this.activity.unregisterReceiver(this.flag); //取消监听  
			// #endif

		},
		onHide() {

			// #ifdef APP-PLUS
			this.activity.unregisterReceiver(this.flag); //取消监听  
			// #endif
		},
		onUnload() {

			// #ifdef APP-PLUS
			this.activity.unregisterReceiver(this.flag); //取消监听  
			// #endif
		},
		methods: {

			//通过设备获取扫码信息
			getzsCodeMumber(sid) {
				let that = this

				this.$common.get('/trace-api/other/isCurrentNodeNewest?sid=' + sid).then((res) => {
					console.log(res)
					if (res.data.code === 200) {
						if (res.data.data) {
							this.$common.get("/trace-api/trace/getSubCodeById?sid=" + sid).then((res) => {
								if (Number(res.data.code) === 200) {
									console.log("发货对象", res)
									that.showError = false
									if (Number(res.data.data.isEnable) > 0) {
										if (that.codeArr.length > 0) {
											let codes = []
											for (let item of that.codeArr) {
												codes.push(item.traceSubCodeNumber)
											}
											if (codes.indexOf(res.data.data.traceSubCodeNumber) > -1) {
												that.$common.showToast("子码编号已存在", "none")
											} else {
												that.$common.showToast("扫码成功", "success")
												that.codeArr.push({
													traceSid: res.data.data.traceSid,
													count: res.data.data.count,
													traceSubCodeNumber: res.data.data.traceSubCodeNumber
												})
											}
										} else {
											that.$common.showToast("扫码成功", "success")
											that.codeArr.push({
												traceSid: res.data.data.traceSid,
												count: res.data.data.count,
												traceSubCodeNumber: res.data.data.traceSubCodeNumber
											})
										}
									} else {
										that.$common.showToast("此编码已发货", "none")
									}
									console.log(that.codeArr)
								} else {
									that.showError = false
									that.$common.showToast(res.data.message, 'none')
								}
							})
						} else {
							that.$common.showToast('不属于该追溯码最新的流通节点', 'none')
						}

					} else {
						that.$common.showToast(res.data.message, 'none')
					}
				})

			},
			radioChange(evt) {
				console.log(evt)
				this.current = Number(evt.detail.value)
				console.log(this.current)
				this.otherMerchant= {
					tracePointName: '',
					personInCharge: ''
				},
				this.contactNumber=''
			},
			next() {
				if (this.codeArr.length > 0) {
					this.active = 1;
				} else {
					this.$common.showToast("请添加货物", 'none')
				}
			},
			getMoblieUserMess() {
				uni.showLoading({
					mask: true,
					title: '正在检索...'
				})

				this.$common.getNot('/trace-api/other/getNodeByMobile?mobile=' + this.contactNumber).then((res) => {
					console.log(typeof res.data.data)
					if (res.data.code === 200) {
						// this.
						if (typeof res.data.data === 'number') {
							this.otherMerchant = {
								tracePointName: '',
								personInCharge: ''
							}
							this.sellerNameSelect = false,
								this.userNameSelect = false
							// this.$common.showToast("暂无信息", 'none')
							this.orSearch = false
						} else {
							this.info = res.data.data
							this.otherMerchant = {
								tracePointName: res.data.data.tracePointName,
								personInCharge: res.data.data.personInCharge
							}
							this.orSearch = true
							this.contactNumber = res.data.data.contactNumber
							this.sellerNameSelect = true,
								this.userNameSelect = true
						}
						console.log(this.otherMerchant)
					} else {
						this.$common.showToast("信息获取失败", 'none')
					}
				})
			},
			nextConfirm() {
				this.otherMerchant.contactNumber = this.contactNumber
				if (this.codeArr.length === 0) {
					this.$common.showToast("外码或内码不能为空", 'none')
					return;
				}
				if(this.current===1){
					for (let s of Object.values(this.otherMerchant)) {
						if (!s) {
							this.$common.showToast("节点信息需填写完整", 'none')
							return false
						}
					}
				}
				

				let arr = []
				for (let item of this.codeArr) {
					arr.push(item.traceSubCodeNumber)
				}
				let param = {
					codeNumber: arr,
					accountId: !this.orSearch ? -1 : this.info.accountId,
					otherMerchant: this.otherMerchant,
					mode: this.current === 0 ? 1 : 2
				}
				console.log(param)
				this.$common.post('/trace-api/trace/deliverGoods', param).then((res) => {
					console.log(res)
					if (Number(res.data.code) === 200) {
						this.$common.showToast(res.data.message, 'success')
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 1500)
					} else {
						this.$common.showToast(res.data.message, 'none')
					}
				})


			},
			jump() {
				this.active = 1
			},
			deleteCode(index) {
				uni.showModal({
					title: '提示',
					content: '此操作将删除此编号',
					success: (res) => {
						if (res.confirm) {
							this.codeArr.splice(index, 1);
							this.$common.showToast("删除成功", "success")
						}
					}
				});

			},
			scanCode() {
				uni.scanCode({
					success: (res) => {
						let that = this
						if (res.result && res.result.indexOf(that.$common.host_name) > -1) {
							let sid = res.result.split(that.$common.host_name)[1]


							this.$common.get('/trace-api/other/isCurrentNodeNewest?sid=' + sid).then((res) => {
								console.log(res)
								if (res.data.code === 200) {
									if (res.data.data) {
										this.$common.get("/trace-api/trace/getSubCodeById?sid=" + sid).then((res) => {
											if (Number(res.data.code) === 200) {
												console.log("发货对象", res)
												that.showError = false
												if (Number(res.data.data.isEnable) > 0) {
													if (that.codeArr.length > 0) {
														let codes = []
														for (let item of that.codeArr) {
															codes.push(item.traceSubCodeNumber)
														}
														if (codes.indexOf(res.data.data.traceSubCodeNumber) > -1) {
															that.$common.showToast("子码编号已存在", "none")
														} else {
															that.$common.showToast("扫码成功", "success")
															that.codeArr.push({
																traceSid: res.data.data.traceSid,
																count: res.data.data.count,
																traceSubCodeNumber: res.data.data.traceSubCodeNumber
															})
														}
													} else {
														that.$common.showToast("扫码成功", "success")
														that.codeArr.push({
															traceSid: res.data.data.traceSid,
															count: res.data.data.count,
															traceSubCodeNumber: res.data.data.traceSubCodeNumber
														})
													}
												} else {
													that.$common.showToast("此编码已发货", "none")
												}



												console.log(that.codeArr)
											} else {
												that.showError = false
												that.$common.showToast(res.data.message, 'none')
											}
										})
									} else {
										that.$common.showToast('不属于该追溯码最新的流通节点', 'none')
									}

								} else {
									that.$common.showToast(res.data.message, 'none')
								}

							})
						} else {
							this.showError = true
							this.text = "关联子码获取失败"
							this.type = 'scanCode'
						}
					}
				});
			}
		}
	}
</script>

<style lang="less">
	.deliverFinish {
		.context {
			margin: 10px 10px;

			.title_header {
				font-size: 28upx;
				padding: 15upx;
			}

			.context_item {
				border-radius: 10px;
				border: 1px solid #ccc;
				display: flex;
				font-size: 14px;

				align-items: center;
				margin: 10px 0;

				.title {
					padding: 20rpx 10rpx;
					font-size: 24upx;
				}

				.picker {
					flex: 1;
				}
			}
		}
	}

	.deliverGoods {
		padding: 30rpx 30rpx 0;

		.context {
			overflow-y: hidden;
			border: 1px solid #ccc;
			border-radius: 10px;

			.header {
				justify-content: center;
				align-items: center;
				display: flex;
				color: rgba(255, 255, 255, 1);
				padding: 10px 5px;
				background: linear-gradient(to left, #f53647, #fd973c);
				font-size: 30rpx;
				justify-content: space-between;

				.left {
					display: flex;
				}

				.btn {
					color: #F53747;
					border-radius: 5px;
					border: 1px solid #fff;
					padding: 10rpx 20rpx;
					font-size: 24rpx;
					color: #000;
					background: #fff;
				}
			}

			.content {
				overflow-y: scroll;
				height: calc(100vh - 400rpx);
				font-size: 14px;
				background: rgba(242, 242, 242, 1);
				margin: 10px;

				.item {
					position: relative;
					display: flex;
					align-items: center;
					padding: 10px 2px;
					justify-content: space-around;

				}
			}
		}

	}
</style>
