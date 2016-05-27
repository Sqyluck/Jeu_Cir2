var menuState = {

    create: function() {
        
        var logo;
        var solo;
        var multi;
        var succes;
        var optio;

        if(choice == 'funcky'){
            logo = game.add.sprite(game.width/2 -150,-10, 'flogo');
            logo.scale.setTo(0.3, 0.3);

            //Position des boutons
            solo = game.add.button(game.width/4 -50, 250, 'fsolo', this.solo, this, 0, 1);
            multi = game.add.button(100+game.width/2, 250, 'fmulti', this.multi, this, 0, 1);
            succes = game.add.button(game.width/4 -50, 450, 'fsucces', this.succes, this, 0, 1);
            optio = game.add.button(100+game.width/2, 450, 'foptio', this.optio, this, 0, 1);
            
            //Echelle
            solo.scale.setTo(0.25, 0.25);
            multi.scale.setTo(0.25, 0.25);
            succes.scale.setTo(0.25, 0.25);
            optio.scale.setTo(0.25, 0.25);
        }
        else//------------------Changement BDE----------------------------------------------------------------- 
        {
           logo = game.add.sprite(game.world.centerX, 150, 'logo');
           logo.anchor.setTo(0.5,0.5);
           logo.scale.setTo(0.7, 0.7);

            //Position des boutons
            solo = game.add.button(game.width/3 -103, 340, 'asolo', this.solo, this, 0, 1);
            multi = game.add.button(2*game.width/3 -103, 340, 'amulti', this.multi, this, 0, 1);
            //succes = game.add.button(game.width/3 -103, 440, 'asucces', this.succes, this, 0, 1);
            //optio = game.add.button(2*game.width/3 -103, 440, 'aoptio', this.optio, this, 0, 1);
            
            //Echelle
            solo.scale.setTo(0.5, 0.5);
            multi.scale.setTo(0.5, 0.5);
            //succes.scale.setTo(0.5, 0.5);
            //optio.scale.setTo(0.5, 0.5);
        }
    },

    solo: function () {
        game.state.start('level');
    },

    multi: function(){
        game.state.start('start');
    },

    succes: function(){
        game.state.start('succes');
    },

    optio: function(){
        game.state.start('optio');
    }
};
