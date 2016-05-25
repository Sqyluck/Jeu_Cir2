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
		game.load.image('flogo','assets/Funcky/logo.png');

	    //Images Asterix
	    game.load.image('awon','assets/Asterix/won.png');
	    game.load.image('alost','assets/Funcky/lost.png');
	    game.load.image('alogo','assets/Asterix/logo.png');

		//Boutons 
	    game.load.spritesheet('level1','assets/Buttons/level1.png', 107, 40);
	    game.load.spritesheet('level2','assets/Buttons/level2.png', 107, 40);
	    game.load.spritesheet('level3','assets/Buttons/level3.png', 107, 40);
	    game.load.spritesheet('changeRole','assets/Buttons/changerole.png', 159, 40);
	    game.load.spritesheet('bdeMember','assets/Buttons/bdemember.png', 171, 40);
	    game.load.spritesheet('journalist','assets/Buttons/journalist.png', 138, 40);
	    game.load.spritesheet('ready','assets/Buttons/ready.png', 102, 40);
	    game.load.spritesheet('play','assets/Buttons/play.png', 82, 40);
	    game.load.spritesheet('playOnline','assets/Buttons/playOnline.png', 152, 40);
	    game.load.spritesheet('playOffline','assets/Buttons/playOffline.png', 155, 40);

		//Persos
		game.load.spritesheet('player1','assets/Perso/Perso1/normal.png',33, 70);
		game.load.spritesheet('player1dark','assets/Perso/Perso1/sombre.png',33, 70);
		game.load.spritesheet('player1dead','assets/Perso/Perso1/asterix.png',33, 70);
		game.load.spritesheet('player1deaddark','assets/Perso/Perso1/asterix sombre.png',33, 70);
		game.load.spritesheet('player1mistake','assets/Perso/Perso1/vener.png',33, 70);
		game.load.spritesheet('player1mistakedark','assets/Perso/Perso1/vener sombre.png',33, 70);

		game.load.spritesheet('player2','assets/Perso/Perso2/normal.png',33, 70);
		game.load.spritesheet('player2dark','assets/Perso/Perso2/sombre.png',33, 70);
		game.load.spritesheet('player2dead','assets/Perso/Perso2/asterix.png',33, 70);
		game.load.spritesheet('player2deaddark','assets/Perso/Perso2/asterix sombre.png',33, 70);
		game.load.spritesheet('player2mistake','assets/Perso/Perso2/vener.png',33, 70);
		game.load.spritesheet('player2mistakedark','assets/Perso/Perso2/vener sombre.png',33, 70);

		game.load.spritesheet('player3','assets/Perso/Perso3/normal.png',33, 70);
		game.load.spritesheet('player3dark','assets/Perso/Perso3/sombre.png',33, 70);
		game.load.spritesheet('player3dead','assets/Perso/Perso3/asterix.png',33, 70);
		game.load.spritesheet('player3deaddark','assets/Perso/Perso3/asterix sombre.png',33, 70);
		game.load.spritesheet('player3mistake','assets/Perso/Perso3/vener.png',33, 70);
		game.load.spritesheet('player3mistakedark','assets/Perso/Perso3/vener sombre.png',33, 70);

		//Caméra
		game.load.spritesheet('photo','assets/camera.png',89,87,5);
		
		//Background
		game.load.image('background', 'assets/fond1B.png');
		//game.load.image('mapLift', 'assets/fond1B.png');

		//Filtres
		game.load.image('filtreSombre', 'assets/filtreSombre.png');
		game.load.image('filtreLampe', 'assets/filtreLampe.png');
	},

	create: function(){
		game.stage.backgroundColor = '#7a0e0c';
		$("#modif").hide();
		//game.state.start('start');
		game.state.start('menu');
	} 
};
