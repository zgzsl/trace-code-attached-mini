<template>
	<view class="print">
		<view class="print_header">
			<view class="item" v-for="(item,index) in NavList" :key="index" @tap="tapNav(index)" :class="{active:active===index}">{{item.name}}</view>
		</view>

		<!-- 设置外码比例 -->
		<view class="setting" v-if="active===0">
			<view class="code_step">生成外码步骤</view>
			<view class="item_active">
				<uni-steps :options="data" active-color="#f53647" direction="row" :active="activeIndex">
				</uni-steps>

				<view class="one_step" v-if="Number(activeIndex)===0">
					<uni-list class='uni-list_one'>
						<view class="item" @tap="showPickerStart=true">
							<view class="left">
								开始时间
							</view>
							<view class="right">
								{{start || '请输入日期'}}
							</view>
						</view>
						<view class="item" @tap="showPickerEnd=true">
							<view class="left">
								结束时间
							</view>
							<view class="right">
								{{end || '请输入日期'}}
							</view>
						</view>
					</uni-list>
					<view class="concent">
						选择其中一个批次号
					</view>
					<view class="list">
						<radio-group @change="radioChange">
							<view class="list_item" v-for="(item,index) in zsCodeArr" v-if="zsCodeArr.length>0" :key="index">
								<radio color='rgb(246, 64, 70)' :value="item.traceCodeNumber" :checked="index === current" />
								<text>{{item.traceCodeNumber || "错误码"}}</text>
								<view class="img" @tap="detailCode(item.traceCodeNumber)">
									<image src="../../static/images/lie.png" mode=""></image>
								</view>
							</view>

						</radio-group>
						<view class="zsNot" v-if="zsCodeArr.length===0">-暂无批次号-</view>
					</view>
				</view>
				<view class="scend_step" v-if="Number(activeIndex)===1">
					<view class="concent">
						设置对应的比例
					</view>
					<view class="goodList">
						<view class="item" v-for="(item,index) in getGoodsLists" v-if="getGoodsLists.length>0" :key="index">
							<view class="item_header">
								<view class="left">
									编号：{{item.traceFromNumber}}-{{item.traceToNumber}}
								</view>
								<view class="left">
									商品名称：{{item.traceGoodsName || ""}}
								</view>
							</view>
							<view class="item_botom">
								<span>设置比例：</span><input type="text" v-model="item.outCodeRadio" />
							</view>
						</view>
						<view class="zsNot" v-if="getGoodsLists.length===0">-批次号暂无商品-</view>
					</view>
				</view>
				<view class="third_step" v-if="Number(activeIndex)===2">
					<view class="concent">
						外码生成结果
					</view>
					<view class="img">
						<image src="../../static/images/finish.png" mode="widthFix"></image>
						<view>生成成功！</view>
					</view>
				</view>
			</view>

		</view>
		<view class="btn_box" v-if="active===0">
			<button type="primary" class="btn" @tap="last"  v-if="activeIndex===0|| activeIndex===1">上一步</button>
			<button type="primary" class="btn" @tap="next" v-if="activeIndex===0">下一步</button>
			<button type="primary" class="btn" v-if="activeIndex===1" @tap="nextPrint">立即打印</button>
		</view>
		<view class="btn_box" v-if="active===1">
			<button type="primary" class="btn" @tap="outZsCode">立即打印</button>
		</view>
		<!-- 设置外码数量 -->
		<view class="setting_number" v-if="active===1">
			<view class="setting_number_methods">
				使用方法：
			</view>
			<view class="setting_number_methods_detail">
				直接生成外码，需调用绑定功能，将已经生成的内码或者外码进行关联
			</view>
			<view class="setting_number_methods_input">
				<text>数量</text>
				<input type="number"  placeholder="请输入数量" v-model="count"/>
				<image src="../../static/images/chu.png" mode="" @tap="count=''"></image>
			</view>
		</view>
		<mx-date-picker :show="showPickerStart" :type="type" :value="start" :show-tips="true" :show-seconds="true" @confirm="onSelected('start',$event,'confirm')"
		 @cancel="onSelected('start',$event,'cancel')" />
		<mx-date-picker :show="showPickerEnd" :type="type" :value="end" :show-tips="true" :show-seconds="true" @confirm="onSelected('end',$event,'confirm')"
		 @cancel="onSelected('end',$event,'cancel')" />
		<pengkaiDraw :visible="visible" mode="right" @close="closeDrawer" catchtouchmove="false">
			<scroll-view scroll-y="true" class="scroll-Y" lower-threshold='0' @scrolltolower='scroll'>
				<view class="scroll_item" v-for="(item,index) in traceCodeNumberArr" :key="index" v-if="traceCodeNumberArr.length>0">
					<view class="uni-title">编号：{{item.traceFromNumber || 0}}----{{item.traceToNumber || 0}}</view>
					<view class="uni-title">名称：{{item.traceGoodsName || ''}}</view>
				</view>
				<view v-if="traceCodeNumberArr.length===0" class="nothing">
					<view class="nogood">
						<image src="../../static/images/nogood.png" mode="widthFix"></image>
					</view>
					<text>暂无商品</text>
				</view>
			</scroll-view>
		</pengkaiDraw>
	</view>
</template>

<script>
	import uniSteps from "../../components/qingqing-steps/uni-steps.vue"
	import MxDatePicker from "@/components/mx-datepicker/mx-datepicker.vue";
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import pengkaiDraw from '@/components/pengkai-draw.vue'
	export default {
		components: {
			uniSteps,
			MxDatePicker,
			uniList,
			uniListItem,
			pengkaiDraw
		},
		data() {
			return {
				start: '',
				end: '',
				zsCodeArr: [], //追溯码列表
				zsCodeInfo: {},
				traceCodeNumberArr: [],
				traceCodeNumberInfo: {},
				current: "",
				activeIndex: 0,
				scrollY: true,
				visible: false,
				showPickerEnd: false,
				showPickerStart: false,
				date: '2019/01/01',
				time: '15:00:12',
				datetime: '2019/01/01 15:00:12',
				range: ['2019/01/01', '2019/01/06'],
				rangetime: ['2019/01/08 14:00', '2019/01/16 13:59'],
				type: 'datetime',
				value: '',
				active: 0,
				pageNum: 1,
				historypageNum: 1, //历史记录
				traceCodeNumberFlag: '', //历史记录追溯码
				getGoodsLists: [], //设置对应比例
				count:"", //设置外码数量
				NavList: [{
						name: '设置外码比例'
					},
					{
						name: '设置外码数量'
					}
				],
				data: [{
						title: '选择批次码',
						desc: '关联商品'
					},
					{
						title: '设置规则',
						desc: '外码数量或比例'
					},
					{
						title: '打印',
						desc: '打印机出码'
					}
				]
			}
		},
		created() {
			this.getTraceCode()

		},
		watch: {
			"activeIndex"(val) {
				if (Number(val) === 0) {
					if (this.$store.state && this.$store.state.activeZs) {
						this.current = Number(this.$store.state.activeZs)
					}
				}
				if (Number(val) === 1) {
					this.getGoodsList()
				}
			}
		},
		onReachBottom() {
			if (this.zsCodeInfo.total > this.zsCodeInfo.pageSize) {
				this.pageNum++
				this.getTraceCode()
			}
		},
		methods: {
			//根据数量生成外码
			outZsCode(){
				if(!this.count){
					uni.showToast({
						title:"请输入数量",
						duration: 2000,
						icon: "none"
					});
					return ;
				}
				this.$common.get("/trace-api/trace/generateOutCodeByCount?count="+this.count).then((res)=>{
						
				})
			},
			scroll() {
				if (this.traceCodeNumberInfo.total > this.traceCodeNumberInfo.pageSize) {
					this.historypageNum++
					this.getHistory(this.traceCodeNumberFlag)
				}

			},
			//获取商品列表
			getGoodsList() {
				console.log(this.$store.state.zsCodeNumber)
				this.$common.get("/trace-api/trace/getTraceRecordByPage?traceCodeNumber=" +
					this.$store.state.zsCodeNumber +
					"&pageNum=100000").then(res => {
					console.log(res)
					let arr = res.data.data.list
					this.getGoodsLists = []
					for (let item of arr) {
						this.getGoodsLists.push({
							"traceCodeNumber": item.traceCodeNumber,
							"traceToNumber": item.traceToNumber,
							"traceFromNumber": item.traceFromNumber,
							"outCodeRadio": "",
							"traceGoodId": item.traceGoodId,
							"traceStallId": -1,
							"traceGoodsName": item.traceGoodsName
						})
					}

				})

			},
			nextPrint() {
				console.log(this.getGoodsLists)
				if (this.getGoodsLists.length===0) {
					this.$common.showToast("此批次号暂无商品,无法进行打印", 'none')
					return;
				}
				let arr = this.getGoodsLists
				let flagArr = []
				for (let item of arr) {
					if (item.outCodeRadio) {
						flagArr.push({
							"traceCodeNumber": item.traceCodeNumber,
							"traceToNumber": item.traceToNumber,
							"traceFromNumber": item.traceFromNumber,
							"outCodeRadio": Number(item.outCodeRadio),
							"traceGoodId": item.traceGoodId,
							"traceStallId": -1
						})
					}
				}
				uni.showModal({
					title: '是否立即打印?',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							uni.showToast({
								title: '先打一局吃鸡',
								icon:'loading'
							});
							this.$common.post("/trace-api/trace/generateOutCode", flagArr).then((res) => {
								uni.hideToast();
								this.activeIndex=2
							})
						}
					}
				});

			},
			radioChange(evt) {

				this.$store.commit("setZsCodeNumber", evt.detail.value)

				let active = 0;
				for (let index in this.zsCodeArr) {
					if (this.zsCodeArr[index].traceCodeNumber === evt.detail.value) {
						active = index
					}
				}
				console.log(active)
				this.$store.commit("setActiveZs", active)

			},
			getHistory(traceCodeNumber) {
				this.$common.get("/trace-api/trace/getTraceRecordByPage?traceCodeNumber=" +
					traceCodeNumber +
					"&pageNum=" + this.historypageNum).then(res => {
					console.log(res)
					if (Number(res.data.code) === 200) {
						this.traceCodeNumberInfo = res.data.data
						this.traceCodeNumberArr = res.data.data.list || []
					} else {
						this.$common.error(res.data.message)
					}
				})
			},

			next() {
				if (this.activeIndex < 3) {
					this.activeIndex++
				}
				if (this.activeIndex === 3) {
					this.activeIndex = 2
				}
			},
			last() {
				if (this.activeIndex >= 0) {
					this.activeIndex--
				}
				if (this.activeIndex < 0) {
					this.activeIndex = 0
				}
			},
			tapNav(index) {
				this.active = index
				this.activeIndex = 0;
				this.start = ''
				this.end = ''
				this.$store.commit("setActiveZs", 0)
				this.$store.commit("setZsCodeNumber", "")
				
			},
			
			onShowDatePicker(type, info) { //显示
				this.type = type;
				if (info === 'start') {
					this.showPickerStart = true;
				} else {
					this.showPickerEnd = true;
				}
				this.value = this[type];
			},
			onSelected(info, e, methods) { //选择
				console.log(e.value)
				if (methods === 'cancel') {

					if (info === 'start') {
						this.showPickerStart = false;
						this.start = ""
						this.zsCodeArr = []
						this.getTraceCode()
					} else {
						this.showPickerEnd = false;
						this.end = ""
						this.zsCodeArr = []
						this.getTraceCode()
					}
				} else {
					this.zsCodeArr = []
					if (info === 'start') {
						this.showPickerStart = false;
						this.start = e.value
						console.log(this.$common.replace(e.value))
						if (this.end) {
							this.getTraceCode(+new Date(this.$common.replace(e.value)), +new Date(this.$common.replace(this.end)))
						} else {
							this.getTraceCode(+new Date(this.$common.replace(e.value)))
						}

					} else {
						this.showPickerEnd = false;
						this.end = e.value
						let traceApplyEndDate = e.value
						if (this.start) {
							this.getTraceCode(+new Date(this.$common.replace(this.start)), +new Date(this.$common.replace(e.value)))
						} else {
							this.getTraceCode("", +new Date(this.$common.replace(e.value)))
						}

					}
				}
			},
			//获取批次号
			getTraceCode(traceApplyStartDate = '', traceApplyEndDate = '') {
				console.log("traceApplyStartDate", traceApplyStartDate)
				console.log("traceApplyEndDate", traceApplyEndDate)
				if (traceApplyStartDate && traceApplyEndDate && traceApplyStartDate >= traceApplyEndDate) {
					this.$common.error("开始时间必须小于结束时间")
					return;
				}
				this.$common.get("/trace-api/trace/getByPage?traceApplyStartDate=" + traceApplyStartDate + "&traceApplyEndDate=" +
					traceApplyEndDate + "&pageNum=" + this.pageNum).then((res) => {
					console.log(res)
					if (Number(res.data.code) === 200) {
						this.zsCodeInfo = res.data.data
						this.zsCodeArr = this.zsCodeArr.concat(res.data.data.list) || []
						console.log(this.zsCodeArr)
					} else {
						this.$common.error(res.data.message)
					}
				})
			},
			closeDrawer() {
				this.visible = false
			},
			//获取追溯详情
			detailCode(traceCodeNumber) {
				this.visible = true
				this.getHistory(traceCodeNumber)
				this.traceCodeNumberFlag = traceCodeNumber
			}
		}

	}
</script>

<style lang="less">
	.print {
		padding-bottom: 120rpx;

		::-webkit-scrollbar {
			width: 0;
		}



		.scroll-Y {
			height: 100%;
			width: 100%;
			white-space: nowrap;
			padding: 15px;

			.nothing {
				text-align: center;
				display: flex;
				flex-direction: column;

				.nogood {
					width: 400rpx;
					height: 400rpx;
					margin: 20% auto 0;

					image {
						width: 100%;
						height: 100%;
					}
				}

				text {
					font-size: 14px;
				}
			}


			.scroll_item {
				margin-bottom: 15px;
				font-size: 13px;
			}

		}

		.btn_box {
			display: flex;
			position: fixed;
			bottom: 0;
			width: 100%;

			.btn {
				flex: 1;
				color: #fff;
				background: linear-gradient(to left, #f53647, #fd973c);
				line-height: 2;
				border-radius: 49px;
				margin: 10px 15px;
				padding: 5px 0;
				font-size: 13px
			}

		}

		padding-top: 15px;

		.code_step {
			font-size: 12px;
			color: #CCCCCC;
			padding: 10px 10px 0;
		}

		.concent {
			font-size: 30upx;
			padding: 10px 15px;
		}

		.uni-badge-success {
			background: #fff !important;
			color: black !important;
		}

		.one_step {
			.uni-list_one {

				.item {
					justify-items: center;

					justify-content: space-between;
					font-size: 28rpx;
					padding: 10px;
					display: flex;
					border-bottom: 1px solid #ccc;

					.right {
						color: #CCCCCC;
					}
				}
			}

			.list {
				padding: 0 15px;

				.zsNot {
					text-align: center;
					font-size: 28rpx;
					padding: 10px;
					color: #CCCCCC;
				}

				.list_item {
					padding: 5px;
					display: flex;
					justify-content: space-between;
					border-bottom: 1px solid #ccc;
					font-size: 24rpx;
					align-items: center;

					radio {
						width: 40px;
					}

					text {
						flex: 1;
					}

					.img {
						width: 30px;
						height: 30px;

						image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}

		}

		.scend_step {
			.goodList {
				padding: 0 15px;
				.zsNot {
					text-align: center;
					font-size: 28rpx;
					padding: 10px;
					color: #CCCCCC;
				}
				.item {
					border: 1px solid #CCCCCC;
					border-radius: 10px;
					overflow: hidden;
					margin: 15px 0;
				}

				.item:first-child {
					margin: 0 0 15px;
				}

				.item_header {
					height: 80upx;
					display: flex;
					justify-content: space-between;
					font-size: 13px;
					background: #E6E6E6;
					align-items: center;
					padding: 0 15px;
				}

				.item_botom {
					font-size: 13px;
					border-radius: 10px;
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 10px;

					input {
						width: 100px;
						border-bottom: 1px solid #CCCCCC;
					}
				}
			}
		}

		.third_step {

			.img {
				text-align: center;
				margin: 30px 0;

				image {

					width: 120upx;
					height: 120upx;
				}
			}
		}

		// 设置外码数量
		.setting_number {
			padding: 0 15px;
		}

		.setting_number_methods_detail {
			font-size: 14px;
			padding: 0 0 10px 0;
			color: #ccc;
		}

		.setting_number_methods {
			font-size: 16px;
			padding: 10px 0;
		}

		.setting_number_methods_input {
			border: 1px solid rgba(204, 204, 204, 1);
			border-radius: 20px;
			display: flex;
			align-items: center;
			font-size: 14px;
			padding: 10px 2px;
			justify-content: space-around;

			text {
				width: 40px;
				text-align: right;
			}

			input {
				border-bottom: 1px solid #ccc;
				flex: 0.8;
			}

			image {

				width: 40upx;
				height: 40upx;
			}
		}

	}

	.print_header {

		display: flex;
		border: 1px solid #F53B47;
		width: calc(100vw - 80upx);
		margin: 0 auto 0;
		border-radius: 50px;
		overflow: hidden;

		.item {
			flex: 1;
			text-align: center;
			font-size: 13px;
			padding: 10px;

			&.active {
				color: #fff;
				background: linear-gradient(to left, #f53647, #fd973c);
			}
		}
	}
</style>
