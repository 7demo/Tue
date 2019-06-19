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

	const initMixin = (Tue) => {
		// console.log(Tue, typeof Tue)
		Tue.prototype.init  = (options) => {
			console.log(1111, undefined);
			// 初始化数据，建立发布订阅模式
			const data = undefined.data = options.data || {};
			observer(data);
		};
	};

	class Tue {
		constructor(options) {
			console.log(options, this);
			this.init(options);
		}
	}
	initMixin(Tue);

	return Tue;

}));
