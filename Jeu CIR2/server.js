var express = require('express'),
    app = express(),
    http = require('http').createServer(app);
    //io = require('socket.io').listen(server);
//var io = require('socket.io')(http);
//var host = '0.0.0.0';
//var port = 3000;
//server.listen(3000);

app.use(express.static(__dirname));

var os = require( 'os' );
var networkInterfaces = os.networkInterfaces( );
var ip = networkInterfaces['Wi-Fi'][1].address;

var client ={};
var taille = 0;
var data;
var NpcArrayServer = [];
var BDEArray = {};
var ViseurArray = {};
var updateGame = {};
var film = 0;
var killers = 0;
io.sockets.on('connection', function(socket){
    var player;
console.log('connection');

    //enregistre le nouvel utilisateurs
    socket.on('login', function(user){
        for(var k in client){
            socket.emit('connected', client[k]);
        }
        player = user;
        player.ready = false;
        client[user.pseudo]=player;
        client[user.pseudo].role = '';
        client[user.pseudo].id = taille;
        socket.emit('logged', user);
        io.sockets.emit('connected', client[user.pseudo]);
        taille ++;
        console.log(taille);
        if(taille == 1){
            socket.emit('data');
        }
    });

    socket.on('role', function(role){
        client[player.pseudo].role = role;
        socket.emit('typped', role);
        io.sockets.emit('newrole', {
            pseudo : player.pseudo,
            role : role,
            id : client[player.pseudo].id
        });
    });

    //initialise les donné pour tt le monde
    socket.on('data', function(donnee){
        data = donnee;
        //console.log(data);
    })

    //passe l'utilisateur courrant en pret et si ts les utilisateurs sont pret, lance le create
    socket.on('pret', function(){
        //averti les autre joueur que l'utilisateur courant est pret
        var pret = 1;
        io.sockets.emit('pret', player);
        player.ready = true;
        var killers = 0;
        var nb_guardian =0;
        for(var i in client){
            if(client[i].ready == false){
                pret = 0;
            }
            if(client[i].role == 'BDE'){
                killers ++;
            }else{
                nb_guardian ++;
            }
        }
        if( (pret == 1)&&(nb_guardian > 0)&&(killers > 0) ){
            //avertis que tt le monde est pret
            io.sockets.emit('tsPret');
            pret = 0;
            for(var i in client){
                client[i].ready = false;
            }
            createServer();
        }
        if(pret == 1){
            if(killers == 0){
                io.sockets.emit('MissingBDE');
            }
            if(nb_guardian == 0){
                io.sockets.emit('MissingGuardian');
            }
            pret = 1;
        }
    });

    //indique qu'un utilisateur pret a annuler
    socket.on('Paspret', function(){
        socket.broadcast.emit('Paspret', player);
        player.ready = false;
    });

    //create server, envoie au differents utilisateur la position initial des npc ainsi que des BDEes et le nombre de viseur necessaire
    function createServer(){
        //creer la structure des npc coté server et envoies les donnés aux client
        for(var k in client){
            if(client[k].role == 'BDE'){
                film += 3;
                killers ++;
            }
        }
        for(var k in client){
            if(client[k].role == 'Journalist'){
                //creer la structure d'un viseur server et envoie les donnés aux client
                ViseurArray[client[k].pseudo] = new ViseurServer(client[k].pseudo, 100);
                io.sockets.emit('createViseur', {
                    pseudo : ViseurArray[client[k].pseudo].pseudo,
                    radius : ViseurArray[client[k].pseudo].radius
                });
            }
        }

        for(var k in client){
            if(client[k].role == 'BDE'){
                //creer la structure d'un npc pour les BDEs coté server et envoie les donnés aux client
                BDEArray[client[k].pseudo] = new NPCserver(client[k].pseudo);
                io.sockets.emit('createBDE', {
                    x : BDEArray[client[k].pseudo].x,
                    y : BDEArray[client[k].pseudo].y,
                    skin : BDEArray[client[k].pseudo].skin,
                    pseudo : BDEArray[client[k].pseudo].id
                });
            }
        }


        for(var i = 0; i < data.nb_npc; i++){
            NpcArrayServer.push(new NPCserver(i));
            io.sockets.emit('createNPC', {
                    x : NpcArrayServer[i].x,
                    y : NpcArrayServer[i].y,
                    skin : NpcArrayServer[i].skin
            });
        }
        io.sockets.emit('GlobalData', {
            nb_npc : data.nb_npc,
            killers : killers,
            film : film,
        });
        io.sockets.emit('ActionViseur');
        console.log('________________________________Start update____________________________________');
        updateGame = setInterval(update, 100/6);
    }

    function update(){
        io.sockets.emit('ActionBDE');
        for(var i = 0; i < data.nb_npc; i++){
            if(NpcArrayServer[i].out != true){
                NpcArrayServer[i].randomMove();
            }else{
                NpcArrayServer[i].willDie('npc');
            }
            io.sockets.emit('collision', NpcArrayServer[i].id);
            io.sockets.emit('moveNPCToXY', {
                moveOnX : NpcArrayServer[i].moveOnX,
                moveOnY : NpcArrayServer[i].moveOnY,
                animation : NpcArrayServer[i].animation,
                id : NpcArrayServer[i].id
            });
            NpcArrayServer[i].IsDetected(ViseurArray);
            if(NpcArrayServer[i].change){
                io.sockets.emit('IsNPCDetected', {
                    detected : NpcArrayServer[i].detected,
                    id : NpcArrayServer[i].id
                });
            }
        }
        for(var k in BDEArray){
            if(BDEArray[k].out){
                BDEArray[k].willDie('bde');
                io.sockets.emit('movePlayer', {
                    moveOnX : BDEArray[k].moveOnX,
                    moveOnY : BDEArray[k].moveOnY,
                    animation : BDEArray[k].animation,
                    pseudo : k
                });
            }
            BDEArray[k].IsDetected(ViseurArray);
            if(BDEArray[k].change){
                io.sockets.emit('IsBDEDetected', {
                    detected : BDEArray[k].detected,
                    id : BDEArray[k].id
                });
            }
        }
    }
    socket.on('NPCdied', function(id){
        //console.log(npc);//ereur ici a revoir avec will die
        io.sockets.emit('NPCdied', id);
    });


    socket.on('willDie', function(character){
        if(character.type == 'npc'){
            NpcArrayServer[character.id].out = character.out;
        }else{
            io.sockets.emit('PlayerFound', character.id);
            BDEArray[character.id].out = character.out;
        }
        //io.sockets.emit('willDie', npc.id);
    });

    socket.on('movePlayer', function(player){
        BDEArray[player.pseudo].x += player.moveOnX;
        BDEArray[player.pseudo].y += player.moveOnY;
        io.sockets.emit('movePlayer', player);
    });

    socket.on('moveViseur', function(viseur){
        ViseurArray[viseur.pseudo].x = viseur.x;
        ViseurArray[viseur.pseudo].y = viseur.y;
        io.sockets.emit('moveViseur', viseur);
    });

    socket.on('MistakeOnNpc', function(i){
        io.sockets.emit('MistakeOnNpc', i);
    });

    socket.on('photo', function(){
        film --;
        io.sockets.emit('PhotoShot');
        if(film == 0){
            io.sockets.emit('BdeWin');
            clearInterval(updateGame);
        }
    });

    socket.on('JournalistWin', function(){
        io.sockets.emit('JournalistWin');
        clearInterval(updateGame);
    });

    socket.on('disconnect',function(){
        if(!player){
            return false;
        }
        clearInterval(updateGame);
        var dimId = false;
        for(var k in client){
            if(client[k] == client[player.id]){
                dimId =true;
            }
            if(dimId){
                client[k].id --;
            }
        }
        delete client[player.id];
        io.sockets.emit('disco', player);
        taille --;
        //console.log('il y a :' + taille + ' utilisateurs connecté');
    });

    socket.on('restart', function(){
        clearInterval(updateGame);
        for(var k in client){
            delete client[k];
        }
        io.sockets.emit('restart');
    });
});

var NPCserver = function(id){
    //position du sprite
    this.id = id;
    this.x = 30 + Math.floor(Math.random()*(data.width - 59));
    this.y = 30 + Math.floor(Math.random()*(data.height - 59));
    this.skin = Math.floor(Math.random()*3);
    this.wait = Math.floor(Math.random()*50);
    this.moveOnX = 0;
    this.moveOnY = 0;
    this.animation = '';

    //point d'arrivé
    this.arriveex = 30 + Math.floor(Math.random()*(data.width - 59));
    this.arriveey = 30 + Math.floor(Math.random()*(data.height - 59));
    this.detected = false;
    this.change = false;
    this.out = false;
};

NPCserver.prototype.constructor = NPCserver;
NPCserver.prototype.moveToXY = function(x, y){
    var v = 1;
    //si le point d'arrivée n'est pas en diagonale, on avance en ligne droite
    this.moveOnY = 0;
    this.moveOnX = 0;
    if(Math.abs(Math.abs(x-this.x) - Math.abs(y - this.y)) > v){
        if(Math.abs(x-this.x) > Math.abs(y - this.y)){
            if(x > this.x){
                this.moveOnX = Math.sqrt(2) * v;
                this.animation = 'right';
                return;
            }else{
                this.moveOnX = -Math.sqrt(2) * v;
                this.animation = 'left';
                return;
            }
        }else{
            if(y > this.y){
                this.moveOnY = Math.sqrt(2) * v;
                this.animation = 'down';
                return;
            }else{
                this.moveOnY = - Math.sqrt(2) * v;
                this.animation = 'up';
                return;
            }
        }
        //sinon on prend la diagonale
    }else{
        if(Math.abs(this.x - x) > v){
            if( (this.x > x)&&(this.y > y) ){
                this.moveOnX = - v;
                this.moveOnY = - v;
                this.animation = 'left';
                return;
            }
            if( (this.x > x)&&(this.y < y) ){
                this.moveOnX = - v;
                this.moveOnY = v;
                this.animation = 'left';
                return;
            }
            if( (this.x < x)&&(this.y > y) ){
                this.moveOnX = v;
                this.moveOnY = - v;
                this.animation = 'right';
                return;
            }
            if( (this.x < x)&&(this.y < y) ){
                this.moveOnX = v;
                this.moveOnY = v;
                this.animation = 'right';
                return;
            }
        }
    }
}
NPCserver.prototype.randomMove = function(){
    // si le temps d'attente est fini on bouge jusqu'au point suivant
    if(this.wait == 0){
        //si le point d'arrivée n'est pas atteind, on continue vers ce point
        if( (Math.abs(this.x - this.arriveex) > 5) && (Math.abs(this.y - this.arriveey) > 5) ){
            this.moveToXY(this.arriveex, this.arriveey);
        }else{//sinon ou on attend, ou on cherche un point proche pur la prohaine destinantion, ou un point éloigné
            this.animation = '';
            this.moveOnX = 0;
            this.moveOnY = 0;
            var choix = Math.floor(Math.random()*100);
            if(choix < 50){
                this.wait = Math.floor(Math.random()*60);
            }
            if( (choix < 80)&&(choix >= 50) ){
                this.findClosePoint();
                this.moveToXY(this.arriveex, this.arriveey);
            }
            if(choix >= 80){
                this.findDistantPoint();
                this.moveToXY(this.arriveex, this.arriveey);
            }
        }
        this.x += this.moveOnX;
        this.y += this.moveOnY;
    }else{
        io.sockets.emit('wait');
        this.wait --;
    }
}

NPCserver.prototype.findClosePoint = function(){
    var x = 30 + Math.floor(Math.random()*(data.width - 59));
    var y = 30 + Math.floor(Math.random()*(data.height - 59));
    while(Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) ) >= data.width / 2){
        x = 30 + Math.floor(Math.random()*(data.width - 59));
        y = 30 + Math.floor(Math.random()*(data.height - 59));
    }
    this.arriveex = x;
    this.arriveey = y;
}
// procedure pour trouver un point éloigné
NPCserver.prototype.findDistantPoint = function(){
    var x = 30 + Math.floor(Math.random()*(data.width - 59));
    var y = 30 + Math.floor(Math.random()*(data.height - 59));
    while(Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2) ) <= data.width / 2){
        x = 30 + Math.floor(Math.random()*(data.width - 59));
        y = 30 + Math.floor(Math.random()*(data.height - 59));
    }
    this.arriveex = x;
    this.arriveey = y;
}

NPCserver.prototype.IsDetected = function(viseurArray){
    var seen = false;
    if(this.change == true){
        this.change = false;
    }
    for(var k in viseurArray){
        var distance = Math.sqrt(Math.pow(this.x - viseurArray[k].x, 2) + Math.pow(this.y - viseurArray[k].y, 2) );
        if( (distance <= viseurArray[k].radius/2) ){
            seen = true;
        }
    }
    if((this.detected == false)&&(seen)){
        this.detected = true;
        this.change = true;
    }
    if((this.detected)&&(seen == false)){
        this.detected = false;
        this.change = true;
    }
}

NPCserver.prototype.willDie = function(type){
    if(this.y > data.height - 50){
        io.sockets.emit('NpcDie', {
            id : this.id,
            type : type
        });
    }else{
        this.moveToXY(data.width/2, data.height-30);
        this.x += this.moveOnX;
        this.y += this.moveOnY;
     }
}

var ViseurServer = function (pseudo, radius) {
    this.x = 0;
    this.y = 0;
    this.radius = radius;
    this.pseudo = pseudo;
};
ViseurServer.prototype.constructor = ViseurServer();

http.listen({ host: host, port: port }, function(){
    console.log('-----------------------------------');
    console.log(' listening on *:' + port);
    console.log('-----------------------------------');
});
