
var navBoxWidth = function(){
 	return $('.nav-block').outerWidth(true);
};

var initMenu = function(n){
	console.log("Initalizing menu")
	flag = false;
	var width = 100/n; 
	i = 0;
	$('.nav-block').each(function(){
		$(this).css({'left':width*i+'%','width':width+'%'});
		//$(this).addClass('minimized');
		i++;
	});
	//Adjust menu to appropriate center button relative to current URL path
	var currentURL = window.location.pathname;
	var currentElem = $('a[href="'+currentURL+'"]');
	console.log(currentURL);
	if (currentURL !== '/'){
		flag = true; //switch flag so that we know an animation is taking place
		//Disable links while animating
		var links = document.getElementsByTagName('a');
		for (var i=0;i<links.length;i++){
		var current = $(links[i]);
		   	current.addClass('disabled');
		}
		var distance = countPositions(currentElem);
		console.log('index is '+distance);
		$('.nav-block.active').removeClass('active');
		$(currentElem).addClass('active');
		slideMenu(distance,true); //make sliding instant
	}
};

var slideMenu = function(index, instant = false){
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

var countPositions = function(elem) {//finds and returns the distance between the active item and the clicked item
 		var value = $(elem).index() - $('.nav-block.active').index();
 		return value;
};

var slidePage = function(index, link){
	console.log("Sliding page to "+link + " with index of " + index);
	if (index < 0){
		//Slide from left to right

	}else if (index > 0){
		//Slide from right to left
	}
};

var watchClick = function() {//watches clicks on the nav-blocks elements
  		$(document).on('click', '.nav-block', function(){
	    	if (!flag){ //if there is no ongoing animation
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
	     		slidePage(distance, this.href);
	   		}else{
	      		console.log("Attempted to slide before animation completed");
	   		}
	    	//new active item
  		});

};

var watchHover = function() {//watches hover on menu to expand/contract
	$('nav').mouseenter(
		function(){
			console.log("beginning slide up");
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
							"visibility":"visible",
						});
						console.log("completed slide up")
			        }
		     	}
			);
		}).mouseleave( 
		function(){
			console.log("beginning slide down");
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
							"visibility":"hidden",
						});
						console.log("completed slide down");
			        }
		     	}
			);
		}
	);
};



Template.navigationBar.onRendered(function () {
	  initMenu(5);
	  watchClick();
	  watchHover();
	  $( window ).resize(function() {
	  initMenu(5);
	  });  
});

