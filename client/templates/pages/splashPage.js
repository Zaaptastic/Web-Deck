var hideMenu = function(){
	$('.nav-block').css({
		"opacity":"0",
		"scale":"0",
	});
	$('.openingFrame').css({
		"opacity":"0",
		"scale":"0",
	});
};

var skip = function(){
	$('#skip').click(function(){

		$('.openingFrame').css({
			"opacity":"0",
			"scale":"0",
		});

		$(".velocity-animating").velocity("stop", true)


		loadingSequence = [
			{
				e: $('#skip'), p: { opacity: 0 }, o: { duration: 0 }
			},
			{
				e: $('#third'), p: { opacity: 1 }, o: { duration: 10000 }
			},
			{
				e: $('.nav-block.active'), p:{ opacity: 1, scale: 1 }, o: { duration: 2000 }
			},
			{
				e: $('.nav-block'), p:{ opacity: 1, scale: 1 }, o: { duration: 1000 }
			},
			{
				e: $('#replay'), p: { opacity: 1, scale: 1}, o: {duration: 1000}
			}
		];

		$.Velocity.RunSequence(loadingSequence);

	});
};

var replay = function(){
	$('#replay').click(function(){
		$('#replay').css({opacity:0,scale:0});
		$('#skip').css({opacity:1});
		hideMenu();
		loadSequence();
	});
}

splashMain = function(){
	hideMenu();
	skip();
	replay();
	loadSequence();
};

var loadSequence = function(){
	// Create the array of Velocity calls
   loadingSequence = [
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
			e: $('.nav-block.active'), p:{ opacity: 1, scale: 1 }, o: { duration: 2000 }
		},
		{
			e: $('.nav-block'), p:{ opacity: 1, scale: 1 }, o: { duration: 1000 }
		},
		{
			e: $('#replay'), p: { opacity: 1, scale: 1}, o: {duration: 1000}
		}
   ];

   // Pass the array into $.Velocity.RunSequence to kick off the sequence
   $.Velocity.RunSequence(loadingSequence);

}
