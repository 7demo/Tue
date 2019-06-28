import { observer, proxy } from './observe.js'
import {Compile} from './compile'
import {initComputed} from './computed'
import {Watcher, createWatch} from './watcher.js'

export const initMixin = (Tue) => {
	Tue.prototype._init = function (options) {
		const tm = this
		tm.$options = options
		const data = tm.data = options.data || {}
		// tm.$watch = options.watch || {}
		// 初始化数据，拦截set与get操作
		observer(data, tm)
		proxy(tm, data)

		// 编译模板
		new Compile(options.el, tm)

		// 计算属性
		initComputed(tm)

		//监控属性
		createWatch(tm, options.watch)
	}
	Tue.prototype.$watch = function(exp, cb) {
		new Watcher(this, exp, cb)
	}
}