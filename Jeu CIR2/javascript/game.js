var game = new Phaser.Game(window.outerWidth-40, window.outerHeight-110, Phaser.CANVAS,'gameDiv');

//Variables Globales

//Declaration des Etats
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('multi', multiState);
game.state.add('solo', soloState);
game.state.add('fin', finState);
game.state.add('succes', succesState);
game.state.add('optio', optioState);

//Lancement du jeu
game.state.start('boot');