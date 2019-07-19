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
		console.log('window1', window.targetStacks.length)
		console.log('deps1', this.deps.length, this.newDeps.length)
		pushTarget(this)
		console.warn('=-读取值中11-=', window.targetStacks.length, this.exp)
		console.log('deps12222222', this.deps.length, this.newDeps.length)
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
		console.log('window2', window.targetStacks.length)
		console.log('deps3333', this.deps.length, this.newDeps.length)
		console.warn('=-读取值中22-=')
		popTarget()
		console.log('window3', window.targetStacks.length)
		console.log('deps144444', this.deps.length, this.newDeps.length)
		this.cleanupDeps()
		console.log('window4', window.targetStacks.length)
		console.log('deps55555', this.deps.length, this.newDeps.length)
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
	    console.log('dep长度--=-====', this.deps)
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
		// this.lazy = false
		console.log('before------>')
		this.value = this.get()
		console.log('before aftrer------>')
	}
}

export const createWatch = (tm, watchs) => {
	Object.keys(watchs).map(key => {
		tm.$watch(key, watchs[key])
	})
}