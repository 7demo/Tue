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

const targetStacks = []

export pushTarget = (target) => {
	Dep.target = target
	targetStacks.push(target)
}

export popTarget = () => {
	targetStacks.pop()
	Dep.target = targetStacks[targetStacks.length - 1]
}