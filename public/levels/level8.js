function autofire() {
		timerAutofire = setInterval( function autofire(){for (i = 0; i <= 18; i++) playerShoot(CANVAS_WIDTH*i/18,CANVAS_HEIGHT/2);}, 500);
}
