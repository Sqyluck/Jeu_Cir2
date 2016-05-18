var loadState = {
	preload: function() {
		var loadingLabel = game.add.text(80, 150, 'Loading assets...',{font: '30px Arial', fill: '#ffffff'});
		
		//Boutons Funcky
		game.load.spritesheet('fsolo', 'assets/Funcky/solo.png', 960, 689);
		game.load.spritesheet('fmulti', 'assets/Funcky/multi.png', 960, 689);
		game.load.spritesheet('fsucces', 'assets/Funcky/succes.png', 960, 689);
		game.load.spritesheet('foptio', 'assets/Funcky/options.png', 960, 689);
		game.load.spritesheet('fmodif', 'assets/Funcky/modif.png', 960, 689);
		game.load.spritesheet('fok', 'assets/Funcky/ok.png', 960, 689);
		game.load.spritesheet('fhome', 'assets/Funcky/home.png', 960, 689);
	    game.load.spritesheet('fdefault', 'assets/Funcky/default.png', 960, 689);
	    
	    //Boutons Asterix
	    game.load.spritesheet('asolo','assets/Asterix/solo.png', 411, 370);
	    game.load.spritesheet('amulti','assets/Asterix/multi.png', 411, 370);
	    game.load.spritesheet('asucces','assets/Asterix/succes.png', 411, 370);
	    game.load.spritesheet('aoptio','assets/Asterix/options.png', 411, 370);
	    game.load.spritesheet('amodif','assets/Asterix/modif.png', 411, 370);
	    game.load.spritesheet('aok','assets/Asterix/ok.png', 411, 370);
	    game.load.spritesheet('ahome','assets/Asterix/home.png', 411, 370);
	    game.load.spritesheet('adefault','assets/Asterix/default.png', 411, 370);
	    
	    //Images Funcky
	    game.load.image('fwon','assets/Funcky/won.png');
	    game.load.image('flost','assets/Funcky/lost.png');
	    game.load.image('flogo','assets/Funcky/logo.old.png');
	    game.load.image('fcadre','assets/Funcky/cadre.png');

	    //Images Asterix
	    game.load.image('awon','assets/Funcky/won.png');
	    game.load.image('alost','assets/Funcky/lost.png');
	    game.load.image('alogo','assets/Asterix/logo.png');
	    game.load.image('acadre','assets/Funcky/cadre.png');

	    //Boutons Level
	    game.load.spritesheet('level1','assets/Funcky/level1.png', 107, 40);
	    game.load.spritesheet('level2','assets/Funcky/level2.png', 107, 40);
	    game.load.spritesheet('level3','assets/Funcky/level3.png', 107, 40);

	    //Map
        game.load.tilemap('salle', 'assets/tilemaps/salle2.json', null, Phaser.Tilemap.TILED_JSON);
	    game.load.image('tiles', 'assets/tileset/interior.png');
	    game.load.image('tile', 'assets/tileset/city_inside.png');

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
		game.load.image('background', 'assets/maplift.png');

		//Filtres
		game.load.image('filtreSombre', 'assets/filtreSombre.png');
		game.load.image('filtreLampe', 'assets/filtreLampe.png');
	},

	create: function(){
		
		
		game.state.start('start');
		//game.state.start('menu');
	} 
};
