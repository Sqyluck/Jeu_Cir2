//Variables pour texte
var NPCS;
var TIME;
var AMMOS;
//Boutons
var Ready;
var ok;
var modif;
var Default;
var home;

var optioState = {

	create: function() {

		var settings;
		var soundLabel;

		if(choice == 'funcky'){

			settings = game.add.sprite(game.width/2 -150, 0, 'foptio',0);
			settings.scale.setTo(0.3, 0.3);

			soundLabel = game.add.text(50, settings.height+50, 'Sound : ', {font: '25px Arial', fill: '#ffffff'});
			NPCS = game.add.text(game.width/2, settings.height+50, 'NPCS : '+npcsinit, {font: '25px Arial', fill: '#ffffff'});
			AMMOS = game.add.text(game.width/2, settings.height+100, 'Films : '+ammoinit, {font: '25px Arial', fill: '#ffffff'});
			TIME = game.add.text(50, settings.height+100, 'Time : '+timeinit, {font: '25px Arial', fill: '#ffffff'});


	        home = game.add.button(50, 450, 'fhome', this.restart, this, 0, 1);
	        home.scale.setTo(0.25, 0.25);
			modif = game.add.button(100+game.width/2, 450, 'fmodif', this.Showchange, this, 0, 1);
	        modif.scale.setTo(0.25, 0.25);
	        ok = game.add.button(100+game.width/2, 450, 'fok', this.Hidechange, this, 0, 1);
	        ok.scale.setTo(0.25, 0.25);
	        Default = game.add.button(game.width/2-150, 450, 'fdefault', this.reinit, this, 0, 1);
	        Default.scale.setTo(0.25, 0.25);
		}
		else//------------------Changement BDE----------------------------------------------------------------- 
		{
			settings = game.add.sprite(game.width/2 -144, 0, 'aoptio',0);
			settings.scale.setTo(0.7, 0.7);

			NPCS = game.add.text(game.width/2-50, settings.height+50, 'NPCS : '+npcsinit, {font: '25px Arial', fill: '#ffffff'});
			AMMOS = game.add.text(game.width/2-50, settings.height+100, 'Films : '+ammoinit, {font: '25px Arial', fill: '#ffffff'});
			//TIME = game.add.text(50, settings.height+100, 'Time : '+killerinit, {font: '25px Arial', fill: '#ffffff'});

			var home = game.add.button(20, game.height/2, 'back', this.restart, this, 0, 1);
			modif = game.add.button(2*game.width/3 -103, 440, 'amodif', this.Showchange, this, 0, 1);
	        modif.scale.setTo(0.5, 0.5);
	        ok = game.add.button(2*game.width/3 -103, 440, 'aok', this.Hidechange, this, 0, 1);
	        ok.scale.setTo(0.5, 0.5);
	        Default = game.add.button(game.width/2-150, 440, 'adefault', this.reinit, this, 0, 1);
	        Default.scale.setTo(0.5, 0.5);
		}
			Ready = game.add.button(3*game.width/4, 450, 'play', this.startGame, this, 1, 0);
	        Default.visible = false;
	        ok.visible = false;
	        home.visible = true;
	},
	
	startGame: function () {
		modif.visible = false;
        ok.visible = true;
		Default.visible = true;
		$("#modif").hide();
		killerinit = 3;
		lvlrun = 0;
		game.state.start('solo');
    },

	Showchange: function () {
		modif.visible = false;
        ok.visible = true;
		Default.visible = true;
		$("#modif").show();
    },

    Hidechange:function(){
		ok.visible = false;
		Default.visible = false;
		$("#modif").hide();
    	modif.visible = true;
		var tempkillers = killerinit;
		var tempnpc = npcsinit;
		var tempammo = ammoinit;

		getFilm();
		//getKillers();
		getnpcs();

		/*if(killerinit <= 0 || killerinit > 3) {
			alert('killer error :'+killerinit);
			killerinit = tempkillers;
		}*/
		if(npcsinit <= 0) {
			alert('Npc error :'+npcsinit);
			npcsinit = tempnpc;
		}
		if(ammoinit <= 0) {
			alert('Film error :'+ammoinit);
			ammoinit = tempammo;
		}
    },

    reinit: function(){
    	timeinit = 120;
		npcsinit = 20;
		ammoinit = 3;
		killerinit = 4;
		ok.visible = false;
		Default.visible = false;
    	modif.visible = true;
    	home.visible = true;
		$("#modif").hide();
    },

	restart: function() {
		$("#modif").hide();
        game.state.start('menu');
    },
    
    update: function(){
        NPCS.setText('Npcs : '+npcsinit);
        //TIME.setText('Killers : '+killerinit);
        AMMOS.setText('Films : '+ammoinit);
    }
};
