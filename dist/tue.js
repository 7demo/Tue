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

	/**
	 * 编译模板
	 */

	class Compile {
		constructor(el, tm) {
			this.tm = tm;
			tm.$el = document.querySelector(el);
			let fragment = document.createDocumentFragment();
			let child = null;
			while (child = tm.$el.firstChild) {
				fragment.appendChild(child);
			}
			let frag = this.replace(fragment);
			tm.$el.appendChild(frag);
		}
		replace(frag) {
			Array.from(frag.childNodes).map(node => {
				let txt = node.textContent;
				let reg = /\{\{(.*?)\}\}/g;
				if (node.nodeType === 3 && reg.test(txt)) {
					let val = this.tm;
					let arr = RegExp.$1.split('.');
					arr.map(item => {
						val = val[item];
					});
					node.textContent = node.textContent.replace(reg, val).trim();
				}
				if (node.childNodes && node.childNodes.length) {
					this.replace(node);
				}
			});
			return frag
		}
	}

	const initMixin = (Tue) => {
		console.log(undefined);
		Tue.prototype._init = function (options) {
			const tm = this;
			const data = tm.data = options.data || {};
			// 初始化数据，建立发布订阅模式
			observer(data);
			proxy(tm, data);

			// 编译模板
			new Compile(options.el, tm);
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
