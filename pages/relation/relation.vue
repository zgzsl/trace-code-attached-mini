<template>
	<view class="relation">
		<view class="right" v-if="!showError">
			<view class="out" v-if="outCode">
				<view class="context">
					<view class="header">
						<view class="left"><text>外码编号:</text><text>{{outCode||""}}</text></view>
						<view class="btn" @tap="relation">关联子码</view>
					</view>

					<view class="content1">
						<mix-tree :list="list" @treeItemClick="treeItemClick" @deleteCode="deleteCode"></mix-tree>
					</view>
					<!-- 	<view class="content2" >
						
					</view> -->
				</view>
				<view class="btn_box">
					<button type="primary" class="btn" @tap="confirm">完成</button>
				</view>
			</view>
			<view class="outbtn" v-if="!outCode">
				<button @tap="createdClick">扫一扫获取外码</button>
			</view>
		</view>
		<error :text="text" v-if="showError" :type="type" @relation='relation' @createdClick='createdClick'></error>
	</view>
</template>

<script>
	import mixTree from '@/components/mix-tree/mix-tree';
	import error from '../../components/scodeError.vue'
	export default {
		data() {
			return {

				text: '扫码错误',
				showError: false,
				outCode: "",
				chlidCodeArr: [],
				type: '',
				alonecode: "",
				list: [],
				flag: true,
				firstData: [],
				count: 0

			}
		},
		components: {
			error,
			mixTree
		},
		// onLoad() {
		// 	this.list = [{
		// 		"id": 1152,
		// 		"traceIndex": 7,
		// 		"traceCodeNumber": "zs1566444062298000575418592",
		// 		"traceSubCodeNumber": "042615664440623250007",
		// 		"traceGoodId": 17621,
		// 		"traceStallId": -1,
		// 		"parentId": null,
		// 		"isLeaf": "N",
		// 		"nodeLevel": 3,
		// 		"scanCount": 0,
		// 		"children": [],
		// 		"name": "042615664440623250007"
		// 	}]
		// },
		methods: {
			//点击最后一级时触发该事件
			treeItemClick(item) {

			},
			createdClick() {
				uni.scanCode({
					success: (res) => {
						let that = this
						if (res.result && res.result.indexOf("SID") > 0) {
							let sid = res.result.split("SID=")[1]
							this.$common.get("/trace-api/trace/getSubCodeById?sid=" + sid).then((res) => {
								if (Number(res.data.code) === 200) {
									if (res.data.data.isLeaf === 'N') {
										that.$common.showToast("扫码成功", "success")
										that.showError = false
										that.outCode = res.data.data.traceSubCodeNumber || ""
										this.getTree()
									} else {
										this.showError = true
										this.text = "此码不是外码,外码获取失败"
										this.type = 'createdClick'
									}
								} else {
									that.$common.showToast(res.data.message, 'none')
								}

							})
						} else {
							this.showError = true
							this.text = "外获取失败"
							this.type = 'createdClick'
						}
					}
				});
			},
			confirm() {
				if (!this.outCode) {
					this.$common.showToast("外码不能为空", 'none')
					return;
				}
				if (this.chlidCodeArr.length === 0&&this.list.length===0) {
					this.$common.showToast("子码不能为空", 'none')
					return;
				}

				let param = {
					outCode: this.outCode,
					subCodeList: this.chlidCodeArr
				}
				this.$common.post("/trace-api/trace/relationOutCode", param).then((res) => {
					console.log("relationOutCode", res)
					if (Number(res.data.code) === 200) {
						uni.showToast({
							title: res.data.message,
							duration: 2000
						});
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							});
						}, 1500)
					} else {

						uni.showToast({
							title: res.data.message,
							duration: 2000,
							icon: "none"
						});
					}
				})
			},
			deleteCode(item) {
				console.log(item)
				uni.showModal({
					title: '提示',
					content: '此操作将删除此子码编号',
					success: (res) => {
						if (res.confirm) {
							this.$common.post('/trace-api/trace/deleteCode/' + item.id).then((res) => {
								if (Number(res.data.code) === 200) {
									this.$common.showToast("删除成功", "success")


									if (this.chlidCodeArr.indexOf(String(item.name)) > -1) {
										let index = 0
										for (let i in this.chlidCodeArr) {

											if (String(this.chlidCodeArr[i]) === String(item.name)) {

												index = i
												break;
											}
										}

										let newArr = this.chlidCodeArr
										let newArr2 = newArr.splice(index, 1)

									}
									this.getTree()

								} else {
									this.$common.showToast(res.data.message, "none")
								}
							})

						}
					}
				});

			},
			iterator(list, sucode) {

				for (let index in list) {
					if (String(list[index].traceSubCodeNumber) === String(sucode)) {
						this.count++;
					}
					if (list[index].children !== null) {
						list[index].children = this.iterator(list[index].children, sucode)
					}
				}
			},
			relation() {
				uni.scanCode({
					success: (res) => {
						let that = this
						if (res.result && res.result.indexOf("SID") > 0) {
							let sid = res.result.split("SID=")[1]
							this.$common.get("/trace-api/trace/getSubCodeById?sid=" + sid).then((res) => {
								this.count = 0
								if (Number(res.data.code) === 200) {
									if (this.chlidCodeArr.indexOf(res.data.data.traceSubCodeNumber) > -1) {
										this.$common.showToast("编码已存在", "none")
									} else {
										if (res.data.data.traceSubCodeNumber === this.outCode) {
											this.$common.showToast("不能关联本身", "none")
										} else {

											this.iterator(this.list, res.data.data.traceSubCodeNumber)
											console.log("this.count ", this.count)
											if (this.count > 0) {
												this.$common.showToast("编码已存在", "none")
												setTimeout(() => {
													this.getTree()
												}, 800)
												return false
											} else {
												this.chlidCodeArr.push(res.data.data.traceSubCodeNumber)
												this.getTree()
											}


										}

									}
								} else {
									that.$common.showToast(res.data.message, 'none')
								}
							})
						} else {
							this.showError = true
							this.text = "子码获取失败"
							this.type = 'relation'
						}
					}
				});
			},
			getTree() {
				this.$common.post("/trace-api/trace/getTreeListCode", {
					subCodeList: this.chlidCodeArr,
					outCode: this.outCode,
				}).then((res) => {

					this.list = res.data.data

					// this.$common.showToast("操作成功", "success")

				})
			}
		}

	}
</script>

<style lang="less">
	.relation {
		padding: 15px 15px 0;
		// padding-bottom: 100px;

		.context {
			overflow-y: hidden;
			border: 1px solid #ccc;
			border-radius: 10px;

			.header {
				justify-content: center;
				align-items: center;
				display: flex;
				color: rgba(255, 255, 255, 1);
				padding: 20rpx 8rpx;
				background: linear-gradient(to left, #f53647, #fd973c);
				font-size: 26rpx;
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

			.content2 {
				width: calc(100vw - 30px);
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

			.content1 {
				// display: flex;
				width: calc(100vw -60px);
				overflow: scroll;
				height: calc(100vh - 400rpx);
				font-size: 14px;
				background: rgba(242, 242, 242, 1);
				margin: 10px;
				// padding
				// justify-content:center;

				.item {
					position: relative;
					display: flex;
					align-items: center;
					padding: 10px 2px;
					justify-content: space-around;

				}
			}
		}

		.outbtn {
			button {
				background: linear-gradient(to left, #f53647, #fd973c);
				color: #FFFFFF;
				font-size: 30rpx;
				padding: 2px 5px;
				border-radius: 49rpx;
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
			// line-height: 3;
			border-radius: 49rpx;
			margin: 10rpx 15rpx;
			padding: 8px;
			font-size: 26rpx;
		}

	}
</style>
