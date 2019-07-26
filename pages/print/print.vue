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
					<uni-list style="margin-top:50px;">
						<uni-list-item title="开始日期" show-badge="true" badge-text="2019-10-20" @click="onShowDatePicker('datetime','start')"></uni-list-item>
						<uni-list-item title="结束日期" show-badge="true" badge-text="2019-10-20" @click="onShowDatePicker('datetime','end')"></uni-list-item>
					</uni-list>
					<view class="concent">
						选择其中一个批次号
					</view>
					<view class="list">
						<view class="list_item" @tap="detailCode">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item" @tap="detailCode">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item" @tap="detailCode">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item" @tap="detailCode">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item" @tap="detailCode">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item" @tap="detailCode">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item" @tap="detailCode">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item" @tap="detailCode">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item" @tap="detailCode">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
						<view class="list_item">
							<text>追溯批次号</text>
							<view class="img">
								<image src="../../static/images/lie.png" mode=""></image>
							</view>
						</view>
					</view>
				</view>
				<view class="scend_step" v-if="Number(activeIndex)===1">

					<view class="concent">
						设置对应的比例
					</view>
					<view class="goodList">
						<view class="item">
							<view class="item_header">
								<view class="left">
									编号：1-1000
								</view>
								<view class="left">
									商品名称：蜜汁火龙果
								</view>
							</view>
							<view class="item_botom">
								<span>设置比例：</span><input type="text" value="" />
							</view>
						</view>
						<view class="item">
							<view class="item_header">
								<view class="left">
									编号：1-1000
								</view>
								<view class="left">
									商品名称：蜜汁火龙果
								</view>
							</view>
							<view class="item_botom">
								<span>设置比例：</span><input type="text" value="" />
							</view>
						</view>
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
				<button type="primary" class="btn" @tap="last">上一步</button>
				<button type="primary" class="btn" @tap="next" v-if="activeIndex!==2">下一步</button>
				<button type="primary" class="btn" @tap="print" v-if="activeIndex===2">打印</button>
			</view>
			<view class="btn_box" v-if="active===1">
				<button type="primary" class="btn" @tap="print">立即打印</button>
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
				<input type="text"  placeholder="请输入数量" value="" />
				<image src="../../static/images/chu.png" mode=""></image>
			</view>
		</view>
		<mx-date-picker :show="showPicker" :type="type" :value="value" :show-tips="true" :begin-text="'入住'" :end-text="'离店'"
		 :show-seconds="true" @confirm="onSelected" @cancel="onSelected" />

		<pengkaiDraw :visible="visible" mode="right" @close="closeDrawer">
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
				<view class="scroll_item">
					<view class="uni-title">编号：1----10000</view>
					<view class="uni-title">名称：xxxxxxxxxxx</view>
				</view>
				<view class="scroll_item">
					<view class="uni-title">编号：1----10000</view>
					<view class="uni-title">名称：xxxxxxxxxxx</view>
				</view>
				<view class="scroll_item">
					<view class="uni-title">编号：1----10000</view>
					<view class="uni-title">名称：xxxxxxxxxxx</view>
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
				activeIndex: 0,
				scrollY: true,
				visible: false,
				showPicker: false,
				date: '2019/01/01',
				time: '15:00:12',
				datetime: '2019/01/01 15:00:12',
				range: ['2019/01/01', '2019/01/06'],
				rangetime: ['2019/01/08 14:00', '2019/01/16 13:59'],
				type: 'rangetime',
				value: '',
				active: 1,
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
		methods: {
			print() {

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
				this.activeIndex = 0
			},
			onShowDatePicker(type) { //显示
				this.type = type;
				this.showPicker = true;
				this.value = this[type];
			},
			onSelected(e) { //选择
				this.showPicker = false;
				if (e) {
					this[this.type] = e.value;
					//选择的值
					console.log('value => ' + e.value);
					//原始的Date对象
					console.log('date => ' + e.date);
				}
			},
			closeDrawer() {
				this.visible = false
			},
			detailCode() {
				this.visible = true
			}
		}

	}
</script>

<style lang="less">
	.print {
		padding-bottom: 80px;

		::-webkit-scrollbar {
			width: 0;
		}

		.scroll-Y {
			height: 100%;
			width: 100%;
			white-space: nowrap;
			padding: 15px;

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
				line-height: 3;
				border-radius: 49px;
				margin: 10px 15px;
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
			.list {
				padding: 0 15px;

				.list_item {
					padding: 5px;
					display: flex;
					justify-content: space-between;
					border-bottom: 1px solid #ccc;
					font-size: 14px;
					align-items: center;

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
			text{
				width: 40px;
				text-align: right;
			}
			input{
				border-bottom: 1px solid #ccc;
				flex: 0.8;
			}
			image{
				
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
