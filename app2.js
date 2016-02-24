Obstacles = function (game) {
    frame = game.rnd.between(0, 1);
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

    Phaser.Sprite.call(this, game, x, y, 'ennemi', 1);
    game.physics.arcade.enable(this);

};

Ennemi.prototype = Object.create(Phaser.Sprite.prototype);
Ennemi.prototype.constructor = Ennemi;

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('player', 'phasers/examples/assets/sprites/phaser-dude.png');
    game.load.image('ennemi', 'phasers/examples/assets/sprites/lemming.png');

    //game.load.spritesheet('obstacle', 'phasers/examples/assets/sprites/fruitnveg32wh37.png', 32, 32);
    game.load.spritesheet('obstacle', 'phasers/examples/assets/sprites/wabbit.png');

}

var player;
var platforms;
var mechants;
var cursors;
var killspace;
var timer;
var total = 10;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    //game.physics.startSystem(Phaser.Physics.P2JS);
    //game.physics.p2.restitution = 0.9;

    game.stage.backgroundColor = '#2d2d2d';

    platforms = game.add.physicsGroup();
    mechants = game.add.group();
    
    for (var i = 0; i < 70; i++){
        if (i < 50){
            platforms.add(new Obstacles(game));
        }
        else{
            //  But a chilli has a physics body
            mechants.add(new Ennemi(game));
        }
    }

    //  Our player
    player = game.add.sprite(32, 200, 'player');
    game.physics.arcade.enable(player);
    //game.physics.p2.enable([ player, obstacle], false);

    player.body.setSize(25, 30, 1, 10);
    player.body.collideWorldBounds = true;
    
    platforms.setAll('body.immovable', true);
    mechants.setAll('body.immovable', true);

    cursors = game.input.keyboard.createCursorKeys();
    killspace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    timer = game.time.create(false);
    timer.loop(1000, updateCounter, this);
    timer.start();


}

function update() {
    game.physics.arcade.collide(player, platforms);
    if(killspace.isDown){
     game.physics.arcade.overlap(player, mechants, collisionHandler, null, this);
    }
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown){
        player.body.velocity.x = -200;
    }
    else if (cursors.right.isDown){
        player.body.velocity.x = 200;
    }

    if (cursors.up.isDown){
        player.body.velocity.y = -200;
    }
    else if (cursors.down.isDown){
        player.body.velocity.y = 200;
    }
    render();
}
function updateCounter() {
    if(total>0) total--;
}
function collisionHandler (player, Ennemi) {
        Ennemi.kill();
}

function render() {
    game.debug.text('Temps restant : ' + total, 32, 64);
    game.debug.body(player);
}
