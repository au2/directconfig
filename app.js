/**
 * Key server generates and provides key files to the 
 */

var restify = require('restify');
var path = require('path');

var fileutil = require("./lib/fileutil");
var configserver = require("./lib/configserver");

var server = restify.createServer();

var keyDirectory = '/opt/direct/certificates';
var logDirectory = '/var/log/upstart/direct-config.log';

var options = {
		pyscriptsdir: path.join(__dirname, "pyscripts"),
		pycmd: "python"
};

server.put('/cert/:filename', function(req, res, next) {
	var dirpath = (process.argv.length > 2) ? process.argv[2] : keyDirectory;
	var filepath = path.join(dirpath, req.params.filename);
        fileutil.putFile.call(this, req, filepath, function(error) {
		configserver.putCert(options, filepath);
		res.send(200);
	});
});

server.del('/reset', function(req, res, next) {
	configserver.clearAll(options);
	res.send(200);
});

server.get('/cert/:filename', fileutil.getFile);

server.listen(3000);
