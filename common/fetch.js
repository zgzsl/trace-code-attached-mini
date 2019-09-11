export default class common {
	static goLogin = '/accountCenter/account/login/zs'
	static host = "https://zs.cntracechain.com"

	static post(url, data) {
		const value = uni.getStorageSync('setUserData');
		common.showLoading()
		return new Promise((resolve, reject) => {
			uni.request({
				url: common.host + url, //仅为示例，并非真实接口地址。
				data: data,
				header: {
					token: value.token
				},
				method: 'POST',
				success: (res) => {
					if (Number(res.data.code) === 401) {
						common.jumplogin()
					} else {
						resolve(res)
					}
					
					setTimeout(() => {
						common.hideLoading()
					}, 1500)

				},
				fail: (err) => {
					reject(err)
					setTimeout(() => {
						common.hideLoading()
					}, 1500)
				}
			});
		})

	}

	static get(url) {
		common.showLoading()
		const value = uni.getStorageSync('setUserData');
		return new Promise((resolve, reject) => {
			uni.request({
				url: common.host + url, //仅为示例，并非真实接口地址。
				header: {
					token: value.token
				},
				success: (res) => {
					if (Number(res.data.code) === 401) {
						common.jumplogin()
					} else {
						resolve(res)
					}

					setTimeout(() => {
						common.hideLoading()
					}, 800)
				},
				fail: (err) => {
					reject(err)
					setTimeout(() => {
						common.hideLoading()
					}, 800)
				}
			});
		})

	}
	static jumplogin(){
	uni.redirectTo({
		url: '../login/login'
	})
	}
	static showLoading() {
		uni.showLoading({
			mask: true,
			title: '加载中'
		})
	}
	static hideLoading() {
		uni.hideLoading()
	}
	static success(title) {
		uni.showToast({
			icon: 'success',
			position: 'bottom',
			title: title
		});
	}
	static modal(title) {
		uni.showModal({
			content: title,
			showCancel: false
		})
	}
	static replace(str) {
		str = str.replace(/\//g, "-")
		return str
	}
	static error(title) {
		uni.showToast({
			icon: 'none',
			position: 'bottom',
			title: title
		});
	}
	static trim(str) {
		str = str.replace(/\s/g, "");
		return str
	}
	static tip(title, icon) {
		uni.showLoading({
			title: title,
			icon: icon
		});
		setTimeout(function() {
			uni.hideLoading();
		}, 800);
	}
	static showToast(title, icon) {
		uni.showToast({
			title: title,
			duration: 2000,
			icon: icon
		});
	}
	static timeStamphang(timeData, type) {
		// console.log(timeData)
		// type 1 是时分秒  0 无时分秒
		let date = new Date(timeData)
		let year = date.getFullYear()
		let mouth = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)
		let day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
		let hour = ''
		let min = ''
		let sec = ''
		let hourMinSe = ''
		if (type) {
			hour = date.getHours() > 9 ? date.getHours() : '0' + date.getHours()
			min = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()
			sec = date.getMilliseconds() > 9 ? date.getMilliseconds() : '0' + date.getMilliseconds()
			hourMinSe = ` ${hour}:${min}:${sec}`
		}
		// console.log(hour)
		let time = `${year}-${mouth}-${day}${hourMinSe}`

		return time
	}

}
