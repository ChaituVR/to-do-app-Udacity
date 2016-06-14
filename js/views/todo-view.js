/*global Backbone, jQuery, _, ENTER_KEY, ESC_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// Todo Item View
	// --------------

	// The DOM element for a todo item...
	app.TodoView = Backbone.View.extend({
		//... is a list tag.
		tagName:  'li',

		// Cache the template function for a single item.
		template: _.template($('#item-template').html()),

		// The DOM events specific to an item.
		events: {
			'click .toggle': 'toggleCompleted',
			'dblclick label': 'edit',
			'click .destroy': 'sendTodelete',
			'keypress .edit': 'updateOnEnter',
			'keydown .edit': 'revertOnEscape',
			'blur .edit': 'close',
			'dblclick .edit-btn':'edit',
			'change .priority-btn': 'togglePriority'
		},

		// The TodoView listens for changes to its model, re-rendering. Since
		// there's a one-to-one correspondence between a **Todo** and a
		// **TodoView** in this app, we set a direct reference on the model for
		// convenience.
		initialize: function () {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
			this.listenTo(this.model, 'visible', this.toggleVisible);
		},

		// Re-render the titles of the todo item.
		render: function () {
			// Backbone LocalStorage is adding `id` attribute instantly after
			// creating a model.  This causes our TodoView to render twice. Once
			// after creating a model and once on `id` change.  We want to
			// filter out the second redundant render, which is caused by this
			// `id` change.  It's known Backbone LocalStorage bug, therefore
			// we've to create a workaround.
			// https://github.com/tastejs/todomvc/issues/469
			if (this.model.changed.id !== undefined) {
				return;
			}

			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toggleClass('completed', this.model.get('completed'));
			this.$el.toggleClass('priority', this.isPrior());
			this.toggleVisible();
			this.$input = this.$('.edit');
			this.$prio= this.$('.priority-btn');
     this.$prio.val(this.model.get('priority'))
			return this;
		},

		toggleVisible: function () {
			this.$el.toggleClass('hidden', this.isHidden());
		},
    isPrior:function(){
        //console.log(this.model.get('priority'))
				var pri=this.model.get('priority');
				if(pri>0){
					return true;
				}
				else{

					return false;
				}
				//return this.model.get('priority')


		},
		isHidden: function () {
			$('#toggle-all').show();
			var filter = app.TodoFilter;
			if(filter==''){
				return this.model.get('deleted');
			}
			if(filter === 'active') {
				return this.model.get('completed') || this.model.get('deleted');
			}
			if(filter === 'priority') {
				return this.model.get('completed') || !this.model.get('priority') ||  this.model.get('deleted')
			}
			if(filter === 'completed') {
				return !this.model.get('completed') || this.model.get('deleted');
			}
			if(filter === 'deleted') {
				$('#toggle-all').hide();
				return !this.model.get('deleted');
			}
			return false;
			// return this.model.get('completed') ?
			// 	app.TodoFilter === 'active' :
			// 	app.TodoFilter === 'completed';
		},

		// Toggle the `"completed"` state of the model.
		toggleCompleted: function () {
			this.model.toggle();
		},

		// Switch this view into `"editing"` mode, displaying the input field.
		edit: function () {
			this.$el.addClass('editing');
			this.$input.focus();
		},
    togglePriority: function(){

        this.model.togglePriority(this.$prio.val());

			//this.$el.toggleClass('priority');
		},
		// Close the `"editing"` mode, saving changes to the todo.
		close: function () {
			var value = this.$input.val();
			var trimmedValue = value.trim();

			// We don't want to handle blur events from an item that is no
			// longer being edited. Relying on the CSS class here has the
			// benefit of us not having to maintain state in the DOM and the
			// JavaScript logic.
			if (!this.$el.hasClass('editing')) {
				return;
			}

			if (trimmedValue) {
				this.model.save({ title: trimmedValue });

				if (value !== trimmedValue) {
					// Model values changes consisting of whitespaces only are
					// not causing change to be triggered Therefore we've to
					// compare untrimmed version with a trimmed one to check
					// whether anything changed
					// And if yes, we've to trigger change event ourselves
					this.model.trigger('change');
				}
			} else {
				this.sendTodelete();
			}

			this.$el.removeClass('editing');
		},

		// If you hit `enter`, we're through editing the item.
		updateOnEnter: function (e) {
			if (e.which === ENTER_KEY) {
				this.close();
			}
		},

		// If you're pressing `escape` we revert your change by simply leaving
		// the `editing` state.
		revertOnEscape: function (e) {
			if (e.which === ESC_KEY) {
				this.$el.removeClass('editing');
				// Also reset the hidden input back to the original value.
				this.$input.val(this.model.get('title'));
			}
		},

		// Remove the item, destroy the model from *localStorage* and delete its view.
		sendTodelete:function(){
			this.model.toggleDelete();
		},
		clear: function () {

			this.model.destroy();
		}
	});
})(jQuery);
