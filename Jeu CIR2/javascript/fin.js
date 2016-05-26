var finState = {

	create: function() {

		var winner = game.add.sprite(game.width/2 -240, 10, 'awon');

		winner.scale.setTo(0.5, 0.5);
		var staynpcs = game.add.text(50, winner.height+10, 'Remaining Npcs : '+npcsLeft+'/'+npcs, {font: '25px Arial', fill: '#ffffff'});
		var stayfilm = game.add.text(50, winner.height+60, 'Remaining Film : '+filmLeft+'/'+film, {font: '25px Arial', fill: '#ffffff'});
		var staykiller = game.add.text(50, winner.height+110, 'Remaining Killers : '+killersLeft+'/'+killers, {font: '25px Arial', fill: '#ffffff'});
		
		//Remise à zéro des count
		restart = true;
		console.log(npcsLeft*100/npcs);
		if(npcsLeft*100/npcs>75 && killersLeft==0 && lvlunblock <= lvlrun) {
			if(lvlrun < 6){
				lvlunblock = lvlrun + 1;
				var text = game.add.text(50, winner.height+210, 'LEVEL '+lvlunblock+' UNLOCK !', {font: '25px Arial', fill: '#ffffff'});
			}else{
				var text = game.add.text(50, winner.height+210, "You finally discovered the evil plan of the Asterix’en. ",{font: '25px Arial', fill: '#ffffff'});
				var text = game.add.text(50, winner.height+250, "Unfortunately, no one really care about your thought so they eventually became the new official BDE of ISEN.",{font: '25px Arial', fill: '#ffffff'});
				var text = game.add.text(50, winner.height+290, "But it’s always great to find the truth when people lie to you, even if sometimes it hurts.",{font: '25px Arial', fill: '#ffffff'}); 
				var text = game.add.text(50, winner.height+330, "However, you can play with your friend and try the multiplayer mode." , {font: '25px Arial', fill: '#ffffff'});

			}
		}else if(npcsLeft*100/npcs<=75) {
			var text = game.add.text(50, winner.height+210, 'YOU LET TOO MUCH STUDENTS GET ASTERIXED, TRY AGAIN !', {font: '25px Arial', fill: '#ffffff'});
		}else if(killersLeft>0) {
			var text = game.add.text(50, winner.height+210, "YOU DIDN'T TAKE A PICTURE OF BDE'S MEMBER, TRY AGAIN !", {font: '25px Arial', fill: '#ffffff'});
		}else{
			var text = game.add.text(50, winner.height+210, 'WOW, AGAIN A GOOD JOB ON LEVEL '+lvlrun+' !', {font: '25px Arial', fill: '#ffffff'});

		}
		var startLabel = game.add.text(game.width/2, game.height -40, 'Press SPACE', {font: '25px Arial', fill: '#ffffff'});
		var wkey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		wkey.onDown.addOnce(this.restart, this);
		startLabel.stroke = '#000000';
	    startLabel.strokeThickness = 3;
	},

	restart: function() {
		game.state.start('level');
	}
};
