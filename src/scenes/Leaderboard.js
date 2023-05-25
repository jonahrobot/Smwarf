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

        //keboard input
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    }

    update(){
        this.add.text(game.config.width/2, game.config.height/8 + borderUISize + borderPadding, 'LEADERBOARD', this.mainText).setOrigin(0.5)
        this.add.text(game.config.width/2, 5*game.config.height/8 + borderUISize + borderPadding, '"r" to restart', this.mainText).setOrigin(0.5)

        //game Over next screen
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start('playScene')
        }
    }
}