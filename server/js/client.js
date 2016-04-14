$(function(){

    game = new Phaser.Game(450,450, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
    var socket = io.connect('http://localhost:3000');
    $('#unready').hide();
    $('#ready').hide();
    $('#game').hide();

    function preload(){
        game.load.spritesheet('player1','assets/eleve.png',32, 48);
        game.load.spritesheet('player2','assets/fou.png', 32, 48);
        game.load.spritesheet('player3','assets/prof.png', 32, 48);
        game.load.spritesheet('player4','assets/femme.png', 32, 48);
        game.load.spritesheet('player5','assets/eleve2.png', 32, 48);
        game.load.spritesheet('player6','assets/eleve3.png', 32, 48);
        game.load.spritesheet('player1dark', 'assets/elevedark.png', 32, 48);
        game.load.spritesheet('player5dark', 'assets/eleve2dark.png', 32, 48);
        game.load.spritesheet('player6dark', 'assets/eleve3dark.png', 32, 48);
        game.load.image('background', 'assets/fond3.png');
        game.load.image('fond1', 'assets/fond1B.png');
    }

    var me = {};
    function create(){
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.tileSprite(0, 0, game.width, game.height, 'background');

        //sprite = game.add.sprite(0, 0, 'fond1');
        //sprite1 = game.add.sprite(0, 0, 'fond1');
        //sprite2 = game.add.sprite(0, 0, 'fond1');
        SpriteArray = {};
        ViseurArray = {};
        maskArray = {};
        PlayerArray = {};
        NpcArray = [];
        cursors = game.input.keyboard.createCursorKeys();
        var skin = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'];
        var skindark = ['player1dark', 'player5dark', 'player6dark'];

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
                nb_npc : 50,
                width : 450,
                height : 450
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

        socket.on('connected',function(user){
            console.log(user.pseudo + ' connected');
            if(user.type == 'gardian'){
                SpriteArray[user.pseudo] = game.add.sprite(0, 0, 'fond1');
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
            $('#game').show();
            $('#unready').hide();
        });

        socket.on('createNPC', function(data){
            NpcArray.push(new NPC(game, skindark[data.skin],data.x, data.y));
        });

        socket.on('createKiller', function(data){
            PlayerArray[data.pseudo] = new Player(game, skindark[data.skin],data.x, data.y);
        });

        var i = 0;
        socket.on('createViseur', function(pseudo){
            maskArray[pseudo] = game.add.graphics(0, 0);
            maskArray[pseudo].beginFill(0xffffff);
            ViseurArray[pseudo] = new Viseur(150, 3, pseudo);
            maskArray[pseudo].drawCircle(0, 0, ViseurArray[pseudo].radius);
            SpriteArray[pseudo].mask = maskArray[pseudo];
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
            //$('#game').hide();
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
    }

    function update(){
    }
});
