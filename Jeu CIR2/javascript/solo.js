//Entrer clavier pour affichage complet
var key;
//Mode debug
var debugKey;
var debugMode = false;
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
var message;
//Compteur munitions
var film;
var filmLeft;
var filmDisp;
var sons = {};
var pad = [];
var tempShoot; //action unique onclick

var player = [];
var soloState = {
	
	create: function() {
		
		//Reinit jeu si restart
		if (restart) {
			timer = game.time.create(false);
			gameLength = timeinit+3;
			killers = killerinit; //changement variable pour le solo
			killersLeft = killers;
			npcs = npcsinit; //changement variable pour le solo
			npcsLeft = npcs;
			film = ammoinit; //changement variable pour le solo
			filmLeft = film;
			key = game.input.keyboard.addKey(Phaser.Keyboard.A);			//Key pour affichage
			debugKey = game.input.keyboard.addKey(Phaser.Keyboard.D); //Key pour le mode debug
			v = 1;//Vitesse
			restart = false;
		}



	    //Background
	    backgroundS = game.add.sprite(0,0, 'ascenseur');
	    backgroundS.scale.x = game.width/backgroundS.width;
    	backgroundS.scale.y = game.height/backgroundS.height;
	    backgroundS = game.add.sprite(0, 0, 'filtreSombre');
	    backgroundS = game.add.sprite(0, 0, 'filtreSombre');

	  	background = game.add.sprite(0, 0, 'ascenseur');
	    background.scale.x = game.width/background.width;
    	background.scale.y = game.height/background.height;
	    //Lampe
	    viseur = new Viseur(150 ,ammoinit);
	    viseur.eclairage();

	    myArray = [];
	    var skin = ['player1', 'player2', 'player3'];
	    var skindark = ['player1dark', 'player2dark', 'player3dark'];
	    //id du killer
	    var k = game.rnd.between(0, npcs - 1)
	    //Insertion des npcs + killer
		for (var i = 0; i < npcs; i++) {
	        if(i == k){
	        	for(var nb = 1 ; nb <= killerinit ; nb++){
	            	player[nb] = new NPC(skindark[game.rnd.between(0, skin.length-1)]);
	            	player[nb].Sprite.scale.x += 1;
 	    			player[nb].Sprite.scale.y += 1;
 	    		}
	        }
 			myArray.push(new NPC(skindark[game.rnd.between(0, skindark.length-1)]));
 			myArray[i].Sprite.scale.x += 1;
 	    	myArray[i].Sprite.scale.y += 1;
 	    }
	    cursors = game.input.keyboard.createCursorKeys();

	    game.input.gamepad.start();
    	if(lvlrun == 0 && killers>0) pad[1] = game.input.gamepad.pad1;
	    if(lvlrun == 0 && killers>1) pad[2] = game.input.gamepad.pad2;
		if(lvlrun == 0 && killers>2) pad[3] = game.input.gamepad.pad3;
	    //Timer + counters
	    this.initAffichage();
	    sons['coller'] = game.add.audio('coller');
	    sons['degout'] = game.add.audio('degout');
	    sons['photo'] =  game.add.audio('photo');
	    sons['ascenseur'] =  game.add.audio('ascenseur');
	    sons['prout'] =  game.add.audio('prout');
	    sons['honte'] =  game.add.audio('honte');
	    sons['song1'] =  game.add.audio('song1');

	    sons.allowMultiple = true;
	    this.ecranDebut();
	    timer.add(3000, this.ecranDebutCancel, this);
	},

	update: function() {
		if(gameLength>timeinit) return;
		if(!game.rnd.between(0, 10000))sons['prout'].play();
		viseur.move();
		
		if (debugKey.isDown) {
			game.input.keyboard.removeKeyCapture(Phaser.Keyboard.D);
		    debugMode = (debugMode) ? false : true;

		    if (!debugMode)
		    {
		        game.debug.reset();
		    }
		}
		//Affichage Complet
		if(key.isUp){
	        this.showdisp();
	        
	    }else{
	        this.hidedisp();
	    }
	    if (gameLength > 0 && npcsLeft > 0 && killersLeft>0 && filmLeft>0 ) { //si le jeu n'est ps fini, on maj
	    	/*MAJ VISEUR*/
	    	if(game.input.activePointer.leftButton.isDown) tempShoot = true ;
	    	if(game.input.activePointer.leftButton.isUp && tempShoot == true){
	    		sons['photo'].play();	        
	    		tempShoot = false;
	    		filmLeft--;
		        viseur.nbBalle--;
		        viseur.camera.animations.play('right');
	    		filmDisp.setText('film:'+filmLeft+'/'+film);
			    for(var i = 0; i < npcs; i++){
			    	if(game.physics.arcade.distanceToPointer(myArray[i].Sprite) <= viseur.radius/2){
		            	viseur.VkillNPC(viseur.camera, myArray[i].Sprite);
		            	npcDisp.setText('Npcs:'+npcsLeft+'/'+npcs);
		            }
		        }
		        for(var i=1; i<=killers; i++){
		        	if(game.physics.arcade.distanceToPointer(player[i].Sprite) <= viseur.radius/2)
			    		viseur.killPlayer(player[i].Sprite);
			   	}
	    	}
	    	/*MAJ ACTION JOUEUR*/
	    	for(var i=1; i<=killers; i++){
		    	player[i].IsDetected(viseur);
		    }
		    if(lvlrun ==0){
	    		for(var i=1; i<=killers; i++){
					player[i].movePlayer(pad[i],myArray,npcs);
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
				}else if(lvlrun == 4) {
		    		player[1].iaMedium(myArray); 
		    	}else if(lvlrun > 4) {
		    		player[1].iaHard(myArray); 
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
						if(myArray[i].aiType == 0)myArray[i].AI0();	
						if(myArray[i].aiType == 1)myArray[i].AI1();
						if(myArray[i].aiType == 2)myArray[i].AI2();
						if(myArray[i].aiType == 3)myArray[i].AI3();
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
	ecranDebut: function() {
		sons['ascenseur'].play();
		var myText = "Find them !";
	    message = game.add.text(game.world.centerX,  game.world.centerY, myText, { font: "1000% Arial", fill: "#ffffff", align: "center" });
	    message.anchor.setTo(0.5, 0.5);
	    message.stroke = '#000000';
	    message.strokeThickness = 7;
	    timer.add(3000, this.ecranDebutCancel, this);

	},
	ecranDebutCancel: function() {
		sons['song1'].play();
	    message.setText("");
	},

	ecranFin: function() {
	    message = game.add.text(game.world.centerX,  game.world.centerY, 'End of the game', { font: "1000% Arial", fill: "#ffffff", align: "center" });
	    message.anchor.setTo(0.5, 0.5);
	    message.stroke = '#000000';
	    message.strokeThickness = 7;
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
	},
		render: function() {
		if(debugMode){
			for (var i = 0; i < npcs; i++) {
				if (myArray[i].aiType == 0) {
					game.debug.body(myArray[i].Sprite, 'green', false);
				}			
				if (myArray[i].aiType == 1) {
					game.debug.body(myArray[i].Sprite,'red', false);
				}
				if (myArray[i].aiType == 2) {
					game.debug.body(myArray[i].Sprite,'blue', false);
				}
				if (myArray[i].aiType == 3 ) {
					game.debug.body(myArray[i].Sprite,'yellow', false);
				}
			}
			for (var i = 1; i < player.length; i++) {
				if(player[i].Sprite.alive){
					game.debug.body(player[i].Sprite);
				}
			}
			//game.debug.text("Mouse position (" + game.input.x + "; " + game.input.mousePointer.y + ") Player position ("+player.Sprite.x + "; "+player.Sprite.y+")" ,32,32);
			game.debug.text("Distance between cursor and player:(" + Phaser.Math.roundTo(Phaser.Math.distance(player[1].Sprite.x, player[1].Sprite.y, game.input.x ,game.input.y), 0) + ")" ,32,64);
			game.debug.text("Center:(" + game.world.centerX +"; "+ game.world.centerY + ") Width:" + game.width + "; Height:" + game.height, 32, 96);
			//game.debug.text("Mask position:(" + mask.x +"; "+ mask.y +")", 32, 96 + 32);
		}
	}
};
