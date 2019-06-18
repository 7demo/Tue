import {init} from './init.js'
class Tue {
	constructor(options) {
		console.log(options)
		this._init(options)
	}
}
init(Tue)

Tue.prototype.$mount = (el) => {
	
}

export default Tue