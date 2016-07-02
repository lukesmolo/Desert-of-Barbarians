function PlayerMissile( source, endX, endY ) {
	var amb = antiMissileBatteries[source];

	Missile.call( this, { startX: amb.x,  startY: amb.y,
		endX: endX,     endY: endY,
		color: 'green', trailColor: 'blue' } );

	var xDistance = this.endX - this.startX,
	yDistance = this.endY - this.startY;

	var scale = (function() {
		var distance = Math.sqrt( Math.pow(xDistance, 2) +
				Math.pow(yDistance, 2) ),
		distancePerFrame = 5;

			return distance / distancePerFrame;
	})();

	this.dx = xDistance / scale;
	this.dy = yDistance / scale;
	amb.missilesLeft--;
}
