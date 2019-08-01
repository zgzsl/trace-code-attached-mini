<template>
	<view class="dev">
		<button type="primary" @click="lanyatest1">打开蓝牙</button>
		<button type="primary" @click="lanyatest2">获取蓝牙状态</button>
		<button type="primary" @click="lanyatest3">搜索周边设备</button>
		<button type="primary" @click="lanyatest4">获取所有设备</button>
		<button type="primary" @click="lanyaconnect">111获取所有设备</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: "未初始化蓝牙适配器",
				connectedDeviceId: ""
			}
		},
		methods: {
			lanyatest1(event) {
				var that = this;
				uni.openBluetoothAdapter({
					success: function(res) {
						console.log('初始化蓝牙适配器成功')
						//页面日志显示
						that.info = '初始化蓝牙适配器成功'
					},
					fail: function(res) {
						console.log(res)
						console.log('请打开蓝牙和定位功能')
						that.info = '请打开蓝牙和定位功能'

					}
				})
			},
			lanyatest2(event) {
				var that = this;
				uni.getBluetoothAdapterState({
					success: function(res) {
						//打印相关信息
						that.info = JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available
						console.log(JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available);
					},
					fail: function(res) {
						//打印相关信息
						that.info = JSON.stringify(res.errMsg) + "\n蓝牙是否可用：" + res.available
					}

				})

			},
			lanyatest3(event) {
				var that = this;
				uni.startBluetoothDevicesDiscovery({
					// services: ['FEE7'], //如果填写了此UUID，那么只会搜索出含有这个UUID的设备，建议一开始先不填写或者注释掉这一句
					success: function(res) {
			
						// that.info = "搜索设备" + JSON.stringify(res)
						console.log('搜索设备返回' + JSON.stringify(res))

					}
				})

			},
			lanyaconnect(event) {
				var that = this;
				uni.createBLEConnection({
					deviceId: event.currentTarget.id,
					success: function(res) {
						console.log('调试信息：' + res.errMsg);
					
							that.info = "MAC地址：" + event.currentTarget.id + '  调试信息：' + res.errMsg
					},
					fail: function() {
						console.log("连接失败");
					},

				})

			},
			lanyatest4(event) {
				var that = this;
				uni.getBluetoothDevices({
					success: function(res) {
						console.log(res)
						that.info = "设备列表\n" + res.devices
							console.log('搜设备数目：' + res.devices.length)
						console.log(res.devices)
					}
				})

			}
		}
	}
</script>

<style>
</style>
