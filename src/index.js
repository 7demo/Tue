import {initMixin} from './init.js'
import { observer } from './observe.js'
class Tue {
	constructor(options) {
		console.log(options, this)
		this.init(options)
	}
}
initMixin(Tue)
// Tue.prototype._init  = (options) => {
// 	console.log(1111, this)
// 	// 初始化数据，建立发布订阅模式
// 	const data = this.data = options.data || {}
// 	observer(data)
// }
export default Tue