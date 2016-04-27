//Entrer clavier pour affichage complet
var key;
//Temps
var gameLength;
var timerDisplay;
//Compteur ennemi
var killers;
var killersLeft;
var killersdisp;
//Compteur civil
var npcs;
var npcsLeft;
var npcdisp;
//Compteur munitions
var ammo;
var ammoLeft;
var ammodisp;

//Viseur
var mask;
var filtreSombre;

var soloState = {
	
	create: function() {
		
		//Reinit jeu si restart
		if (restart) {

			timer = game.time.create(false);
			//Temps
			gameLength = timeinit;
			timerDisplay = 0;
			//Compteur ennemi
			killers = killerinit;
			killersLeft = killers;
			//Compteur civil
			npcs = npcsinit;
			npcsLeft = npcs;
			//Compteur munitions
			ammo = ammoinit;
			ammoLeft = ammo;
			//Key pour affichage
			key = game.input.keyboard.addKey(Phaser.Keyboard.A);
			restart = false;

		}

		//Vitesse
	    v = 1;

	    //Background
	    backgroundS = game.add.sprite(0, 0, 'background');
	    backgroundS = game.add.sprite(0, 0, 'filtreSombre');

	  	background = game.add.sprite(0, 0, 'background');
	    
	    //Lampe
	    mask = game.add.graphics((window.outerWidth-40)/2, (window.outerHeight)/4+50);
	    mask.beginFill(0xffffff);
	    viseur = new Viseur(200 ,3 , mask);
	    filtreL = game.add.image(mask.x-101, mask.y-101, 'filtreLampe');
	    viseur.eclairage();

	    myArray = [];
	    var skin = ['player1', 'player2', 'player3'];
	    var skindark = ['player1dark', 'player2dark', 'player3dark'];
	    //id du killer
	    var k = game.rnd.between(0, npcs - 1)

	    //Insertion des npcs + killer
	    for (var i = 0; i < npcs; i++) {
	        if(i == k){
	            player = new Player(skin[game.rnd.between(0, skin.length-1)]);
	        }
 			myArray.push(new NPC(skindark[game.rnd.between(0, skindark.length-1)]));
 	    }
	    cursors = game.input.keyboard.createCursorKeys();
	    killspace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


	    //Timer + counters
	    this.initAffichage();

	},

	update: function() {
		//Affichage Complet
		if(key.isDown){
	        this.showdisp();
	        
	    }else{
	        this.hidedisp();
	    }

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
		            	myArray[i].Sprite.name += 'dead';
		                myArray[i].Sprite.loadTexture(myArray[i].Sprite.name);
		                myArray[i].out = true;
		            }else{
		                myArray[i].randomMove();
		            }
		        }
		    }
		    player.movePlayer();
	    
		}else{
	    	this.ecranFin();
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

	    killersdisp = game.add.text(50,  10, 'Killers:'+killersLeft+'/'+killers, { font: "15px Arial", fill: "#ffffff", align: "center" });    
	    killersdisp.anchor.setTo(0.5, 0.5);
	    killersdisp.stroke = '#000000';
	    killersdisp.strokeThickness = 1;

	    npcdisp = game.add.text(50,  40, 'Npcs:'+npcsLeft+'/'+npcs, { font: "15px Arial", fill: "#ffffff", align: "center" });
	    npcdisp.anchor.setTo(0.5, 0.5);
	    npcdisp.stroke = '#000000';
	    npcdisp.strokeThickness = 1;
	    
	    ammodisp = game.add.text(50,  70, 'Ammo:'+ammoLeft+'/'+ammo, { font: "15px Arial", fill: "#ffffff", align: "center" });
	    ammodisp.anchor.setTo(0.5, 0.5);
	    ammodisp.stroke = '#000000';
	    ammodisp.strokeThickness = 1;
	    
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

	},

	hidedisp: function() {
	    killersdisp.visible = false;
	    npcdisp.visible = false;
	    ammodisp.visible = false;
	},

	showdisp: function(){

	    npcdisp.visible = true;
	    killersdisp.visible = true;
	    ammodisp.visible = true;
	}

};
