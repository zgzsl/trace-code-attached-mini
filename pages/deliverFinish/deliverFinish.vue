<template>
	<view class="deliverFinish">

		<view class="context">
			<view class="context_item">
				<view class="title">代理商：</view>
				<picker class="picker" mode="selector" @change="bindPickerChange" :value="index" :range="arr">
					{{arr[index]}}
				</picker>
			</view>
			<view class="context_item">
				<view class="title">输入自定义商家：</view>
				<input type="text" placeholder="直接输入商家名称" value="" />
			</view>
		</view>
			<view class="btn_box">
			<button type="primary" class="btn">完成</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				arr: ['中国', '美国', '巴西', '日本'],
				index: 0
			}
		},
		methods: {
			bindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.index = e.target.value
			}
		}
	}
</script>

<style lang="less">
	.context {
		margin: 10px 10px;

		.context_item {
			border-radius: 10px;
			border: 1px solid #ccc;
			display: flex;
			font-size: 14px;
			padding: 10px 10px;
			align-items: center;
			margin: 10px 0;
			.picker{
				flex: 1;
			}
		}
	}
</style>
