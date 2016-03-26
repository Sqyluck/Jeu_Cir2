var Viseur = function (game,radius, nbBalle) {
    this.x = 0;
    this.y = 0;
    this.radius = radius;
    this.nbBalle = nbBalle;
};

Viseur.prototype.constructor = Viseur(game);

Viseur.prototype.eclairage = function(mask){
    mask.drawCircle(0, 0, this.radius);
    sprite.mask = mask;
    game.input.addMoveCallback(this.move, this);
}


Viseur.prototype.move = function(pointer, x, y) {
    mask.x = x;
    mask.y = y;  
}