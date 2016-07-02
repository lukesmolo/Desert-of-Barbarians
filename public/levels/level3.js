function setupListeners() {
	$( '#game_canvas' ).one( 'click', function() {
		startLevel();

		//subtractions are necessaries to correct the position of the click (error dependent on left and top offset)
		$( '#game_canvas' ).on( 'click', function( event ) {
			playerShoot( event.pageX - $("#game_canvas").offset().left*3/2,
					event.pageY - $("#game_canvas").offset().top)+23;
		});
	});
}
