var multiState = {
    create: function(){

    
    //---------------------------------------------------------------------------------------------------------------------------------------
        var startLabel = game.add.text(game.width/2, game.height -40, 'Press SPACE', {font: '25px Arial', fill: '#ffffff'});
        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        wkey.onDown.addOnce(this.restart, this);
        startLabel.stroke = '#000000';
        startLabel.strokeThickness = 3;

    },

    restart: function() {
        game.state.start('menu');
    }

};
