var animation = function(sprite){
    sprite.animations.add('right',[8,9,10,11],10,true);
    sprite.animations.add('left',[4,5,6,7],10,true);
    sprite.animations.add('up',[12,13,14,15],10,true);
    sprite.animations.add('down',[0,1,2,3],10,true);
}

var NPC = function(skin){
    //création du sprite a une position aléatoire
    this.Sprite = game.add.sprite(game.rnd.between(30, game.width-30), game.rnd.between(30, game.height-30), skin);
    this.Sprite.name = skin;
    //les differents mouvement du sprite
    animation(this.Sprite);

    //collision
    game.physics.arcade.enable(this.Sprite,true);
    
    this.Sprite.body.setSize(18, 38, 1, 1);
    this.Sprite.body.collideWorldBounds = true;

    //caracteristique du sprite
    this.Sprite.anchor.setTo(0.5, 0.5);
    //this.Sprite.scale.setTo(0.5);

    //temps d'attente de base
    this.wait = game.rnd.between(0, 50);

    //point d'arrivé
    this.arriveex = game.rnd.between(50, game.width-50);
    this.arriveey = game.rnd.between(50, game.height-50);
    this.Sprite.alive = true;
    this.detected = false;
    this.out = false;
    this.Sprite.mistake = false;
    this.target = -1;
};

NPC.prototype = Object.create(Phaser.Sprite.prototype);
NPC.prototype.constructor = NPC;
NPC.prototype.moveToXY = function(x, y){
    //si le point d'arrivée n'est pas en diagonale, on avance en ligne droite
    if((Math.abs(this.Sprite.x - this.arriveex) < 5) && (Math.abs(this.Sprite.y - this.arriveey) < 5)){
        return;
    }
    if(Math.abs(Math.abs(x-this.Sprite.x) - Math.abs(y - this.Sprite.y)) > v){
        if(Math.abs(x-this.Sprite.x) > Math.abs(y - this.Sprite.y)){
            if(x > this.Sprite.x){
                this.Sprite.x += Math.sqrt(2) * v;
                this.Sprite.animations.play('right');
                return;
            }else{
                this.Sprite.x -= Math.sqrt(2) * v;
                this.Sprite.animations.play('left');
                return;
            }
        }else{
            if(y > this.Sprite.y){
                this.Sprite.y += Math.sqrt(2) * v;
                this.Sprite.animations.play('down');
                return;
            }else{
                this.Sprite.y -= Math.sqrt(2) * v;
                this.Sprite.animations.play('up');
                return;
            }
        }
        //sinon on prend la diagonale
    }else{
        if(Math.abs(this.Sprite.x - x) > v){
            if( (this.Sprite.x > x)&&(this.Sprite.y > y) ){
                this.Sprite.x -=v; this.Sprite.y -= v;
                this.Sprite.animations.play('left');
                return;
            }
            if( (this.Sprite.x > x)&&(this.Sprite.y < y) ){
                this.Sprite.x -=v; this.Sprite.y += v;
                this.Sprite.animations.play('left');
                return;
            }
            if( (this.Sprite.x < x)&&(this.Sprite.y > y) ){
                this.Sprite.x +=v; this.Sprite.y -= v;
                this.Sprite.animations.play('right');
                return;
            }
            if( (this.Sprite.x < x)&&(this.Sprite.y < y) ){
                this.Sprite.x +=v; this.Sprite.y += v;
                this.Sprite.animations.play('right');
                return;
            }
        }
    }
}
NPC.prototype.iaEasy = function(focus){
    //var target =game.rnd.between(0, my2Array.length-1);
    this.reelMove(focus);
}

NPC.prototype.reelMove = function(myArray, nbIA){
    if(this.target == -1){
        this.target = game.rnd.between(0, npcs-1);
        return;
    }
   // console.log("is target alive: "+myArray[this.target].alive);
    if(!myArray[this.target].Sprite.alive){
        this.Sprite.animations.stop();
        this.target = -1;
        return;
    }
    game.physics.arcade.overlap(this.Sprite, myArray[this.target].Sprite, this.PkillNPC);
    this.arriveex = myArray[this.target].Sprite.x;
    this.arriveey = myArray[this.target].Sprite.y;
    this.moveToXY(this.arriveex, this.arriveey);
}

//IA MERDIQUE, 1000 RECURSION AVEC this.target = 0
/*
NPC.prototype.reelMove2 = function(myArray, nbIA){
    console.log(nbIA);
    if(this.target == -1){
        this.target = 0;
        for(var i = 0 ; i < nbIA ; i++){
            //if(Math.sqrt(Math.pow(player.Sprite.x-myArray[i].Sprite.x)+Math.pow(player.Sprite.y-myArray[i].Sprite.y)) < Math.sqrt(Math.pow(player.Sprite.x-myArray[this.target].Sprite.x)+Math.pow(player.Sprite.y-myArray[this.target].Sprite.y))){
                this.target = i;
            //}
        }
    }
    if(!myArray[this.target].Sprite.alive){
        console.log(this.target);
        this.target = -1;
        return this.reelMove2(myArray, nbIA);
    }
    if((Math.abs(this.Sprite.x - this.arriveex) < 5) && (Math.abs(this.Sprite.y - this.arriveey) < 5)){
        this.findClosePoint();
    }
    game.physics.arcade.overlap(this.Sprite, myArray[this.target].Sprite, this.PkillNPC);
    this.moveToXY(this.arriveex, this.arriveey);
}*/

NPC.prototype.PkillNPC = function (me, Ennemi) {
    //this.animations.stop();
    if(Ennemi.alive == true){
        Ennemi.alive = false;
        console.log("someone die"); //a changer ar du son
        npcsLeft--;
        npcDisp.setText('Npcs:'+npcsLeft+'/'+npcs);
        console.log(npcsLeft); //a changer ar du son
        this.target =-1;
        this.arriveex = 0;
        this.arriveey = 0;
        //this.randomMove();

    }
}

NPC.prototype.randomMove = function(){
    // si je suis sensé attendre, je réduis ce temps
    this.arriveex = this.Sprite.x;
    this.arriveey = this.Sprite.y;
    this.Sprite.animations.stop();
    var choix = game.rnd.between(0, 100);
    if(choix < 50){
        this.wait = game.rnd.between(0, 60);
    }
    else if(choix < 80){
        this.findClosePoint();
        this.moveToXY(this.arriveex, this.arriveey);
    }
    else{
        this.findDistantPoint();
        this.moveToXY(this.arriveex, this.arriveey);
    }
}

NPC.prototype.findClosePoint = function(){
    var x = game.rnd.between(30, game.width-30);
    var y = game.rnd.between(30, game.height-30);
    while(Math.sqrt(Math.pow(this.Sprite.x - x, 2) + Math.pow(this.Sprite.y - y, 2) ) >= 150){
        x = game.rnd.between(30, game.width-30);
        y = game.rnd.between(30, game.height-30);
    }
    this.arriveex = x;
    this.arriveey = y;
}
// procedure pour trouver un point éloigné
NPC.prototype.findDistantPoint = function(){
    var x = game.rnd.between(30, game.width-30);
    var y = game.rnd.between(30, game.height-30);
    while(Math.sqrt(Math.pow(this.Sprite.x - x, 2) + Math.pow(this.Sprite.y - y, 2) ) <= 250){
        x = game.rnd.between(30, game.width-30);
        y = game.rnd.between(30, game.height-30);
    }
    this.arriveex = x;
    this.arriveey = y;
}

NPC.prototype.IsDetected = function(viseur){
    //var distance = Math.sqrt(Math.pow(this.Sprite.x - viseur.x, 2) + Math.pow(this.Sprite.y - viseur.y, 2) );
/*    if( (game.physics.arcade.distanceToPointer(this.Sprite) <= viseur.radius/2) ){
        if(this.detected == false){
            this.detected = true;
            this.Sprite.name = this.Sprite.name.substring(0, this.Sprite.name.length - 4);
            var frame = this.Sprite.frame;
            this.Sprite.loadTexture(this.Sprite.name);
            this.Sprite.frame = frame;
            animation(this.Sprite);

        }
    }else{
        if(this.detected == true){
            this.detected = false;
            this.Sprite.name += 'dark';
            var frame = this.Sprite.frame;
            this.Sprite.loadTexture(this.Sprite.name);
            this.Sprite.frame = frame;
            animation(this.Sprite);
        }
    }*/
}


NPC.prototype.willDie = function(){
    if(this.Sprite.y > game.height - 40)  this.Sprite.kill();
    else this.moveToXY(game.width/2, game.height-30);
}


var Player = function(skin){
    //création du sprite a une position aléatoire
    this.Sprite = game.add.sprite(game.rnd.between(30, game.width-30), game.rnd.between(30, game.height-30), skin);

    //les differents mouvement du sprite
    animation(this.Sprite);


    //collision
    game.physics.arcade.enable(this.Sprite,true);
    //Phillipe je te dédie cette ligne pour que tu puisse mettres la hitbox de nos NPCnnage
    //...........code ici...........................
    //this.Sprite.body.setSize(25, 30, 1, 10);
    this.Sprite.body.collideWorldBounds = true;

    //caracteristique du sprite
    this.Sprite.anchor.setTo(0.5, 0.5);
    //this.Sprite.scale.setTo(0.5);
    this.detected = false;
};


Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;


NPC.prototype.movePlayer = function(pad){
    var left =  (cursors.left.isDown || pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1);
    var right = (cursors.right.isDown || pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1);
    var up =    (cursors.up.isDown || pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) ;
    var down =  (cursors.down.isDown || pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) ;
    // mouvements annulés

    if(left == true && right == true){
        left = false;
        right = false;
    }
    if(up == true && down == true){
        up = false;
        down = false;
    }
    
    if(this.Sprite.x > game.width - 20)right = false;
    if(this.Sprite.x < 20) left = false;
    if(this.Sprite.y > game.height - 30)down = false;
    if(this.Sprite.y < 30)up = false;

       //diagonales : 2 input non opposé
    if( left && up ){
        this.Sprite.x -= v;
        this.Sprite.y -= v;
        this.Sprite.animations.play('left');
        return;

    }
    if( left && down ){
        this.Sprite.x -= v;
        this.Sprite.y += v;
        this.Sprite.animations.play('left');
        return;
    }
    if( right && up ){
        this.Sprite.x += v;
        this.Sprite.y -= v;
        this.Sprite.animations.play('right');
        return;
    }
    if( right && down ){
        this.Sprite.x += v;
        this.Sprite.y += v;
        this.Sprite.animations.play('right');
        return;
    }
    //direction simple 1 ou 3 input
    if( left ){
        this.Sprite.x -= Math.sqrt(2) * v;
        this.Sprite.animations.play('left');
        return;
    }
    if( right ){
        this.Sprite.x += Math.sqrt(2) * v;
        this.Sprite.animations.play('right');
        return;
    }
    if(up){
        this.Sprite.y -= Math.sqrt(2) * v;
        this.Sprite.animations.play('up');
        return;
    }
    if( down ){
        this.Sprite.y += Math.sqrt(2) * v;
        this.Sprite.animations.play('down');
        return;
    }
    // si pas d'input ou input opposé
    this.Sprite.animations.stop();
}
