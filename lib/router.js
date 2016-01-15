Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
});

Router.route('/',{name: 'splashPage'});
Router.route('/1',{name: 'testpage1'});
Router.route('/2',{name: 'testpage2'});
Router.route('/3',{name: 'testpage3'});
Router.route('/4',{name: 'testpage4'});
Router.route('/5',{name: 'testpage5'});

Router.onBeforeAction(function(){
	//initMenu(5);
	this.next();
});
