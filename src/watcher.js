import {Dep, pushTarget, popTarget} from './dep.js'
export class Watcher{
	constructor(tm, exp, cb, opts) {
		opts = opts || {}
		this.tm = tm
		this.exp = exp
		this.cb = cb
		this.lazy = opts.lazy
		if (this.lazy) {
			this.value = undefined
		} else {
			this.value = this.get()
		}
	}
	get() {
		pushTarget(this)
		let arr = this.exp.split('.')
		let val = this.tm
		arr.map(item => {
			val = val[item]
		})
		popTarget()
		return val
	}
	update() {
		let arr = this.exp.split('.')
		let oldValue = this.value
		let val = this.tm
		arr.map(item => {
			val = val[item]
		})
		this.value = val
		this.cb(val, oldValue)
	},
	evaluate() {
		this.value = this.get()
	}
}

export const createWatch = (tm, watchs) => {
	Object.keys(watchs).map(key => {
		tm.$watch(key, watchs[key])
	})
}