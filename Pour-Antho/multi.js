var socket;

var multiState = {

    create: function(){
        socket = io.connect('localhost:3000');
        //game.physics.startSystem(Phaser.Physics.ARCADE);
        $('#loginform').show();
        $('#gameDiv').hide();
        game.add.tileSprite(0, 0, game.width, game.height, 'background');

        //sprite = game.add.sprite(0, 0, 'fond1');
        //sprite1 = game.add.sprite(0, 0, 'fond1');
        //sprite2 = game.add.sprite(0, 0, 'fond1');
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
        $('#loginform').submit(function(event){
            event.preventDefault();
            socket.emit('login', {
                pseudo : $('#pseudo').val()
            });
            $('#loginform').hide();
            $('#roleform').show();
        });

        $('#roleform').submit(function(event){
            event.preventDefault();
            socket.emit('role', $('input[name=role]:checked').val());
            $('#roleform').hide();
            $('#changerole').show();
            $('#ready').show();
        });

        socket.on('data', function(){
            socket.emit('data', {
                nb_npc : npc,
                width : game.width,
                height : game.height
            });
        });

        $('#changerole').click(function(event){
            $('#changerole').hide();
            $('#roleform').show();
            $('#ready').hide();
        });

        $('#ready').click(function(event){
            socket.emit('pret');
            $('#ready').hide();
            $('#changerole').hide();
            $('#unready').show();
        });

        $('#unready').click(function(event){
            socket.emit('Paspret');
            $('#changerole').show();
            $('#ready').show();
            $('#unready').hide();
        });

        socket.on('logged', function(user){
            me = user;
        });

        socket.on('typped', function(role){
            me.role = role;
            me.found = false;
        });

        backgroundS = game.add.sprite(0, 0, 'background');
	    backgroundS = game.add.sprite(0, 0, 'filtreSombre');

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
        });

        socket.on('Paspret', function(user){
            console.log(user.pseudo + " n'est pas prêt.");
        });


        socket.on('MissingBDE', function(){
            console.log('il faut au moins un BDE pour lancer la partie');
            /*socket.emit('Paspret');
            $('#changerole').show();
            $('#ready').show();
            $('#unready').hide();*/
        });

        socket.on('MissingJournalist', function(){
            console.log('il faut au moins un Journalist pour lancer la partie');
            /*socket.emit('Paspret');
            $('#changerole').show();
            $('#ready').show();
            $('#unready').hide();*/
        });

        socket.on('tsPret', function(){
            console.log('tout les joueurs sont prêt');

            $('#gameDiv').show();
            $('#unready').hide();
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


    //---------------------------------------------------------------------------------------------------------------------------------------
        var startLabel = game.add.text(game.width/2, game.height -40, 'Press SPACE', {font: '25px Arial', fill: '#ffffff'});
        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.M);
        wkey.onDown.addOnce(this.restart, this);
        startLabel.stroke = '#000000';
        startLabel.strokeThickness = 3;
        nombredetir = 0;

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

    },


    collisionHandler: function(player, Ennemi) {
        if(Ennemi.alive == true){
            Ennemi.alive = false;
            Ennemi.recentlyDead = true;
        }
    },

    restart: function() {
        game.state.start('menu');
    }

};
