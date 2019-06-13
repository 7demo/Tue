(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.Tue = factory());
}(this, function () { 'use strict';

	const init = (Tue) => {
		Tue.prototype._init  = (options) => {
		};
	};

	class Tue {
		constructor(options) {
			console.log(options);
			this._init(options);
		}
	}
	init(Tue);

	return Tue;

}));
