var enter;
var change;
var Ready;
var journalist;
var bdeMember;

var multiState = {

    create: function(){
        $('#Login').show();
        var displayLabel = game.add.text(80, 150, 'Connection',{font: '30px Arial', fill: '#ffffff'});

        enter = game.add.button(0, 0, 'ready', this.start, this, 1, 0);
        change = game.add.button(0, 450, 'changeRole', this.chooseRole, this, 1, 0);
        Ready = game.add.button(350, 450, 'ready', this.update, this, 1, 0);
        journalist = game.add.button(50, 350, 'journalist', this.journalistChoice, this, 1, 0);
        bdeMember = game.add.button(50, 450, 'bdeMember', this.bdeChoice, this, 1, 0);

        change.visible = false;
        Ready.visible = false;
        journalist.visible = false;
        bdeMember.visible = false;

       // game.add.tileSprite(0, 0, game.width, game.height, 'background');

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

        /*$('#loginform').submit(function(event){
            event.preventDefault();
            socket.emit('login', {
                pseudo : $('#pseudo').val()
            });
            $('#loginform').hide();
            $('#typeform').show();
        });*/

        $('#typeform').submit(function(event){
            event.preventDefault();
            socket.emit('type', $('input[name=type]:checked').val());
            $('#typeform').hide();
            $('#changetype').show();
            $('#ready').show();
        });

        socket.on('data', function(){
            socket.emit('data', {
                nb_npc : npc,
                width : game.width,
                height : game.height
            });
        });

        $('#changetype').click(function(event){
            $('#changetype').hide();
            $('#typeform').show();
            $('#ready').hide();
        });

        $('#ready').click(function(event){
            socket.emit('pret');
            $('#ready').hide();
            $('#changetype').hide();
            $('#unready').show();
        });

        $('#unready').click(function(event){
            socket.emit('Paspret');
            $('#changetype').show();
            $('#ready').show();
            $('#unready').hide();
        });

        socket.on('logged', function(user){
            me = user;
        });

        socket.on('typped', function(type){
            me.type = type;
        });

//        backgroundS = game.add.sprite(0, 0, 'background');
//	    backgroundS = game.add.sprite(0, 0, 'filtreSombre');

        socket.on('connected',function(user){
            if(user.type == ''){
                console.log(user.pseudo + ' connected' + ' (no type chosen)');
            }else{
                console.log(user.pseudo + ' connected as ' + user.type);
            }
        });

        socket.on('newType', function(user){
            console.log(user.pseudo + ' is a ' + user.type);
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

        socket.on('MissingKiller', function(){
            console.log('il faut au moins un killer pour lancer la partie');
            socket.emit('Paspret');
            $('#changetype').show();
            $('#ready').show();
            $('#unready').hide();
        });

        socket.on('MissingGardian', function(){
            console.log('il faut au moins un gardian pour lancer la partie');
            socket.emit('Paspret');
            $('#changetype').show();
            $('#ready').show();
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
            SpriteArray[pseudo] = game.add.sprite(0, 0, 'background');
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
                if((npc.detected)&&(NpcArray[npc.id].Sprite.alive == false)&&(NpcArray[npc.id].Sprite.recentlyDead)){
                    socket.emit('willDie', {
                        id : npc.id,
                        out : true
                    });
                    NpcArray[npc.id].changeSkin();
                    NpcArray[npc.id].Sprite.recentlyDead = false;
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
                NpcArray[id].changeSkin();
            }else{
                NpcArray[id].Sprite.recentlyDead = true;
            }
        });
        //Retour menu
        var wkey = game.input.keyboard.addKey(Phaser.Keyboard.M);
        wkey.onDown.addOnce(this.restart, this);
    },

    chooseRole: function () {
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
        journalist.visible = false;
        bdeMember.visible = false;
        change.visible = true;
        Ready.visible = true;
        socket.emit('type', 'gardian');
    },

    bdeChoice: function () {
        journalist.visible = false;
        bdeMember.visible = false;
        change.visible = true;
        Ready.visible = true;
        socket.emit('type', 'killer');
    },

    update: function(){

            if((killspace.isDown)&&(me.type=='killer')){
                for(var i = 0; i < npc; i++){
                    game.physics.arcade.overlap(PlayerArray[me.pseudo].Sprite, NpcArray[i].Sprite, this.collisionHandler);
                    if(NpcArray[i].Sprite.recentlyDead){
                        NpcArray[i].Sprite.recentlyDead = false;
                        socket.emit('NPCdied', i);
                    }
                }
            }
    },


    collisionHandler: function(player, Ennemi) {
        if(Ennemi.alive == true){
            console.log('dead');
            Ennemi.alive = false;
            Ennemi.recentlyDead = true;
        }
    },

    restart: function() {
        game.state.start('menu');
    }

};
