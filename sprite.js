function preload(){

	game.load.spritesheet('player','assets/eleve.png',32, 48);
	game.load.spritesheet('player2','assets/fou.png', 32, 48);
    game.load.spritesheet('player3','assets/prof.png', 32, 48);
    game.load.spritesheet('player4','assets/femme.png', 32, 48);
    game.load.spritesheet('player5','assets/eleve2.png', 32, 48);
    game.load.spritesheet('player6','assets/eleve3.png', 32, 48);
}
var player;

function create(){

	player = game.add.sprite(32,200,'player');
	player.animations.add('right',[8,9,10,11],10,true);
	player.animations.add('left',[4,5,6,7],10,true);
	player.animations.add('up',[12,13,14,15],10,true);
	player.animations.add('down',[0,1,2,3],10,true);

    player.body.collideWorldBounds = true;
}

function update(){

	player.animations.play('left');
	player.animations.play('right');
	player.animations.play('up');
	player.animations.play('down');
	player.animations.stop();
}