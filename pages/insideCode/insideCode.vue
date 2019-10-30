<template>
	<view class="insideCode">
		<view class="inside" v-if="!showError">
			<view class="in" v-if="zscode">
				<view class="setting_insideCode">
					<view class="item">
						<view class="name">内码编号：</view>
						<text>{{zscode|| ""}}</text>
					</view>
				</view>
				<view class="btn_box">
					<button type="primary" class="btn" @tap='scode'>重新扫一扫</button>
					<button type="primary" class="btn" @tap="confirm">确定变更</button>
				</view>
			</view>
			<view class="out" v-if="!zscode">
				<button @tap="createdClick">扫一扫获取内部编码</button>
				<view style="font-size: 26upx;margin: 15upx 0;">温馨提醒：如果机器是扫码枪，使用机器自带按钮或者点击屏幕按钮方可使用</view>
			</view>
		</view>
		<error :text="text" v-if="showError" :type="type" @scode='scode'></error>
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
				title: '你好！',
				type: 'scode',
				text: '扫码错误',
				showError: false,
				zscode: '',
				flag: '',
				activity: ''
			}
		},
		onShow() {

			// #ifdef APP-PLUS
			this.title = "开始监听！";

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
					that.getCodeZsNumber(sid)
				} else {
					that.showError = true
					that.text = "内码获取失败"
					that.type = 'scode'
				}

				that.title = barcode;
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
			createdClick() {
				this.scode()
			},
			confirm() {
				this.$common.get("/trace-api/trace/changeOutCode?outCode=" + this.zscode).then((res) => {
					console.log(res)
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
			scode() {
				let that = this
				uni.scanCode({
					success: (res) => {

						if (res.result && res.result.indexOf(that.$common.host_name) > -1) {
							let sid = res.result.split(that.$common.host_name)[1]
							that.getCodeZsNumber(sid)
						} else {
							this.showError = true
							this.text = "内码获取失败"
							this.type = 'scode'
						}
					}
				});
			},
			getCodeZsNumber(sid) {
				let that = this
				this.$common.get("/trace-api/trace/getSubCodeById?sid=" + Number(sid)).then((res) => {
					console.log(res)
					if (Number(res.data.code) === 200) {
						if (res.data.data.isLeaf === 'Y') {
							that.$common.showToast("扫码成功", "success")
							that.showError = false
							that.zscode = res.data.data.traceSubCodeNumber || ""
						} else {

							this.showError = true
							this.text = "此码不是内码,内码获取失败"
							this.type = 'scode'
						}

					} else {
						that.showError = false
						that.$common.showToast(res.data.message, 'none')
					}
				})
			}
		}
	}
</script>

<style lang="less">
	.insideCode {
		padding: 15px 15px 0;

		.out {
			button {
				background: linear-gradient(to left, #f53647, #fd973c);
				color: #FFFFFF;
				font-size: 30rpx;
				padding: 2px 5px;
				border-radius: 49rpx;
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
	}

	.setting_insideCode {
		.item {
			border: 1px solid rgba(204, 204, 204, 1);
			border-radius: 20px;
			display: flex;
			align-items: center;
			font-size: 28rpx;
			padding: 10px 5px;
			justify-content: space-around;

			text {
				flex: 1;
			}

			.name {
				padding: 0 0 0 15rpx;
				width: 180rpx;
			}

			.btn {
				margin-left: 10px;
				width: 100px;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(245, 53, 71, 1);
			}
		}


	}
</style>
