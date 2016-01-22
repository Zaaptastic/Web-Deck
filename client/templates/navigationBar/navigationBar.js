
var navBoxWidth = function(){
 	return $('.nav-block').outerWidth(true);
};

var initMenu = function(n,resize=false){
	/*
		Initializes menu by properly positioning and sizing them, as well as re-centering
		if applicable (should not be done when resizing window)
	*/

	flag = false; //flag is a global variable used to keep track of whether an animation
	//is currently ongoing, so that overlapping animations do not occur

	//Set the width and left CSS properties for each nav-block (menu button), based on 
	//how many menu buttons exist
	var width = 100/n; 
	i = 0;
	$('.nav-block').each(function(){
		$(this).css({'left':width*i+'%','width':width+'%'});
		i++;
	});

	if (!resize) { //Avoid recentering or altering what is grayed out
		//when calling initMenu due to window resize	
		recenter(n,true);
	}
	
};

var disable = function(){
	/*
		Disables navbar functions when an animation begins so that overlapping
		animations do not occur. Re-enabled in the slideMenu function with a call to
		enable().
	*/
	flag = true; //switch flag so that we know an animation is taking place
	//Disable links while animating
	var links = document.getElementsByTagName('a');
	for (var i=0;i<links.length;i++){
		var current = $(links[i]);
	   	current.addClass('disabled');
	}
}

var enable = function(){
	/*
		Enables navbar functions when an animation completes. Meant to be called after
		disable(), once necessary work is finished, to undo the flagging done in that
		function.
	*/

	//Switches flag back to false so that the next click can be properly executed
	flag = false;
	//Re-enable clicking
  	var links = document.getElementsByTagName('a');
	for (var i=0;i<links.length;i++){
		var current = $(links[i]);
		current.removeClass('disabled');
	} 
}

var recenter = function(n,resize=false){
	/*
		Adjusts menu to appropriate center button relative to current URL path. Note
		the difference in behavior when called on the splashPage vs chapter pages.
		Typically only called when refreshing a page to move the navbar to the appropriate
		position
	*/

		var currentIden = getCurrIden();
		if (currentIden !== null){ //handles centering menu when refreshing a routed page

			//Ensure visited menu makes sense for refresh (previously pages are
			//avaliable to click), but do not call when resizing
			var visited = [];
			for (var i = 0; i <= currentIden; i++){
				var toAdd = i+1
				visited.push(toAdd);
				$('#b'+toAdd).removeClass('gray-out');
			}
			Session.set("progress",visited);

			//Now do the sliding
			disable();
			$('.active').removeClass('active');
			$('#b'+currentIden).addClass('active'); //since there is no active hard-coded
			//sets active to current URL so that this recentering is a valid function
			var distance = currentIden - Math.ceil(n/2); //move into the center
			slideMenu(distance,true); //make sliding instant

		}else{ //handles centering at splash page
			var first = $('#b1');
			var distance = 1-Math.ceil(n/2);
			disable();
			$(first).addClass('active');
			slideMenu(distance,true);
			$(first).removeClass('active'); //remove active tag so that there is no user 
			//confusion on what the cover page is vs. the first chapter page
			//splashMain();
		}
	
}

var slideMenu = function(index, instant = false){
	/*
		Slides menu by a certain number of index positions, with the option of doing so
		over a duration (default 600) or instantly, which is useful in initMenu to create
		the illusion that the menu was loaded centered on the appropriate page
	*/
		//allows the option for sliding to take place instantaneously (default off)
		var durationTime = 600;
		if (instant)
			durationTime = 0;
		var width = navBoxWidth();

		if (index === 0){
			//Catches case in which the menu should not slide
			//Must still set flag to false to allow further sliding and re-enable links
			enable();	

		}else if (index<0) { //if clicked on the left side of the screen
			Session.set("direction","leftToRight"); //set Session var for page transition
	    	var currentBox = $('.nav-block:visible:last');
	    	for (count = Math.abs(index);count > 0; count -= 1){
		      //clone the last nav-block and insert it before the first
		      var cloned = currentBox.clone().prependTo('.nav');
		      var nextLeft = $(cloned).next().css("left"); //calculate the left property of the next box
		      var clonedLeft = parseFloat(nextLeft,10) - navBoxWidth(); //calculate the left property of the cloned box
		      $(cloned).css({"left":clonedLeft}); //apply the css left
		      currentBox = currentBox.prev();
		    }
		    //slide the number of positions of the index
		    $('.nav-block').velocity(
		     	{
		        	left:'+='+width*Math.abs(index)
		     	},
		     	{
			        delay: 0,
			        duration:durationTime,
			        easing:"easeInQuad",
			        complete: function() {
			          for (count = 0; count < Math.abs(index); count += 1){
			            $('.nav-block:visible:last').remove();
			          }			           
			          enable();
		        	}
		     	});
	    }else if (index>0) {
	    	//For sliding in the opposite direction
	    	Session.set("direction","rightToLeft");
	    	var currentBox = $('.nav-block:visible:first');
	    	for (count = Math.abs(index); count > 0; count -= 1){
		     	//clone the first nav-block and insert it after the last
		    	var cloned = currentBox.clone().appendTo('.nav');
		     	var prevLeft = $(cloned).prev().css("left"); //calculate the left property of the previous box
		     	var clonedLeft = parseFloat(prevLeft,10) + navBoxWidth(); //calculate the left property of the cloned box
		     	$(cloned).css({"left":clonedLeft}); //apply the css left
		     	currentBox = currentBox.next();
	    	} 
		    $('.nav-block').velocity(
		     	{
		        	left:'-='+width*Math.abs(index)
		     	},
		     	{
			        delay:0,
			        duration:durationTime,
			        easing:"easeInQuad", 
			        complete: function() { //move the copied div before animation
			          for (count = 0; count < Math.abs(index); count += 1){
			            $('.nav-block:visible:first').remove();
			          }
			          enable();
			        }
		     	});
		}
};

var countPositions = function(elem) {//finds and returns the distance between the active item and the clicked item
 		var value = $(elem).index() - $('.nav-block.active').index();
 		if ($('.nav-block').hasClass('active') === false) //if there is no active class,
 			//then there should be no sliding done, so we hard set value to 0
 			value = 0;
 		return value;
};


var watchClick = function() {//watches clicks on the nav-blocks elements
  		$(document).on('click', '.nav-block', function(){
	     	
	    	if (!flag){ //if there is no ongoing animation and thus sliding is valid

	    		//Adds next page to array of already visited pages, unlocks next page 
				var pageValue = getNavIden($(this));
				$('#b'+(pageValue+1)).removeClass('gray-out');
				$('#b'+(pageValue+1)).css("opacity","1");
				visited = Session.get("progress");
				if (visited.indexOf(pageValue) === -1){
					visited.push(pageValue);
				}
				Session.set("progress",visited);

				//Now perform the actual sliding
	    		disable();
	    		var distance = countPositions(this);
	     		$('.nav-block.active').removeClass('active');
	     		$(this).addClass('active');
	     		slideMenu(distance);
	   		}else{
	      		console.log("Attempted to slide before animation completed");
	   		}
	    	//new active item
  		});

};

var watchHover = function() {//watches hover on menu to expand/contract
	if (!touchscreen){
		$('nav').mouseenter(
			function(){
				$('nav').velocity("stop", true); //stop current navbar animations to prevent
				//jumping behavior
				$('nav').velocity(
					{
				       	height: "200px",
				    },
				    {
					    delay:0,
					    duration:200,
				        easing:"easeInQuad", 
				        complete: function() { 
							$('.nav-block h2').css({
								opacity:1,
							});
				        }
			     	}
				);
			}).mouseleave( 
			function(){
				if (getCurrIden() !== null){ //Do not allow collapsing on the splashPage
					$('nav').velocity("stop", true); //stop current navbar animations to prevent
					//jumping behavior
					$('nav').velocity(
						{
				        	height: "50px",
				     	},
				     	{
					        delay:0,
					        duration:200,
					        easing:"easeOutQuad", 
					        complete: function() { 	        	
								$('.nav-block h2').css({
									opacity:0,
								});
					        }
				     	}
					);
				}
			}
		);
	}
};

var getNavIden = function(navObj){ 
	/*
		Given a nav-block, determines the original index by using theblock's assigned Id. 
		Note that this necessitates the use of nav-block Ids #b1, #b2, etc.
	*/
	var navId = navObj.attr('id');
	if (navId === undefined)
		return 0
	return parseInt(navId.split("b")[1]);
}


var getCurrIden = function(){ 
	/*
		Gets assigned Id of the current page, used for recentering with centerCheck().
		Returns null if not found.
	*/
	var currentElem = $('a[href="'+window.location.pathname+'"]');
	if (window.location.pathname === "/")
		return null;
	return getNavIden(currentElem);
}

centerCheck = function(currentPath) {
	/*
		Compare the current URL to the active menu nav-block. If there is a mismatch, then
		recentering needs to be performed
	*/
	var currentIden = $('a[href="'+currentPath+'"]');
	currentIden = getNavIden(currentIden);
	var activeIden = getNavIden($('.active'));

	if(currentIden===0){ //restore state of the cover page, centering on page 1
		$('.active').removeClass('active');
	}else if (currentIden !== activeIden){ //if there is a mismatch and not to the cover page
		//Now do the sliding
		disable();
		var distance = countPositions($('#b'+currentIden));
		$('.active').removeClass('active');
		$('#b'+currentIden).addClass('active');
		slideMenu(distance,true); //make sliding instant
	}
}

Template.navigationBar.onRendered(function () {
	/*
		Performs the main initializations for the navbar and also partly for splashPage.
		splashPage initializations for animations are done here so that they do not repeat
		when splashPage is returned to via the back browser function.
	*/
	touchscreen = false; //To customize features if the user has a touchscreen
	menuSize = 5; //Only place where the number of menu buttons must be hard-coded in
	//the rest of the code will scale with this varaible

	//Adds appropriate .gray-out classes to nav-blocks, then removes it from the first 
	//menu button (which should always be clickable)
	$('.nav-block').addClass('gray-out');
	$('#b1').removeClass('gray-out');	
	Session.set("progress",[]); //initializes the Session variable that keeps track of 
	//which pages the user has visited so far in this session
	initMenu(menuSize); //calls on the initMenu function to give the buttons appropriate
	//sizes and positions

	//Establishes custom styling and functions for mobile sites
	if ('ontouchstart' in window || /mobile/i.test(navigator.userAgent)) {
		//On touchscreens, since there is no hover functionality, make the menu a set size
		//and always show the titles
		$('nav').addClass('nav-restrict');
		$('.landscape-prompt').addClass('landscape-restrict');
		$('.vcenter h2').css("opacity","1");
		touchscreen = true;
	}

	if (window.location.pathname === "/"){
		//activates the loading sequence if the current page is the splashPage
		//delays loading if on mobile portrait orientation 
		if (!touchscreen || (window.matchMedia("(orientation: landscape)").matches)){
			hideMenu();
			loadSequence();
		}else{
			//Sets Session variables to support initiating animation upon switching to
			//landscape
			Session.set("wasP",true);
			Session.set("animated",false);
		}
	}

	//activates nav button functions
	watchClick();
	watchHover();


	$(window).resize(function() {
		//Allows the menu to be resized with the window, making sure that no movement of the 
		//menu occurs by passing boolean true to the initMenu function
	  	initMenu(menuSize,true);
	  	//If applicable, performs the opening animation
	  	if (Session.get("wasP") && !Session.get("animated")){
	  		hideMenu();
	  		loadSequence();
	  		Session.set("animated",true); //Makes sure starting the opening animation in
	  		//this way only occurs once
	  	}
	});  
});


