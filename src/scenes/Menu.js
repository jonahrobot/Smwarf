class Menu extends Phaser.Scene{
  constructor(){
      super("menuScene");
  }

  preload(){
    this.load.setPath("./assets/");

    // Load Hammer assets
    this.load.image('spr_hammer','Hammer.png');
    this.load.image('spr_anvil','anvil.png');
    this.load.image('spr_hitbox_large','spr_hitbox_large.png');
    this.load.image('spr_hitbox_small','spr_hitbox_small.png')

    // Load Environment assets
    this.load.image('spr_ground','spr_ground.png');

    // Load Sword Assets
    this.load.image('sword1', 'sword2.png')

    this.load.image('sword2', 'sword3.png')
    
    this.load.image('star', 'star2.png')
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

    this.add.text(game.config.width/2, game.config.height/2, 'By Jonah Ryan, Abel Goy, Dylan Louie', menuConfig).setOrigin(0.5);
    //menuConfig.backgroundColor = '#A50B5E';
    menuConfig.color = '#000';
    this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press the -> button to continue', menuConfig).setOrigin(0.5);

    // define keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
      this.scene.start('tutorialScene');    
    }
  }
}