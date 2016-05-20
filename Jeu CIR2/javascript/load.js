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
	    	game.load.spritesheet('asolo','assets/Asterix/solo.png', 960, 960);
	    	game.load.spritesheet('amulti','assets/Asterix/multi.png', 960, 960);
	    	game.load.spritesheet('asucces','assets/Asterix/succes.png', 960, 960);
	    	game.load.spritesheet('aoptio','assets/Asterix/options.png', 960, 960);
	    	game.load.spritesheet('amodif','assets/Funcky/modif.png', 960, 689);
	    	game.load.spritesheet('aok','assets/Funcky/ok.png', 960, 689);
		game.load.spritesheet('ahome','assets/Asterix/home.png', 960, 960);
	    	game.load.spritesheet('adefault','assets/Funcky/default.png', 960, 689);
		    
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

	    	//Map
	    	//game.load.tilemap('map1',, null, Phaser.T)
	    	game.load.image('tiles','assets/tileset/LPC_house_interior/interior.png');

		//Multi
		game.load.image('player','assets/player.png');
		game.load.image('win','assets/win.png');

		//Persos
		game.load.spritesheet('player1','assets/Perso/Perso1/normal.png',33, 70);
		game.load.spritesheet('player1dark','assets/Perso/Perso1/sombre.png',33, 70);
		game.load.spritesheet('player1dead','assets/Perso/Perso1/asterix.png',33, 70);
		game.load.spritesheet('player1deaddark','assets/Perso/Perso1/asterix sombre.png',33, 70);
		game.load.spritesheet('player1mistake','assets/Perso/Perso1/vener.png',33, 70);
		game.load.spritesheet('player1mistakedark','assets/Perso/Perso1/vener sombre.png',33, 70);

		game.load.spritesheet('player2','assets/Perso2 (1).png',32, 48);
		game.load.spritesheet('player2dark','assets/Perso2 (2).png',32, 48);
		game.load.spritesheet('player2dead','assets/Perso2 (1).png',32, 48);
		game.load.spritesheet('player2deaddark','assets/Perso2 (1).png',32, 48);
		game.load.spritesheet('player2mistake', 'assets/eleve.png', 32, 48);
		game.load.spritesheet('player2mistakedark', 'assets/eleve2.png', 32, 48);

		game.load.spritesheet('player3','assets/fou.png',32, 48);
		game.load.spritesheet('player3dark','assets/dark-fou2.png',32, 48);
		game.load.spritesheet('player3dead','assets/fou.png',32, 48);
		game.load.spritesheet('player3deaddark','assets/dark-fou2.png',32, 48);
		game.load.spritesheet('player3mistake', 'assets/eleve.png', 32, 48);
		game.load.spritesheet('player3mistakedark', 'assets/eleve2.png', 32, 48);
		
		//Caméra
		game.load.spritesheet('photo','assets/photo3.png',90,84,5);
		
		//Background
		game.load.image('background', 'assets/fond1B.png');

		//Filtres
		game.load.image('filtreSombre', 'assets/filtreSombre.png');
		game.load.image('filtreLampe', 'assets/filtreLampe.png');
	},

	create: function(){
		game.stage.backgroundColor = '#7a0e0c'; //#c31222 (Asterix)
		$("#modif").hide();
		game.state.start('start');
		//game.state.start('menu');
	} 
};
