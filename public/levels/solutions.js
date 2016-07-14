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

//level5

function checkHeightObf(y) {
	var admitted = false;
	var admittedTop = false;
	var admittedBottom = false;
	var alreadySetTop = false;
	var alreadySetBottom = false;
	for (i = 0; i <= CANVAS_HEIGHT*6/8; i++){
				if (i == y) {
					admittedBottom = true;
					alreadySetBottom = true;
				}
				else {
					if (!alreadySetBottom){
						admittedBottom = false;
					}
				}
	}
	for (i = CANVAS_HEIGHT; i >= CANVAS_HEIGHT/8; i--){
				if (i == y) {
					admittedTop = true;
					alreadySetTop = true;
				}
				else {
					if (!alreadySetTop){
						admittedTop = false;
					}
				}
	}
	console.log(admittedTop);
		console.log(admittedBottom);

	admitted = admittedTop && admittedBottom;
	return admitted;
}


//level 5
function checkHeightObf(y) {
	if (y >= CANVAS_HEIGHT/8 && y <= CANVAS_HEIGHT*6/8) {return true}
	else return false;
}

//level 6
function initializeRec(i) {
 	if (i === 0){
         initializeLevel();
         return;
 		 }
 	 else if (i == 3 || i == 5 || i == 7 || i == 11 || i == 13 || i == 15) {
             castles.push( new castle( i) );
 				 }
 	else if (i == 1 || i == 9 || i == 17) {
             antiMissileBatteries.push( new AntiMissileBattery(i));
		}
		initializeRec(i-1);
}

//level 7

function playerShoot2(x,y) {
	if( checkHeight(y) ) {
		var source = whichAntiMissileBattery( x );
		if( source === -1 ){
			return;
		}
		playerMissiles.push( new PlayerMissile( source, x, y ) );
		playerMissiles.push( new PlayerMissile( source, x + 20, y ) );
	}
}

//level 8
function autofire() {
		timerAutofire = setInterval(
		function autofire(){
			for (i = 0; i <= 18; i++)
				playerShoot(CANVAS_WIDTH*i/18,CANVAS_HEIGHT/2);}
		, 500);
}
