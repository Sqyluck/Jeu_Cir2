var succesState = {

	create: function() {

		var winLabel = game.add.text(80, 80, 'Succes',{font: '50px Arial', fill:'#00FF00'});
		var startLabel = game.add.text(80,180, 'press Space to exit', {font: '25px Arial', fill: '#ffffff'});

		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		wkey.onDown.addOnce(this.restart, this);
	},

	restart: function() {
		game.state.start('menu');
	}
};