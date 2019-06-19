import { observer } from './observe.js'

export const initMixin = (Tue) => {
	// console.log(Tue, typeof Tue)
	Tue.prototype.init  = (options) => {
		console.log(1111, this)
		// 初始化数据，建立发布订阅模式
		const data = this.data = options.data || {}
		observer(data)
	}
}