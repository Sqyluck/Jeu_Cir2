var startState = {
	create: function(){

		var playOnline = game.add.button(game.width/2-100, game.height/2 -200, 'playOnline', this.online, this, 1, 0);
		var playOffline = game.add.button(game.width/2-100, game.height/2, 'playOffline', this.offline, this, 1, 0);
	},

	online: function() {
    	
    	game.state.start('multi');
	},

	offline: function() {
    	
    	game.state.start('level');
	}
};