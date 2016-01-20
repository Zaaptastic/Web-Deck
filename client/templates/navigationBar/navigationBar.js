
var navBoxWidth = function(){
 	return $('.nav-block').outerWidth(true);
};

var initMenu = function(n,resize=false){
	/*
		Initializes menu by properly positioning and sizing them, as well as re-centering
		if applicable (should not be done when resizing window)
	*/

	flag = false;
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
		animations do not occur. Re-enabled in the slideMenu function.
	*/
	flag = true; //switch flag so that we know an animation is taking place
	//Disable links while animating
	var links = document.getElementsByTagName('a');
	for (var i=0;i<links.length;i++){
		var current = $(links[i]);
	   	current.addClass('disabled');
	}
}

var recenter = function(n,resize=false){
	/*
		Adjusts menu to appropriate center button relative to current URL path
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
			flag = false;
			var links = document.getElementsByTagName('a');
		    for (var i=0;i<links.length;i++){
		    	var current = $(links[i]);
		    	current.removeClass('disabled');
		    }		

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
			          //Switches flag back to false so that the next click can be properly executed
			          flag = false;
			          //Re-enable clicking
  		    		  var links = document.getElementsByTagName('a');
		    		  for (var i=0;i<links.length;i++){
		    			var current = $(links[i]);
		    			current.removeClass('disabled');
		    		  }  

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
			          //Switches flag back to false so that the next click can be properly executed
			          flag = false;
			          //Re-enable clicking
		    		  var links = document.getElementsByTagName('a');
		    		  for (var i=0;i<links.length;i++){
		    			var current = $(links[i]);
		    			current.removeClass('disabled');
		    		  }
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

	$('nav').mouseenter(
		function(){
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
	);
};

var getNavIden = function(navObj){ //given a nav-block, determines the original index by using the
	//block's assigned Id. Note that this necessitates the use of nav-block Ids #b1, #b2, etc.
	var navId = navObj.attr('id');
	if (navId === undefined)
		return 0
	return parseInt(navId.split("b")[1]);
}


var getCurrIden = function(){ //gets assigned Id of the current page, used for recentering
	var currentElem = $('a[href="'+window.location.pathname+'"]');
	if (window.location.pathname === "/")
		return null;
	return getNavIden(currentElem);
}

centerCheck = function(currentPath) {
	//Compare the current URL to the active menu nav-block. If there is a mismatch, then
	//recentering needs to be performed
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
	  menuSize = 5;
	  $('.nav-block').addClass('gray-out');
	  $('#b1').removeClass('gray-out');	
	  Session.set("progress",[]);
	  initMenu(menuSize);
	  if (window.location.pathname === "/"){
		  hideMenu();
		  loadSequence();
	  }
	  watchClick();
	  watchHover();
	  $( window ).resize(function() {
	  	initMenu(menuSize,true);
	  });  
});


