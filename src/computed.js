import {Watcher} from './watcher.js'

const noop = () => {}
export const initComputed = (tm, computed) => {
	const watchers = Object.create(null)
	for (const key in computeds) {
		watchers[key] = new Watcher({
			tm,
			computeds[key],
			noop,
			{
				lazy: true
			}
		})
	}
}