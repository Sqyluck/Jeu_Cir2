var displayLabel;
var enter;
var change;
var Ready;
var journalist;
var bdeMember;

var multiState = {

    create: function(){
        $('#Login').show();
        displayLabel = game.add.text(100, 100, 'Connection Page',{font: '30px Arial', fill: '#ffffff'});

        //Déclaration des boutons du menu
        enter = game.add.button(game.width/2 +50, game.height/2, 'ready', this.start, this, 1, 0);
        change = game.add.button(game.width/3 -69, game.height/2, 'changeRole', this.chooseRole, this, 1, 0);
        Ready = game.add.button(2*game.width/3 -40, game.height/2, 'play', this.waiting, this, 1, 0);
        journalist = game.add.button(game.width/3 -69, game.height/2, 'journalist', this.journalistChoice, this, 1, 0);
        bdeMember = game.add.button(2*game.width/3 -85, game.height/2, 'bdeMember', this.bdeChoice, this, 1, 0);

        change.visible = false;
        Ready.visible = false;
        journalist.visible = false;
        bdeMember.visible = false;
//------------------------------------Déclaration des npcs/viseurs/killers----------------------------------
        npc = 10;
        nb_photos = 0;
        SpriteArray = {};
        ViseurArray = {};
        maskArray = {};
        PlayerArray = {};
        NpcArray = [];
        cursors = game.input.keyboard.createCursorKeys();
        killspace = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        var skindark = ['player1dark', 'player2dark', 'player3dark'];

        socket.on('data', function(){
            socket.emit('data', {
                nb_npc : npc,
                width : game.width,
                height : game.height
            });
        });

        socket.on('logged', function(user){
            me = user;
        });

        socket.on('typped', function(role){
            me.role = role;
            me.found = false;
        });

        socket.on('connected',function(user){
            if(user.role == ''){
                if(user.ready){
                    console.log(user.pseudo + ' connected' + ' (no role chosen) et pret ' + user.id);
                }else{
                    console.log(user.pseudo + ' connected' + ' (no role chosen) mais pas pret ' + user.id);
                }
            }else{
                if(user.ready){
                    console.log(user.pseudo + ' connected as ' + user.role + ' et pret ' + user.id );
                }else{
                    console.log(user.pseudo + ' connected as ' + user.role + ' mais pas pret '+user.id);
                }
            }
        });

        socket.on('newrole', function(user){
            console.log(user.pseudo + ' is a ' + user.role);
        });

        socket.on('pret', function(user){
            console.log(user.pseudo + ' est prêt.');
            //var txt = game.add.text(300, 0, user.pseudo,{font: '30px Arial', fill: '#ffffff'});
        });

        socket.on('Paspret', function(user){
            console.log(user.pseudo + " n'est pas prêt.");
        });

        socket.on('MissingKiller', function(){
            console.log('il faut au moins un killer pour lancer la partie');
            //socket.emit('Paspret');
        });

        socket.on('MissingGardian', function(){
            console.log('il faut au moins un gardian pour lancer la partie');
            //socket.emit('Paspret');
        });

        socket.on('tsPret', function(){//-------------------------------------------------------------------------------------------
            console.log('tout les joueurs sont prêt');
            
            $('#Login').hide();
            displayLabel.visible = false;
            enter.visible = false;
            Ready.visible = false;
            change.visible = false;
            journalist.visible = false;
            bdeMember.visible = false;

            game.add.tileSprite(0, 0, game.width, game.height, 'background');
            backgroundS = game.add.sprite(0, 0, 'background');
            backgroundS = game.add.sprite(0, 0, 'filtreSombre');

        });

        socket.on('createNPC', function(data){
            NpcArray.push(new NPCServer(game, skindark[data.skin],data.x, data.y));
        });

        socket.on('createBDE', function(data){
            PlayerArray[data.pseudo] = new PlayerServer(game, skindark[data.skin],data.x, data.y);
        });


        var i = 0;
        socket.on('createViseur', function(viseur){
            SpriteArray[viseur.pseudo] = game.add.sprite(0, 0, 'background');
            ViseurArray[viseur.pseudo] = new ViseurServer(viseur.radius, viseur.pseudo);
            ViseurArray[viseur.pseudo].eclairage();
            nb_photos = viseur.nb_photos;
        });

        socket.on('collision', function(id){
            if(me.role == 'BDE'){
                game.physics.arcade.collide(PlayerArray[me.pseudo].Sprite, NpcArray[id].Sprite);
            }
        });

        socket.on('moveNPCToXY', function(NPC){
            NpcArray[NPC.id].Sprite.x += NPC.moveOnX;
            NpcArray[NPC.id].Sprite.y += NPC.moveOnY;
            if(NPC.animation == ''){
                NpcArray[NPC.id].Sprite.animations.stop();
            }else{
                NpcArray[NPC.id].Sprite.animations.play(NPC.animation);
            }
        });

        socket.on('disco', function(player){
            console.log(player.pseudo + ' disconnected');
        });

        socket.on('ActionBDE', function(){
            if( (me.role == 'BDE')&&(me.found == false) ){
                PlayerArray[me.pseudo].movePlayer();
                socket.emit('movePlayer',{
                    moveOnX : PlayerArray[me.pseudo].moveOnX,
                    moveOnY : PlayerArray[me.pseudo].moveOnY,
                    animation : PlayerArray[me.pseudo].animation,
                    pseudo : me.pseudo
                });
            }
        });
        
        socket.on('PlayerFound', function(pseudo){
            if(me.pseudo == pseudo){
                me.found = true;
            }
            PlayerArray[pseudo].alive = false;
        });

        socket.on('ActionViseur', function(){
            if(me.role == 'Journalist'){
                ViseurArray[me.pseudo].moveViseur(game, socket);
            }
        });

        socket.on('IsNPCDetected', function(npc){
            //console.log(npc.detected);
            NpcArray[npc.id].IsDetected(npc.detected);
            if(me.role == 'Journalist'){
                if((npc.detected)&&(NpcArray[npc.id].Sprite.alive == false)&&(NpcArray[npc.id].Sprite.recentlyDead)){
                    socket.emit('willDie', {
                        type : 'npc',
                        id : npc.id,
                        out : true
                    });
                    NpcArray[npc.id].changeSkin();
                    NpcArray[npc.id].Sprite.recentlyDead = false;
                }
            }
        });

        socket.on('NpcDie', function(character){
            if(character.type == 'npc'){
                NpcArray[character.id].Sprite.kill();
            }else{
                PlayerArray[character.id].Sprite.kill();
            }
        });

        socket.on('IsBDEDetected', function(BDE){
            PlayerArray[BDE.id].IsDetected(BDE.detected);
        });

        socket.on('moveViseur', function(viseur){
            ViseurArray[viseur.pseudo].move(viseur);
        });

        socket.on('MistakeOnNpc', function(i){
            NpcArray[i].mistake();
        });

        socket.on('movePlayer', function(player){
            PlayerArray[player.pseudo].Sprite.x += player.moveOnX;
            PlayerArray[player.pseudo].Sprite.y += player.moveOnY;
            if(player.animation == ''){
                PlayerArray[player.pseudo].Sprite.animations.stop();
            }else{
                PlayerArray[player.pseudo].Sprite.animations.play(player.animation);
            }
        });

        socket.on('NPCdied', function(id){
            NpcArray[id].Sprite.alive = false;
            if(me.role == 'BDE'){
                NpcArray[id].changeSkin();
            }else{
                NpcArray[id].Sprite.recentlyDead = true;
            }
        });

        socket.on('BdeWin', function(){
            console.log("Bde win");
        });

        socket.on('JournalistWin', function(){
            console.log("Journalist win");
        });

        nombredetir = 0;
        //Retour menu
        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.M);
        wkey.onDown.addOnce(this.restart, this);
    },
    waiting: function () {
        displayLabel.setText('Please Wait the others players');
        Ready.visible = false;
        socket.emit('pret');
    },

    chooseRole: function () {
        displayLabel.setText('Choose Your Role');
        socket.emit('Paspret');
        $('#Login').hide();
        enter.visible = false;
        Ready.visible = false;
        change.visible = false;
        journalist.visible = true;
        bdeMember.visible = true;
    },

    start: function () {
        socket.emit('login',{
            pseudo: getLogin()});
        enter.visible = false;
        this.chooseRole();
    },

    journalistChoice: function () {
        displayLabel.setText('Confirm Your Role');
        journalist.visible = false;
        bdeMember.visible = false;
        change.visible = true;
        Ready.visible = true;
        socket.emit('role', 'Journalist');
    },

    bdeChoice: function () {
        journalist.visible = false;
        bdeMember.visible = false;
        change.visible = true;
        Ready.visible = true;
        socket.emit('role', 'BDE');
    },

    update: function(){
            var win = false;
            if((killspace.isDown)&&(me.role=='BDE')){
                for(var i = 0; i < npc; i++){
                    game.physics.arcade.overlap(PlayerArray[me.pseudo].Sprite, NpcArray[i].Sprite, this.collisionHandler);
                    if(NpcArray[i].Sprite.recentlyDead){
                        NpcArray[i].Sprite.recentlyDead = false;
                        socket.emit('NPCdied', i);
                    }
                }
            }
/*
            if( (game.input.activePointer.leftButton.isDown)&&(me.role == "Journalist") ){
                ViseurArray[me.pseudo].tempShoot = true;
                if(ViseurArray[me.pseudo].tempShoot == true){
                    ViseurArray[me.pseudo].tempShoot = false;
                    var findsomeone = false;
                    for(var i = 0; i < npc; i++){
                        if(  ( (game.physics.arcade.distanceToPointer(NpcArray[i].Sprite) ) <= (ViseurArray[me.pseudo].radius/2 ) )&&(NpcArray[i].alive) ){
                            NpcArray[i].alive = false;
                            findsomeone = true;
                            socket.emit('willDie', {
                                type : 'npc',
                                id : i,
                                out : true
                            });
                            socket.emit('MistakeOnNpc', i);
                        }
                    }
                    for(var k in PlayerArray){
                            if( (game.physics.arcade.distanceToPointer(PlayerArray[k].Sprite) ) <= (ViseurArray[me.pseudo].radius/2 ) ){
                                findsomeone = true;
                                socket.emit('willDie', {
                                    type : 'bde',
                                    id : k,
                                    out : true
                                });
                            }
                            if(PlayerArray[k].alive == false){
                                win = true;
                            }
                    }


                    if(win){
                        socket.emit('JournalistWin');
                    }
                    if(findsomeone){
                        socket.emit('photo');
                    }
                }
            }
*/
    },

    collisionHandler: function(player, Ennemi) {
        if(Ennemi.alive == true){
            Ennemi.alive = false;
            Ennemi.recentlyDead = true;
        }
    },

    restart: function() {
        $('#Login').hide();        
        game.state.start('menu');
    }

};
