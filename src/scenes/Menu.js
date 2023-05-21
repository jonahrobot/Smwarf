class Menu extends Phaser.Scene{
  constructor(){
      super("menuScene");
  }

  preload(){
  
  }

  create(){
    // display score
    let menuConfig = {
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

    //show menu text
    this.add.text(game.config.width/2, game.config.height/2 - borderUISize*2 - borderPadding*2, 'Smwarf!', menuConfig).setOrigin(0.5);
    
    menuConfig.fontSize = '20px' 
    this.add.text(game.config.width/2, game.config.height/2, 'Click on the hammer handle and swing it', menuConfig).setOrigin(0.5);
    //menuConfig.backgroundColor = '#A50B5E';
    menuConfig.color = '#000';
    this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, '→ to start game', menuConfig).setOrigin(0.5);

    // define keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
      this.scene.start('playScene');    
    }
  }
}