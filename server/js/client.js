$(function(){

    var game = new Phaser.Game(250,250, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

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

    var npc = 2;

    function create(){
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.add.tileSprite(0, 0, game.width, game.height, 'background');
        sprite = game.add.sprite(0, 0, 'fond1');

        ViseurArray = {};
        PlayerArray = {};
        NpcArray = [];
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
                nb_npc : 2,
                width : 250,
                height : 250
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


        socket.on('connected',function(user){
            console.log(user.pseudo + ' connected');
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
            NpcArray.push(new NPC(game, skin[data.skin],data.x, data.y));
        });

        socket.on('createKiller', function(data){
            PlayerArray[data.pseudo] = new Player(game, skin[data.skin],data.x, data.y);
        });
        mask = game.add.graphics(0, 0);
        mask.beginFill(0xffffff);
        socket.on('createViseur', function(pseudo){
            ViseurArray[pseudo] = new Viseur(150, 3, mask);
            ViseurArray[pseudo].eclairage();
        });

        socket.on('disco', function(player){
            console.log(player.pseudo + ' disconnected');
        });

    }

    function update(){
    }
});
