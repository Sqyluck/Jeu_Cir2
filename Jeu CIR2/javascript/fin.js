var finState = {
var finState = {

	create: function() {

			
		if(gameLength > 0) 
		{
			var winner = game.add.sprite(game.width/2 -240, 10, 'fwon');
		}
		else
		{
			var winner = game.add.sprite(game.width/2 -240, 10, 'flost');
		}
		
		winner.scale.setTo(0.5, 0.5);
		var staytime = game.add.text(game.width/2, winner.height+10, 'Remaining Time : '+gameLength, {font: '25px Arial', fill: '#ffffff'});
		var staynpcs = game.add.text(50, winner.height+10, 'Remaining Npcs : '+npcsLeft+'/'+npcs, {font: '25px Arial', fill: '#ffffff'});
		var stayammo = game.add.text(50, winner.height+100, 'Remaining Ammo : '+ammoLeft+'/'+ammo, {font: '25px Arial', fill: '#ffffff'});
		var staykiller = game.add.text(50, winner.height+190, 'Remaining Killers : '+killersLeft+'/'+killers, {font: '25px Arial', fill: '#ffffff'});
		var scoreLabel = game.add.text(game.width/2, winner.height+100, 'Score : ', {font: '25px Arial', fill: '#ffffff'});
		
		//Remise à zéro des count
		restart = true;

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
