var levelState = {
	create: function(){

    	switch(lvlunblock)
    	{
    		case 1:
				var lvl1disp = game.add.button(game.width/2-100, game.height/2 -200, 'level1', this.level1, this, 1, 0);
				var lvl2disp = game.add.button(game.width/2-100, game.height/2, 'level2', this.update, this, 2, 2);
				var lvl3disp = game.add.button(game.width/2-100, game.height/2 +200, 'level3',  this.update, this, 2, 2);
    			break;
			case 2:
				var lvl1disp = game.add.button(game.width/2-100, game.height/2 -200, 'level1', this.level0, this, 1, 0);
				var lvl2disp = game.add.button(game.width/2-100, game.height/2, 'level2', this.level2, this, 1, 0);
				var lvl3disp = game.add.button(game.width/2-100, game.height/2 +200, 'level3',  this.update, this, 2, 2);
    			break;
			case 3:
				var lvl1disp = game.add.button(game.width/2-100, game.height/2 -200, 'level1', this.level1, this, 1, 0);
				var lvl2disp = game.add.button(game.width/2-100, game.height/2, 'level2', this.level2, this, 1, 0);
				var lvl3disp = game.add.button(game.width/2-100, game.height/2 +200, 'level3',  this.level3, this, 1, 0);
    			break;

    	}
	},
	level0: function() {
	lvlrun = 0;
	killerinit = 2;
	game.state.start('solo');
	},
	level1: function() {
	lvlrun = 1;
    	killerinit = 1;
    	timeinit = 60;
    	npcsinit = 10;
    	ammoinit = 1;
		game.state.start('solo');
	},

	level2: function() {
	lvlrun = 2;
	killerinit = 1;
    	timeinit = 60;
    	npcsinit = 30;
    	ammoinit = 3;
		game.state.start('solo');
	},

	level3: function() {
	lvlrun = 3;
	killerinit = 1;
    	timeinit = 60;
    	npcsinit = 10;
    	ammoinit = 3;
		game.state.start('solo');    	
	},
	level4: function() {
	lvlrun = 4;
	killerinit = 1;
    	timeinit = 80;
    	npcsinit = 30;
    	ammoinit = 5;
		game.state.start('solo');    	
	},
	level5: function() {
	lvlrun = 5;
	killerinit = 1;
    	timeinit = 60;
    	npcsinit = 10;
    	ammoinit = 3;
		game.state.start('solo');    	
	},
	level6: function() {
	lvlrun = 6;
	killerinit = 1;
    	timeinit = 120;
    	npcsinit = 30;
    	ammoinit = 3;
		game.state.start('solo');    	
	},
	update: function(){

	}
};
