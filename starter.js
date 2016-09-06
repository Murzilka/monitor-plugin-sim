'use strict';

const process = require('process')
	, inspect = require('util').inspect
	;

process.on('message', function(api) {
	if (api && api.Name) {
		global.KodeksApi = api;
		let pluginExports = null;
		try {
			pluginExports = require(api.Path);
			if (!pluginExports) throw new Error('empty exports');
		} catch (err) {
			console.error(`error: ${inspect(err)}`);
			process.send({ error: err });
		}
	}
});