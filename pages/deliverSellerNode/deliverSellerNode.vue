<template>
	<view class="good">
		<view class="box" v-if="!showError">
			<view class="deliverGoods" v-if="Number(active)===0">
				<view class="context">
					<view class="header">
						<view class="left">列表</view>
						<view class="btn" @tap="scanCode">添加编号</view>
					</view>
					<view class="content">
						<view class="item" v-for="(item,index) in codeArr" v-if="codeArr.length>0" :key="index">
							<text style="font-size: 26rpx;">子码编号：</text><text style="font-size: 26rpx;">{{item.traceSubCodeNumber||""}}</text>
							<icon type="cancel" size="26" @tap="deleteCode(index)" />
						</view>
						<view class="item" style="color: rgba(128,128,128,1);" v-if="codeArr.length===0">
							暂无编号
						</view>
					</view>
				</view>

			</view>
			<view class="deliverFinish" v-if="Number(active)===1">
				<view class="context">
					<radio-group @change="radioChange">
						<view class="title_header">
							模式
						</view>
						<view class="context_item">
							<radio style="margin-left: 10px;" color='rgb(246, 64, 70)' value="0" :checked="0 === current" />
							<view class="title">添加节点</view>
							

						</view>
						<view class="context_item">
							<radio style="margin-left: 10px;" color='rgb(246, 64, 70)' value="1" :checked="1 === current" />
							<view class="title">已经出售</view>
					
						</view>
						<view class="title_header">
							节点信息
						</view>
						<view class="context_item">
							
							<view class="title">手机号码：</view>
							<input type="text" v-model="phone" placeholder="输入手机号码" />
						</view>
						<view class="context_item">
							
							<view class="title">追溯点名称：</view>
							<input type="text" v-model="sellerName" placeholder="输入追溯点名称" />
						</view>
						<view class="context_item">
							
							<view class="title">负责人：</view>
							<input type="text" v-model="sellerName" placeholder="输入追溯点名称" />
						</view>
					</radio-group>

				</view>

			</view>
			<view class="btn_box">
				<button type="primary" class="btn" @tap="active=0" v-if=" active===1">上一步</button>
				<button type="primary" class="btn" @tap="next" v-if="active===0">下一步</button>
				<button type="primary" class="btn" v-if="active===1" @tap="nextConfirm">完成</button>
			</view>
		</view>
		<error :text="text" v-if="showError" :type="type" @scanCode='scanCode'></error>
	</view>

</template>

<script>
	import error from '../../components/scodeError.vue'
	export default {
		components: {
			error
		},
		data() {
			return {
				type: 'scanCode',
				text: '扫码错误',
				showError: false,
				current: 0,
				codeArr: [],
				arr: ['中国', '美国', '巴西', '日本'],
				index: 0,
				active: 1,
				List: [],
				sellerName: "",
				count: 0
			}
		},
		watch: {
			"codeArr": {
				handler(value) {
					let count = 0;
					for (let item of this.codeArr) {
						count += item.count
					}
					this.count = count
				},
				deep: true
			}

		},
		methods: {
			radioChange(evt) {
				console.log(evt)
				this.current = Number(evt.detail.value)
				console.log(this.current)
			},
			next() {
				if (this.codeArr.length > 0) {
					this.active = 1;
				} else {
					this.$common.showToast("请添加货物", 'none')
				}
			},
			nextConfirm() {
				let sellName = ""
				if (this.codeArr.length === 0) {
					this.$common.showToast("外码或内码不能为空", 'none')
					return;
				}
				if (Number(this.current) === 1) {
					if (!this.$common.trim(this.sellerName)) {
						this.$common.showToast("请输入商家名称", 'none')
						return;
					}
					sellName = this.sellerName
				} else {
					if (!this.List[Number(this.index)].agentName) {

						this.$common.showToast("请选择代理商", 'none')
						return;
					} else {
						sellName = this.List[Number(this.index)].agentName
					}
				}
				console.log(this.current)
				let arr = []
				for (let item of this.codeArr) {
					arr.push(item.traceSubCodeNumber)
				}
				let param = {
					codeNumber: arr,
					bussName: sellName
				}
				console.log(param)
				this.$common.post('/trace-api/trace/deliverGoods', param).then((res) => {
					console.log(res)
					if (Number(res.data.code) === 200) {
						this.$common.showToast(res.data.message, 'success')
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 1500)
					} else {
						this.$common.showToast(res.data.message, 'none')
					}
				})
			},
			getList() {
				let merchantId = uni.getStorageSync("setUserData").merchant.merchantId
				this.$common.get("/agent/merchantAgent/normal?merchantId=" + merchantId).then((res) => {
					console.log(res)
					this.List = res.data.data || []
				})
			},
			bindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', this.List[Number(e.target.value)])
				console.log(Number(e.target.value))
				this.index = Number(e.target.value)

			},
			jump() {
				this.active = 1
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
			scanCode() {
				uni.scanCode({
					success: (res) => {
						let that = this
						if (res.result && res.result.indexOf("SID") > 0) {
							let sid = res.result.split("SID=")[1]
							this.$common.get("/trace-api/trace/getSubCodeById?sid=" + sid).then((res) => {
								if (Number(res.data.code) === 200) {
									console.log("发货对象",res)
									that.showError = false
									if(Number(res.data.data.isEnable)>0){
										if (that.codeArr.length > 0) {
											let codes = []
											for (let item of that.codeArr) {
												codes.push(item.traceSubCodeNumber)
											}
											if (codes.indexOf(res.data.data.traceSubCodeNumber) > -1) {
												that.$common.showToast("子码编号已存在", "none")
											} else {
												that.$common.showToast("扫码成功", "success")
												that.codeArr.push({
													count: res.data.data.count,
													traceSubCodeNumber: res.data.data.traceSubCodeNumber
												})
											}
											console.log(codes)
										} else {
											that.$common.showToast("扫码成功", "success")
											that.codeArr.push({
												count: res.data.data.count,
												traceSubCodeNumber: res.data.data.traceSubCodeNumber
											})
										}
									}else{
										that.$common.showToast("此编码已发货", "none")
									}
									
									

									console.log(that.codeArr)
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
		},
		created() {
			this.getList()
			// this.scanCode()
		}
	}
</script>

<style lang="less">
	.deliverFinish {
		.context {
			margin: 10px 10px;
			.title_header{
				font-size: 28upx;
				padding: 15upx;
			}
			.context_item {
				border-radius: 10px;
				border: 1px solid #ccc;
				display: flex;
				font-size: 14px;

				align-items: center;
				margin: 10px 0;

				.title {
					padding: 20rpx 20rpx;
				}

				.picker {
					flex: 1;
				}
			}
		}
	}

	.deliverGoods {
		padding: 30rpx 30rpx 0;

		.context {
			overflow-y: hidden;
			border: 1px solid #ccc;
			border-radius: 10px;

			.header {
				justify-content: center;
				align-items: center;
				display: flex;
				color: rgba(255, 255, 255, 1);
				padding: 10px 5px;
				background: linear-gradient(to left, #f53647, #fd973c);
				font-size: 30rpx;
				justify-content: space-between;

				.left {
					display: flex;
				}

				.btn {
					color: #F53747;
					border-radius: 5px;
					border: 1px solid #fff;
					padding: 10rpx 20rpx;
					font-size: 24rpx;
					color: #000;
					background: #fff;
				}
			}

			.content {
				overflow-y: scroll;
				height: calc(100vh - 400rpx);
				font-size: 14px;
				background: rgba(242, 242, 242, 1);
				margin: 10px;

				.item {
					position: relative;
					display: flex;
					align-items: center;
					padding: 10px 2px;
					justify-content: space-around;

				}
			}
		}

	}
</style>
