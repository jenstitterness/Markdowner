var fs = require('fs'),
	$ = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	uuid = require('node-uuid'),
	md = require('markdown').markdown,
	currentlySelectedModel,
	mdCollection,
	list;

	Backbone.$ = $; // add jquery to backbone


var Model = Backbone.Model.extend({
	title: undefined,
	markdown: undefined,
	id: undefined,
	date: undefined
});

var Collection = Backbone.Collection.extend({
	model: Model
});


var ListItem = Backbone.View.extend({
	tagName: 'li',

	events: {
		'click' : 'modelClicked'
	},

	initialize: function() {
		var self = this;

		// setup event for title change so the title updates in the list
		this.listenTo(this.model, 'change:title', function() {
			self.render();
		})
	},

	render: function() {

		this.$el.html(this.model.get('title') );

		return this;
	},

	// save clicked model
	modelClicked: function(evt) {

		$('#mdTitle').val(this.model.get('title'));
		$('#mdEditor').val(this.model.get('markdown'));
		$('#outputPanel').html( md.toHTML( this.model.get('markdown') )  );

		currentlySelectedModel = this.model;


	}
});

var List = Backbone.View.extend({
	initialize: function() {

	},

	render: function() {
		var self = this;
		self.$el.empty();
		// console.log('List render this:', this);
		this.collection.each(function(model) {
			// console.log('List MODEL:', model);
			var item = new ListItem({model: model});
			item.render();
			self.$el.append(item.el);
			
		});
		// console.log('!!', $(this.el));
		// console.log('List render caleld', this.$el.html());
		return this;
	}
});



// build left list with saved md data
exports.init = function(data) {

	mdCollection = new Collection(data);

	if (mdCollection.length > 0) {
		currentlySelectedModel = mdCollection.at(0);
	}

	list = new List({el: $('#mdModel'), collection: mdCollection }).render();

};

// Function to change md text area, mark down viewer, and title
exports.changeElements = function(markdown, title) {
	$('#mdEditor').val(markdown);
	$('#mdTitle').val(title);
	$('#outputPanel').html( md.toHTML( markdown)  );
};

// update model's markdown
exports.changeMD = function(data) {
	if (currentlySelectedModel) {
		currentlySelectedModel.set('markdown', data);
		$('#outputPanel').html(md.toHTML(currentlySelectedModel.get('markdown')));
	}
};

// update models title
exports.changeTitle = function(data) {
	if (currentlySelectedModel) {
		currentlySelectedModel.set('title', data);
	}
};

// build a new model 
exports.newMDModel = function() {
	var newMD = new Model({
		title: 'new markdowner',
		markdown: '',
		date: Date.now(), // created date
		id: uuid.v4() // build id
	});

	// setup ui
	this.changeElements(newMD.get('markdown'), 
						newMD.get('title'));

	// add model to collection
	mdCollection.add(newMD);

	// save currently display model
	currentlySelectedModel = newMD;

	// render the list ui again.
	list.render();
};

// save collection to file
// todo: add support for save locations
exports.save = function() {

	fs.writeFile('markdown.json', JSON.stringify(mdCollection.toJSON()), function() {
		// add error handling here.
	});
};