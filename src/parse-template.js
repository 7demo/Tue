const compile = require('lodash.template')

const compileOptions = {
	escape: /{{([^{][\s\S]+?[^}])}}/g
}

export const parseTemplate = (template) => {
	return compile(template, compileOptions.escape)
}