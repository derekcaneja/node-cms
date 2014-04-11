var _ 	 = require('underscore')
  , path = require('path');

var config = require('../../config.json');

var cachedLayouts = {};

module.exports = LayoutController;

function LayoutController() {	
	this.templateAdapter = require('./templateAdapter');

	this.render = this.render.bind(this);
}

LayoutController.prototype.render = function(layout, data, callback) {
	if(!this.templateAdapter.app) {
		this.templateAdapter.app = this.app;
		this.templateAdapter.registerHelpers();
	}
	
	var _this = this;

	data = data || {};

	data.config = config;

	this.getLayoutHtml(layout, data, function(err, body) {
		var context = {
			config : config,
			body   : body
		};

		context.user = data.user;

		_this.getLayoutHtml((data.layout) ? data.layout : '__layout', context, function(err, html) {
			if (err) return callback(err);

	    	callback(null, html);
		});
	});

}

LayoutController.prototype.getLayoutHtml = function(layout, data, callback) {
	var cachedLayout = cachedLayouts[layout];

	if(cachedLayout) {
		var html = cachedLayout(data);

		return callback(null, html);
	}

	this.templateAdapter.getLayout(layout, this.app, function(err, template) {
		if(err) return callback(err);

		cachedLayouts[layout] = template;
		
		var html = template(data);

		callback(null, html)
	});
};