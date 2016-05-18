//Entrée clavier pour affichage complet
var key;
//Affichage du temps
var gameLength;
var timerDisplay;
//Compteur ennemi
var killers;
var killersDisp;
//Compteur civil
var npcs;
var npcsLeft;
var npcDisp;
//Affichage munitions
var film;
var filmDisp;
//Viseur
var sizeCamera
var test;
var camera;
var filtreSombre;
//gestion jusqu'à 3 manettes
var pad1, pad2, pad3;

var soloState = {
	create: function() {
		//Reinitialise les variables si le jeu restart
		if (restart) {
			timer = game.time.create(false);
			gameLength = timeinit;
			timerDisplay = 0;
			killers = killerinit;
			npcs = npcsinit;
			npcsLeft = npcs;
			film = filminit;
			filmLeft = film;
			restart = false;
			killersLeft = killers;
			sizeCamera = 100; //diametre de la camera
			 = 1; // vitesse persos
		}
		key = game.input.keyboard.addKey(Phaser.Keyboard.A); //Affichage HUD

		//Background
		backgroundS = game.add.sprite(0, 0, 'background');
		backgroundS = game.add.sprite(0, 0, 'filtreSombre');
		background = game.add.sprite(0, 0, 'background');
		//Lampe
		viseur = new Viseur(sizeCamera, film);
		test = game.add.graphics((window.outerWidth-40)/2, (window.outerHeight)/4+50);
		viseur.eclairage();

		myArray = [];
		var skin = ['player1', 'player2', 'player3'];
		var skindark = ['player1dark', 'player2dark', 'player3dark'];
		
		var idKiller = game.rnd.between(0, npcs - 1);
		//Insertion des npcs + killer
	    	for (var i = 0; i < npcs; i++) {
		        if(i == idKiller){
		        	player = new Player(skin[game.rnd.between(0, skin.length-1)]);
		        }
	 		myArray.push(new NPC(skindark[game.rnd.between(0, skindark.length-1)]));
 		}
	    	cursors = game.input.keyboard.createCursorKeys();
		killspace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
		game.input.gamepad.start();
		pad1 = game.input.gamepad.pad1;
		padd = new Padd();
		
		this.initAffichage();

	},

	update: function() {
		//Affichage Complet
		if(key.isDown){
			this.showdisp();
		}else{
			this.hidedisp();
		}
		viseur.move();
		if (gameLength > 0 && npcsLeft > 0 && player.Sprite.alive && viseur.nbBalle>0 ) { //si le jeu n'est ps fini, on maj
			/*MàJ VISEUR*/
			if(game.input.activePointer.leftButton.isDown) viseur.tempShoot = true ;
			if(game.input.activePointer.leftButton.isUp && viseur.tempShoot == true){
				console.log(viseur.nbBalle);
				viseur.tempShoot = false;
				viseur.nbBalle--;
				filmDisp.setText('film:'+viseur.nbBalle+'/'+film);
				for(var i = 0; i < npcs; i++){
					if(game.physics.arcade.distanceToPointer(myArray[i].Sprite) <= viseur.radius/2)
					viseur.VkillNPC(viseur.camera, myArray[i].Sprite);
					filmLeft--;
				}
				if(game.physics.arcade.distanceToPointer(player.Sprite) <= viseur.radius/2)
					viseur.killPlayer(player.Sprite);
			}
		    	/*MAJ ACTION JOUEUR*/
			if(killspace.isDown){
				for(var i = 0; i < npcs; i++){
					game.physics.arcade.overlap(player.Sprite, myArray[i].Sprite, player.PkillNPC);
				}
			}
			player.IsDetected(viseur);
			//player.reelMove(myArray, npcs-1); /*Intelligence de l'IA*/
			player.movePlayer(pad1);
			/*MAJ BOTS*/
			for (var i = 0; i < myArray.length; i++) {
				myArray[i].IsDetected(viseur);
				if(myArray[i].out){
					myArray[i].willDie();
			        }else{
					if( (!myArray[i].Sprite.alive)&&(myArray[i].detected) ){
			            		if(!myArray[i].Sprite.mistake){
							myArray[i].Sprite.name += 'dead';
						}else {
							myArray[i].Sprite.name += 'mistake';
						}
						myArray[i].Sprite.loadTexture(myArray[i].Sprite.name);
						myArray[i].out = true;
					}else{
						if((Math.abs(myArray[i].Sprite.x - myArray[i].arriveex) < 100) && (Math.abs(myArray[i].Sprite.y - myArray[i].arriveey) < 100))myArray[i].randomMove();
						else myArray[i].moveToXY(myArray[i].arriveex, myArray[i].arriveey);
					}
				}
			}
		}else{
			viseur.target(player.Sprite);
			this.ecranFin();
			for (var i = 0; i < myArray.length; i++) {
				if(myArray[i].out) myArray[i].willDie();
			}
		}
	},
	
	initAffichage: function() {
		//Insertion du timer
		if((gameLength/60)<10){
			if((gameLength%60)<10){
				timerDisplay = game.add.text(game.world.centerX, 20, '0'+ Math.floor(gameLength/60) + ':0' + gameLength%60, { font: "18px Arial", fill: "#ffffff", align: "center" });
			}else{
				timerDisplay = game.add.text(game.world.centerX, 20, '0'+ Math.floor(gameLength/60) + ':' + gameLength%60, { font: "18px Arial", fill: "#ffffff", align: "center" });
			}
		}else{
			if((gameLength%60)<10){
				timerDisplay = game.add.text(game.world.centerX, 20, Math.floor(gameLength/60) + ':0' + gameLength%60, { font: "18px Arial", fill: "#ffffff", align: "center" });
			}else{
				timerDisplay = game.add.text(game.world.centerX, 20, Math.floor(gameLength/60) + ':' + gameLength%60, { font: "18px Arial", fill: "#ffffff", align: "center" });
			}
		}
		timerDisplay.anchor.setTo(0.5, 0.5);
		timerDisplay.stroke = '#000000';
		timerDisplay.strokeThickness = 2;
		
		killersDisp = game.add.text(50,  10, 'Killers:'+killers+'/'+killers, { font: "15px Arial", fill: "#ffffff", align: "center" });    
		killersDisp.anchor.setTo(0.5, 0.5);
		killersDisp.stroke = '#000000';
		killersDisp.strokeThickness = 1;
	    
		npcDisp = game.add.text(50,  40, 'Npcs:'+npcs+'/'+npcs, { font: "15px Arial", fill: "#ffffff", align: "center" });
		npcDisp.anchor.setTo(0.5, 0.5);
		npcDisp.stroke = '#000000';
		npcDisp.strokeThickness = 1;
		
		filmDisp = game.add.text(50,  70, 'Ammo:'+film+'/'+film, { font: "15px Arial", fill: "#ffffff", align: "center" });
		filmDisp.anchor.setTo(0.5, 0.5);
		filmDisp.stroke = '#000000';
		filmDisp.strokeThickness = 1;
	    
		timer.loop(Phaser.Timer.SECOND, this.updateCounter, this);
		timer.start();
	},

	ecranFin: function() {
		endTime = game.add.text(game.world.centerX,  game.world.centerY, 'End of the game', { font: "1000% Arial", fill: "#ffffff", align: "center" });
		endTime.anchor.setTo(0.5, 0.5);
		endTime.stroke = '#000000';
		endTime.strokeThickness = 7;
		timer.stop(false);

		var startLabel = game.add.text(game.width/2, game.height -40, 'Press SPACE', {font: '25px Arial', fill: '#ffffff'});
		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		wkey.onDown.addOnce(this.quit, this);
	},

	quit: function() {
		game.state.start('fin');
	},

	updateCounter: function() {
		gameLength--;
		sec = gameLength % 60;
		if ((gameLength/60)<10) {
			if(sec<10){
				timerDisplay.setText('0' + Math.floor(gameLength/60) + ':0' + sec);
			}else{
				timerDisplay.setText('0' + Math.floor(gameLength/60) + ':' + sec);
			}
		}else{
			if(sec<10){
				timerDisplay.setText(Math.floor(gameLength/60) + ':0' + sec);
			}else{
				timerDisplay.setText(Math.floor(gameLength/60) + ':' + sec);
			}
		}
	},

	hidedisp: function() {
	    killersDisp.visible = false;
	    npcDisp.visible = false;
	    filmDisp.visible = false;
	},
	showdisp: function(){
	    npcDisp.visible = true;
	    killersDisp.visible = true;
	    filmDisp.visible = true;
	}
};
