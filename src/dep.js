export class Dep {
	constructor() {
		this.subs = []
	}
	addSub(sub) {
		this.subs.push(sub)
	}
	notify() {
		this.subs.map(sub => sub.update())
	}
}

Dep.target = null