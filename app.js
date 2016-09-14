'use strict';

const inspect = require('util').inspect
	, http = require('http')
	, url = require('url')
	, cp = require('child_process')
	, fs = require('fs')
	;

const kSocketPath = (('win32' == process.platform)
	? '\\\\.\\pipe\\k' : '/tmp/kodeks-server-6') + '-test-plugin-on node'
	, kHostName = 'localhost'
	, kPort = 8087
	, kArmPath = `${__dirname}/arm`
	;

const child = cp.fork(`${__dirname}/starter.js`)
.on('message', (m) => {
	console.log('	PARENT: got message:', m);
})
.on('close', (code) => {
  console.log(`	PARENT: child process exited with code ${code}`);
});

const server = http.createServer((req, res) => {
	if (!req.isPaused()) req.pause();
	
	const reqId = `	PARENT: ${req.method} ${req.url} on ${new Date().toLocaleTimeString()}` 
	console.log(reqId);

	const uriObj = url.parse(req.url);
	const rpath = uriObj.pathname + (uriObj.search ? uriObj.search : '');
	const options = {
		path: rpath
		, auth: req.auth
		, headers: req.headers
		, method: req.method
		, socketPath: kSocketPath
	};

	const reqToPipe = http.request(options, function (resFromPipe) {
		console.log(`${reqId}: piped responce status is ${resFromPipe.statusCode}`);
		res.writeHead(resFromPipe.statusCode, resFromPipe.headers);
		resFromPipe.pipe(res);
	}).on('error', function (errFromPipe) {
		console.log(`${reqId}: error on request: ${inspect(errFromPipe)}`);
		res.end();
	});
	req.pipe(reqToPipe);
	if (req.isPaused()) req.resume();
}).on('error', (err) => {
	console.error(`	PARENT: error: ${inspect(err)}`);
});

server.listen(kPort, function () {
	child.send({
		Name: 'testArm'
		, Path: kArmPath
		, StoragePath: `${__dirname}`
		, LogsPath: `${__dirname}`
		, SocketPath: kSocketPath
		, Info: {}
		, Port: kPort
		, Hostname: kHostName
		, Protocol: 'http:'
		, Host: `${kHostName}:${kPort}`
	});
});
