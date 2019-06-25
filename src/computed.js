export const initComputed = (tm) => {
	let computeds = tm.$options.computed
	Object.keys(computeds).map(computed => {
		Object.defineProperty(tm, computed, {
			get: computeds[computed],
			set() {}
		})
	})
}