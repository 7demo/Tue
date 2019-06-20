class Observer{
	constructor(data) {
		console.log(data)
		this.walk(data)
	}

	walk(data) {
		Object.keys(data).map(key => {
			if (typeof data[key] === 'object') {
				this.walk(data[key])
			}
			defineReactive(data, key, data[key])
		})
	}
}

export const defineReactive = (obj, key, val) => {
	Object.defineProperty(obj, key, {
		set(newValue) {
			val = newValue
		},
		get() {
			return val
		}
	})
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