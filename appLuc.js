var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('perso', 'assets/perso.png');
    game.load.image('arrivée', 'assets/arrivée.png');
    game.load.image('depart', 'assets/Depart.png');
    game.load.image('obstacle', 'assets/obstacle.png')
    game.load.spritesheet('player1','assets/eleve.png',32, 48);
    game.load.spritesheet('player2','assets/fou.png', 32, 48);
    game.load.spritesheet('player3','assets/prof.png', 32, 48);
    game.load.spritesheet('player4','assets/femme.png', 32, 48);
    game.load.spritesheet('player5','assets/eleve2.png', 32, 48);
    game.load.spritesheet('player6','assets/eleve3.png', 32, 48);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    v = 1;
    nb_perso = 100;
    game.stage.backgroundColor = "#4488AA";
    myArray = [];
    var player = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'];
    cursors = game.input.keyboard.createCursorKeys();
    xd = game.rnd.between(30, 770);
    yd = game.rnd.between(30, 570);

    var k = game.rnd.between(0, nb_perso - 1)
    for(var i = 0; i < 20; i++){
    //    new Obstacles();
    }
    for (var i = 0; i < nb_perso; i++) {
        if(i == k){
            Moi = game.add.sprite(game.rnd.between(30, 570), game.rnd.between(30, 570), player[game.rnd.between(0, 5)]);
            Moi.anchor.setTo(0.5, 0.5);
            //Moi.scale.setTo(0.5);
            Moi.animations.add('right',[8,9,10,11],10,true);
            Moi.animations.add('left',[4,5,6,7],10,true);
            Moi.animations.add('up',[12,13,14,15],10,true);
            Moi.animations.add('down',[0,1,2,3],10,true);
            game.physics.arcade.enable(Moi);
            //Moi.body.setSize(25, 30, 1, 10);
            Moi.body.collideWorldBounds = true;
        }
        myArray.push(new Perso(player[game.rnd.between(0, 5)]));
    }
    killspace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function update() {
    for(var i = 0; i < nb_perso; i++){
        game.physics.arcade.collide(Moi, myArray[i].Sprite);
    }
    if(killspace.isDown){
        for(var i = 0; i < nb_perso; i++){
            game.physics.arcade.overlap(Moi, myArray[i].Sprite, collisionHandler);
        }
    }
    for (var i = 0; i < myArray.length; i++) {
        myArray[i].randomMove();
    }
    movePlayer();
    //render();
}

function collisionHandler (player, Ennemi) {
        Ennemi.kill();
}

function render() {
    //game.debug.text('Temps restant : ' + total, 320, 64);
    game.debug.body(myArray[0].Sprite);
}
