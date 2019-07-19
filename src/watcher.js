import {Dep, pushTarget, popTarget} from './dep.js'
let uid = 0
export class Watcher{
	constructor(tm, exp, cb, opts) {
		opts = opts || {}
		this.id = ++uid
		this.tm = tm
		this.exp = exp
		this.cb = cb
		this.lazy = opts.lazy
		this.deps = []
		this.newDeps = []
		this.depIds = []
		this.newDepIds = []
		if (this.lazy) {
			this.value = undefined
		} else {
			this.value = this.get()
		}
	}
	get() {
		pushTarget(this)
		let val
		if (typeof this.exp === 'function') {
			val = this.exp.call(this.tm)
		} else {
			let arr = this.exp.split('.')
			val = this.tm
			arr.map(item => {
				val = val[item]
			})
		}
		popTarget()
		this.cleanupDeps()
		this.cb(val)
		return val
	}
	addDep (dep) {
		const id = dep.id
		if (this.newDepIds.indexOf(id) == '-1') {
			this.newDepIds.push(id)
			this.newDeps.push(dep)
			if (this.depIds.indexOf(id) == '-1') {
				dep.addSub(this)
			}
		}
	}
	cleanupDeps () {
	    let i = this.deps.length
	    while (i--) {
	      const dep = this.deps[i]
	      if (this.newDepIds.indexOf(dep.id) == '-1') {
	        dep.removeSub(this)
	      }
	    }
	    let tmp = this.depIds
	    this.depIds = this.newDepIds
	    this.newDepIds = tmp
	    this.newDepIds = []
	    tmp = this.deps
	    this.deps = this.newDeps
	    this.newDeps = tmp
	    this.newDeps.length = 0
	  }
	depend () {
	    let i = this.deps.length
	    while (i--) {
	      this.deps[i].depend()
	    }
	  }
	update() {
		let val
		let oldValue
		if (typeof this.exp === 'function') {
			oldValue = this.value
			val = this.exp.call(this.tm)
		} else {
			let arr = this.exp.split('.')
			oldValue = this.value
			val = this.tm
			arr.map(item => {
				val = val[item]
			})
		}
		this.value = val
		this.cb(val, oldValue)
	}
	evaluate() {
		this.value = this.get()
	}
}

export const createWatch = (tm, watchs) => {
	Object.keys(watchs).map(key => {
		tm.$watch(key, watchs[key])
	})
}