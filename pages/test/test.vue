<template>
	<view class="content">
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				title: '你好！'
			}
		},
		onLoad() {


			this.title = "开始监听！";

			var main = plus.android.runtimeMainActivity(); //获取activity  
			var context = plus.android.importClass('android.content.Context'); //上下文  
			var receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
				onReceive: doReceive
			});
			var IntentFilter = plus.android.importClass('android.content.IntentFilter');
			var Intent = plus.android.importClass('android.content.Intent');
			var filter = new IntentFilter();

			//针对优博讯安卓PDA-i6300A添加监听，其它优博讯的型号应该一样或类似
			filter.addAction("android.intent.ACTION_DECODE_DATA"); //监听扫描

			main.registerReceiver(receiver, filter); //注册监听  
			let that=this
			function doReceive(context, intent) {


				//通过intent实例引入intent类，方便以后的‘.’操作  
				plus.android.importClass(intent);

				//条码内容
				var barcodeBytes = intent.getByteArrayExtra("barcode");
				var barcode = byteToString(barcodeBytes);

				//条码长度
				var barcodeLength = intent.getIntExtra("length", 0);
				//var myArray = new ArrayBuffer(0);
				//条码类型
				var barcodeTypeBytes = intent.getByteExtra("barcodeType", (0 | 0));
				var barcodeType = byteToString(barcodeTypeBytes);

			
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


		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
