<template>
	<view class="good">
		<view class="deliverGoods" v-if="Number(active)===0">
			<view class="context">
				<view class="header">
					<view class="left"><text>统计:</text><text>共{{codeArr.length}}件货物</text></view>
					<view class="btn" @tap="scanCode">扫一扫</view>
				</view>
				<view class="content">
					<view class="item" v-for="(item,index) in codeArr" v-if="codeArr.length>0" :key="index">
						<text>子码编号：</text><text>{{item}}</text>
						<icon type="cancel" size="26" @tap="deleteCode(index)" />
					</view>
					<view class="item" style="color: rgba(128,128,128,1);" v-if="codeArr.length===0">
						暂无关联的子码
					</view>
				</view>
			</view>

		</view>
		<view class="deliverFinish" v-if="Number(active)===1">
			<view class="context">
				<radio-group @change="radioChange">
					<view class="context_item">
						<radio style="margin-left: 10px;" color='rgb(246, 64, 70)' value="0" :checked="0 === current" />
						<view class="title">代理商：</view>
						<picker class="picker" range-key="agentName" mode="selector" @change="bindPickerChange" :value="index" :range="List">
							{{List[index].agentName}}
						</picker>

					</view>
					<view class="context_item">
						<radio style="margin-left: 10px;" color='rgb(246, 64, 70)' value="1" :checked="1 === current" />
						<view class="title">输入自定义商家：</view>
						<input type="text" v-model="sellerName" placeholder="直接输入商家名称" />
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

</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				codeArr: [],
				arr: ['中国', '美国', '巴西', '日本'],
				index: 0,
				active: 0,
				List: [],
				sellerName: ""
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
				if (this.codeArr.length === 0) {
					this.$common.showToast("外码或内码不能为空", 'none')
					return;
				}
				if (Number(this.current) === 1) {
					if (!this.$common.trim(this.sellerName)) {
						this.$common.showToast("请输入商家名称", 'none')
						return;
					}
				} else {
					if (!this.List[Number(this.index)].agentName) {
						this.$common.showToast("请选择代理商", 'none')
						return;
					}
				}
				let param={
					codeNumber:this.codeArr,
					bussName:this.sellerName
				}
				this.$common.post('/trace-api/trace/deliverGoods',param).then((res)=>{
					console.log(res)
					if(Number(res.data.code)===200){
						this.$common.showToast(res.data.message, 'success')
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 1500)
					}else{
						this.$common.showToast(res.data.message, 'none')
					}
				})
			},
			getList() {
				let merchantId = uni.getStorageSync("setUserData").merchant.merchantId
				this.$common.get("/agent/merchantAgent/list/page?merchantId=" + merchantId + "&pageNum=1&pageSize=10000").then((res) => {
					this.List = res.data.data.data || []
				})
			},
			bindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', this.List[Number(e.target.value)])
				this.index = e.target.agentName
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
							this.$common.tip("删除成功", "success")
						}
					}
				});

			},
			scanCode() {
				uni.scanCode({
					success: (res) => {
						this.$common.tip("扫码成功", "success")
						this.codeArr.push(res.result)
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

			.context_item {
				border-radius: 10px;
				border: 1px solid #ccc;
				display: flex;
				font-size: 14px;

				align-items: center;
				margin: 10px 0;

				.title {
					padding: 10px 10px;
				}

				.picker {
					flex: 1;
				}
			}
		}
	}

	.deliverGoods {
		padding: 15px 15px 0;

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
					padding: 10rpx;
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

	.btn_box {
		display: flex;
		position: fixed;
		bottom: 0;
		left: 0;
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
</style>
