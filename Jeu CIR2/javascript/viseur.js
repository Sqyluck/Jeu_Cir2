var Viseur = function (radius, nbBalle) {
    this.x = 0;
    this.y = 0;
    this.radius = radius;
    this.nbBalle = nbBalle;
};

Viseur.prototype.constructor = Viseur();

Viseur.prototype.eclairage = function(){
    mask.drawCircle(0, 0, this.radius);
    sprite.mask = mask;
    game.input.addMoveCallback(this.move, this);
}


Viseur.prototype.move = function(pointer, x, y) {
    mask.x = x;
    mask.y = y;  
}