import {Watcher} from './watcher.js'
import {Dep} from './dep.js'
// computed 理解逻辑，假设 sum是计算属性依赖msg
// 创建监听模板watcher sum
// sum watcher 默认调用get函数
// 把sum watcher 推入targetstact
// 读sum，走computed 拦截器
// 拦截器中sum computed watcher调用evalute计算
// 把sum computed watcher 推入推入targetstact
// 因为sum需要读取msg 所以在msg的拦截器中，把msg的dep 加入 sum computed watcher 的deps 中
// 此时存在存在Dep.target = msg watcher 所以把sum computed watcher的依赖（msg dep）执行遍历，把msg dep 加入的msg watcher的依赖中
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
				if (watcher.lazy) {
					watcher.evaluate()
				}
				// 在编译模板时，第一次只是单纯的获取值，没有Dep.target
				// 紧接着，创建一个模板与计算属性的wather, 由于创建watcher时，会默认调用get，所以Dep.target的值为此watcher
				if (Dep.target) {
					watcher.depend()
				}
				return watcher.value
			}
		})
	}
}