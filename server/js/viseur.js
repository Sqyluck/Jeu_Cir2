var Viseur = function (radius, nbBalle, pseudo) {
    this.radius = radius;
    this.nbBalle = nbBalle;
    this.pseudo = pseudo;
};

Viseur.prototype.constructor = Viseur();

Viseur.prototype.moveViseur = function(game, socket){
    this.socket = socket;
    game.input.addMoveCallback(this.sendCoordonnee, this);
}

Viseur.prototype.sendCoordonnee = function(pointer, x, y) {
    this.socket.emit('moveViseur',{
        x : x,
        y : y,
        pseudo : this.pseudo
    });
}
