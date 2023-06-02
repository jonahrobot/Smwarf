class Leaderboard extends Phaser.Scene{
    constructor(){
        super("leaderboardScene");
    }

    preload(){

    }

    create(){

        this.highScoreNames = JSON.parse(localStorage.getItem('names'));
        this.highScoreValues = JSON.parse(localStorage.getItem('values'));
        this.lastScoreAdded =localStorage.getItem('last');

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

        let index = this.highScoreNames.indexOf(this.lastScoreAdded);
        let offset = 48;
        let prefex = ["1st ","2nd","3rd"]

        for(let i = 0; i < Math.min(3,this.highScoreNames.length); i++){
            this.add.text(game.config.width/4 + 64, game.config.height/8 + borderUISize + borderPadding + offset, prefex[i] + " "+ this.highScoreNames[i] + "  " + this.highScoreValues[i], this.mainText)
            offset += 64;
        }

        if(index > 2){
            offset += 48;
            this.add.text(game.config.width/2, game.config.height/8 + borderUISize + borderPadding + offset, "^^^ " + (index - 2) + " Away ^^^", this.mainText).setOrigin(0.5)
            offset += 32;
            this.add.text(game.config.width/4 + 64, game.config.height/8 + borderUISize + borderPadding + offset, index+1 + "th "+  this.highScoreNames[index] + "  " + this.highScoreValues[index], this.mainText)
        }

        this.add.text(game.config.width/2, 5*game.config.height/8 + borderUISize + borderPadding + 100, '"r" to restart', this.mainText).setOrigin(0.5)

        //game Over next screen
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start('playScene')
        }
    }
}