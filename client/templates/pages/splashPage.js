hideMenu = function(){
	/*
		Resets elements on page to default values in preparation of opening 
		sequence animation
	*/
	$('#replay').css({
		opacity:0,
		scale:0
	});
	$('#skip').css({
		opacity:1
	});
	$('.nav-block').css({
		opacity:0,
		scale:0,
	});
	$('.nav-block h2').css({
		opacity:0,
	})
	$('.openingFrame').css({
		opacity:0,
		scale:0
	});
};

var skip = function(){
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
				e: $('.nav-block.gray-out'), p:{ opacity: .2, scale: 1 }, o: { duration: 1500 }
			},
			{
				e: $('#replay'), p: { opacity: 1, scale: 1}, o: { duration: 1000}
			}
		];

		$.Velocity.RunSequence(loadingSequence);

	});
};

var replay = function(){
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

splashMain = function(){
	/*
		Main function, called on by nav bar's initMenu so that the menu is properly
		constructed before any animations begin
		(Impt, otherwise some menu buttons have opacity:0 after opening sequence animation)
	*/
	hideMenu();
	skip();
	replay();
	loadSequence();
};

var loadSequence = function(){
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
        	e: $('#first'), p: { opacity: 1 }, o: { duration: 15000 } 
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
			e: $('#skip'), p: { opacity: 0 }, o: { duration: 0 }
		},
		{
			e: $('#third'), p: { opacity: 1 }, o: { duration: 10000 }
		},
		{
			e: $('.nav-block#b1'), p:{ opacity: 1, scale: 1 }, o: { duration: 2000 }
		},
		{
			e: $('.nav-block.gray-out'), p:{ opacity: .2, scale: 1 }, o: { duration: 1500 }
		},
		{
			e: $('#replay'), p: { opacity: 1, scale: 1}, o: { duration: 1000}
		}
   ];

   // Pass the array into $.Velocity.RunSequence to kick off the sequence
   $.Velocity.RunSequence(loadingSequence);

}
