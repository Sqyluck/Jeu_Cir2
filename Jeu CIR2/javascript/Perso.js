var NPC = function(skin){
    //création du sprite a une position aléatoire
    this.Sprite = game.add.sprite(game.rnd.between(30, 770), game.rnd.between(30, 570), skin);

    //les differents mouvement du sprite
    this.Sprite.animations.add('right',[8,9,10,11],10,true);
    this.Sprite.animations.add('left',[4,5,6,7],10,true);
    this.Sprite.animations.add('up',[12,13,14,15],10,true);
    this.Sprite.animations.add('down',[0,1,2,3],10,true);

    //collision
    game.physics.arcade.enable(this.Sprite,true);
    //Phillipe je te dédie cette ligne pour que tu puisse mettres la hitbox de nos NPCnnage
    //...........code ici...........................
    //this.Sprite.body.setSize(25, 30, 1, 10);
    this.Sprite.body.collideWorldBounds = true;

    //caracteristique du sprite
    this.Sprite.anchor.setTo(0.5, 0.5);
    //this.Sprite.scale.setTo(0.5);

    //temps d'attente de base
    this.wait = game.rnd.between(0, 50);

    //point d'arrivé
    this.arriveex = game.rnd.between(50, 750);
    this.arriveey = game.rnd.between(50, 550);
};

NPC.prototype = Object.create(Phaser.Sprite.prototype);
NPC.prototype.constructor = NPC;

NPC.prototype.moveToXY = function(x, y){

    //si le point d'arrivée n'est pas en diagonale, on avance en ligne droite
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

NPC.prototype.randomMove = function(){
    // si le temps d'attente est fini on bouge jusqu'au point suivant
    if(this.wait == 0){
        //si le point d'arrivée n'est pas atteind, on continue vers ce point
        if( (Math.abs(this.Sprite.x - this.arriveex) > 5) && (Math.abs(this.Sprite.y - this.arriveey) > 5) ){
            this.moveToXY(this.arriveex, this.arriveey);
        }else{//sinon ou on attend, ou on cherche un point proche pur la prohaine destinantion, ou un point éloigné
            this.Sprite.animations.stop();
            var choix = game.rnd.between(0, 100);
            if(choix < 50){
                this.wait = game.rnd.between(0, 60);
            }
            if( (choix < 80)&&(choix >= 50) ){
                this.findClosePoint();
                this.moveToXY(this.arriveex, this.arriveey);
            }
            if(choix >= 80){
                this.findDistantPoint();
                this.moveToXY(this.arriveex, this.arriveey);
            }
        }
    }else{
        this.wait --;
    }
}

NPC.prototype.findClosePoint = function(){
    var x = game.rnd.between(30, 770);
    var y = game.rnd.between(30, 570);
    while(Math.sqrt(Math.pow(this.Sprite.x - x, 2) + Math.pow(this.Sprite.y - y, 2) ) >= 150){
        x = game.rnd.between(30, 770);
        y = game.rnd.between(30, 570);
    }
    this.arriveex = x;
    this.arriveey = y;
}
// procedure pour trouver un point éloigné
NPC.prototype.findDistantPoint = function(){
    var x = game.rnd.between(30, 770);
    var y = game.rnd.between(30, 570);
    while(Math.sqrt(Math.pow(this.Sprite.x - x, 2) + Math.pow(this.Sprite.y - y, 2) ) <= 250){
        x = game.rnd.between(30, 770);
        y = game.rnd.between(30, 570);
    }
    this.arriveex = x;
    this.arriveey = y;
}

var Player = function(skin){
    //création du sprite a une position aléatoire
    this.Sprite = game.add.sprite(game.rnd.between(30, 770), game.rnd.between(30, 570), skin);

    //les differents mouvement du sprite
    this.Sprite.animations.add('right',[8,9,10,11],10,true);
    this.Sprite.animations.add('left',[4,5,6,7],10,true);
    this.Sprite.animations.add('up',[12,13,14,15],10,true);
    this.Sprite.animations.add('down',[0,1,2,3],10,true);

    //collision
    game.physics.arcade.enable(this.Sprite,true);
    //Phillipe je te dédie cette ligne pour que tu puisse mettres la hitbox de nos NPCnnage
    //...........code ici...........................
    //this.Sprite.body.setSize(25, 30, 1, 10);
    this.Sprite.body.collideWorldBounds = true;

    //caracteristique du sprite
    this.Sprite.anchor.setTo(0.5, 0.5);
    //this.Sprite.scale.setTo(0.5);
};


Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.movePlayer = function(){
    //direction simple 1 ou 3 input
    if( (cursors.left.isDown)&&(cursors.right.isUp)&&(cursors.up.isUp == cursors.down.isUp) ){
        if(this.Sprite.x - Math.sqrt(2) * v > 30){
            this.Sprite.x -= Math.sqrt(2) * v;
            this.Sprite.animations.play('left');
            return;
        }
    }
    if( (cursors.left.isUp)&&(cursors.right.isDown)&&(cursors.up.isUp == cursors.down.isUp) ){
        if(this.Sprite.x + Math.sqrt(2) < 770){
            this.Sprite.x += Math.sqrt(2) * v;
            this.Sprite.animations.play('right');
            return;
        }
    }
    if( (cursors.left.isUp == cursors.right.isUp)&&(cursors.up.isDown)&&(cursors.down.isUp) ){
        if(this.Sprite.y - Math.sqrt(2) * v > 30){
            this.Sprite.y -= Math.sqrt(2) * v;
            this.Sprite.animations.play('up');
            return;
        }
    }
    if( (cursors.left.isUp == cursors.right.isUp)&&(cursors.up.isUp)&&(cursors.down.isDown) ){
        if(this.Sprite.y + Math.sqrt(2) * v < 570){
            this.Sprite.y += Math.sqrt(2) * v;
            this.Sprite.animations.play('down');
            return;
        }
    }
    //diagonales : 2 input non opposé
    if( (cursors.left.isDown)&&(cursors.up.isDown) ){
        if((this.Sprite.x - v > 30)&&(this.Sprite.y - v > 30)){
            this.Sprite.x -= v;
            this.Sprite.y -= v;
            this.Sprite.animations.play('left');
            return;
        }
    }
    if( (cursors.left.isDown)&&(cursors.down.isDown) ){
        if((this.Sprite.x - v > 30)&&(this.Sprite.y + v < 570)){
            this.Sprite.x -= v;
            this.Sprite.y += v;
            this.Sprite.animations.play('left');
            return;
        }
    }
    if( (cursors.right.isDown)&&(cursors.up.isDown) ){
        if((this.Sprite.x + v < 770)&&(this.Sprite.y - v > 30)){
            this.Sprite.x += v;
            this.Sprite.y -= v;
            this.Sprite.animations.play('right');
            return;
        }
    }
    if( (cursors.right.isDown)&&(cursors.down.isDown) ){
        if((this.Sprite.x + v < 770)&&(this.Sprite.y + v < 570)){
            this.Sprite.x += v;
            this.Sprite.y += v;
            this.Sprite.animations.play('right');
            return;
        }
    }
    // si pas d'input ou input opposé
    this.Sprite.animations.stop();
}
