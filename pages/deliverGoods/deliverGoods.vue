<template>
	<view class="good">
		<view class="box" v-if="!showError">
			<view class="deliverGoods" v-if="Number(active)===0">
				<view class="context">
					<view class="header">
						<view class="left"><text>统计:</text><text>共{{count}}件货物</text></view>
						<view class="btn" @tap="scanCode">扫一扫</view>
					</view>
					<view class="content">
						<view class="item" style="position: relative;" v-for="(item,index) in codeArr" v-if="codeArr.length>0" :key="index">
							<text style="font-size: 26rpx;">子码编号：</text><text style="font-size: 26rpx;">{{item.traceSubCodeNumber||""}}</text>
							<text style="position: absolute;left: 86upx;bottom: -5px;">sid : {{item.traceSid}}</text>
							<icon type="cancel" size="26" @tap="deleteCode(index)" />
						</view>
						<view class="item" style="color: rgba(128,128,128,1);" v-if="codeArr.length===0">
							暂无货物
						</view>
					</view>
				</view>

			</view>
			<view class="deliverFinish" v-if="Number(active)===1">
				<view class="context">
					<radio-group @change="radioChange">
						<view class="context_item">
							<radio style="margin-left: 10px;" color='rgb(246, 64, 70)' value="0" :checked="0 === current" />
							<view class="title">代理商：</view>
							<!-- 	<picker class="picker" range-key="agentName" mode="selector" @change="bindPickerChange" :value="index" :range="List">
								{{List.length>0 ?  List[index].agentName : '' || '暂无数据'}}
							</picker> -->
							<view style="width: 100%;flex: 1;" @tap="visibleMethod">
								{{List.length>0 ?  List[index].agentName  : flagValue || '暂无数据'}}
							</view>
						</view>
						<view class="context_item">
							<radio style="margin-left: 10px;" color='rgb(246, 64, 70)' value="1" :checked="1 === current" />
							<view class="title">输入自定义商家</view>
						</view>
						<view class="context_item">

							<view class="title">手机号码：</view>
							<input type="number" v-model="contactNumber" :disabled="current===0" placeholder="输入手机号码" />
						</view>
						<view class="context_item">

							<view class="title">追溯点名称：</view>
							<input type="text" v-model="otherMerchant.tracePointName" :disabled="sellerNameSelect" placeholder="输入追溯点名称" />
						</view>
						<view class="context_item">

							<view class="title">负责人：</view>
							<input type="text" v-model="otherMerchant.personInCharge" :disabled="userNameSelect" placeholder="输入负责人" />
						</view>
					</radio-group>

				</view>

			</view>
			<view class="btn_box">
				<button type="primary" class="btn" @tap="last" v-if=" active===1">上一步</button>
				<button type="primary" class="btn" @tap="next" v-if="active===0">下一步</button>
				<button type="primary" class="btn" v-if="active===1" @tap="nextConfirm">完成</button>
			</view>
		</view>
		<uni-drawer  mode='right' ref='uniDrawer'>

		</uni-drawer>
		<hj-dragabledrawer :options="options" ref="dragBox">
			<view style="position: relative;padding-top: 80upx;">
				<input type="text" v-model="inputValue" placeholder="请输入代理商名称" style="font-size: 24upx;padding: 12px 0;;position: absolute;left: 0;top: 0;width: 100%;"
				 @input="inputSearch" />
				<scroll-view scroll-y="true" style="height: 100vh;">
					<view v-if="List.length>0" v-for="(item,index) in List" :key="index" @tap='select(item,index)' style="font-size: 24upx; padding: 12px ;margin:5upx 0 ;background: rgb(228, 230, 241);">
						{{item.agentName}}
					</view>
					<view v-if="List.length===0" style="font-size: 24upx; padding: 12px ;margin:5upx 0 ;text-align: center;background: rgb(228, 230, 241);">
						检索结果为空
					</view>
				</scroll-view>
			</view>
		</hj-dragabledrawer>
		<error :text="text" v-if="showError" :type="type" @scanCode='scanCode'></error>
	</view>

</template>

<script>
	import error from '../../components/scodeError.vue'
	import hjDragabledrawer from '@/components/hj-dragabledrawer/hj-dragabledrawer.vue';
	let dragBox;
	export default {
		components: {
			error,
			hjDragabledrawer
		},
		data() {
			return {
				options: {
					visible: false,
					rightMode: false,
					autoClose: true,
					pulldown: true
				},
				flagValue:'',
				inputValue: '',
				sellerNameSelect: false,
				userNameSelect: false,
				type: 'scanCode',
				text: '扫码错误',
				showError: false,
				current: 0,
				codeArr: [],
				arr: ['中国', '美国', '巴西', '日本'],
				index: 0,
				active: 0,
				List: [],
				count: 0,
				flag: '',
				orSearch: false,
				activity: '',
				otherMerchant: {
					tracePointName: '',
					personInCharge: ''
				},
				merchantId:'',
				info: {},
				contactNumber: ''
			}
		},
		watch: {
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
			'contactNumber'(val) {
				if (this.current === 1) {
					console.log(val)
					if (val.length > 10) {
						if (val) {
							this.getMoblieUserMess()
						}
					}

				}
			}

		},
		methods: {
			inputSearch() {
				
				// console.log("merchantId",merchantId)
				this.$common.getNot('/agent/merchantAgent/normal?merchantId='+this.merchantId+'&agentName='+this.inputValue).then((res) => {
					console.log(res)
					this.List = res.data.data || []
				})

			},
			open() {
				dragBox.open();
			},
			hello() {
				uni.showToast({
					title: 'hello',
					icon: 'none'
				});
			},
			close() {
				dragBox.close();
			},
			toggle() {
				this.options.rightMode = !this.options.rightMode;
			},
			toggle1() {
				this.$set(this.options, 'mask', !this.options.mask);
			},

			last() {
				this.active = 0;
				dragBox.close();
			},
			visibleMethod() {
				dragBox.open();
			},
			onShow() {
			this.merchantId = uni.getStorageSync("setUserData").merchant.merchantId
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
							this.orSearch = false
							this.$common.showToast("暂无信息", 'none')
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
						uni.hideLoading()
					} else {
						this.$common.showToast("信息获取失败", 'none')
					}
				})
			},
			radioChange(evt) {
				console.log(evt.detail.value)
				this.current = Number(evt.detail.value)
				console.log(this.current === 1)
				if (this.current === 1) {
					this.contactNumber = ''
				} else {
					console.log("this.List[this.index].contactNumber",this.List[this.index])
					this.contactNumber = this.List[this.index].mobile
					this.getMoblieUserMess()
				}
				this.otherMerchant = {
					tracePointName: "",
					personInCharge: ''
				}

				console.log(this.current)

			},
			getzsCodeMumber(sid) {
				let that = this

				this.$common.get('/trace-api/other/isCurrentNodeNewest?sid=' + sid).then((res) => {
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
											console.log(codes)
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
			next() {
				if (this.codeArr.length > 0) {
					this.active = 1;
					// dragBox.open();
				} else {
					this.$common.showToast("请添加货物", 'none')
				}
			},
			nextConfirm() {
				if (this.codeArr.length === 0) {
					this.$common.showToast("外码或内码不能为空", 'none')
					return;
				}
				this.otherMerchant.contactNumber = this.contactNumber

				let arr = []
				for (let item of this.codeArr) {
					arr.push(item.traceSubCodeNumber)
				}
				let param = {
					codeNumber: arr,
					accountId: !this.orSearch ? -1 : this.info.accountId,
					otherMerchant: this.otherMerchant,
					mode: 2
				}
				for (let s of Object.values(this.otherMerchant)) {
					if (!s) {
						this.$common.showToast("节点信息需填写完整", 'none')
						return false
					}
				}

				console.log(param)

				uni.showModal({
				    title: '确定要发货?',
				    success:  (res) =>{
				        if (res.confirm) {
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
				            		this.$common.showToast(res.data.message || '发货失败', 'none')
				            	}
				            })
				        } 
				    }
				});
			},
			getList() {
				let merchantId = uni.getStorageSync("setUserData").merchant.merchantId
				this.$common.get("/agent/merchantAgent/normal?merchantId=" + merchantId).then((res) => {
					console.log(res)
					this.List = res.data.data || []
					this.flagValue=this.List[0].agentName
					console.log("this.flagValue",this.flagValue)
					// this.List[0].mobile
					this.getOneData()


				})
			},
			getOneData() {
				if (this.current === 0) {
					if (this.List.length > 0) {
						this.contactNumber = this.List[0].mobile
						this.getMoblieUserMess()
					}
				}
			},
			select(item, index) {
				if (this.current === 0) {

					console.log(item)
					if (item) {
						if (item.mobile) {
							this.contactNumber = item.mobile
							this.flagValue=item.agentName
							this.getMoblieUserMess()
						}
					}
				}

				this.index = index
				dragBox.close();
			},
			bindPickerChange(e) {
				console.log(e)
				if (this.current === 0) {

					console.log(Number(e.target.value))
					if (this.List[Number(e.target.value)]) {
						if (this.List[Number(e.target.value)].mobile) {
							this.contactNumber = this.List[Number(e.target.value)].mobile
							this.getMoblieUserMess()
						}
					}
				}

				this.index = Number(e.target.value)

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
							console.log('sid', sid)

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
														console.log(codes)
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
		},
		onReady() {
			this.getList()
			dragBox = this.$refs.dragBox;
			// this.scanCode()
		}
	}
</script>

<style lang="less">
	.deliverFinish {
		.context {
			margin: 10px 10px;

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
				input{
					width: calc(100vw - 240upx);
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
