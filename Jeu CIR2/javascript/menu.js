var menuState = {

    create: function() {
        
        game.stage.backgroundColor = '#182d3b';

        //Position des boutons
        var solo = game.add.button(game.world.centerX -41, game.world.centerY -100, 'solo', this.solo, this, 1, 0);
        var multi = game.add.button(game.world.centerX -75, game.world.centerY, 'multi', this.multi, this, 1, 0);
        var succes = game.add.button(game.world.centerX -55, game.world.centerY +100, 'succes', this.succes, this, 1, 0);
        var optio = game.add.button(game.world.centerX -58, game.world.centerY +200, 'options', this.optio, this, 1, 0);

    },

    up: function() {
        console.log('solo up', arguments);
        console.log('multi up', arguments);
        console.log('succes up', arguments);
        console.log('optio up', arguments);
    },

    over: function() {
        console.log('solo over');
        console.log('multi over');
        console.log('succes over');
        console.log('optio over');
    },

    out: function() {
        console.log('solo out');
        console.log('multi out');
        console.log('succes out');
        console.log('optio out');
    },

    solo: function () {

        game.state.start('solo');
    },

    multi: function(){
        game.state.start('multi');
    },

    succes: function(){
        game.state.start('succes');
    },

    optio: function(){
        game.state.start('optio');
    }
};