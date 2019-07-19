import {Watcher} from './watcher.js'
import {Dep} from './dep.js'

const noop = () => {}
export const initComputed = (tm, computeds) => {
	for (const key in computeds) {
		let watcher = new Watcher(
			tm,
			computeds[key],
			noop,
			{
				lazy: true
			}
		)
		Object.defineProperty(tm, key, {
			get() {
				console.log('======= YYYYY开始',watcher.deps.length, watcher.id, Dep.target && Dep.target.id)
				if (watcher.lazy) {
					watcher.evaluate()
				}
				console.log('%c ======= 要增加依赖', watcher.deps.length, Dep.target && Dep.target.id)
				// 在编译模板时，第一次只是单纯的获取值，没有Dep.target
				// 紧接着，创建一个模板与计算属性的wather, 由于创建watcher时，会默认调用get，所以Dep.target的值为此watcher
				if (Dep.target) {
					watcher.depend()
				}
				return watcher.value
			}
		})
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
}