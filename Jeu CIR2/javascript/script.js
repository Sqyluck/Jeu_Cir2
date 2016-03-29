var game = new Phaser.Game(window.outerWidth-40, window.outerHeight-110, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.spritesheet('player1','assets/eleve.png',32, 48);
    game.load.spritesheet('player5','assets/eleve2.png', 32, 48);
    game.load.spritesheet('player6','assets/eleve3.png', 32, 48);
    game.load.spritesheet('player4','assets/femme.png', 32, 48);
    game.load.spritesheet('player2','assets/fou.png', 32, 48);
    game.load.spritesheet('player3','assets/prof.png', 32, 48);
    game.load.image('background', 'assets/fond3.png');
    game.load.image('fond1', 'assets/fond1B.png');

}

//Affichage du temps
var gameLength = 603;
var timerDisplay = 0;
//Affichage compteur ennemi
var killers = 1;
var killersLeft = killers;
//Affichage compteur civil
var npcs = 100;
var npcsLeft = npcs;
var npcdisp;
//Affichage munitions
var ammo = 0;
var ammoLeft = ammo;
//Viseur
var mask;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

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
    initAffichage();

}

function initAffichage() {
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

    killersLeft = game.add.text(game.height/3,  40, 'Killers:'+killersLeft+'/'+killers, { font: "15px Arial", fill: "#ffffff", align: "center" });    
    killersLeft.anchor.setTo(0.5, 0.5);

    npcdisp = game.add.text(game.height/3*2,  40, 'Npcs:'+npcsLeft+'/'+npcs, { font: "15px Arial", fill: "#ffffff", align: "center" });
    npcdisp.anchor.setTo(0.5, 0.5);
    
    ammoLeft = game.add.text(game.world.centerX,  60, 'Ammo:'+ammoLeft+'/'+ammo, { font: "15px Arial", fill: "#ffffff", align: "center" });
    ammoLeft.anchor.setTo(0.5, 0.5);
    
    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);
}

function update() {
    for(var i = 0; i < npcs; i++){
        game.physics.arcade.collide(player.Sprite, myArray[i].Sprite);
    }
    if(killspace.isDown){
        for(var i = 0; i < npcs; i++){
            game.physics.arcade.overlap(player.Sprite, myArray[i].Sprite, collisionHandler);
        }
    }
    for (var i = 0; i < myArray.length; i++) {
        myArray[i].IsDetected(viseur);
        if(myArray[i].out){
            myArray[i].moveToXY(0, 0);
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

}

function collisionHandler (player, Ennemi) {
    if(Ennemi.alive == true){
        Ennemi.alive = false;
        console.log("someone die"); //a changer ar du son
        npcsLeft--;
        npcdisp.setText('Npcs:'+npcsLeft+'/'+npcs);
    }
}


function updateCounter() {
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
