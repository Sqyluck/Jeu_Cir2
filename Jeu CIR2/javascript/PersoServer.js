var animation = function(sprite){
    sprite.animations.add('right',[8,9,10,11],10,true);
    sprite.animations.add('left',[4,5,6,7],10,true);
    sprite.animations.add('up',[12,13,14,15],10,true);
    sprite.animations.add('down',[0,1,2,3],10,true);
}

var NPCServer = function(game, skin, x, y){
    //création du sprite a une position aléatoire
    this.Sprite = game.add.sprite(x, y, skin);

    //les differents mouvement du sprite
    animation(this.Sprite);
    this.Sprite.name = skin;

    //collision
    game.physics.arcade.enable(this.Sprite,true);

    this.Sprite.body.collideWorldBounds = true;

    //caracteristique du sprite
    this.Sprite.anchor.setTo(0.5, 0.5);

    this.Sprite.alive = true;
    this.detected = false;
    this.Sprite.recentlyDead = false;
    this.out = false;
};

NPCServer.prototype = Object.create(Phaser.Sprite.prototype);
NPCServer.prototype.constructor = NPCServer;

NPCServer.prototype.IsDetected = function(detected){
        if(detected){
            this.detected = true;
            this.Sprite.name = this.Sprite.name.substring(0, this.Sprite.name.length - 4);
            var frame = this.Sprite.frame;
            this.Sprite.loadTexture(this.Sprite.name);
            this.Sprite.frame = frame;
            animation(this.Sprite);

        }else{
            this.detected = false;
            this.Sprite.name += 'dark';
            var frame = this.Sprite.frame;
            this.Sprite.loadTexture(this.Sprite.name);
            this.Sprite.frame = frame;
            animation(this.Sprite);
        }
}

var PlayerServer = function(game, skin, x, y){
    //création du sprite a une position aléatoire
    this.Sprite = game.add.sprite(x, y, skin);

    //les differents mouvement du sprite
    animation(this.Sprite);

    this.moveOnX = 0;
    this.moveOnY = 0;
    this.animation = '';
    this.Sprite.name = skin;
    //collision
    game.physics.arcade.enable(this.Sprite,true);

    this.Sprite.body.collideWorldBounds = true;

    //caracteristique du sprite
    this.Sprite.anchor.setTo(0.5, 0.5);
    //this.Sprite.scale.setTo(0.5);
    this.detected = false;
};
NPCServer.prototype.willDie = function(){
    if(this.Sprite.y > game.height - 40)  this.Sprite.kill();
    else this.moveToXY(game.width/2, game.height-30);
}

PlayerServer.prototype = Object.create(Phaser.Sprite.prototype);
PlayerServer.prototype.constructor = PlayerServer;

PlayerServer.prototype.IsDetected = function(detected){
        if(detected){
            this.detected = true;
            this.Sprite.name = this.Sprite.name.substring(0, this.Sprite.name.length - 4);
            var frame = this.Sprite.frame;
            this.Sprite.loadTexture(this.Sprite.name);
            this.Sprite.frame = frame;
            animation(this.Sprite);

        }else{
            this.detected = false;
            this.Sprite.name += 'dark';
            var frame = this.Sprite.frame;
            this.Sprite.loadTexture(this.Sprite.name);
            this.Sprite.frame = frame;
            animation(this.Sprite);
        }
}

PlayerServer.prototype.movePlayer = function(){
    var v = 1;
    var left = cursors.left.isDown;
    var right = cursors.right.isDown;
    var up = cursors.up.isDown;
    var down = cursors.down.isDown;
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
        this.moveOnX = - v;
        this.moveOnY = - v;
        this.animation = 'left';
        return;

    }
    if( left && down ){
        this.moveOnX = - v;
        this.moveOnY = v;
        this.animation = 'left';
        return;
    }
    if( right && up ){
        this.moveOnX = v;
        this.moveOnY = - v;
        this.animation = 'right';
        return;
    }
    if( right && down ){
        this.moveOnX = v;
        this.moveOnY = v;
        this.animation = 'right';
        return;
    }
    //direction simple 1 ou 3 input
    if( left ){
        this.moveOnX = - Math.sqrt(2) * v;
        this.moveOnY = 0;
        this.animation = 'left';
        return;
    }
    if( right ){
        this.moveOnX = Math.sqrt(2) * v;
        this.moveOnY = 0;
        this.animation = 'right';
        return;
    }
    if(up){
        this.moveOnX = 0;
        this.moveOnY = - Math.sqrt(2) * v;
        this.animation = 'up';
        return;
    }
    if( down ){
        this.moveOnX = 0;
        this.moveOnY = Math.sqrt(2) * v;
        this.animation = 'down';
        return;
    }
    // si pas d'input ou input opposé
    this.moveOnX = 0;
    this.moveOnY = 0;
    //console.log('stop');
    this.animation = '';
}
