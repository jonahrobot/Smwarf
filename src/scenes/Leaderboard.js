class Leaderboard extends Phaser.Scene{
    constructor(){
        super("leaderboardScene");
    }

    preload(){

    }

    create(){
        // display text
        this.mainText = {
            fontFamily: 'font1',
            fontSize: '48px',
            color: '#313638',
            align: 1
        }
    }

    update(){
        this.add.text(game.config.width/2, game.config.height/8 + borderUISize + borderPadding, 'LEADERBOARD', this.mainText).setOrigin(0.5)
    }
}