var startState = {
	create: function(){

		var playOnline = game.add.button(game.width/2-100, game.height/3, 'playOnline', this.online, this, 1, 0);
		var playOffline = game.add.button(game.width/2-100, 2*game.height/3, 'playOffline', this.offline, this, 1, 0);
		var home = game.add.button(20, game.height/2, 'back', this.restart, this, 0, 1);

	},

	online: function() {
    	
    	game.state.start('multi');
	},

	offline: function() {
    	
    	game.state.start('optio');
	},	
	restart: function() {
		game.state.start('menu');
	}
};
