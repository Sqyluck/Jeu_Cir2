class SimpleGame {

    constructor() {
        this.game = new Phaser.Game(1200, 700, Phaser.AUTO, 'content', { create: this.create });
    }

    game: Phaser.Game;

    create() {
        var text = "Hello World! ca marche nan?";
        var style = { font: "90px Arial", fill: "#ff0000", align: "center" };
        this.game.add.text(200, 100, text, style);
    }

}

window.onload = () => {
    var game = new SimpleGame();
};