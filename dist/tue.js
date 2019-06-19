(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.Tue = factory());
}(this, function () { 'use strict';

	class Observer{
		constructor(data) {
			console.log(data);
			this.walk(data);
		}

		walk(data) {
			Object.keys(data).map(key => {
				if (typeof data[key] === 'object') {
					this.walk(data[key]);
				}
				defineReactive(data, key, data[key]);
			});
		}
	}

	const defineReactive = (obj, key, val) => {
		Object.defineProperty(obj, key, {
			set(newValue) {
				val = newValue;
			},
			get() {
				return val
			}
		});
	};

	const observer = (data) => {
		return new Observer(data)
	};

	// 作为代理拦截
	// 实现 this.msg 即为 this.data.msg
	const proxy = (tm, data) => {
		Object.keys(data).map(key => {
			Object.defineProperty(tm, key, {
				set(val) {
					tm.data[key] = val;
				},
				get() {
					return tm.data[key]
				}
			});
		});
		
	};

	const initMixin = (Tue) => {
		console.log(undefined);
		Tue.prototype._init = function (options) {
			// 初始化数据，建立发布订阅模式
			const tm = this;
			const data = tm.data = options.data || {};
			observer(data);
			proxy(tm, data);
		};
	};

	class Tue {
		constructor(options) {
			console.log(options, this);
			this._init(options);
		}
	}

	initMixin(Tue);

	return Tue;

}));
