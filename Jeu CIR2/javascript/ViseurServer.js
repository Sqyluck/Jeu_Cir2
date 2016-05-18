var ViseurServer = function (radius, nbBalle, pseudo) {
    this.radius = radius;
    this.nbBalle = nbBalle;
    this.pseudo = pseudo;
};

ViseurServer.prototype.constructor = ViseurServer();

ViseurServer.prototype.moveViseur = function(game, socket){
    this.socket = socket;
    game.input.addMoveCallback(this.sendCoordonnee, this);
}

ViseurServer.prototype.sendCoordonnee = function(pointer, x, y) {
    this.socket.emit('moveViseur',{
        x : x,
        y : y,
        pseudo : this.pseudo
    });
}
