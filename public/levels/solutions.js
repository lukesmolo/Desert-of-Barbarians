//level 4
function initializeObf() {
	for (i=3; i <=7; i+=2)
		castles.push( new castle( i ) );
	for (i=11; i <=15; i+=2)
		castles.push( new castle( i ) );
	for (i=1; i <=17; i+=8)
		antiMissileBatteries.push( new AntiMissileBattery( i ) );
	initializeLevel();
}

//level 5

function checkHeightObf(y) {
	if (y >= CANVAS_HEIGHT/8 && y <= CANVAS_HEIGHT*6/8) {return true}
	else return false;
}

//level 6

function initializeRec(i) {
	if (i == 0){
		initializeLevel();
		return;
	}
	else if (i == 3 || i == 5 || i == 7 || i == 11 || i == 13 || i == 15) {
		    castles.push( new castle( i) );
	} else if (i == 1 || i == 9 || i == 17) {
		    antiMissileBatteries.push( new AntiMissileBattery(i));
	} 
	initializeRec(i-1);
}

//level 8
function autofire() {
		timerAutofire = setInterval(
		function autofire(){
			for (i = 0; i <= 18; i++)
				playerShoot(CANVAS_WIDTH*i/18,CANVAS_HEIGHT/2);}
		, 500);
}
