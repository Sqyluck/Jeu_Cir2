var start=false;

//Affichage du temps
var gameLength = 5;
var timerDisplay = 0;
//Affichage compteur ennemi
var killers = 1;
var killersLeft = killers;
//Affichage compteur civil
var npcs = 10;
var npcsLeft = npcs;
var npcdisp;
//Affichage munitions
var ammo = 0;
var ammoLeft = ammo;
//Viseur
var mask;

var soloState = {
	
	create: function() {
		
		//Reinit des variables si jeu restart
		if (start) {

			//Affichage du temps
			gameLength = 5;
			timerDisplay = 0;
			//Affichage compteur ennemi
			killers = 1;
			killersLeft = killers;
			//Affichage compteur civil
			npcs = 10;
			npcsLeft = npcs;
			npcdisp;
			//Affichage munitions
			ammo = 0;
			ammoLeft = ammo;
			//Viseur
			start=false;
		}

		//Vitesse
	    v = 1;

	    //Background
	    game.add.tileSprite(0, 0, game.width, game.height, 'background');
	    sprite = game.add.sprite(0, 0, 'fond1'); 
	    
	    myArray = [];
	    var skin = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'];
	    
	    //id du killer
	    var k = game.rnd.between(0, npcs - 1)

	    //Insertion des npcs + killer
	    for (var i = 0; i < npcs; i++) {
	        if(i == k){
	            player = new Player(skin[game.rnd.between(0, 5)]);
	        }
	        myArray.push(new NPC(skin[game.rnd.between(0, 5)]));
	    }
	    cursors = game.input.keyboard.createCursorKeys();
	    killspace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

	    //Lampe
	    mask = game.add.graphics(0, 0);
	    mask.beginFill(0xffffff);
	    viseur = new Viseur(150 ,3 , mask);
	    viseur.eclairage();

	    //Timer + counters
	    this.initAffichage();

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

	    killersLeft = game.add.text(game.width/3,  40, 'Killers:'+killersLeft+'/'+killers, { font: "15px Arial", fill: "#ffffff", align: "center" });    
	    killersLeft.anchor.setTo(0.5, 0.5);
	    killersLeft.stroke = '#000000';
	    killersLeft.strokeThickness = 1;

	    npcdisp = game.add.text(game.width/3*2,  40, 'Npcs:'+npcsLeft+'/'+npcs, { font: "15px Arial", fill: "#ffffff", align: "center" });
	    npcdisp.anchor.setTo(0.5, 0.5);
	    npcdisp.stroke = '#000000';
	    npcdisp.strokeThickness = 1;
	    
	    ammoLeft = game.add.text(game.world.centerX,  60, 'Ammo:'+ammoLeft+'/'+ammo, { font: "15px Arial", fill: "#ffffff", align: "center" });
	    ammoLeft.anchor.setTo(0.5, 0.5);
	    ammoLeft.stroke = '#000000';
	    ammoLeft.strokeThickness = 1;
	    
	    game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
	},

	update: function() {
	    for(var i = 0; i < npcs; i++){
	        game.physics.arcade.collide(player.Sprite, myArray[i].Sprite);
	    }
	    if (gameLength > 0 && npcsLeft > 0) {
		    if(killspace.isDown){
		        for(var i = 0; i < npcs; i++){
		            game.physics.arcade.overlap(player.Sprite, myArray[i].Sprite, this.collisionHandler);
		        }
		    }
		    for (var i = 0; i < myArray.length; i++) {
		        myArray[i].IsDetected(viseur);
		        if(myArray[i].out){
		            myArray[i].willDie();
		        }else{
		            if( (myArray[i].Sprite.alive == false)&&(myArray[i].detected) ){
		                //myArray[i].Sprite.kill();
		                myArray[i].Sprite.loadTexture("player1");
		                myArray[i].out = true;
		            }else{
		                myArray[i].randomMove();
		            }
		        }
		    }
		    player.movePlayer();
	    
		}else{
	    	game.state.start('fin');
	    	//this.ecranFin();
		}

	},

	ecranFin: function() {
	    endTime = game.add.text(game.world.centerX,  game.world.centerY, 'End of the game', { font: "1000% Arial", fill: "#ffffff", align: "center" });
	    endTime.anchor.setTo(0.5, 0.5);
	    endTime.stroke = '#000000';
	    endTime.strokeThickness = 7;
	    game.time.events.stop(this.updateCounter);
	},

	collisionHandler: function (player, Ennemi) {
	    if(Ennemi.alive == true){
	        Ennemi.alive = false;
	        console.log("someone die"); //a changer ar du son
	        npcsLeft--;
	        npcdisp.setText('Npcs:'+npcsLeft+'/'+npcs);
	    }
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

	}
};