<template>
	<view class="relation">
		<view class="right" v-if="!showError">
			<view class="out" v-if="outCode">
				<view class="context">
					<view class="header">
						<view class="left"><text>外码编号:</text><text>{{outCode||""}}</text></view>
						<view class="btn" @tap="relation" v-if="!deliverGoods">关联子码</view>
						<view class="btn" v-if="deliverGoods">已发货</view>
					</view>

					<view class="content1" :class="{'contentMax':deliverGoods}">
						<mix-tree :list="list" :deliverGoods="deliverGoods" @treeItemClick="treeItemClick" @deleteCode="deleteCode"></mix-tree>
					</view>
					<!-- 	<view class="content2" >
						
					</view> -->
				</view>
				<view class="btn_box">
					<button type="primary" class="btn" @tap="confirm" v-if="!deliverGoods">完成</button>
				</view>
			</view>
			<view class="outbtn" v-if="!outCode">
				<button @tap="createdClick">扫一扫获取外码</button>
				<view style="font-size: 26upx;margin: 15upx 0;">温馨提醒：如果机器是扫码枪，使用机器自带按钮或者点击屏幕按钮方可使用</view>
			</view>
		</view>
		<error :text="text" v-if="showError" :type="type" @relation='relation' @createdClick='createdClick'></error>
	</view>
</template>

<script>
	import mixTree from '@/components/mix-tree/mix-tree';
	import error from '../../components/scodeError.vue'
	export default {
		data() {
			return {
				deliverGoods: false,
				text: '扫码错误',
				showError: false,
				outCode: "",
				chlidCodeArr: [],
				type: '',
				alonecode: "",
				list: [],
				flag: true,
				firstData: [],
				count: 0,
				flagClass: '',
				activity: ''
			}
		},
		components: {
			error,
			mixTree
		},
		onLoad() {

			// #ifdef APP-PLUS
			let main = plus.android.runtimeMainActivity(); //获取activity  
			this.activity = main
			let context = plus.android.importClass('android.content.Context'); //上下文  
			let receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
				onReceive: doReceive
			});
			this.flagClass = receiver
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
					if(that.outCode){
						that.getCodeZsNumberInside(sid)
					}else{
						 that.getCodeZsNumber(sid)
					}
				} else {
					
					that.showError = true
					if(that.outCode){
						that.text = "子码获取失败"
						that.type = 'relation'
					}else{
						that.text = "外码获取失败"
						that.type = 'createdClick'
					}
				}

				// that.title = barcode;
				//console.log(barcode);  
				// main.unregisterReceiver(receiver);//取消监听  
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
			this.activity.unregisterReceiver(this.flagClass);//取消监听  
			// #endif
		},
		onHide() {
			// #ifdef APP-PLUS
			this.activity.unregisterReceiver(this.flagClass);//取消监听  
			// #endif
		},
		onUnload() {
			 
			// #ifdef APP-PLUS
			this.activity.unregisterReceiver(this.flagClass);//取消监听  
			// #endif
		},
		methods: {
			//点击最后一级时触发该事件
			treeItemClick(item) {

			},
			getCodeZsNumber(sid){
				
				this.$common.get("/trace-api/trace/getSubCodeById?sid=" + sid).then((res) => {
				
					if (Number(res.data.code) === 200) {
						if (Number(res.data.data.isEnable) > 0) {
							this.deliverGoods = false
						} else {
							this.deliverGoods = true
						}
						if (res.data.data.isLeaf === 'N') {
							this.$common.showToast("扫码成功", "success")
							this.showError = false
							this.outCode = res.data.data.traceSubCodeNumber || ""
							this.getTree()
						} else {
							this.showError = true
							this.text = "此码不是外码,外码获取失败"
							this.type = 'createdClick'
						}
					} else {
						this.$common.showToast(res.data.message, 'none')
					}
				
				})
			},
			getCodeZsNumberInside(sid,text,type){
				
				this.$common.get("/trace-api/trace/getSubCodeById?sid=" + sid).then((res) => {
					this.count = 0
					if (Number(res.data.code) === 200) {
						if (this.chlidCodeArr.indexOf(res.data.data.traceSubCodeNumber) > -1) {
							this.$common.showToast("编码已存在", "none")
						} else {
							if (res.data.data.traceSubCodeNumber === this.outCode) {
								this.$common.showToast("不能关联本身", "none")
							} else {
				
								this.iterator(this.list, res.data.data.traceSubCodeNumber)
								console.log("this.count ", this.count)
								if (this.count > 0) {
									this.$common.showToast("编码已存在", "none")
									setTimeout(() => {
										this.getTree()
									}, 800)
									return false
								} else {
									this.chlidCodeArr.push(res.data.data.traceSubCodeNumber)
									this.getTree()
								}
							}
				
						}
					} else {
						that.$common.showToast(res.data.message, 'none')
					}
				})
			},
			createdClick() {
				uni.scanCode({
					success: (res) => {
						let that = this
						if (res.result && res.result.indexOf(that.$common.host_name) > -1) {
							let sid = res.result.split(that.$common.host_name)[1]
							this.$common.get("/trace-api/trace/getSubCodeById?sid=" + sid).then((res) => {

								if (Number(res.data.code) === 200) {
									if (Number(res.data.data.isEnable) > 0) {
										this.deliverGoods = false
									} else {
										this.deliverGoods = true
									}
									if (res.data.data.isLeaf === 'N') {
										that.$common.showToast("扫码成功", "success")
										that.showError = false
										that.outCode = res.data.data.traceSubCodeNumber || ""
										this.getTree()
									} else {
										this.showError = true
										this.text = "此码不是外码,外码获取失败"
										this.type = 'createdClick'
									}
								} else {
									that.$common.showToast(res.data.message, 'none')
								}

							})
						} else {
							this.showError = true
							this.text = "外获取失败"
							this.type = 'createdClick'
						}
					}
				});
			},
			confirm() {
				if (!this.outCode) {
					this.$common.showToast("外码不能为空", 'none')
					return;
				}
				if (this.chlidCodeArr.length === 0 && this.list.length === 0) {
					this.$common.showToast("子码不能为空", 'none')
					return;
				}

				let param = {
					outCode: this.outCode,
					subCodeList: this.chlidCodeArr
				}
				this.$common.post("/trace-api/trace/relationOutCode", param).then((res) => {
					console.log("relationOutCode", res)
					if (Number(res.data.code) === 200) {
						uni.showToast({
							title: res.data.message,
							duration: 2000
						});
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 1500)
					} else {

						uni.showToast({
							title: res.data.message,
							duration: 2000,
							icon: "none"
						});
					}
				})
			},
			deleteCode(item) {
				console.log(item)
				uni.showModal({
					title: '提示',
					content: '此操作将删除此子码编号',
					success: (res) => {
						if (res.confirm) {
							this.$common.post('/trace-api/trace/deleteCode/' + item.id).then((res) => {
								if (Number(res.data.code) === 200) {
									this.$common.showToast("删除成功", "success")


									if (this.chlidCodeArr.indexOf(String(item.name)) > -1) {
										let index = 0
										for (let i in this.chlidCodeArr) {

											if (String(this.chlidCodeArr[i]) === String(item.name)) {

												index = i
												break;
											}
										}

										let newArr = this.chlidCodeArr
										let newArr2 = newArr.splice(index, 1)

									}
									this.getTree()

								} else {
									this.$common.showToast(res.data.message, "none")
								}
							})

						}
					}
				});

			},
			iterator(list, sucode) {

				for (let index in list) {
					if (String(list[index].traceSubCodeNumber) === String(sucode)) {
						this.count++;
					}
					if (list[index].children !== null) {
						list[index].children = this.iterator(list[index].children, sucode)
					}
				}
			},
			relation() {
				uni.scanCode({
					success: (res) => {
						let that = this
						if (res.result && res.result.indexOf(that.$common.host_name) > -1) {
							let sid = res.result.split(that.$common.host_name)[1]
							this.$common.get("/trace-api/trace/getSubCodeById?sid=" + sid).then((res) => {
								this.count = 0
								if (Number(res.data.code) === 200) {
									if (this.chlidCodeArr.indexOf(res.data.data.traceSubCodeNumber) > -1) {
										this.$common.showToast("编码已存在", "none")
									} else {
										if (res.data.data.traceSubCodeNumber === this.outCode) {
											this.$common.showToast("不能关联本身", "none")
										} else {

											this.iterator(this.list, res.data.data.traceSubCodeNumber)
											if (this.count > 0) {
												this.$common.showToast("编码已存在", "none")
												setTimeout(() => {
													this.getTree()
												}, 800)
												return false
											} else {
												this.chlidCodeArr.push(res.data.data.traceSubCodeNumber)
												this.getTree()
											}
										}

									}
								} else {
									that.$common.showToast(res.data.message, 'none')
								}
							})
						} else {
							this.showError = true
							this.text = "子码获取失败"
							this.type = 'relation'
						}
					}
				});
			},
			getTree() {
				this.$common.post("/trace-api/trace/getTreeListCode", {
					subCodeList: this.chlidCodeArr,
					outCode: this.outCode,
				}).then((res) => {

					this.list = res.data.data

					// this.$common.showToast("操作成功", "success")

				})
			}
		}

	}
</script>

<style lang="less">
	.relation {
		padding: 15px 15px 0;
		// padding-bottom: 100px;

		.context {
			overflow-y: hidden;
			border: 1px solid #ccc;
			border-radius: 10px;

			.header {
				justify-content: center;
				align-items: center;
				display: flex;
				color: rgba(255, 255, 255, 1);
				padding: 20rpx 8rpx;
				background: linear-gradient(to left, #f53647, #fd973c);
				font-size: 26rpx;
				justify-content: space-between;

				.left {
					display: flex;
				}

				.btn {
					color: #F53747;
					border-radius: 5px;
					border: 1px solid #fff;
					padding: 10rpx;
					font-size: 24rpx;
					color: #000;
					background: #fff;
				}
			}

			.content2 {
				width: calc(100vw - 30px);
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

			.content1 {
				// display: flex;
				width: calc(100vw -60px);
				overflow: scroll;
				height: calc(100vh - 400rpx);
				font-size: 14px;
				background: rgba(242, 242, 242, 1);
				margin: 10px;
				// padding
				// justify-content:center;

				.item {
					position: relative;
					display: flex;
					align-items: center;
					padding: 10px 2px;
					justify-content: space-around;

				}

				&.contentMax {
					height: calc(100vh - 200rpx);
				}
			}

		}

		.outbtn {
			button {
				background: linear-gradient(to left, #f53647, #fd973c);
				color: #FFFFFF;
				font-size: 30rpx;
				padding: 2px 5px;
				border-radius: 49rpx;
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
			// line-height: 3;
			border-radius: 49rpx;
			margin: 10rpx 15rpx;
			padding: 8px;
			font-size: 26rpx;
		}

	}
</style>
