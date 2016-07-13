function initializeRec(i) {
	if (i === 0){
		initializeLevel();
		return;
	}
	castles.push( new castle( i) );
	antiMissileBatteries.push( new AntiMissileBattery(i));
	initializeRec(i-1);
}
