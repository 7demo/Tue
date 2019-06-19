import { observer, proxy } from './observe.js'

export const initMixin = (Tue) => {
	console.log(this)
	Tue.prototype._init = function (options) {
		// 初始化数据，建立发布订阅模式
		const tm = this
		const data = tm.data = options.data || {}
		observer(data)
		proxy(tm, data)
	}
}