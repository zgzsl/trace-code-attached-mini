(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/getLocation/getLocation"],{"5efa":function(t,e,a){"use strict";(function(t){a("7b83"),a("921b");o(a("66fd"));var e=o(a("72ac"));function o(t){return t&&t.__esModule?t:{default:t}}t(e.default)}).call(this,a("6e42")["createPage"])},"72ac":function(t,e,a){"use strict";a.r(e);var o=a("b66f"),i=a("ed15");for(var n in i)"default"!==n&&function(t){a.d(e,t,function(){return i[t]})}(n);a("c8ff");var s,c=a("f0c5"),r=Object(c["a"])(i["default"],o["b"],o["c"],!1,null,"4599f38c",null,!1,o["a"],s);e["default"]=r.exports},b66f:function(t,e,a){"use strict";var o,i=function(){var t=this,e=t.$createElement;t._self._c;t._isMounted||(t.e0=function(e){t.show=!1},t.e1=function(e){e.stopPropagation(),t.show=!0})},n=[];a.d(e,"b",function(){return i}),a.d(e,"c",function(){return n}),a.d(e,"a",function(){return o})},c8ff:function(t,e,a){"use strict";var o=a("d4fb"),i=a.n(o);i.a},d4fb:function(t,e,a){},ed15:function(t,e,a){"use strict";a.r(e);var o=a("fd04"),i=a.n(o);for(var n in o)"default"!==n&&function(t){a.d(e,t,function(){return o[t]})}(n);e["default"]=i.a},fd04:function(t,e,a){"use strict";(function(t,o){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=a("17b8"),n=new i.AMapWX({key:"2649cf46ba2417b42f9fe36f53c57f63"}),s={data:function(){return{keywords:"",setUserData:{},show:!0,markers:[],latitude:23.13,longitude:113.27,city:"",myAmapFunflag:"",dataArr:[],maskerClick:!1,labels:[]}},onLoad:function(){var e=this;t.getLocation({type:"gcj02",success:function(a){o("log",a," at pages\\getLocation\\getLocation.vue:68"),o("log","当前位置的经度："+a.longitude," at pages\\getLocation\\getLocation.vue:69"),o("log","当前位置的纬度："+a.latitude," at pages\\getLocation\\getLocation.vue:70");n.getRegeo({iconPath:"../../static/img/marker.png",location:a.longitude+","+a.latitude,success:function(t){o("log",t," at pages\\getLocation\\getLocation.vue:76"),e.markers=[{id:t[0].id,latitude:t[0].latitude,longitude:t[0].longitude,iconPath:t[0].iconPath,width:40,height:60,label:{content:t[0].name,fontSize:16,bgColor:"#fff",textAlign:"left",borderRadius:5,padding:3,color:"red",width:200}}],e.latitude=t[0].latitude,e.longitude=t[0].longitude},fail:function(e){t.showModal({title:e.errMsg})}})}})},methods:{makertap:function(t){var e=t.markerId,a=this;a.changeMarkerColor(this.markers,e)},changeMarkerColor:function(e,a){var i=this;this.maskerClick||(o("log",e," at pages\\getLocation\\getLocation.vue:124"),t.showModal({content:"确定更改地址?",success:function(t){if(t.confirm){var a=[];e[0].iconPath="../../static/img/marker_checked.png",i.setUserMessage(e[0].label.content),i.maskerClick=!0,o("log",e," at pages\\getLocation\\getLocation.vue:138"),a.push({id:e[0].id,latitude:e[0].latitude,longitude:e[0].longitude,iconPath:e[0].iconPath,width:e[0].width,height:e[0].height,label:{content:e[0].label.content||e[0].regeocodeData.formatted_address,fontSize:16,bgColor:"#fff",textAlign:"right",borderRadius:5,padding:3,color:"red"}}),i.latitude=e[0].latitude,i.longitude=e[0].longitude,i.markers=a,o("log","可以了"," at pages\\getLocation\\getLocation.vue:163")}}}))},selectAdress:function(e){var a=this;if(this.maskerClick=!1,0===e.location.length)return t.showToast({title:"请输入具体地址",icon:"none"}),!1;this.longitude=e.location.split(",")[0],this.latitude=e.location.split(",")[1],this.show=!1,this.myAmapFunflag.getRegeo({iconPath:"../../static/img/marker.png",location:this.longitude+","+this.latitude,success:function(e){o("log",e," at pages\\getLocation\\getLocation.vue:185"),a.maskerClick=!0,a.markers=[{id:e[0].id,latitude:e[0].latitude,longitude:e[0].longitude,iconPath:e[0].iconPath,width:40,height:60,label:{content:e[0].regeocodeData.formatted_address,fontSize:16,bgColor:"#fff",textAlign:"right",borderRadius:5,padding:3,color:"red"}}],a.latitude=e[0].latitude,a.longitude=e[0].longitude,t.showModal({content:"确定更改地址?",success:function(t){if(t.confirm){var i=[];e[0].iconPath="../../static/img/marker_checked.png",i.push({id:e[0].id,latitude:e[0].latitude,longitude:e[0].longitude,iconPath:e[0].iconPath,width:e[0].width,height:e[0].height,label:{content:e[0].regeocodeData.formatted_address,fontSize:16,bgColor:"#fff",textAlign:"right",borderRadius:5,padding:3,color:"red"}}),a.latitude=e[0].latitude,a.longitude=e[0].longitude,a.markers=i,a.setUserMessage(e[0].regeocodeData.formatted_address),o("log","可以了"," at pages\\getLocation\\getLocation.vue:241")}}})},fail:function(e){t.showModal({title:e.errMsg})}}),o("log",this.myAmapFunflag," at pages\\getLocation\\getLocation.vue:252")},setUserMessage:function(e){var a=this,i="";this.setUserData=t.getStorageSync("setUserData"),o("log",this.setUserData," at pages\\getLocation\\getLocation.vue:259"),i=9===this.setUserData.role.id||10===this.setUserData.role.id||11===this.setUserData.role.id?9===this.setUserData.role.id?this.setUserData.merchant.merchantName:this.setUserData.distributeNode.tracePoint:this.setUserData.merchant.merchantName,this.$common.post("/accountCenter/account/updateNode",{location:e,tracePoint:i}).then(function(e){200===e.data.statusCode?(a.$common.showToast("修改成功","success"),t.setStorageSync("setUserData",e.data.data),setTimeout(function(){t.navigateBack({url:-1})},2e3)):a.$common.showToast(e.data.statusMsg,"none")})},bindInput:function(t){if(!t.detail.value)return this.dataArr=[],!1;this.myAmapFunflag=n;var e=this;n.getInputtips({keywords:t.detail.value,success:function(t){o("log",t.tips," at pages\\getLocation\\getLocation.vue:298"),e.dataArr=t.tips,o("log",e.dataArr," at pages\\getLocation\\getLocation.vue:301")}});var a={iconPathSelected:"../../static/img/marker_checked.png",iconPath:"../../static/img/marker.png",success:function(t){o("log",t," at pages\\getLocation\\getLocation.vue:308")}};n.getPoiAround(a)}}};e.default=s}).call(this,a("6e42")["default"],a("0de9")["default"])}},[["5efa","common/runtime","common/vendor"]]]);