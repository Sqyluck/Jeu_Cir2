var Viseur = function (radius, nbBalle) {
    this.x;
    this.y;
    this.radius = radius+1;
    this.nbBalle = nbBalle;
    this.filtreL;
    this.camera;
    this.cercle;
};

Viseur.prototype.constructor = Viseur();

Viseur.prototype.eclairage = function(){
    this.x = game.input.x;
    this.y = game.input.y;
    this.cercle = game.add.graphics(this.x, this.y);
    this.cercle.drawCircle(0, 0, this.radius); // 0 0 : écart avec le pointeur de la souris
    game.input.addMoveCallback(this.sendCoord, this);
    background.mask = this.cercle;
    
    this.filtreL = game.add.image(0, 0, 'filtreLampe');
    this.filtreL.height = this.radius;
    this.filtreL.width = this.radius;
    this.filtreL.x = this.x - (this.filtreL.height/2);
    this.filtreL.y = this.y - (this.filtreL.width/2);
    
    this.camera = game.add.tileSprite(0, 0, 88,84, 'photo');
    this.camera.scale.setTo(this.radius/this.camera.height);
    game.physics.arcade.enable(this.camera,true);
    this.camera.x = this.x - ((this.radius+2)/2);
    this.camera.y = this.y - ((this.radius/2));
    this.camera.animations.add('right',[0,1,2,3,4,3,2,1,0],20,false);
}
Viseur.prototype.killPlayer = function(Ennemi) {
    Ennemi.kill();
    sons['honte'].play();
    killersLeft--;
    killersDisp.setText('Killers:'+killersLeft+'/'+killers);
}

Viseur.prototype.VkillNPC = function(player, Ennemi) {
    if(Ennemi.alive == true){
        npcsLeft--;
        sons['degout'].play();
        Ennemi.alive = false;
        Ennemi.mistake = true;
    }
}

Viseur.prototype.sendCoord = function(pointer, x, y) {
    this.x = x;
    this.y = y;
}

Viseur.prototype.target =function(player){
    this.filtreL.x = player.x - (this.filtreL.height/2);
    this.filtreL.y = player.y - (this.filtreL.width/2);
    this.cercle.x = player.x;
    this.cercle.y = player.y;
    this.camera.x = player.x - ((this.radius+2)/2);
    this.camera.y = player.y - ((this.radius/2));
}
Viseur.prototype.move = function() {
    this.filtreL.x = this.x - (this.filtreL.height/2);
    this.filtreL.y = this.y - (this.filtreL.width/2);
    this.cercle.x = this.x;
    this.cercle.y = this.y;
    this.camera.x = this.x - ((this.radius+2)/2);
    this.camera.y = this.y - ((this.radius/2));
}
