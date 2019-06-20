import {Dep} from './dep.js'
export class Watcher{
	constructor(tm, exp, cb) {
		this.tm = tm
		this.exp = exp
		this.cb = cb
		this.get()
	}
	get() {
		Dep.target = this
		let arr = this.exp.split('.')
		let val = this.tm
		arr.map(item => {
			val = val[item]
		})
		Dep.target = null
	}
	update() {
		let arr = this.exp.split('.')
		let val = this.tm
		arr.map(item => {
			val = val[item]
		})
		this.cb(val)
	}
}