(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/deliverSellerNode/deliverSellerNode"],{"1f8d":function(e,t,o){"use strict";o.r(t);var r=o("b967"),a=o.n(r);for(var n in r)"default"!==n&&function(e){o.d(t,e,function(){return r[e]})}(n);t["default"]=a.a},"3e61":function(e,t,o){"use strict";var r=function(){var e=this,t=e.$createElement,o=(e._self._c,Number(e.active)),r=Number(e.active);e._isMounted||(e.e0=function(t){e.active=0}),e.$mp.data=Object.assign({},{$root:{m0:o,m1:r}})},a=[];o.d(t,"a",function(){return r}),o.d(t,"b",function(){return a})},"6e3f":function(e,t,o){"use strict";var r=o("8c98"),a=o.n(r);a.a},"8c98":function(e,t,o){},afad:function(e,t,o){"use strict";o.r(t);var r=o("3e61"),a=o("1f8d");for(var n in a)"default"!==n&&function(e){o.d(t,e,function(){return a[e]})}(n);o("6e3f");var c=o("2877"),s=Object(c["a"])(a["default"],r["a"],r["b"],!1,null,null,null);t["default"]=s.exports},b967:function(e,t,o){"use strict";(function(e,r){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=function(){return o.e("components/scodeError").then(o.bind(null,"94bf"))},n={components:{error:a},data:function(){return{sellerNameSelect:!0,userNameSelect:!1,userName:"",type:"scanCode",text:"扫码错误",showError:!1,current:0,codeArr:[],arr:[],index:0,active:0,count:0,timeId:"",mobileInfo:{},orSearch:!1,otherMerchant:{tracePointName:"",personInCharge:""},contactNumber:"",activity:"",flag:"",info:{}}},watch:{codeArr:{handler:function(e){var t=0,o=!0,r=!1,a=void 0;try{for(var n,c=this.codeArr[Symbol.iterator]();!(o=(n=c.next()).done);o=!0){var s=n.value;t+=s.count}}catch(i){r=!0,a=i}finally{try{o||null==c.return||c.return()}finally{if(r)throw a}}this.count=t},deep:!0},contactNumber:function(){this.getMoblieUserMess()}},onShow:function(){var e=plus.android.runtimeMainActivity();this.activity=e;plus.android.importClass("android.content.Context");var t=plus.android.implements("io.dcloud.feature.internal.reflect.BroadcastReceiver",{onReceive:n});this.flag=t;var o=plus.android.importClass("android.content.IntentFilter"),r=(plus.android.importClass("android.content.Intent"),new o);r.addAction("android.intent.ACTION_DECODE_DATA"),e.registerReceiver(t,r);var a=this;function n(e,t){plus.android.importClass(t);var o=t.getByteArrayExtra("barcode"),r=c(o),n=(t.getIntExtra("length",0),t.getByteExtra("barcodeType",0));c(n);if(r&&r.indexOf(a.$common.host_name)>-1){var s=r.split(a.$common.host_name)[1];a.getzsCodeMumber(s)}else a.showError=!0,a.text="关联子码获取失败",a.type="scanCode"}function c(e){if("string"===typeof e)return e;for(var t="",o=e,r=0;r<o.length;r++){var a=o[r].toString(2),n=a.match(/^1+?(?=0)/);if(n&&8==a.length){for(var c=n[0].length,s=o[r].toString(2).slice(7-c),i=1;i<c;i++)s+=o[i+r].toString(2).slice(2);t+=String.fromCharCode(parseInt(s,2)),r+=c-1}else t+=String.fromCharCode(o[r])}return t}},destroyed:function(){this.activity.unregisterReceiver(this.flag)},onHide:function(){this.activity.unregisterReceiver(this.flag)},onUnload:function(){this.activity.unregisterReceiver(this.flag)},methods:{getzsCodeMumber:function(t){var o=this,r=this;this.$common.get("/trace-api/other/isCurrentNodeNewest?sid="+t).then(function(a){console.log(e(a," at pages\\deliverSellerNode\\deliverSellerNode.vue:229")),200===a.data.code?a.data.data?o.$common.get("/trace-api/trace/getSubCodeById?sid="+t).then(function(t){if(200===Number(t.data.code)){if(console.log(e("发货对象",t," at pages\\deliverSellerNode\\deliverSellerNode.vue:234")),r.showError=!1,Number(t.data.data.isEnable)>0)if(r.codeArr.length>0){var o=[],a=!0,n=!1,c=void 0;try{for(var s,i=r.codeArr[Symbol.iterator]();!(a=(s=i.next()).done);a=!0){var d=s.value;o.push(d.traceSubCodeNumber)}}catch(l){n=!0,c=l}finally{try{a||null==i.return||i.return()}finally{if(n)throw c}}o.indexOf(t.data.data.traceSubCodeNumber)>-1?r.$common.showToast("子码编号已存在","none"):(r.$common.showToast("扫码成功","success"),r.codeArr.push({traceSid:t.data.data.traceSid,count:t.data.data.count,traceSubCodeNumber:t.data.data.traceSubCodeNumber}))}else r.$common.showToast("扫码成功","success"),r.codeArr.push({traceSid:t.data.data.traceSid,count:t.data.data.count,traceSubCodeNumber:t.data.data.traceSubCodeNumber});else r.$common.showToast("此编码已发货","none");console.log(e(r.codeArr," at pages\\deliverSellerNode\\deliverSellerNode.vue:263"))}else r.showError=!1,r.$common.showToast(t.data.message,"none")}):r.$common.showToast("不属于该追溯码最新的流通节点","none"):r.$common.showToast(a.data.message,"none")})},radioChange:function(t){console.log(e(t," at pages\\deliverSellerNode\\deliverSellerNode.vue:280")),this.current=Number(t.detail.value),console.log(e(this.current," at pages\\deliverSellerNode\\deliverSellerNode.vue:282"))},next:function(){this.codeArr.length>0?this.active=1:this.$common.showToast("请添加货物","none")},getMoblieUserMess:function(){var t=this;r.showLoading({mask:!0,title:"正在检索..."}),this.$common.getNot("/trace-api/other/getNodeByMobile?mobile="+this.contactNumber).then(function(o){console.log(e(typeof o.data.data," at pages\\deliverSellerNode\\deliverSellerNode.vue:298")),200===o.data.code?("number"===typeof o.data.data?(t.otherMerchant={tracePointName:"",personInCharge:""},t.sellerNameSelect=!1,t.userNameSelect=!1,t.$common.showToast("暂无信息","none"),t.orSearch=!1):(t.info=o.data.data,t.otherMerchant={tracePointName:o.data.data.tracePointName,personInCharge:o.data.data.personInCharge},t.orSearch=!0,t.contactNumber=o.data.data.contactNumber,t.sellerNameSelect=!0,t.userNameSelect=!0),console.log(e(t.otherMerchant," at pages\\deliverSellerNode\\deliverSellerNode.vue:321"))):t.$common.showToast("信息获取失败","none")})},nextConfirm:function(){var t=this;if(this.otherMerchant.contactNumber=this.contactNumber,0!==this.codeArr.length){for(var o=Object.values(this.otherMerchant),a=0;a<o.length;a++){var n=o[a];if(!n)return this.$common.showToast("节点信息需填写完整","none"),!1}var c=[],s=!0,i=!1,d=void 0;try{for(var l,u=this.codeArr[Symbol.iterator]();!(s=(l=u.next()).done);s=!0){var m=l.value;c.push(m.traceSubCodeNumber)}}catch(f){i=!0,d=f}finally{try{s||null==u.return||u.return()}finally{if(i)throw d}}var h={codeNumber:c,accountId:this.orSearch?this.info.accountId:-1,otherMerchant:this.otherMerchant,mode:0===this.current?1:2};console.log(e(h," at pages\\deliverSellerNode\\deliverSellerNode.vue:350")),this.$common.post("/trace-api/trace/deliverGoods",h).then(function(o){console.log(e(o," at pages\\deliverSellerNode\\deliverSellerNode.vue:352")),200===Number(o.data.code)?(t.$common.showToast(o.data.message,"success"),setTimeout(function(){r.navigateBack({delta:1})},1500)):t.$common.showToast(o.data.message,"none")})}else this.$common.showToast("外码或内码不能为空","none")},jump:function(){this.active=1},deleteCode:function(e){var t=this;r.showModal({title:"提示",content:"此操作将删除此编号",success:function(o){o.confirm&&(t.codeArr.splice(e,1),t.$common.showToast("删除成功","success"))}})},scanCode:function(){var t=this;r.scanCode({success:function(o){var r=t;if(o.result&&o.result.indexOf(r.$common.host_name)>-1){var a=o.result.split(r.$common.host_name)[1];t.$common.get("/trace-api/other/isCurrentNodeNewest?sid="+a).then(function(o){console.log(e(o," at pages\\deliverSellerNode\\deliverSellerNode.vue:392")),200===o.data.code?o.data.data?t.$common.get("/trace-api/trace/getSubCodeById?sid="+a).then(function(t){if(200===Number(t.data.code)){if(console.log(e("发货对象",t," at pages\\deliverSellerNode\\deliverSellerNode.vue:397")),r.showError=!1,Number(t.data.data.isEnable)>0)if(r.codeArr.length>0){var o=[],a=!0,n=!1,c=void 0;try{for(var s,i=r.codeArr[Symbol.iterator]();!(a=(s=i.next()).done);a=!0){var d=s.value;o.push(d.traceSubCodeNumber)}}catch(l){n=!0,c=l}finally{try{a||null==i.return||i.return()}finally{if(n)throw c}}o.indexOf(t.data.data.traceSubCodeNumber)>-1?r.$common.showToast("子码编号已存在","none"):(r.$common.showToast("扫码成功","success"),r.codeArr.push({traceSid:t.data.data.traceSid,count:t.data.data.count,traceSubCodeNumber:t.data.data.traceSubCodeNumber}))}else r.$common.showToast("扫码成功","success"),r.codeArr.push({traceSid:t.data.data.traceSid,count:t.data.data.count,traceSubCodeNumber:t.data.data.traceSubCodeNumber});else r.$common.showToast("此编码已发货","none");console.log(e(r.codeArr," at pages\\deliverSellerNode\\deliverSellerNode.vue:429"))}else r.showError=!1,r.$common.showToast(t.data.message,"none")}):r.$common.showToast("不属于该追溯码最新的流通节点","none"):r.$common.showToast(o.data.message,"none")})}else t.showError=!0,t.text="关联子码获取失败",t.type="scanCode"}})}}};t.default=n}).call(this,o("0de9")["default"],o("6e42")["default"])},cd5e:function(e,t,o){"use strict";(function(e){o("7b83"),o("921b");r(o("66fd"));var t=r(o("afad"));function r(e){return e&&e.__esModule?e:{default:e}}e(t.default)}).call(this,o("6e42")["createPage"])}},[["cd5e","common/runtime","common/vendor"]]]);