function
setupListeners() {
	$( '#game_canvas' ).one( 'click', function() {
		startLevel();

		//calls a function or evaluates an expression at specified intervals
		function autofire(){
			for (i = 0; i <= 18; i++)
			playerShoot(CANVAS_WIDTH*i/18,CANVAS_HEIGHT/2);
		}

		timerAutofire = setInterval( autofire, 500);


	});
}
