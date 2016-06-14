/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Model
	// ----------

	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	app.Todo = Backbone.Model.extend({
		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			title: '',
			completed: false,
			priority:0,
			deleted:false
		},
     togglePriority:function(val){
			 this.save({
 				priority: $.parseJSON(val)
 			});
		 },
		// Toggle the `completed` state of this todo item.
		toggle: function () {
			this.save({
				completed: !this.get('completed')
			});
		},
		toggleDelete: function () {
			this.save({
				deleted: !this.get('deleted')
			});
		}
	});
})();
