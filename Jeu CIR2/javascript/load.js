var loadState = {
	preload: function() {
		var loadingLabel = game.add.text(80, 150, 'Loading assets...',{font: '30px Arial', fill: '#ffffff'});
		
		//Buttons
		game.load.spritesheet('solo', 'assets/Buttons/solo.png', 82, 43);
		game.load.spritesheet('multi', 'assets/Buttons/multi.png', 150, 43);
		game.load.spritesheet('succes', 'assets/Buttons/succes.png', 111, 43);
		game.load.spritesheet('options', 'assets/Buttons/options.png', 117, 43);
	    
		//Multi
		game.load.image('player','assets/player.png');
		game.load.image('win','assets/win.png');

		//Persos
		game.load.spritesheet('player1','assets/Perso1 (1).png',32, 48);
		game.load.spritesheet('player1dark', 'assets/Perso1 (3).png', 32, 48);
		game.load.spritesheet('player1dead','assets/Perso1 (2).png',32, 48);
		game.load.spritesheet('player1deaddark', 'assets/Perso1 (3).png', 32, 48);

		game.load.spritesheet('player2','assets/Perso2 (4).png',32, 48);
		game.load.spritesheet('player2dark','assets/Perso2 (2).png',32, 48);
		game.load.spritesheet('player2dead','assets/Perso2 (1).png',32, 48);
		game.load.spritesheet('player2deaddark','assets/Perso2 (3).png',32, 48);

		game.load.spritesheet('player3','assets/fou.png',32, 48);
		game.load.spritesheet('player3dark','assets/dark-fou2.png',32, 48);
		game.load.spritesheet('player3dead','assets/fou.png',32, 48);
		game.load.spritesheet('player3deaddark','assets/dark-fou2.png',32, 48);
	   
		//Background
		game.load.image('background', 'assets/fond1B.png');

		//Filtres
		game.load.image('filtreSombre', 'assets/filtreSombre.png');
		game.load.image('filtreLampe', 'assets/filtreLampe.png');
	},

	create: function(){

		game.state.start('menu');
	} 
};
