function playerShoot3(x,y) {
	if( checkHeight(y) ) {
		var source = whichAntiMissileBattery( x );
		if( source === -1 ){
			return;
		}
		playerMissiles.push( new PlayerMissile( source, x, y ) );
		playerMissiles.push( new PlayerMissile( source, x + 40, y ) );
		playerMissiles.push( new PlayerMissile( source, x - 40, y ) );
	}
}
