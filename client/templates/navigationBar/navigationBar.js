
var navBoxWidth = function(){
 	return $('.nav-block').outerWidth(true);
};

var initMenu = function(n){
	flag = false;
	var width = 100/n; 
	i = 0;
	$('.nav-block').each(function(){
		$(this).css({'left':width*i+'%','width':width+'%'});
		//$(this).addClass('minimized');
		i++;
	});
};

var slideMenu = function(index){
		var width = navBoxWidth();
	 	if (index<0) { //if clicked on the left side of the screen
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
			        delay: 500,
			        duration:600,
			        easing:"easeInQuad",
			        complete: function() {
			          for (count = 0; count < Math.abs(index); count += 1){
			            $('.nav-block:visible:last').remove();
			          }
			          //Switches flag back to false so that the next click can be properly executed
			          flag = false;
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
		        duration:600,
		        easing:"easeInQuad", 
		        complete: function() { //move the copied div before animation
		          for (count = 0; count < Math.abs(index); count += 1){
		            $('.nav-block:visible:first').remove();
		          }
		          //Switches flag back to false so that the next click can be properly executed
		          flag = false;
		          console.log("Sliding finished with flag as " + flag);
		        }
	     	});
		}
};

var countPositions = function(elem) {//finds and returns the distance between the active item and the clicked item
 		var value = $(elem).index() - $('.nav-block.active').index();
 		return value;
};

var watchClick = function() {//watches clicks on the nav-blocks elements
  		$(document).on('click', '.nav-block', function(){
	    	if (!flag){ //if there is no ongoing animation
	    		flag = true; //switch flag so that we know an animation is taking place
	    		var distance=countPositions(this);
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



Template.navigationBar.onRendered(function () {
	  initMenu(5);
	  watchClick();
	  $( window ).resize(function() {
	  initMenu(5);
	  });  
});

