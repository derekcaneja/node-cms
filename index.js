// Dependencies
var NodeCMS = require('./lib/nodeCMS');

// Config
var config = require('./config.json');

module.exports.initialize = function(callback) {
	var nodeCMS = new NodeCMS(config);

	callback(null, nodeCMS);
}