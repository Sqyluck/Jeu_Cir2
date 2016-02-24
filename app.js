Obstacles = function (game) {
    frame = game.rnd.between(0, 35);/*  //Just because we don't want a false chilli (frame 17)if (frame === 17){frame = 1;}*/
    var x = game.rnd.between(100, 770);
    var y = game.rnd.between(0, 570);

    Phaser.Sprite.call(this, game, x, y, 'obstacle', frame);
    game.physics.arcade.enable(this);

};

Obstacles.prototype = Object.create(Phaser.Sprite.prototype);
Obstacles.prototype.constructor = Obstacles;

Ennemi = function (game) {
    var x = game.rnd.between(100, 770);
    var y = game.rnd.between(0, 570);

    Phaser.Sprite.call(this, game, x, y, 'phaser', 1);
    game.physics.arcade.enable(this);

};

Ennemi.prototype = Object.create(Phaser.Sprite.prototype);
Ennemi.prototype.constructor = Ennemi;

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('phaser', 'phasers/examples/assets/sprites/phaser-dude.png');
    game.load.spritesheet('obstacle', 'phasers/examples/assets/sprites/fruitnveg32wh37.png', 32, 32);

}

var sprite;
var platforms;
var group2;
var cursors;
var killspace;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#2d2d2d';

    platforms = game.add.physicsGroup();
    group2 = game.add.group();
    
    for (var i = 0; i < 70; i++)
    {
        if (i < 50)
        {
            platforms.add(new Obstacles(game));
        }
        else
        {
            group2.add(new Ennemi(game));
        }
    }

    //  Our player
    sprite = game.add.sprite(32, 200, 'phaser');
    game.physics.arcade.enable(sprite);
    sprite.body.collideWorldBounds = true;
    platforms.setAll('body.immovable', true);
    group2.setAll('body.immovable', true);

    cursors = game.input.keyboard.createCursorKeys();
    killspace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {
    game.physics.arcade.collide(sprite, platforms);
    if(killspace.isDown){
     game.physics.arcade.overlap(sprite, group2, collisionHandler, null, this);
    }
    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.left.isDown){
        sprite.body.velocity.x = -200;
    }
    else if (cursors.right.isDown){
        sprite.body.velocity.x = 200;
    }

    if (cursors.up.isDown){
        sprite.body.velocity.y = -200;
    }
    else if (cursors.down.isDown){
        sprite.body.velocity.y = 200;
    }
}

function collisionHandler (player, Ennemi) {
    //  If the player collides with a chilli it gets eaten :)
        Ennemi.kill();
}
