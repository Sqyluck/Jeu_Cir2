var mess;
var levelState = {
	create: function(){
		console.log(lvlunblock);
    	if(lvlunblock != 1){//Lvl1
    				console.log(lvlunblock);

	    	var lvl1disp = game.add.button(game.width/3 -53, game.height/4 -20, 'level1', this.level1, this, 1, 0);
			//Lvl2
			if(lvlunblock >= 2){
				var lvl2disp = game.add.button(game.width/3 -53, game.height/2 -20, 'level2', this.level2, this, 1, 0);
			}else{
				var lvl2disp = game.add.button(game.width/3 -53, game.height/2 -20, 'level2', this.message, this, 2, 2);
			}
			//Lvl3
			if(lvlunblock >= 3){
				var lvl3disp = game.add.button(game.width/3 -53, 3*game.height/4 -20, 'level3', this.level3, this, 1, 0);
			}else{
				var lvl3disp = game.add.button(game.width/3 -53, 3*game.height/4 -20, 'level3', this.message, this, 2, 2);
			}
			//Lvl4
			if(lvlunblock >= 4){
				var lvl4disp = game.add.button(2*game.width/3 -53, game.height/4 -20, 'level4', this.level4, this, 1, 0);
			}else{
				var lvl4disp = game.add.button(2*game.width/3 -53, game.height/4 -20, 'level4', this.message, this, 2, 2);
			}
			//Lvl5
			if(lvlunblock >= 5){
				var lvl5disp = game.add.button(2*game.width/3 -53, game.height/2 -20, 'level5', this.level5, this, 1, 0);
			}else{
				var lvl5disp = game.add.button(2*game.width/3 -53, game.height/2 -20, 'level5', this.message, this, 2, 2);
			}
			//Lvl6
			if(lvlunblock == 6){
				var lvl6disp = game.add.button(2*game.width/3 -53, 3*game.height/4 -20, 'level6', this.level6, this, 1, 0);
			}else{
				var lvl6disp = game.add.button(2*game.width/3 -53, 3*game.height/4 -20, 'level6', this.message, this, 2, 2);
			}
		}else{
			var lvl1disp = game.add.button(game.world.centerX, 3*game.height/4, 'level1', this.level1, this, 1, 0);
			var messa = game.add.text(10, 10,"This is the BDE campaign week’s, both lists are trying their best to please everyone.",{font: '30px Arial', fill: '#ffffff'}) ;
			messa = game.add.text(10, 50," Student from all promotions are having fun.",{font: '30px Arial', fill: '#ffffff'}) ;
			messa = game.add.text(10, 90," According to the sondage, the popularity of the Asterix’en is rising extremely fast.",{font: '30px Arial', fill: '#ffffff'}) ;
			messa = game.add.text(10, 130," Those who had no opinion yet seems to support this list.",{font: '30px Arial', fill: '#ffffff'}) ;
			messa = game.add.text(10, 170," For you, nothing really explain that.",{font: '30px Arial', fill: '#ffffff'}) ;
			messa = game.add.text(10, 210," Therefore, as a member of the Journal’Isen, you have the feeling that you could make a good article on that,",{font: '30px Arial', fill: '#ffffff'}) ;
			messa = game.add.text(10, 250," so you decide to investigate on that subject.",{font: '30px Arial', fill: '#ffffff'}) ;
			messa = game.add.text(10, 290," You suspect members of Asterix’en to use propaganda by putting mask on student faces.",{font: '30px Arial', fill: '#ffffff'}) ;
			messa = game.add.text(10, 340," Try to find proofs of that in common places of Isen.",{font: '30px Arial', fill: '#ffffff'}) ;


		}
		var home = game.add.button(20, game.height/2, 'back', this.restart, this, 0, 1);

		mess = game.add.text(game.width/3, 10,'Finish the previous level',{font: '30px Arial', fill: '#ffffff'});
		mess.visible = false;
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
	message: function(){
		mess.visible = true;
	},
	
	removeMessage:function(){
		mess.visible = false;
	},
	update: function(){
		game.input.onDown.addOnce(this.removeMessage, this);
	},
	restart: function() {
		game.state.start('menu');
	}
};
