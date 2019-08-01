<template>
	<view class="relation">
		<view class="out" v-if="outCode">
			<view class="context">
				<view class="header">
					<view class="left"><text>外码编号:</text><text>{{outCode||""}}</text></view>
					<view class="btn" @tap="relation">关联子码</view>
				</view>
				<view class="content">
					<view class="item" v-for="(item,index) in chlidCodeArr" v-if="chlidCodeArr.length>0" :key="index">
						<text>子码编号：</text><text>{{item}}</text>
						<icon type="cancel" size="26" @tap="deleteCode(index)" />
					</view>
					<view class="item" style="color: rgba(128,128,128,1);" v-if="chlidCodeArr.length===0">
						暂无关联的子码
					</view>
				</view>
			</view>
			<view class="btn_box">
				<button type="primary" class="btn" @tap="confirm">完成</button>
			</view>
		</view>
		<view class="outbtn" v-if="!outCode">
			<button  style="background:linear-gradient(to left, #f53647, #fd973c);color: #FFFFFF;" @tap="createdClick">扫一扫获取外码</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				outCode: '',
				chlidCodeArr: []
			}
		},
		created() {
			
		},
		methods: {
			createdClick(){
				uni.scanCode({
					success: (res) => {
						this.$common.tip("扫码成功", "success")
						this.outCode = res.result
					}
				});
			},
			confirm() {
				if (!this.outCode) {
					this.$common.tip("外码不能为空", "none")
					return;
				}
				if (this.chlidCodeArr.length === 0) {
					this.$common.tip("子码不能为空", "none")
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
							title: res.data.data,
							duration: 2000
						});
						setTimeout(()=>{
							uni.navigateBack({
								delta: 1
							});
						},1500)
					} else {

						uni.showToast({
							title: res.data.data,
							duration: 2000,
							icon: "none"
						});
					}
				})
			},
			deleteCode(index) {
				uni.showModal({
					title: '提示',
					content: '此操作将删除此子码编号',
					success: (res) => {
						if (res.confirm) {
							this.chlidCodeArr.splice(index, 1);
							this.$common.tip("删除成功", "success")
						}
					}
				});

			},
			relation() {
				uni.scanCode({
					success: (res) => {
						this.$common.tip("扫码成功", "success")
						this.chlidCodeArr.push(res.result)
					}
				});
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
				padding: 10px 2px;
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
