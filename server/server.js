var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

server.listen(3000);

app.use(express.static(__dirname));

var client ={};
var taille = 0;
var data;
var pret = 1;
var NpcArrayServer = [];
var KillerArray = {};
var ViseurArray = {};
var updateGame = {};
io.sockets.on('connection', function(socket){
    var player;

    for(var k in client){
        socket.emit('connected', client[k]);
    }
    //enregistre le nouvel utilisateurs
    socket.on('login', function(user){
        var j = 0;
        player = user;
        player.id = user.pseudo + 'id';
        player.ready = false;
        client[player.id] = player;
        socket.emit('logged', user);
        io.sockets.emit('connected', player);
        for(var k in client){
            j++;
        }
        taille ++;
        if(j == 1){
            socket.emit('data');
        }
        //console.log(client[player.id].pseudo + ' is a ' + client[player.id].type);
        //console.log('il y a :' + taille + ' utilisateurs connecté');

    });

    //initialise les donné pour tt le monde
    socket.on('data', function(donnee){
        data = donnee;
        //console.log(data);
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
            pret = 0;
            for(var i in client){
                client[i].ready = false;
            }
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
        //creer la structure des npc coté server et envoies les donnés aux client
        for(var i = 0; i < data.nb_npc; i++){
            NpcArrayServer.push(new NPCserver(i));
            io.sockets.emit('createNPC', {
                    x : NpcArrayServer[i].x,
                    y : NpcArrayServer[i].y,
                    skin : NpcArrayServer[i].skin
            });
        }

        for(var k in client){
            if(client[k].type == 'killer'){
                //creer la structure d'un npc pour les killers coté server et envoie les donnés aux client
                KillerArray[client[k].pseudo] = new NPCserver(client[k].pseudo);
                io.sockets.emit('createKiller', {
                    x : KillerArray[client[k].pseudo].x,
                    y : KillerArray[client[k].pseudo].y,
                    skin : KillerArray[client[k].pseudo].skin,
                    pseudo : KillerArray[client[k].pseudo].id
                });
            }else{
                //creer la structure d'un viseur server et envoie les donnés aux client
                ViseurArray[client[k].pseudo] = new ViseurServer(client[k].pseudo);
                io.sockets.emit('createViseur', ViseurArray[client[k].pseudo].pseudo);
            }
        }

        io.sockets.emit('ActionViseur');
        console.log('________________________________Start update____________________________________');
        updateGame = setInterval(update, 20);
    }

    function update(){
        io.sockets.emit('ActionKiller');
        for(var i = 0; i < data.nb_npc; i++){
            //NPCserver[i].randomMove();
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
        for(var k in KillerArray){
            KillerArray[k].IsDetected(ViseurArray);
            if(KillerArray[k].change){
                io.sockets.emit('IsKillerDetected', {
                    detected : KillerArray[k].detected,
                    id : KillerArray[k].id
                });
            }
        }
    }

    socket.on('movePlayer', function(player){
        KillerArray[player.pseudo].x += player.moveOnX;
        KillerArray[player.pseudo].y += player.moveOnY;
        io.sockets.emit('movePlayer', player);
    });

    socket.on('moveViseur', function(viseur){
        ViseurArray[viseur.pseudo].x = viseur.x;
        ViseurArray[viseur.pseudo].y = viseur.y;
        io.sockets.emit('moveViseur', viseur);
    });

    socket.on('disconnect',function(){
        if(!player){
            return false;
        }
        clearInterval(updateGame);
        delete client[player.id];
        io.sockets.emit('disco', player);
        taille --;
        //console.log('il y a :' + taille + ' utilisateurs connecté');
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
    this.arriveey = 30 + Math.floor(Math.random()*(data.width - 59));
    this.detected = false;
    this.change = false;
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
        if( (distance <= 75) ){
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

var ViseurServer = function (pseudo) {
    this.x = 0;
    this.y = 0;
    this.pseudo = pseudo;
};
ViseurServer.prototype.constructor = ViseurServer();
