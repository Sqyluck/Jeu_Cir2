var startState = {
	create: function(){

		var intro = game.add.text(0, 0, 'Choose a team...',{font: '25px Arial', fill: '#ffffff'});
		var funcky = game.add.button(game.width/8-100, game.height/2 -200, 'flogo', this.funckymember, this);
        var asterix = game.add.button(100+game.width/2, game.height/2 -180, 'alogo', this.asterixmember, this);
        funcky.scale.setTo(0.5, 0.5);
        asterix.scale.setTo(0.45, 0.45);
	},

	funckymember: function() {
    	choice = 'funcky';
    	game.state.start('menu');
	},

	asterixmember: function() {
    	choice = 'asterix';
    	game.state.start('menu');
	}
};