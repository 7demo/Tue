(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.Tue = factory());
}(this, function () { 'use strict';

	class Dep {
		constructor() {
			this.subs = [];
		}
		addSub(sub) {
			this.subs.push(sub);
		}
		notify() {
			this.subs.map(sub => sub.update());
		}
	}

	Dep.target = null;

	class Observer{
		constructor(data, tm) {
			let dep = new Dep();
			this.dep = dep;
			this.tm = tm;
			this.walk(data);
		}

		walk(data) {
			Object.keys(data).map(key => {
				if (typeof data[key] === 'object') {
					this.walk(data[key]);
				}
				defineReactive(data, key, data[key], this.dep, this.tm);
				if (Array.isArray(data[key])) {
					defineArrayReactive(data, key, this.dep, this.tm);
				}
			});
		}
	}

	const defineReactive = (obj, key, val, dep, tm) => {
		Object.defineProperty(obj, key, {
			set(newValue) {
				let oval = tm[key];
				val = newValue;
				dep.notify();
				tm.$watch[key] && tm.$watch[key](newValue, oval);
			},
			get() {
				Dep.target && dep.addSub(Dep.target);
				return val
			}
		});
	};

	const defineArrayReactive = (obj, key, dep, tm) => {
		let arrayProto = Array.prototype;
		let arrayMethods = Object.create(arrayProto);
		[
			'push',
			'pop'
		].map(item => {
			Object.defineProperty(arrayMethods, item, {
				value: function(...arg) {
					const original = arrayProto[item];
					let args = Array.from(arguments);
					original.apply(this, args);
					dep.notify();
				}
			});
		});
		obj[key].__proto__ = arrayMethods;
	};

	const observer = (data, tm) => {
		return new Observer(data, tm)
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

	class Watcher{
		constructor(tm, exp, cb) {
			this.tm = tm;
			this.exp = exp;
			this.cb = cb;
			this.get();
		}
		get() {
			Dep.target = this;
			let arr = this.exp.split('.');
			let val = this.tm;
			arr.map(item => {
				val = val[item];
			});
			Dep.target = null;
		}
		update() {
			let arr = this.exp.split('.');
			let val = this.tm;
			arr.map(item => {
				val = val[item];
			});
			this.cb(val);
		}
	}

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
					node.textContent = txt.replace(reg, val).trim();
					new Watcher(this.tm, RegExp.$1, v => {
						node.textContent = txt.replace(reg, v).trim();
					});
				}
				if (node.nodeType === 1) {
					let attrs = node.attributes;
					Array.from(attrs).map(attr => {
						let name = attr.name;
						let exp = attr.value;
						if (name.includes('v-')) {
							let val = this.tm;
							let arr = exp.split('.');
							arr.map(item => {
								val = val[item];
							});
							node.value = val;
							new Watcher(this.tm, exp, v => {
								node.value = v;
							});
							node.addEventListener('input', e => {
								let nc = e.target.value;
								let arr = exp.split('.');
								let val = this.tm;
								arr.map(item => {
									if (arr[arr.length - 1] === item) {
										val[item] = nc;
										return
									}
									val = val[item];
								});
							});
						}
					});
				}
				if (node.childNodes && node.childNodes.length) {
					this.replace(node);
				}
			});
			return frag
		}
	}

	const initComputed = (tm) => {
		let computeds = tm.$options.computed;
		Object.keys(computeds).map(computed => {
			Object.defineProperty(tm, computed, {
				get: computeds[computed],
				set() {}
			});
		});
	};

	const initMixin = (Tue) => {
		Tue.prototype._init = function (options) {
			const tm = this;
			tm.$options = options;
			const data = tm.data = options.data || {};
			tm.$watch = options.watch || {};
			// 初始化数据，拦截set与get操作
			observer(data, tm);
			proxy(tm, data);

			// 编译模板
			new Compile(options.el, tm);

			// 计算属性
			initComputed(tm);
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
