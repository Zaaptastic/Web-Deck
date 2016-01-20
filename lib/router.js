Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
});

Router.route('/',{name: 'splashPage'});
Router.route("/adam",{name: 'testpage1'});
Router.route("/eve",{name: 'testpage2'});
Router.route("/cain",{name: 'testpage3'});
Router.route("/abel",{name: 'testpage4'});
Router.route("/seth",{name: 'testpage5'});

Router.onAfterAction(function(){
	if (this.ready()){
		var currentPath = Iron.Location.get().path;
		centerCheck(currentPath);
		window.scrollTo(0,0); //Make sure we are at the top of the next page
	}
})

