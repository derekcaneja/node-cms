var config = require('../../../config.json');

module.exports = function(Handlebars, app, getLayout) {
	var postPreview = null;

	getLayout('post_preview', app, function(err, templateFn) { postPreview = templateFn });

	return {
		post_preview: function() {				
			var html = postPreview(this);

			return html;
		},
		post_number: function(index) {
			return new Handlebars.SafeString(index + 1);
		},
		post_date: function(timestamp) {
			var days   = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

			var toReturn = days[timestamp.getDay()] + " " + months[timestamp.getMonth()] + " " + timestamp.getDay() + ", " + timestamp.getFullYear();

			return new Handlebars.SafeString(toReturn); 
		},
		generate_link: function(slug) {
			var toReturn = '#';

			if(slug) toReturn = config.urlSchema.replace(':slug', slug);

			return new Handlebars.SafeString(toReturn);
		},
		is_selected: function(a, b) {
			console.log(a, b)
			return new Handlebars.SafeString((a == b) ? 'selected' : '');
		},
		determine_syntax: function(key) {
			if(key.substring(0, 1) == '{') return new Handlebars.SafeString(key.substring(1) + ' (Accepts HTML)');
			
			return new Handlebars.SafeString(key);
		},
		to_lower_case: function(string) {
			return new Handlebars.SafeString(string.toLowerCase());
		}
	};
};
