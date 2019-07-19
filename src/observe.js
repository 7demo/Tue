import {Dep} from './dep.js'


class Observer{
	constructor(data, tm) {
		let dep = new Dep()
		this.dep = dep
		this.tm = tm
		this.walk(data)
	}
	walk(data) {
		Object.keys(data).map(key => {
			if (typeof data[key] === 'object') {
				this.walk(data[key])
			}
			if (Array.isArray(data[key])) {
				// defineArrayReactive(data, key, this.tm)
			} else {
				defineReactive(data, key, data[key], this.tm)
			}
		})
	}
}

export const defineReactive = (obj, key, val, tm, dep) => {
	dep =  dep || new Dep()
	Object.defineProperty(obj, key, {
		set(newValue) {
			if (val == newValue) return
			val = newValue
			dep.notify()
		},
		get() {
			console.log('------', key, val)
			// Dep.target && dep.addSub(Dep.target)
			Dep.target && dep.depend()
			return val
		}
	})
}

export const defineArrayReactive = (obj, key, tm) => {
	let dep =  new Dep()
	let arrayProto = Array.prototype
	let arrayMethods = Object.create(arrayProto)
	defineReactive(obj, key, obj[key], tm, dep);
	[
		'push',
		'pop'
	].map(item => {
		Object.defineProperty(arrayMethods, item, {
			value: function(...arg) {
				const original = arrayProto[item]
				let args = Array.from(arguments)
				original.apply(this, args)
				dep.notify()
			}
		})
	})
	obj[key].__proto__ = arrayMethods
}

export const observer = (data, tm) => {
	return new Observer(data, tm)
}

// 作为代理拦截
// 实现 this.msg 即为 this.data.msg
export const proxy = (tm, data) => {
	Object.keys(data).map(key => {
		Object.defineProperty(tm, key, {
			set(val) {
				tm.data[key] = val
			},
			get() {
				return tm.data[key]
			}
		})
	})
}