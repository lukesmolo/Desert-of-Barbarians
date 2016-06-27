//var initializeLevel = function() {
	$.each( antiMissileBatteries, function( index, amb ) {
		if (index == 1) {amb.missilesLeft = 1;}
		else {amb.missilesLeft = 0;}
	});
	playerMissiles = [];
	enemyMissiles = [];
	createEmemyMissiles();
	drawBeginLevel()
//};
