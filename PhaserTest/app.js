var SimpleGame = (function () {
    function SimpleGame() {
        this.game = new Phaser.Game(1200, 700, Phaser.AUTO, 'content', { create: this.create });
    }
    SimpleGame.prototype.create = function () {
        var text = "Hello World!";
        var style = { font: "90px Arial", fill: "#ff0000", align: "center" };
        this.game.add.text(200, 100, text, style);
    };
    return SimpleGame;
})();
window.onload = function () {
    var game = new SimpleGame();
};
//# sourceMappingURL=app.js.map