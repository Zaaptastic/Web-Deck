Template.layout.onRendered(function() { 
	/*
		Defines the functions involved in advancing the page in the event that the user keeps
		scrolling past the bottom of the page
	*/

	downScrollCount = 0; 
	upScrollCount = 0; //Only apply scroll-induced click after first the time the user scrolls to the
	//very bottom or very top, otherwise will make this feature annoying to use since it 
	//will be too responsive

	window.onscroll = function() {
	    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
			downScrollCount += 1;
	    	if (downScrollCount >= 2){
		    	var nextPage = $('.active').next();
		    	if ($('.active').is('.nav-block') === false){ //Scroll to page 1 from the 
		    		//cover page
		    		$('#b1').click();
		    		scrollCount = 0;
		    	}else if (nextPage.is('#b1') === false){ //Do not wrap to first chapter upon reaching the end	        
					if (flag === false){ //Ensures that only one scroll-induced click occurs at once     
				        nextPage.click();
				        downScrollCount = 0;
				    }
		    	}
	    	}
	    }else if($(window).scrollTop() < -5){
	    	upScrollCount += 1;
	    	if (upScrollCount >= 2){
		    	var prevPage = $('.nav-block').prev();
		    	if ($('.active').is('#b1') === false){ //Do not wrap to last chapter upon reaching the beginning	        
					if (flag === false){ //Ensures that only one scroll-induced click occurs at once     
				        prevPage.click();
				        upScrollCount = 0;
				    }
		    	}
	    	}
	    }
	};

	/*
		Defines the functions involved in page-to-page transitions
	*/
	var startLeft = "-100%";
	var startRight = "100%";

	$(document).ready(function(){
		$('#loading').css("display","none");
	});

	this.find('#main')._uihooks = {

		insertElement: function(node, next) { 
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