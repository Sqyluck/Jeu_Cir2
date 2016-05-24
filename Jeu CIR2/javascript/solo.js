//Entrer clavier pour affichage complet
var key;
//Temps
var gameLength;
var timerDisplay;
//Compteur ennemi
var killers;
var killersLeft;
var killersDisp;
//Compteur civil
var npcs;
var npcsLeft;
var npcDisp;
//Compteur munitions
var film;
var filmLeft;
var filmDisp;

var pad1, pad2, pad3;
var player = [];
var soloState = {
	
	create: function() {
		
		//Reinit jeu si restart
		if (restart) {
			timer = game.time.create(false);
			gameLength = timeinit;
			killers = killerinit; //changement variable pour le solo
			killersLeft = killers;
			npcs = npcsinit; //changement variable pour le solo
			npcsLeft = npcs;
			film = ammoinit; //changement variable pour le solo
			filmLeft = film;
			key = game.input.keyboard.addKey(Phaser.Keyboard.A);			//Key pour affichage
			v = 1;//Vitesse
			restart = false;
		}



	    //Background
	    backgroundS = game.add.sprite(0, 0, 'background');
	    backgroundS = game.add.sprite(0, 0, 'filtreSombre');

	  	background = game.add.sprite(0, 0, 'background');
	    
	    //Lampe
	    viseur = new Viseur(150 ,30, game);
	    viseur.eclairage();

	    myArray = [];
	    var skin = ['player1', 'player2', 'player3'];
	    var skindark = ['player1dark', 'player2dark', 'player3dark'];
	    //id du killer
	    var k = game.rnd.between(0, npcs - 1)
		var tempShoot; //action unique onclick
	    //Insertion des npcs + killer
	    for (var i = 0; i < npcs; i++) {
	        if(i == k){
	            player[1] = new NPC(skindark[game.rnd.between(0, skin.length-1)]);
	            if(killerinit>1) player[2] = new NPC(skindark[game.rnd.between(0, skin.length-1)]);
	            if(killerinit>2) player[3] = new NPC(skindark[game.rnd.between(0, skin.length-1)]);
	        }
 			myArray.push(new NPC(skindark[game.rnd.between(0, skindark.length-1)]));
 	    }
	    cursors = game.input.keyboard.createCursorKeys();

	    game.input.gamepad.start();
    	if(lvlrun == 0 && killers>1) pad = game.input.gamepad.pad1;
	    if(lvlrun == 0 && killers>2) pad2 = game.input.gamepad.pad2;
		if(lvlrun == 0 && killers>3) pad3 = game.input.gamepad.pad3;
	    //Timer + counters
	    this.initAffichage();
	},

	update: function() {
		game.debug.body(player[1].Sprite);
		viseur.move();
		//Affichage Complet
		if(key.isUp){
	        this.showdisp();
	        
	    }else{
	        this.hidedisp();
	    }
	    if (gameLength > 0 && npcsLeft > 0 && killersLeft>0 && viseur.nbBalle>0 ) { //si le jeu n'est ps fini, on maj
	    	/*MAJ VISEUR*/
	    	if(game.input.activePointer.leftButton.isDown) tempShoot = true ;
	    	if(game.input.activePointer.leftButton.isUp && tempShoot == true){
	    		tempShoot = false;
	    		filmDisp.setText('film:'+filmLeft+'/'+film);
			    for(var i = 0; i < npcs; i++){
			    	if(game.physics.arcade.distanceToPointer(myArray[i].Sprite) <= viseur.radius/2){
			    		viseur.camera.animations.play('right');
		            	viseur.VkillNPC(viseur.camera, myArray[i].Sprite);
		            	filmLeft--;
		            	viseur.nbBalle--;
		            }
		        }
		        for(var i=1; i<=killersLeft; i++){
		        	if(game.physics.arcade.distanceToPointer(player[i].Sprite) <= viseur.radius/2)
			    		viseur.killPlayer(player[i].Sprite);
			   	}
	    	}
	    	/*MAJ ACTION JOUEUR*/
	    	for(var i=1; i<=killersLeft; i++){
		    	player[i].IsDetected(viseur);
		    }
		    if(lvlrun ==0){
	    		for(var i=1; i<=killersLeft; i++){
					player[i].movePlayer(pad+i,myArray,npcs);
		    	}
		    }else{
		    	if(lvlrun == 1){ 
		    		player[1].iaEasy(myArray);
		    		player[1].moveToXY(player[1].arriveex,player[1].arriveey);
		    		game.physics.arcade.overlap(player[1].Sprite, myArray[player[1].target].Sprite, player[1].PkillNPC); 
		    	}else if(lvlrun == 2) { 
		    		player[1].iaEasy2(myArray); 
		    		if(!myArray[0].out)myArray[0].iaEasy(myArray);
		    	}else if(lvlrun == 3) {
		    		player[1].iaMedium(myArray); 
		    	}
		    }

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
			viseur.target(player[1].Sprite);
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

	    killersDisp = game.add.text(50,  10, 'Killers:'+killersLeft+'/'+killers, { font: "15px Arial", fill: "#ffffff", align: "center" });    
	    killersDisp.anchor.setTo(0.5, 0.5);
	    killersDisp.stroke = '#000000';
	    killersDisp.strokeThickness = 1;

	    npcDisp = game.add.text(50,  40, 'Npcs:'+npcsLeft+'/'+npcs, { font: "15px Arial", fill: "#ffffff", align: "center" });
	    npcDisp.anchor.setTo(0.5, 0.5);
	    npcDisp.stroke = '#000000';
	    npcDisp.strokeThickness = 1;
	    
	    filmDisp = game.add.text(50,  70, 'film:'+filmLeft+'/'+film, { font: "15px Arial", fill: "#ffffff", align: "center" });
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
