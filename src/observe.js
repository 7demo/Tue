import {Dep} from './dep.js'


class Observer{
	constructor(data) {
		let dep = new Dep()
		this.dep = dep
		this.walk(data)
	}

	walk(data) {
		Object.keys(data).map(key => {
			if (typeof data[key] === 'object') {
				this.walk(data[key])
			}
			defineReactive(data, key, data[key], this.dep)
			if (Array.isArray(data[key])) {
				defineArrayReactive(data, key, this.dep)
			}
		})
	}
}

export const defineReactive = (obj, key, val, dep) => {
	Object.defineProperty(obj, key, {
		set(newValue) {
			val = newValue
			dep.notify()
		},
		get() {
			Dep.target && dep.addSub(Dep.target)
			return val
		}
	})
}

export const defineArrayReactive = (obj, key, dep) => {
	let arrayProto = Array.prototype
	let arrayMethods = Object.create(arrayProto);
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

export const observer = (data) => {
	return new Observer(data)
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