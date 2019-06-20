export class Dep {
	constructor() {
		this.subs = []
	}
	addSub(sub) {
		console.log(32323, sub)
		this.subs.push(sub)
	}
	notify() {
		this.subs.map(sub => sub.update())
	}
}

Dep.target = null