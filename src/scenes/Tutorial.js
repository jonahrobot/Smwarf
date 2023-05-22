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

        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, '-> to start game', tutorialConfig).setOrigin(0.5)
        
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.start('playScene');    
          }
    }

}