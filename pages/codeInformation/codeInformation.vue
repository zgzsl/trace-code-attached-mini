<template>
	<view class="container">
		<view class="codeInformation" v-if="!showError">
			<view class="header">
				<view class="left">已识别的标签</view>
				<view class="btn" @tap="scanCode">继续扫一扫</view>
			</view>
			<view class="content">
				<view class="item" style="position: relative;" v-for="(item,index) in codeArr" v-if="codeArr.length>0" :key="index">
					<text style="font-size: 26rpx;">子码编号：</text><text style="font-size: 26rpx;">{{item.traceSubCodeNumber||""}}</text>
					<icon type="cancel" size="26" @tap="deleteCode(index)" />
					<text style="font-size: 26rpx;position: absolute;left: 86upx;bottom: -5upx;">sid : {{item.traceSid}}</text>
				</view>
				<view class="item" style="color: rgba(128,128,128,1);text-align: center;padding-top: 20upx;font-size: 28upx;" v-if="codeArr.length===0">
					暂无编号
				</view>
			</view>
			<view class="bottom">
				<view class="context_item">

					<view class="title">生产批次号：</view>
					<input type="number" style="font-size: 12px!important;" v-model="info.productionBatch" @input="inputContactNumber"
					 placeholder="请输入" />
				</view>
				<view class="context_item">
					<view class="title">选择商品：</view>
					<picker style="flex: 1;font-size: 12px!important;" @change="bindPickerChange" :value="index" :range="goodList">
						<view class="uni-input">{{goodList[index]}}</view>
					</picker>
				</view>
			</view>
			<view class="btn_box1">
				<button type="primary" class="btn" @tap="confirm">提交</button>
			</view>

		</view>
		<error :text="text" v-if="showError" :type="type" @scanCode='scanCode'></error>
	</view>
</template>

<script>
	import mixTree from '@/components/mix-tree/mix-tree';
	import error from '../../components/scodeError.vue';
	import throttle from '../../common/throttle.js';
	let dragBox;
	export default {

		components: {
			error,
			mixTree

		},
		data() {
			return {
				info: {
					"sids": [],
					"traceGoodId": "",
					"productionBatch": ""
				},
				List: [],
				selectValue: {},
				isScroll: true,
				type: 'scanCode',
				showError: false,
				codeArr: [],
				goodList: [],
				index: 0,
				goodAllData: []
			}
		},
		methods: {
			inputContactNumber(val) {
				if (val.detail.value) {
					this.$common.get("/trace-api/p_batch/goodsListByBatchNo/SCPC202007221645", false).then((res) => {
						if (res.data.code === 200) {
							this.goodAllData = res.data.data
							for (let s of res.data.data) {
								this.goodList.push(s.goods_name)
							}
						} else {
							this.goodList = []
						}

					})
				} else {
					this.goodList = []
				}

			},
			bindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
			},
			confirm() {
				this.info.sids = this.codeArr.map(v => {
					return v.traceSid
				})
				if (this.info.sids.length === 0) {
					this.$common.error("请录入追溯码", "error")

					return;
				}
				if (!this.info.productionBatch) {
					this.$common.error("请输入生产批次号", "error")
					return;
				}
				if (this.goodAllData.length===0) {
					this.$common.error("检索商品为空", "error")
					return;
				}
				if (!this.info.productionBatch) {
					this.$common.error("请选择对应商品", "error")
					return;
				}
			
				

				this.info.traceGoodId = this.goodAllData[this.index].goods_id
				console.log(this.info)
				this.$common.post('/trace-api/trace/miniTraceRecordBind', this.info).then((res) => {
					if (res.data.code === 200) {
						this.$common.success(res.data.message, "success")
					} else {
						this.$common.error(res.data.message, "error")
					}
				})
			},
			deleteCode(index) {
				uni.showModal({
					title: '提示',
					content: '此操作将删除此编号',
					success: (res) => {
						if (res.confirm) {
							this.codeArr.splice(index, 1);
							this.$common.showToast("删除成功", "success")
						}
					}
				});

			},
			inputSearch(val) {
				console.log(val)
				this.paramInfo.goodsName = val.detail.value

			},
			scanCode() {
				uni.scanCode({
					success: (res) => {
						let that = this
						if (res.result && res.result.indexOf(that.$common.host_name) > -1) {
							let sid = res.result.split(that.$common.host_name)[1]
							console.log('sid', sid)
							this.$common.get("/trace-api/trace/getSubCodeBySidRecord?sid=" + sid).then((res) => {
								if (Number(res.data.code) === 200) {
									that.showError = false
									if (that.codeArr.length > 0) {
										let codes = []
										for (let item of that.codeArr) {
											codes.push(item.traceSubCodeNumber)
										}
										if (codes.indexOf(res.data.data.traceSubCodeNumber) > -1) {
											that.$common.showToast("子码编号已存在", "none")
										} else {
											that.$common.showToast("扫码成功", "success")
											that.codeArr.unshift(res.data.data)
										}
									} else {
										that.$common.showToast("扫码成功", "success")
										that.codeArr.unshift(res.data.data)
									}
								} else {
									that.showError = false
									that.$common.showToast(res.data.message, 'none')
								}
							})

						} else {
							this.showError = true
							this.text = "关联子码获取失败"
							this.type = 'scanCode'
						}
					}
				});
			}
		}
	}
</script>

<style lang="less" scoped>
	.codeInformation {
		.content {
			overflow-y: scroll;
			height: calc(100vh - 400rpx);
			font-size: 14px;
			background: #F7F7F7;
			margin: 10px;
			height: 688upx;

			.item {
				position: relative;
				display: flex;
				align-items: center;
				padding: 10px 2px;
				justify-content: space-around;

			}
		}

		.header {
			justify-content: center;
			align-items: center;
			display: flex;

			padding: 10px 5px 0;

			font-size: 30rpx;
			justify-content: space-between;

			.left {
				display: flex;
				color: #000;
			}

			.btn {
				color: #F53747;
				border-radius: 5px;
				border: 1px solid #fff;
				padding: 10rpx 20rpx;
				font-size: 24rpx;

				color: rgba(255, 255, 255, 1);
				background: linear-gradient(to left, #f53647, #fd973c);
			}
		}

		.bottom {
			margin: 10px 10px;

			.context_item {
				border-radius: 10px;
				border: 1px solid #ccc;
				display: flex;

				min-height: 78upx;
				align-items: center;
				margin: 10px 0;

				.title {
					padding: 20rpx 10rpx;
					font-size: 26upx;
				}

				input {
					width: calc(100vw - 240upx);
					font-size: 24upx;
				}

				.box {
					font-size: 24upx;
					flex: 1;
					height: 100%;
					align-items: center;
					// justify-content: center;
					display: flex;
					padding: 10upx;

				}

				.picker {
					flex: 1;
				}
			}
		}

		.btn_box1 {
			display: flex;
			// position: fixed;
			// bottom: 0;
			// left: 0;
			margin: 36upx 0;
			width: 100%;

			.btn {
				flex: 1;
				color: #fff;
				background: linear-gradient(to left, #f53647, #fd973c);
				border-radius: 49px;
				margin: 10px 15px;
			}

		}


	}
</style>
