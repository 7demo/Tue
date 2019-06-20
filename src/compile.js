/**
 * 编译模板
 */
import {Watcher} from './watcher.js'
export class Compile {
	constructor(el, tm) {
		this.tm = tm
		tm.$el = document.querySelector(el)
		let fragment = document.createDocumentFragment()
		let child = null
		while (child = tm.$el.firstChild) {
			fragment.appendChild(child)
		}
		let frag = this.replace(fragment)
		tm.$el.appendChild(frag)
	}
	replace(frag) {
		Array.from(frag.childNodes).map(node => {
			let txt = node.textContent
			let reg = /\{\{(.*?)\}\}/g
			if (node.nodeType === 3 && reg.test(txt)) {
				let val = this.tm
				let arr = RegExp.$1.split('.')
				arr.map(item => {
					val = val[item]
				})
				node.textContent = txt.replace(reg, val).trim()
				new Watcher(this.tm, RegExp.$1, v => {
					node.textContent = txt.replace(reg, v).trim()
				})
			}
			if (node.childNodes && node.childNodes.length) {
				this.replace(node)
			}
		})
		return frag
	}
}
