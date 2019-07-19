let uid = 0
export class Dep {
	constructor() {
		this.id = ++uid
		this.subs = []
	}
	// watcher 监视器纳入订阅
	addSub(sub) {
		this.subs.push(sub)
	}
	// 加入依赖
	depend() {
		if (Dep.target) {
			Dep.target.addDep(this)
		}
	}
	notify() {
		this.subs.map(sub => sub.update())
	}
}

Dep.target = null

const targetStacks = []

export const pushTarget = (target) => {
	Dep.target = target
	targetStacks.push(target)
}

export const popTarget = () => {
	targetStacks.pop()
	Dep.target = targetStacks[targetStacks.length - 1]
}
window.targetStacks = targetStacks