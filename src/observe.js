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