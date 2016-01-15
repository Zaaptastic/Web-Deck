Template.layout.onRendered(function() { 
	var startLeft = "-100%";
	var startRight = "100%";


	this.find('#main')._uihooks = {

		insertElement: function(node, next) { 
			var dir = Session.get("direction");
			var start = startLeft;
			if (dir === "rightToLeft")
				start = startRight	


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
				end = startRight	
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