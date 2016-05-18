var multiState = {

    create: function(){
        //game.physics.startSystem(Phaser.Physics.ARCADE);
        $('#loginform').show();
        $('#gameDiv').hide();
        game.add.tileSprite(0, 0, game.width, game.height, 'background');

        //sprite = game.add.sprite(0, 0, 'fond1');
        //sprite1 = game.add.sprite(0, 0, 'fond1');
        //sprite2 = game.add.sprite(0, 0, 'fond1');
        npc = 10;
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
                pseudo : $('#pseudo').val() ,
                type : $('input[name=type]:checked').val()
            });
            $('#loginform').hide();
            $('#ready').show();
        });
        socket.on('data', function(){
            socket.emit('data', {
                nb_npc : npc,
                width : game.width,
                height : game.height
            });
        });

        $('#ready').click(function(event){
            socket.emit('pret');
            $('#ready').hide();
            $('#unready').show();
        });
        $('#unready').click(function(event){
            socket.emit('Paspret');
            $('#ready').show();
            $('#unready').hide();
        });

        socket.on('logged', function(user){
            me = user;
        });

        backgroundS = game.add.sprite(0, 0, 'background');
	    backgroundS = game.add.sprite(0, 0, 'filtreSombre');

        socket.on('connected',function(user){
            console.log(user.pseudo + ' connected');
            if(user.type == 'gardian'){
                SpriteArray[user.pseudo] = game.add.sprite(0, 0, 'background');
                //SpriteArray[user.pseudo] = game.add.sprite(0, 0, 'filtreSombre');
            }
        });

        socket.on('pret', function(user){
            console.log(user.pseudo + ' est prêt.');
        });

        socket.on('Paspret', function(user){
            console.log(user.pseudo + " n'est pas prêt.");
        });

        socket.on('tsPret', function(){
            console.log('tout les joueurs sont prêt');
            $('#gameDiv').show();
            $('#unready').hide();
        });

        socket.on('createNPC', function(data){
            NpcArray.push(new NPCServer(game, skindark[data.skin],data.x, data.y));
        });

        socket.on('createKiller', function(data){
            PlayerArray[data.pseudo] = new PlayerServer(game, skindark[data.skin],data.x, data.y);
        });


        var i = 0;
        socket.on('createViseur', function(pseudo){
            maskArray[pseudo] = game.add.graphics((window.outerWidth-40)/2, (window.outerHeight)/4+50);
            maskArray[pseudo].beginFill(0xffffff);
            ViseurArray[pseudo] = new ViseurServer(150, 3, pseudo);
            maskArray[pseudo].drawCircle(0, 0, ViseurArray[pseudo].radius);
            SpriteArray[pseudo].mask = maskArray[pseudo];
        });

        socket.on('collision', function(id){
            if(me.type == 'killer'){
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

        socket.on('ActionKiller', function(){
            if(me.type == 'killer'){
                PlayerArray[me.pseudo].movePlayer();
                socket.emit('movePlayer',{
                    moveOnX : PlayerArray[me.pseudo].moveOnX,
                    moveOnY : PlayerArray[me.pseudo].moveOnY,
                    animation : PlayerArray[me.pseudo].animation,
                    pseudo : me.pseudo
                });
            }
        });

        socket.on('ActionViseur', function(){
            if(me.type == 'gardian'){
                ViseurArray[me.pseudo].moveViseur(game, socket);
            }
        });

        socket.on('IsNPCDetected', function(npc){
            //console.log(npc.detected);
            NpcArray[npc.id].IsDetected(npc.detected);
            if(me.type == 'gardian'){
                if((npc.detected)&&(NpcArray[npc.id].Sprite.alive == false)){
                    socket.emit('willDie', {
                        id : npc.id,
                        out : true
                    });

                }
            }
        });

        socket.on('NpcDie', function(id){
            NpcArray[id].Sprite.kill();
        });

        socket.on('IsKillerDetected', function(killer){
            PlayerArray[killer.id].IsDetected(killer.detected);
        });

        socket.on('moveViseur', function(viseur){
            maskArray[viseur.pseudo].x = viseur.x;
            maskArray[viseur.pseudo].y = viseur.y;
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
            if(me.type == 'killer'){
                NpcArray[id].Sprite.kill();
            }
        });
    //---------------------------------------------------------------------------------------------------------------------------------------
        var startLabel = game.add.text(game.width/2, game.height -40, 'Press SPACE', {font: '25px Arial', fill: '#ffffff'});
        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.M);
        wkey.onDown.addOnce(this.restart, this);
        startLabel.stroke = '#000000';
        startLabel.strokeThickness = 3;

    },

    update: function(){

            if((killspace.isDown)&&(me.type=='killer')){
                for(var i = 0; i < npc; i++){
                    game.physics.arcade.overlap(PlayerArray[me.pseudo].Sprite, NpcArray[i].Sprite, this.collisionHandler);
                    if((NpcArray[i].Sprite.alive  == false)&&(NpcArray[i].Sprite.recentlyDead)){
                        socket.emit('NPCdied', i);
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
