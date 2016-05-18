var succesState = {

	create: function() {

		var achvts;
		var bestLabel;
		var playerLabel;
		var Label1;
		var Label2;
		var Label3;
		var Label4;
		var home;

		if(choice == 'funcky'){

			achvts = game.add.sprite(game.width/2 -150, 0, 'fsucces',0);
			achvts.scale.setTo(0.3, 0.3);

			bestLabel = game.add.text(50, achvts.height+50, 'Best Score : ', {font: '25px Arial', fill: '#ffffff'});
			playerLabel = game.add.text(50, achvts.height+100, 'Player : ', {font: '25px Arial', fill: '#ffffff'});
			Label1 = game.add.text(game.width/2, achvts.height+50, 'Achvt 1 : ', {font: '25px Arial', fill: '#ffffff'});
			Label2 = game.add.text(game.width/2, achvts.height+100, 'Achvt 2 : ', {font: '25px Arial', fill: '#ffffff'});
			Label3 = game.add.text(game.width/2, achvts.height+150, 'Achvt 3 : ', {font: '25px Arial', fill: '#ffffff'});
			Label4 = game.add.text(game.width/2, achvts.height+200, 'Achvt 4 : ', {font: '25px Arial', fill: '#ffffff'});
			home = game.add.button(50, 450, 'fhome', this.restart, this, 0, 1);
        	home.scale.setTo(0.25, 0.25);

		}
		else//------------------Changement BDE----------------------------------------------------------------- 
		{
			achvts = game.add.sprite(game.width/2 -144, 0, 'asucces',0);
			achvts.scale.setTo(0.7, 0.7);

			bestLabel = game.add.text(50, achvts.height+50, 'Best Score : ', {font: '25px Arial', fill: '#ffffff'});
			playerLabel = game.add.text(50, achvts.height+100, 'Player : ', {font: '25px Arial', fill: '#ffffff'});
			Label1 = game.add.text(game.width/2, achvts.height+50, 'Achvt 1 : ', {font: '25px Arial', fill: '#ffffff'});
			Label2 = game.add.text(game.width/2, achvts.height+100, 'Achvt 2 : ', {font: '25px Arial', fill: '#ffffff'});
			Label3 = game.add.text(game.width/2, achvts.height+150, 'Achvt 3 : ', {font: '25px Arial', fill: '#ffffff'});
			Label4 = game.add.text(game.width/2, achvts.height+200, 'Achvt 4 : ', {font: '25px Arial', fill: '#ffffff'});
			home = game.add.button(game.width/4, 425, 'ahome', this.restart, this, 0, 1);
	        home.scale.setTo(0.2, 0.2);
	    }
        
	},

	restart: function() {
		game.state.start('menu');
	}
};
