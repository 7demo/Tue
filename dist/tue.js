(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.Tue = factory());
}(this, function () { 'use strict';

	let uid = 0;
	class Dep {
		constructor() {
			this.id = ++uid;
			this.subs = [];
		}
		// watcher 监视器纳入订阅
		addSub(sub) {
			this.subs.push(sub);
		}
		// 加入依赖
		depend() {
			if (Dep.target) {
				Dep.target.addDep(this);
			}
		}
		notify() {
			this.subs.map(sub => sub.update());
		}
	}

	Dep.target = null;

	const targetStacks = [];

	const pushTarget = (target) => {
		Dep.target = target;
		targetStacks.push(target);
	};

	const popTarget = () => {
		targetStacks.pop();
		Dep.target = targetStacks[targetStacks.length - 1];
	};
	window.targetStacks = targetStacks;

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
				if (Array.isArray(data[key])) ; else {
					defineReactive(data, key, data[key], this.tm);
				}
			});
		}
	}

	const defineReactive = (obj, key, val, tm, dep) => {
		dep =  dep || new Dep();
		Object.defineProperty(obj, key, {
			set(newValue) {
				if (val == newValue) return
				val = newValue;
				dep.notify();
			},
			get() {
				console.log('------', key, val);
				// Dep.target && dep.addSub(Dep.target)
				Dep.target && dep.depend();
				return val
			}
		});
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

	let uid$1 = 0;
	class Watcher{
		constructor(tm, exp, cb, opts) {
			opts = opts || {};
			this.id = ++uid$1;
			this.tm = tm;
			this.exp = exp;
			this.cb = cb;
			this.lazy = opts.lazy;
			this.deps = [];
			this.newDeps = [];
			this.depIds = [];
			this.newDepIds = [];
			if (this.lazy) {
				this.value = undefined;
			} else {
				this.value = this.get();
			}
		}
		get() {
			console.log('window1', window.targetStacks.length);
			console.log('deps1', this.deps.length, this.newDeps.length);
			pushTarget(this);
			console.warn('=-读取值中11-=', window.targetStacks.length, this.exp);
			console.log('deps12222222', this.deps.length, this.newDeps.length);
			let val;
			if (typeof this.exp === 'function') {
				val = this.exp.call(this.tm);
			} else {
				let arr = this.exp.split('.');
				val = this.tm;
				arr.map(item => {
					val = val[item];
				});
			}
			console.log('window2', window.targetStacks.length);
			console.log('deps3333', this.deps.length, this.newDeps.length);
			console.warn('=-读取值中22-=');
			popTarget();
			console.log('window3', window.targetStacks.length);
			console.log('deps144444', this.deps.length, this.newDeps.length);
			this.cleanupDeps();
			console.log('window4', window.targetStacks.length);
			console.log('deps55555', this.deps.length, this.newDeps.length);
			this.cb(val);
			return val
		}
		addDep (dep) {
			const id = dep.id;
			if (this.newDepIds.indexOf(id) == '-1') {
				this.newDepIds.push(id);
				this.newDeps.push(dep);
				if (this.depIds.indexOf(id) == '-1') {
					dep.addSub(this);
				}
			}
		}
		cleanupDeps () {
		    let i = this.deps.length;
		    while (i--) {
		      const dep = this.deps[i];
		      if (this.newDepIds.indexOf(dep.id) == '-1') {
		        dep.removeSub(this);
		      }
		    }
		    let tmp = this.depIds;
		    this.depIds = this.newDepIds;
		    this.newDepIds = tmp;
		    this.newDepIds = [];
		    tmp = this.deps;
		    this.deps = this.newDeps;
		    this.newDeps = tmp;
		    this.newDeps.length = 0;
		  }
		depend () {
		    let i = this.deps.length;
		    console.log('dep长度--=-====', this.deps);
		    while (i--) {
		      this.deps[i].depend();
		    }
		  }
		update() {
			let val;
			let oldValue;
			if (typeof this.exp === 'function') {
				oldValue = this.value;
				val = this.exp.call(this.tm);
			} else {
				let arr = this.exp.split('.');
				oldValue = this.value;
				val = this.tm;
				arr.map(item => {
					val = val[item];
				});
			}
			this.value = val;
			this.cb(val, oldValue);
		}
		evaluate() {
			// this.lazy = false
			console.log('before------>');
			this.value = this.get();
			console.log('before aftrer------>');
		}
	}

	const createWatch = (tm, watchs) => {
		Object.keys(watchs).map(key => {
			tm.$watch(key, watchs[key]);
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
					// let val = this.tm
					// let arr = RegExp.$1.split('.')
					// arr.map(item => {
					// 	val = val[item]
					// })
					// node.textContent = txt.replace(reg, val).trim()
					console.log('创建编译watcher');
					let watcher = new Watcher(this.tm, RegExp.$1, v => {
						node.textContent = txt.replace(reg, v).trim();
					});
					console.log('创建编译watcher ater', watcher.id);
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

	const noop = () => {};
	const initComputed = (tm, computeds) => {
		for (const key in computeds) {
			let watcher = new Watcher(
				tm,
				computeds[key],
				noop,
				{
					lazy: true
				}
			);
			Object.defineProperty(tm, key, {
				get() {
					console.log('======= YYYYY开始',watcher.deps.length, watcher.id, Dep.target && Dep.target.id);
					if (watcher.lazy) {
						watcher.evaluate();
					}
					console.log('%c ======= 要增加依赖', watcher.deps.length, Dep.target && Dep.target.id);
					// 在编译模板时，第一次只是单纯的获取值，没有Dep.target
					// 紧接着，创建一个模板与计算属性的wather, 由于创建watcher时，会默认调用get，所以Dep.target的值为此watcher
					if (Dep.target) {
						watcher.depend();
					}
					return watcher.value
				}
			});
			// Object.defineProperty(tm, key, () => {
			// 	return function computedGeeter() {
			// 		if (watcher.lazy) {
			// 			watcher.evaluate()
			// 		}
			// 		if (Dep.target) {
			// 			watcher.depend()
			// 		}
			// 		return watcher.value
			// 	}
			// })
		}
	};

	const initMixin = (Tue) => {
		Tue.prototype._init = function (options) {
			const tm = this;
			tm.$options = options;
			const data = tm.data = options.data || {};
			// tm.$watch = options.watch || {}
			// 初始化数据，拦截set与get操作
			observer(data, tm);
			proxy(tm, data);
			// 计算属性
			options.computed && initComputed(tm, options.computed);

			//监控属性
			createWatch(tm, options.watch);

			// 编译模板
			new Compile(options.el, tm);
		};
		Tue.prototype.$watch = function(exp, cb) {
			console.log('----watcher', exp, cb);
			new Watcher(this, exp, cb, true);
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
