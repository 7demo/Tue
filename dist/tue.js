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
			pushTarget(this);
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
			popTarget();
			this.cleanupDeps();
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
			this.value = this.get();
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
					let watcher = new Watcher(this.tm, RegExp.$1, v => {
						node.textContent = txt.replace(reg, v).trim();
					});
				}
				if (node.nodeType === 1) {
					let attrs = node.attributes;
					Array.from(attrs).map(attr => {
						let name = attr.name;
						let exp = attr.value;
						if (name.includes('v-')) {
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

	// computed 理解逻辑，假设 sum是计算属性依赖msg
	// 创建监听模板watcher sum
	// sum watcher 默认调用get函数
	// 把sum watcher 推入targetstact
	// 读sum，走computed 拦截器
	// 拦截器中sum computed watcher调用evalute计算
	// 把sum computed watcher 推入推入targetstact
	// 因为sum需要读取msg 所以在msg的拦截器中，把msg的dep 加入 sum computed watcher 的deps 中
	// 此时存在存在Dep.target = msg watcher 所以把sum computed watcher的依赖（msg dep）执行遍历，把msg dep 加入的msg watcher的依赖中
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
					if (watcher.lazy) {
						watcher.evaluate();
					}
					// 在编译模板时，第一次只是单纯的获取值，没有Dep.target
					// 紧接着，创建一个模板与计算属性的wather, 由于创建watcher时，会默认调用get，所以Dep.target的值为此watcher
					if (Dep.target) {
						watcher.depend();
					}
					return watcher.value
				}
			});
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
