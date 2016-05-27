var game = new Phaser.Game(window.outerWidth-40, window.outerHeight-110, Phaser.CANVAS,'gameDiv');
var socket = io.connect('localhost:3000');
//Variables Globales

//Var Map
var map;
var layer;
//Choix du BDE
var choice ='';
//permet de relancer le solo
var restart = true;

//Loop time pour solo
var timer;

//Options par default pour solo
var timeinit = 120;
var npcsinit = 30;
var ammoinit = 5;
var killerinit = 1;

//Choix lvl
var lvlrun;
var lvlunblock = 1;

//Declaration des Etats
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('multi', multiState);
game.state.add('solo', soloState);
game.state.add('fin', finState);
game.state.add('succes', succesState);
game.state.add('optio', optioState);
game.state.add('level',levelState);
game.state.add('start',startState);
game.state.add('home',homeState);

//Lancement du jeu
game.state.start('boot');
