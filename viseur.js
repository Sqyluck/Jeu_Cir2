var Viseur = function (radius, nbBalle) {
    this.x = 400;
    this.y = 100;
    this.radius = radius;
    this.nbBalle = nbBalle;

};

Viseur.prototype.constructor = Viseur(50, 50);

Viseur.prototype.eclairage = function(){
    mask.drawCircle(0, 0, this.radius); // 0,0 est le décallage par rapport à la souris en x et y
    background.mask = mask;
    game.input.addMoveCallback(this.move, this);
    if(game.physics.arcade.distanceToPointer("dark") < 55) newSprite.alpha = 0;
}


Viseur.prototype.move = function(pointer, x, y) {
    mask.x = x;
    mask.y = y;
}