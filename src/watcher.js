import {Dep} from './dep.js'
export class Watcher{
	constructor(tm, exp, cb) {
		this.tm = tm
		this.exp = exp
		this.cb = cb
		this.value = this.get()
	}
	get() {
		Dep.target = this
		let arr = this.exp.split('.')
		let val = this.tm
		arr.map(item => {
			val = val[item]
		})
		Dep.target = null
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
	}
}

export const createWatch = (tm, watchs) => {
	Object.keys(watchs).map(key => {
		tm.$watch(key, watchs[key])
	})
}