hideMenu = function(){
	/*
		Resets elements on page to default values in preparation of opening 
		sequence animation
	*/
	$('#replay').css({
		opacity:0,
		scale:0,
		"pointer-events":"none",
	});
	$('#skip').css({
		opacity:1,
		"pointer-events": "all",
	});
	$('.nav-block').css({
		opacity:0,
		scale:0,
		"pointer-events":"none",
	});
	$('.openingFrame').css({
		opacity:0,
		scale:0
	});
};

skip = function(){
	/*
		Adds skip button functionality, which stops all current animations and replaces
		with a shorter animation that immediately animates to
		the final splash page state
	*/
	$('#skip').click(function(){

		$(".velocity-animating").velocity("stop", true);

		$('.openingFrame').css({
			"opacity":"0",
			"scale":"0",
		});


		loadingSequence = [
			{
				e: $('nav'), p: { height: "200px" }, o: { duration : 0 }
			},
			{
				e: $('.nav-block h2'), p: { opacity: 1 }, o: { duration : 0 }
			},
			{
				e: $('#skip'), p: { opacity: 0 }, o: { duration: 0 }
			},
			{
				e: $('#third'), p: { opacity: 1 }, o: { duration: 10000 }
			},
			{
				e: $('.nav-block#b1'), p:{ opacity: 1, scale: 1 }, o: { duration: 2000 }
			},
			{
				e: $('.nav-block').not("#b1"), p:{ opacity: .2, scale: 1 }, o: { duration: 1500 }
			},
			{
				e: $('#replay'), p: { opacity: 1, scale: 1}, o: { duration: 1000, 
					complete: adjustPointerEvents }
			}
		];

		$.Velocity.RunSequence(loadingSequence);

	});
};

replay = function(){
	/*
		Adds replay button functionality. Returns all elements to their default values
		and restarts the opening sequence
	*/
	$('#replay').click(function(){
		$('.nav-block h2').css("visibility","visible");
		hideMenu();
		loadSequence();
	});
}

loadSequence = function(){
	/*
		Defines and executes the opening sequence animations
	*/

	// Create the array of Velocity calls
   loadingSequence = [
		{
			e: $('nav'), p: { height: "200px" }, o: { duration : 0 }
		},
		{
			e: $('.nav-block h2'), p: { opacity:1 }, o: { duration : 0 }
		},
        { 
        	e: $('#first'), p: { opacity: 1 }, o: { duration: 15000, } 
    	},
        { 
        	e: $('#first'), p: { opacity: 0 }, o: { duration: 0 } 
        },
        {
        	e: $('#second'), p: { opacity: 1 }, o: { duration: 15000 } 
    	},
		{ 
			e: $('#second'), p: { opacity: 0 }, o: { duration: 0 } 
		},
		{
			e: $('#skip'), p: { opacity: 0, }, o: { duration: 0 }
		},
		{
			e: $('#third'), p: { opacity: 1 }, o: { duration: 10000 }
		},
		{
			e: $('.nav-block#b1'), p:{ opacity: 1, scale: 1}, o: { duration: 2000 }
		},
		{
			e: $('.nav-block').not("#b1"), p:{ opacity: .2, scale: 1}, o: { duration: 1500 }
		},
		{
			e: $('#replay'), p: { opacity: 1, scale: 1}, o: { duration: 1000, 
				complete: adjustPointerEvents }
		},
   ];

   // Pass the array into $.Velocity.RunSequence to kick off the sequence
   $.Velocity.RunSequence(loadingSequence);

}

adjustPointerEvents = function(){
	/*
		hideMenu() disables pointer-events in the navbar and the replay button, while 
		making sure they are enabled for the skip button. This function inverts that and 
		should represent the button functionality once all animations are completed
	*/


	$('#replay').css({
		"pointer-events":"all",
	});
	$('#skip').css({
		"pointer-events":"none",
	});
	$('.nav-block').css({
		"pointer-events":"all",
	});

}

Template.splashPage.onRendered(function(){
	/*
		When splashPage is rendered, only the skip() and replay() functions need to be called
		to active their respective click() functions. The automatic start to the animations
		is assign to the onRender of the navigation bar. This way the animation only 
		automatically plays when the user opens splashPage for the first time. Returning
		to it via the back browser function simply shows the final state of the splashPage,
		while giving the user the option to replay the animation if desired
	*/
		skip();
		replay();
});
