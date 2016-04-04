var Viseur = function (radius, nbBalle) {
    this.x = 0;
    this.y = 0;
    this.radius = radius+1;
    this.nbBalle = nbBalle;
};

Viseur.prototype.constructor = Viseur();

Viseur.prototype.eclairage = function(){
    mask.drawCircle(0, 0, this.radius);
    background.mask = mask;
    game.input.addMoveCallback(this.move, this);
}


Viseur.prototype.move = function(pointer, x, y) {
	filtreL.x = x -101;
    filtreL.y = y -101;
    mask.x = x;
    mask.y = y;  
}
