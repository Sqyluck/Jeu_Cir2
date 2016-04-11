var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(3000);

app.use(express.static(__dirname));

var client ={};
var taille = 0;
var data;
var dimx = 250;
var dimy = 250;
var pret = 1;
var npc = 2;
io.sockets.on('connection', function(socket){
    var player;

    for(var k in client){
        socket.emit('connected', client[k]);
    }
    //enregistre le nouvel utilisateurs
    socket.on('login', function(user){
        if(taille == 0){
            socket.emit('data');
        }
        player = user;
        player.id = user.pseudo + 'id';
        player.ready = false;
        client[player.id] = player;
        io.sockets.emit('connected', player);
        taille ++;
        console.log(client[player.id].pseudo + ' is a ' + client[player.id].type);
        console.log('il y a :' + taille + ' utilisateurs connecté');
        console.log(data);

    });

    //initialise les donné pour tt le monde
    socket.on('data', function(donnee){
        data = donnee;
    })

    //passe l'utilisateur courrant en pret et si ts les utilisateurs sont pret, lance le create
    socket.on('pret', function(){
        //averti les autre joueur que l'utilisateur courant est pret
        socket.broadcast.emit('pret', player);
        player.ready = true;
        for(var i in client){
            if(client[i].ready == false){
                pret = 0;
            }
        }
        if(pret == 1){
            //avertis que tt le monde est pret
            io.sockets.emit('tsPret');
            createServer();
        }
        pret = 1;
    });

    //indique qu'un utilisateur pret a annuler
    socket.on('Paspret', function(){
        socket.broadcast.emit('Paspret', player);
        player.ready = false;
    });

    //create server, envoie au differents utilisateur la position initial des npc ainsi que des killeres et le nombre de viseur necessaire
    function createServer(){
        for(var i = 0; i < data.nb_npc; i++){
            io.sockets.emit('createNPC', {
                x : 30 + Math.random()*(data.width - 60),
                y : 30 + Math.random()*(data.height - 60),
                skin : Math.floor(Math.random()*3)
            });
        }
        for(var k in client){
            console.log(client[k].type);
            if(client[k].type == 'killer'){
                io.sockets.emit('createKiller', {
                    x : 30 + Math.random()*(data.width - 60),
                    y : 30 + Math.random()*(data.height - 60),
                    skin : Math.floor(Math.random()*3),
                    pseudo : client[k].pseudo
                });
            }else{
                io.sockets.emit('createViseur', client[k].pseudo);
            }
        }
    }


    socket.on('disconnect',function(){
        if(!player){
            return false;
        }
        delete client[player.id];
        io.sockets.emit('disco', player);
        taille --;
        console.log('il y a :' + taille + ' utilisateurs connecté');
    });
});
