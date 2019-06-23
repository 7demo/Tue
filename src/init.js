import { observer, proxy } from './observe.js'
import {Compile} from './compile'

export const initMixin = (Tue) => {
	Tue.prototype._init = function (options) {
		const tm = this
		const data = tm.data = options.data || {}
		// 初始化数据，拦截set与get操作
		observer(data)
		proxy(tm, data)

		// 编译模板
		new Compile(options.el, tm)
	}
}