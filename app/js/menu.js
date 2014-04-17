var gui = window.require('nw.gui'),
	menu = new gui.Menu({type: 'menubar'}),
	controller;


// build file menu 
menu.append(new gui.MenuItem({
    label: 'File',
    submenu: new gui.Menu()
}));


menu.items[0].submenu.append(new gui.MenuItem({
    label: 'Save',
    click: function () { // setup save event
        if (controller) {
        	controller.save();
        }
    }
}));

gui.Window.get().menu = menu;


// save access to controller so we can save
exports.controller  = function(ctrl) {
	controller = ctrl;
};