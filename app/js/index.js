var fs = require('fs'),
	md = require('markdown').markdown,
	$ = require('jquery'),
	_ = require('underscore'),
	uuid = require('node-uuid'),
	MDController = require('../js/MDController'),
	menu = require('../js/menu').controller(MDController);


// Setup save file on load
fs.readFile('markdown.json', 'utf-8', function(error, content) {
	// load file.
	var setup = function(data) {
		// parse json file
		var parsedData = JSON.parse(data);

		// send data to the controller to setup the Backbone controller
		MDController.init(parsedData);

		// setup the ui elements to display the first item.
		// change to load first model later.
		MDController.changeElements(parsedData[0].markdown, 
									parsedData[0].title
									);
	};

	if (error) { // no file, create it.
		fs.writeFile('markdown.json', '[{"title": "example", "markdown": "# Welcome to Markdowner!", "id": "'+ uuid.v4() +'", "date": '+ Date.now()+'}]', function() {
			fs.readFile('markdown.json', 'utf-8', function(error, content) {
				setup(content);
			});
			
		});
	} else {
		setup(content);
	}
});



/*
* Events
*/

// event to convert md to html
$('#mdEditor').on('keyup', function(evt) {

	MDController.changeMD(evt.target.value)
});

// change title
$('#mdTitle').on('keyup', function(evt) {

	MDController.changeTitle(evt.target.value)
});

// make new model
$('#newMDButton').on('click', function(evt) {

	// clear elemnts and create new model
	MDController.newMDModel();

});


