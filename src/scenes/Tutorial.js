class Tutorial extends Phaser.Scene{
    constructor(){
        super("tutorialScene")
    }
  
    preload(){
        
    }

    create(){
        // display text
        let tutorialConfig = {
            fontFamily: 'Papyrus',
            fontSize: '30px',
            backgroundColor: '#B47EE5',
            color: '#000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        } 

        this.add.text(game.config.width/2, game.config.height/8 + borderUISize + borderPadding, 'Use the mouse to grab the handle of the hammer.', tutorialConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, 2*game.config.height/8 + borderUISize + borderPadding, 'Click and drag the hammer by the handle to swing it.', tutorialConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, 3*game.config.height/8 + borderUISize + borderPadding, 'There is a spot on the sword you need to hit with the hammer.', tutorialConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, 4*game.config.height/8 + borderUISize + borderPadding, 'If you hit the mark on the sword consecutive times in a row,', tutorialConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, 5*game.config.height/8 + borderUISize + borderPadding, 'Youll form a COMBO! Missing the mark will lose the combo.', tutorialConfig).setOrigin(0.5)
        this.add.text(game.config.width/2, 6*game.config.height/8 + borderUISize + borderPadding, '-> to start the game', tutorialConfig).setOrigin(0.5)
        
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.start('playScene');    
        }
    }

}