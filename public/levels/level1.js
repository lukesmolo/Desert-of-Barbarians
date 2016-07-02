function initializeLevel(){
	funtion foo(){
		missilesLeft = 10
		return missilesLeft
	};
	$.each( antiMissileBatteries, function( index, amb ) {
		if (index == 1) {amb.missilesLeft = foo();}
		else {amb.missilesLeft = foo();}
	});
	playerMissiles = [];
	enemyMissiles = [];
	createEmemyMissiles();
	drawBeginLevel();
}
