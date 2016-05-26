var ViseurServer = function (radius, pseudo) {
    this.radius = radius;
    this.pseudo = pseudo;
    this.cercle;
    this.filtreL;
    this.camera;
    this.tempShoot = false;
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

ViseurServer.prototype.eclairage = function(){
    this.x = game.input.x ;     this.y = game.input.y ;

    this.cercle = game.add.graphics((window.outerWidth-40)/2, (window.outerHeight)/4+50);
    this.cercle.drawCircle(0, 0, this.radius);
    //game.input.addMoveCallback(this.sendCoord, this);

    SpriteArray[this.pseudo].mask = this.cercle;
    this.filtreL = game.add.image(this.cercle.x-101, this.cercle.y-101, 'filtreLampe');
    this.filtreL.height = this.radius;
    this.filtreL.width = this.radius;
    this.camera = game.add.tileSprite((window.outerWidth)/2, (window.outerHeight)/4, 88,84, 'photo');
    this.camera.scale.setTo(this.radius/this.camera.height);
    game.physics.arcade.enable(this.camera,true);
    this.camera.animations.add('right',[0,1,2,3,4,3,2,1,0],20,false);
    this.filtreL.x = this.x - (this.filtreL.height/2);
    this.filtreL.y = this.y - (this.filtreL.width/2);
    this.cercle.x = this.x;
    this.cercle.y = this.y;
    this.camera.x = this.x - ((this.radius+2)/2);
    this.camera.y = this.y - ((this.radius/2));
}

ViseurServer.prototype.move = function(viseur) {
    this.filtreL.x = viseur.x - (this.filtreL.height/2);
    this.filtreL.y = viseur.y - (this.filtreL.width/2);
    this.cercle.x = viseur.x;
    this.cercle.y = viseur.y;
    this.camera.x = viseur.x - ((this.radius+2)/2);
    this.camera.y = viseur.y - ((this.radius/2));
}
