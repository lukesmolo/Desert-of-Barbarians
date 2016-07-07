function initializeRec(i) {
	if (i == 18){
		castles.push( new castle( i) );
		antiMissileBatteries.push( new AntiMissileBattery(i) );
		initializeLevel();
	}
	else {
		castles.push( new castle( i) );
		antiMissileBatteries.push( new AntiMissileBattery(i) );
		initializeRec(i+1);
	}
}
