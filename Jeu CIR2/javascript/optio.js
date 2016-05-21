//Variables pour texte
var NPCS;
var TIME;
var AMMOS;
//Boutons
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
			AMMOS = game.add.text(game.width/2, settings.height+100, 'Ammos : '+ammoinit, {font: '25px Arial', fill: '#ffffff'});
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

			soundLabel = game.add.text(50, settings.height+50, 'Sound : ', {font: '25px Arial', fill: '#ffffff'});
			NPCS = game.add.text(game.width/2, settings.height+50, 'NPCS : '+npcsinit, {font: '25px Arial', fill: '#ffffff'});
			AMMOS = game.add.text(game.width/2, settings.height+100, 'Ammos : '+ammoinit, {font: '25px Arial', fill: '#ffffff'});
			TIME = game.add.text(50, settings.height+100, 'Time : '+timeinit, {font: '25px Arial', fill: '#ffffff'});

	        home = game.add.button(game.width/4, 425, 'ahome', this.restart, this, 0, 1);
	        home.scale.setTo(0.2, 0.2);
			modif = game.add.button(100+game.width/2, 450, 'amodif', this.Showchange, this, 0, 1);
	        modif.scale.setTo(0.25, 0.25);
	        ok = game.add.button(100+game.width/2, 450, 'aok', this.Hidechange, this, 0, 1);
	        ok.scale.setTo(0.25, 0.25);
	        Default = game.add.button(game.width/2-150, 450, 'adefault', this.reinit, this, 0, 1);
	        Default.scale.setTo(0.25, 0.25);
		}
	        Default.visible = false;
	        ok.visible = false;
	        home.visible = true;
	},

	Showchange: function () {
		home.visible = false;
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
		home.visible = true;
		var temptime = timeinit;
		var tempnpc = npcsinit;
		var tempammo = ammoinit;

		getammos();
		getTime();
		getnpcs();

		if(timeinit <= 0) {
			alert('Time error :'+timeinit);
			timeinit = temptime;
		}
		if(npcsinit <= 0) {
			alert('Npc error :'+npcsinit);
			npcsinit = tempnpc;
		}
		if(ammoinit <= 0) {
			alert('Ammo error :'+ammoinit);
			ammoinit = tempammo;
		}
    },

    reinit: function(){
    	timeinit = 60;
		npcsinit = 10;
		ammoinit = 3;
		killerinit = 1;
		ok.visible = false;
		Default.visible = false;
    	modif.visible = true;
    	home.visible = true;
		$("#modif").hide();
    },

	restart: function() {
        game.state.start('menu');
    },
    
    update: function(){
        NPCS.setText('Npcs : '+npcsinit);
        TIME.setText('Time : '+timeinit);
        AMMOS.setText('Ammos : '+ammoinit);
    }
};
