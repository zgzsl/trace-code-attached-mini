(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/uni-badge/uni-badge"],{1775:function(e,t,n){"use strict";var u=function(){var e=this,t=e.$createElement;e._self._c},i=[];n.d(t,"a",function(){return u}),n.d(t,"b",function(){return i})},1868:function(e,t,n){"use strict";n.r(t);var u=n("1775"),i=n("1b88");for(var a in i)"default"!==a&&function(e){n.d(t,e,function(){return i[e]})}(a);n("ceee");var r=n("2877"),o=Object(r["a"])(i["default"],u["a"],u["b"],!1,null,null,null);t["default"]=o.exports},"1b88":function(e,t,n){"use strict";n.r(t);var u=n("3b67"),i=n.n(u);for(var a in u)"default"!==a&&function(e){n.d(t,e,function(){return u[e]})}(a);t["default"]=i.a},"3b67":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var u={name:"uni-badge",props:{type:{type:String,default:"default"},inverted:{type:Boolean,default:!1},text:{type:String,default:""},size:{type:String,default:"normal"}},computed:{setClass:function(){var e=["uni-badge-"+this.type,"uni-badge--"+this.size];return!0===this.inverted&&e.push("uni-badge-inverted"),e.join(" ")}},methods:{onClick:function(){this.$emit("click")}}};t.default=u},5534:function(e,t,n){},ceee:function(e,t,n){"use strict";var u=n("5534"),i=n.n(u);i.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/uni-badge/uni-badge-create-component',
    {
        'components/uni-badge/uni-badge-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("1868"))
        })
    },
    [['components/uni-badge/uni-badge-create-component']]
]);                
