Template.layout.onRendered(function() { 
	/*
		Defines the functions involved in advancing the page in the event that the user keeps
		scrolling past the bottom of the page
	*/
	window.onscroll = function() {
	    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
	    	var nextPage = $('.active').next();
	    	if (nextPage.is('#b1') === false){ //Do not wrap to first chapter upon reaching the end	        
				if (flag === false){ //Ensures that only one scroll-induced click occurs at once
			        nextPage.click();
			        window.scrollTo(0,0);
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