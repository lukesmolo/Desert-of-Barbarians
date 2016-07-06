function
initializeObf() {
	for (i=1; i <=18; i+=1){
		castles.push( new castleAlt( i) );
		antiMissileBatteries.push( new AntiMissileBatteryAlt(i) );
	}
	initializeLevel();
}
