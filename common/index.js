export  function  Addaction(callback) {
	
	let main = plus.android.runtimeMainActivity(); //获取activity
	let context = plus.android.importClass('android.content.Context'); //上下文  
	 let receiver = plus.android.implements('io.dcloud.feature.internal.reflect.BroadcastReceiver', {
		onReceive: doReceive
	});
	let IntentFilter = plus.android.importClass('android.content.IntentFilter');
	let Intent = plus.android.importClass('android.content.Intent');
	let  filter = new IntentFilter();

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
	
		callback(barcode)
	
	
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
	
}
			
			