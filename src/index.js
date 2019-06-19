import {initMixin} from './init.js'
import { observer } from './observe.js'
class Tue {
	constructor(options) {
		console.log(options, this)
		this._init(options)
	}
}

initMixin(Tue)

export default Tue