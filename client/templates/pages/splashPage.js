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

var skipFunctions = function(){
	$('#skip').hover(function(){
		$(this).css("underline","true");
	},function(){
		$(this).css("underline","none");
	});

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
				e: $('.nav-block'), p:{ opacity: 1, scale: 1 }, o: { duration: 2000 }
			},
		];

		$.Velocity.RunSequence(loadingSequence);

	});
};

var main = function(){
	hideMenu();
	skipFunctions();

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
			e: $('.nav-block'), p:{ opacity: 1, scale: 1 }, o: { duration: 2000 }
		},
   ];

   // Pass the array into $.Velocity.RunSequence to kick off the sequence
   $.Velocity.RunSequence(loadingSequence);
};

Template.splashPage.onRendered(function(){
	main();
});