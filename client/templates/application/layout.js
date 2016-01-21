Template.layout.onRendered(function() { 
	/*
		Defines the functions involved in advancing the page in the event that the user keeps
		scrolling past the bottom of the page
	*/

	//Only apply scroll-induced click after first the time the user scrolls to the
	//very bottom or very top, otherwise will make this feature annoying to use since it 
	//will be too responsive

	downScrollCount = 0; 
	upScrollCount = 0; 

	window.onscroll = function() {
		//window.scrollTo(0,+1);
		/*
			Advances forward to the next page when scrolled to the bottom of the current page.
			Also returns to the previous page when scrolled to the top of the current page.
			No wrapping around occurs, but that can be easily changed by removing the 
			specific caught cases
		*/
	    if ($(window).scrollTop() + $(window).height() > $(document).height() + 30) {
	    	//For when the user has scrolled to the bottom of the current page
			downScrollCount += 1;
	    	if (downScrollCount >= 2){
		    	var nextPage = $('.active').next();
		    	if ($('.active').is('.nav-block') === false){ //Scroll to page 1 from the 
		    		//cover page
		    		$('#b1').click();
		    		downScrollCount = 0;
		    	}else if (nextPage.is('#b1') === false){ //Do not wrap to first chapter upon reaching the end	        
					if (flag === false){ //Ensures that only one scroll-induced click occurs at once     
				        nextPage.click();
				        downScrollCount = 0;
				        //window.scrollTo(0,+1);
				    }
		    	}
	    	}
	    }else if($(window).scrollTop() < -30){
	    	//For when the user has scrolled to the top of the current page. Technically,
	    	//the user must scroll PAST the top of the page to trigger this function. This is
	    	//in place so that this function does not automatically trigger when the user
	    	//enters a few page (since they will be at the top of the page). The specific
	    	//degree (-35) is related to the size of the background arrow indicating 
	    	//scrollability
	    	upScrollCount += 1;
	    	if (upScrollCount >= 2){
		    	var prevPage = $('.active').prev();
		    	if ($('.active').is('#b1') === false){ //Do not wrap to last chapter upon reaching the beginning	        
					if (flag === false){ //Ensures that only one scroll-induced click occurs at once     
				        prevPage.click();
				        upScrollCount = 0;
				    }
		    	}
	    	}
	    }

	    /*
			Controls the appearance/disappearance of the background arrows, communicating
			that scrolling past the page causes a jump
	    */
	    if ($(window).scrollTop() + $(window).height() > $(document).height() ){
	    	//Make background down-arrow appear if valid
	    	var nextPage=$('.active').next();
	    	if (nextPage.is('#b1') === false) {//Do not show down-arrow on last page
	    		$('#down-arrow').velocity({opacity:1},{duration: 1000});
	    		//Also move up the navbar so that it does not overlap with the down-arrow
	    		var displace = $(window).scrollTop() + $(window).height() - $(document).height();
	    		displace = displace + "px";
	    		$('nav').css("bottom",displace);
	    	}
	    }else if($(window).scrollTop() < 0){
	    	//Make background up-arrow appear if valid
	    	if ($('.active').is('#b1') === false && //Do not show up-arrow on first page
	    			$('.active').is('.nav-block') === true) //or the cover page
	    		$('#up-arrow').velocity({opacity:1},{duration: 1000});
	    }else{ 
	    	//Reset background arrow css
			$("#down-arrow").velocity("stop", true);
			$("#up-arrow").velocity("stop", true);
			$('nav').velocity("stop", true);
	    	$('#down-arrow').css("opacity","0");
	    	$('#up-arrow').css("opacity","0");
	    	$('nav').css("bottom","0px");
	    }
	};

	/*
		Defines the functions involved in page-to-page transitions
	*/
	var startLeft = "-100%";
	var startRight = "100%";

	//Removes the loading screen
	$(document).ready(function(){
		$('#loading').css("display","none");
	});

	//Functions that create the actual transition between pages
	this.find('#main')._uihooks = {
		insertElement: function(node, next) {
			/*
				Animates the page entering the window. Uses a set Session variable to determine
				the direction of animation. Session variable should have been set in the 
				slideMenu navigationBar function, and should follow the direction that the
				navbar moves
			*/ 
			var dir = Session.get("direction");
			var start = startLeft;
			if (dir === "rightToLeft")
				start = startRight;	


			$(node)
	        .css("left",start)
	        .insertBefore(next)
	        .velocity(
		        {
		        	left: 0
		        },
		        {
		        	delay:0,
		        	duration: 600,
		        }
	        )
	},
		removeElement: function(node) {
			/*
				Animates the page leaving the window, also using the same Session variable
				as above. Note that the page leaves from the same direction as the page 
				entering. They are effectively switching positions and this is done for effect.
				To create a normal sliding effect, simply swap the direction (var end).
			*/
			var dir = Session.get("direction");
			var end = startLeft;
			if (dir === "rightToLeft")
				end = startRight;	
			$(node).velocity(
				{
	        		left: end
		        },
		        {
		        	delay:0,
		        	duration: 600,
		        	complete: function(){
						$(node).remove();
		        	}
	        	}
			)
		}
	} 
});