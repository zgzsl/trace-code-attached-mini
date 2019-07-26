<template>
	<view class="insideCode">
		<view class="setting_insideCode">
			<view class="item">
				<view class="name">内码编号：</view>
				<text>WM20190913787681001</text>
				<view class="btn">重新扫一扫</view>
			</view>
		</view>
		<view class="btn_box">
			<button type="primary" class="btn">确定变更</button>
		</view>
	</view>
</template>

<script>
</script>

<style lang="less">
	.insideCode {
		padding: 15px 15px 0;

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
	}

	.setting_insideCode {
		.item {
			border: 1px solid rgba(204, 204, 204, 1);
			border-radius: 20px;
			display: flex;
			align-items: center;
			font-size: 14px;
			// padding: 10px 2px;
			justify-content: space-between;
			min-height: 50px;

			text {
				flex: 1;
			}

			.name {
				padding: 0 0 0 15px;
				width:80px;
			}

			.btn {
				width: 100px;
				font-family: PingFang-SC-Medium;
				font-weight: 500;
				color: rgba(245, 53, 71, 1);
			}
		}


	}
</style>
