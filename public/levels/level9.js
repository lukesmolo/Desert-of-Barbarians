function
whichAntiMissileBattery(x) {
	var firedToOuterThird = function( priority1, priority2, priority3) {
		if( antiMissileBatteries[priority1].hasMissile() ) {
			return priority1;
		} else if ( antiMissileBatteries[priority2].hasMissile() ) {
			return priority2;
		} else {
			return priority3;
		}
	};

	var firedtoMiddleThird = function( priority1, priority2 ) {
		if( antiMissileBatteries[priority1].hasMissile() ) {
			return priority1;
		} else {
			return priority2;
		}
	};

	if( !antiMissileBatteries[0].hasMissile() &&
			!antiMissileBatteries[1].hasMissile() &&
			!antiMissileBatteries[2].hasMissile() ) {
		return -1;
	}
	if( x <= CANVAS_WIDTH / 3 ){
		return firedToOuterThird( 0, 1, 2 );
	} else if( x <= (2 * CANVAS_WIDTH / 3) ) {
		if ( antiMissileBatteries[1].hasMissile() ) {
			return 1;
		} else {
			return ( x <= CANVAS_WIDTH / 2 ) ? firedtoMiddleThird( 0, 2 )
				: firedtoMiddleThird( 2, 0 );
		}
	} else {
		return firedToOuterThird( 2, 1, 0 );
	}
}
