var Viseur = function (radius, nbBalle) {
	this.x = (window.outerWidth)/2;
	this.y = (window.outerHeight)/3;
	this.radius = radius+1;
	this.nbBalle = nbBalle;
	this.mask;
	this.filtreL;
	this.camera;
	this.tempShoot = false;
};

Viseur.prototype.constructor = Viseur();

Viseur.prototype.eclairage = function(){
	test.drawCircle(0, 0, this.radius);
	background.mask = test;
	game.input.addMoveCallback(this.sendCoord, this);
	this.filtreL = game.add.image(test.x-101, test.y-101, 'filtreLampe');
	this.filtreL.height = this.radius;
	this.filtreL.width = this.radius;
	//this.camera = game.add.tileSprite((window.outerWidth)/2, (window.outerHeight)/4, 88,84, 'photo');
	//this.camera.scale.setTo(this.radius/this.camera.height);
	//game.physics.arcade.enable(this.camera,true);
	//this.camera.animations.add('right',[0,1,2,3,4,3,2,1,0],20,false);
}

Viseur.prototype.target =function(player){
	this.filtreL.x = player.x - (this.filtreL.height/2);
	this.filtreL.y = player.y - (this.filtreL.width/2);
	test.x = player.x;
	test.y = player.y;
	//this.camera.x = player.x - ((this.radius+2)/2);
	//this.camera.y = player.y - ((this.radius/2));
}

Viseur.prototype.sendCoord = function(pointer, x, y) {
	this.x = x;
	this.y = y;
}

Viseur.prototype.killPlayer = function(Ennemi) {
	Ennemi.kill();
	killersDisp.setText('Killers:0/'+killers);
}
	
Viseur.prototype.VkillNPC = function(player, Ennemi) {
	player.animations.play('right');
	if(Ennemi.alive == true){
		Ennemi.alive = false;
		Ennemi.mistake = true;
		npcsLeft--;
		npcDisp.setText('Npcs:'+npcsLeft+'/'+npcs);
	}
	return;
}
Viseur.prototype.move = function() {
	this.filtreL.x = this.x - (this.filtreL.height/2);
	this.filtreL.y = this.y - (this.filtreL.width/2);
	test.x = this.x;
	test.y = this.y;
	//this.camera.x = this.x - ((this.radius+2)/2);
	//this.camera.y = this.y - ((this.radius/2));
}
