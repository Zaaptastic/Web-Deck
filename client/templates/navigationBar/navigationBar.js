
navBoxWidth = function(){
 	return $('.nav-block').outerWidth(true);
};

initMenu = function(n,resize=false){
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

	$('.nav-block').addClass('gray-out');
	$('#b1').removeClass('gray-out');


	if (!resize) //Avoid recentering when calling initMenu due to window resize
		recenter(n);
	
};

recenter = function(n){
	/*
		Adjusts menu to appropriate center button relative to current URL path
	*/
		var currentURL = window.location.pathname;
		var currentElem = $('a[href="'+currentURL+'"]');
		console.log(currentURL);
		if (currentURL !== '/'){ //handles centering menu when refreshing a routed page
			pageValue = currentURL.split("/")[1];


			//Ensure visited menu makes sense for refresh (previously pages are
			//avaliable to click)
			var visited = [];
			for (var i = 0; i <= pageValue; i++){
				var toAdd = i+1
				visited.push(toAdd);
				$('#b'+toAdd).removeClass('gray-out');
			}
			Session.set("progress",visited);

			//Now do the sliding
			flag = true; //switch flag so that we know an animation is taking place
			//Disable links while animating
			console.log('recentering');
			var links = document.getElementsByTagName('a');
			for (var i=0;i<links.length;i++){
			var current = $(links[i]);
			   	current.addClass('disabled');
			}
			$('.active').removeClass('active');
			$('#b'+pageValue).addClass('active'); //since there is no active hard-coded
			//sets active to current URL so that this recentering is a valid function
			var distance = pageValue - Math.ceil(n/2);
			console.log('index is '+distance);
			$('.nav-block.active').removeClass('active');
			$(currentElem).addClass('active');
			slideMenu(distance,true); //make sliding instant



		}else{ //handles centered menu on Page 1 at splash page
			var first = $('#b1');
			var distance = 1-Math.ceil(n/2);
			console.log("index=" + distance);
			flag = true; //switch flag so that we know an animation is taking place
			//Disable links while animating
			var links = document.getElementsByTagName('a');
			for (var i=0;i<links.length;i++){
			var current = $(links[i]);
			   	current.addClass('disabled');
			}
			$(first).addClass('active');
			slideMenu(distance,true);
			$(first).removeClass('active'); //remove active tag so that there is no user 
			//confusion on what the cover page is vs. the first chapter page
			splashMain();
		}
	
}

slideMenu = function(index, instant = false){
	/*
		Slides menu by a certain number of index positions, with the option of doing so
		over a duration (default 600) or instantly, which is useful in initMenu to create
		the illusion that the menu was loaded centered on the appropriate page
	*/
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
			console.log("Sliding finished with flag as " + flag);			

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
			          console.log("Sliding finished with flag as " + flag);

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
			          console.log("Sliding finished with flag as " + flag);
			        }
		     	});
		}
};

countPositions = function(elem) {//finds and returns the distance between the active item and the clicked item
 		var value = $(elem).index() - $('.nav-block.active').index();
 		if ($('.nav-block').hasClass('active') === false) //if there is no active class,
 			//then there should be no sliding done, so we hard set value to 0
 			value = 0;
 		return value;
};


watchClick = function() {//watches clicks on the nav-blocks elements
  		$(document).on('click', '.nav-block', function(){
	    	if (!flag){ //if there is no ongoing animation and thus sliding is valid
	    		//Adds next page to array of already visited pages, unlocks next page 
				var pageValueString = this.pathname.split("/")[1];
				if (pageValueString === "")
					pageValueString = 0;
				var pageValue = parseInt(pageValueString);
				$('#b'+(pageValue+1)).removeClass('gray-out');
				$('#b'+(pageValue+1)).css("opacity","1");
				visited = Session.get("progress");
				if (visited.indexOf(pageValue) === -1){
					console.log("adding "+pageValue+" to visited");
					visited.push(pageValue);
				}
				Session.set("progress",visited);

				//Now perform the actual sliding
	    		flag = true; //switch flag so that we know an animation is taking place
	    		//Disable links while animating
	    		var links = document.getElementsByTagName('a');
	    		for (var i=0;i<links.length;i++){
	    			var current = $(links[i]);
	    			current.addClass('disabled');
	    		}
	    		var distance = countPositions(this);
	     		console.log('index is '+distance);
	     		$('.nav-block.active').removeClass('active');
	     		$(this).addClass('active');
	     		slideMenu(distance);
	   		}else{
	      		console.log("Attempted to slide before animation completed");
	   		}
	    	//new active item
  		});

};

watchHover = function() {//watches hover on menu to expand/contract

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

Template.navigationBar.onRendered(function () {
	  Session.set("progress",[]);
	  initMenu(5);
	  watchClick();
	  watchHover();
	  $( window ).resize(function() {
	  initMenu(5,true);
	  });  
});


