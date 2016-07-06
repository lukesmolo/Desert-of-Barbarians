function shootWithOffset(x, y, offLeft, offTop){
	correctedX = x - offLeft;
	correctedY = y - offTop;
	playerShoot(1.5*correctedX, correctedY+45);
}
