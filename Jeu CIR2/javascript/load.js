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

		//Solo

	    game.load.spritesheet('player1','assets/eleve.png',32, 48);
    	    game.load.spritesheet('player5','assets/eleve2.png', 32, 48);
	    game.load.spritesheet('player6','assets/eleve3.png', 32, 48);
	    game.load.spritesheet('player4','assets/femme.png', 32, 48);
	    game.load.spritesheet('player2','assets/fou.png', 32, 48);
	    game.load.spritesheet('player3','assets/prof.png', 32, 48);
	    game.load.image('background', 'assets/fond1B.png');
	    game.load.image('filtreSombre', 'assets/filtreSombre.png');
	    game.load.image('filtreLampe', 'assets/filtreLampe.png');
	},

	create: function(){

		game.state.start('menu');
	} 
};
