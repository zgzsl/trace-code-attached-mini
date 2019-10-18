<template>
	<view class="dev">
<!-- 		<button type="primary" @click="lanyatest1">打开蓝牙</button>
		<button type="primary" @click="lanyatest2">获取蓝牙状态</button>
		<button type="primary" @click="lanyatest3">搜索周边设备</button>
		<button type="primary" @click="lanyatest4">获取所有设备</button>
		<button type="primary" @click="lanyaconnect">111获取所有设备</button> -->
	</view>
</template>

<script>
	var main,receiver,filter;
	var _codeQueryTag = false;  
	export default {
		
		data() {
			return {
				info: "未初始化蓝牙适配器",
				connectedDeviceId: ""
			}
		},
		onLoad: function (option) {  
		    this.initScan()  
		},  
		onShow: function(){  
		    this.startScan();  
		},  
		onHide:function(){  
		    this.stopScan();  
		},  
		onUnload:function(){  
		    /*页面退出时一定要卸载监听,否则下次进来时会重复，造成扫一次出2个以上的结果*/  
		    this.stopScan();  
		},  
		methods: {
			initScan() {  
			    let _this = this;  
			    /* #ifdef APP-PLUS */  
			    main = plus.android.runtimeMainActivity();//获取activity  
			
				
			    /* var context = plus.android.importClass('android.content.Context'); */  
			    var IntentFilter = plus.android.importClass('android.content.IntentFilter');  
					
			    /* var Intent = plus.android.importClass('android.content.Intent'); */  
			    filter = new IntentFilter();  
			    filter.addAction("com.se4500.onDecodeComplete");  
			
			    receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver',{  
			    onReceive : function(context, intent) {  
			        plus.android.importClass(intent);  
			 /*这个se4500很坑，不同的手机或pda，这个值就不一样，要具体去查硬件api*/  
			        let code = intent.getStringExtra("se4500");  
			        /* rmker.showTip('条码:'+code); */  
			        /*调用本页面某方法*/  
					console.log(code)
			        _this.queryCode(code);  
			    }});  
			    /* #endif */  
			},  
			startScan(){  
			    /* #ifdef APP-PLUS */  
			    main.registerReceiver(receiver,filter);  
			    /* #endif */  
			},  
			stopScan(){  
			    /* #ifdef APP-PLUS */  
			    main.unregisterReceiver(receiver);  
			    /* #endif */  
			},  
			queryCode: function(code){  
				console.log(code)
			//防重复  
			    if(_codeQueryTag)return false;  
			    _codeQueryTag = true;  
			    setTimeout(function(){  
			        _codeQueryTag = false;  
			    },150);  
				uni.showModal({
					content:code
				})
			        //到这里扫描成功了，可以调用自己的业务逻辑，code就是扫描的结果  
			},  
			// lanyatest1(event) {
			// 	var that = this;
			// 	uni.openBluetoothAdapter({
			// 		success: function(res) {
			// 			console.log('初始化蓝牙适配器成功')
			// 			//页面日志显示
			// 			that.info = '初始化蓝牙适配器成功'
			// 		},
			// 		fail: function(res) {
			// 			console.log(res)
			// 			console.log('请打开蓝牙和定位功能')
			// 			that.info = '请打开蓝牙和定位功能'

			// 		}
			// 	})
			// },
			// lanyatest2(event) {
			// 	var that = this;
			// 	uni.getBluetoothAdapterState({
			// 		success: function(res) {
			// 			//打印相关信息
			// 			that.info = JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available
			// 			console.log(JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available);
			// 		},
			// 		fail: function(res) {
			// 			//打印相关信息
			// 			that.info = JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available
			// 		}

			// 	})

			// },
			// lanyatest3(event) {
			// 	var that = this;
			// 	uni.startBluetoothDevicesDiscovery({
			// 		// services: ['FEE7'], //如果填写了此UUID，那么只会搜索出含有这个UUID的设备，建议一开始先不填写或者注释掉这一句
			// 		success: function(res) {
			
			// 			// that.info = "搜索设备" + JSON.stringify(res)
			// 			console.log('搜索设备返回' + JSON.stringify(res))

			// 		}
			// 	})

			// },
			// lanyaconnect(event) {
			// 	var that = this;
			// 	uni.createBLEConnection({
			// 		deviceId: event.currentTarget.id,
			// 		success: function(res) {
			// 			console.log('调试信息：' + res.errMsg);
					
			// 				that.info = "MAC地址：" + event.currentTarget.id + '  调试信息：' + res.errMsg
			// 		},
			// 		fail: function() {
			// 			console.log("连接失败");
			// 		},

			// 	})

			// },
			// lanyatest4(event) {
			// 	var that = this;
			// 	uni.getBluetoothDevices({
			// 		success: function(res) {
			// 			console.log(res)
			// 			that.info = "设备列表\n" + res.devices
			// 				console.log('搜设备数目：' + res.devices.length)
			// 			console.log(res.devices)
			// 		}
			// 	})

			// }
		}
	}
</script>

<style>
</style>
