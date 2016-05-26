var homeState = {

	create: function() {
		var cover = game.add.tileSprite(game.world.centerX, game.world.centerY, 1920, 1440, 'cover');
		cover.anchor.setTo(0.5);
		cover.scale.x = (game.width)/(cover.width);
		cover.scale.y = (game.height)/(cover.height);
		cover.animations.add('coverMove', [0,1,0,1,1,1,1,1,0,1,0,2], 10, false);
		cover.animations.play('coverMove');

		var text = game.add.text(game.world.centerX, game.world.centerY * 1.7, 'click to play', {font: '30px Arial', fill: '#ffffff'});
		text.anchor.setTo(0.5);

		game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		game.input.onDown.add(this.goFull, this);


	},

	goFull: function () {

	    if (game.scale.isFullScreen)
	    {
	        game.scale.stopFullScreen();
	    }
	    else
	    {
	        game.scale.startFullScreen(false);
	    }
	    this.restart();
	},
	
	update: function() {
		
	},

	restart: function() {
		//plein écran
		game.state.start('menu');

	}
};
