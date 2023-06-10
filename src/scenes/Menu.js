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

    // Load Title Icons
    this.load.image('spr_continue','spr_continue.png')
    this.load.image('spr_credits','spr_credits.png')
    this.load.image('spr_title','spr_title (1).png')

    // Load End Screen Assets
    this.load.image('spr_end_background','spr_end_background.png')
    //this.load.image('spr_end_continue','spr_end_continue.png')
    this.load.image('spr_end_name_off','spr_end_name_off.png')
    //this.load.image('spr_end_name_on','spr_end_name_on.png')

    // Load Environment assets
    this.load.image('spr_ground','spr_ground.png');

    // Load Sword Assets
    this.load.image('sword1', 'sword2.png')

    this.load.image('sword2', 'sword3.png')
    
    this.load.image('star', 'star2.png')

    //load tutorial assets
    this.load.image('hand', 'hand.png')

    // load audio

    //  load audio
    this.load.audio('ding1', 'ding_E_flat149.mp3');
    this.load.audio('ding2', 'ding_E_minor149.mp3');
    this.load.audio('ding3', 'ding_F_minor149.mp3');
    this.load.audio('ding4', 'ding_G_flat149.mp3');
    this.load.audio('ding5', '/ding_G_minor149.mp3');
    this.load.audio('ding6', 'eding_A_flat149.mp3');
    this.load.audio('ding7', 'eding_A_minor149.mp3');
    this.load.audio('ding8', 'eding_B_flat149.mp3');
    this.load.audio('ding9', 'eding_B_minor149.mp3');
    this.load.audio('ding10', 'eding_C_minor149.mp3');
    this.load.audio('ding11', 'eding_D_flat149.mp3');
    this.load.audio('ding12', 'eding_D_minor149.mp3');
    this.load.audio('ding13', 'eding_E_flat149.mp3');
    this.load.audio('fail', 'fail.wav');

  }

  create(){


    this.add.image(0,64,'spr_title').setOrigin(0)

    this.add.image(0,346,'spr_credits').setOrigin(0)

    this.continue = this.add.image(game.config.width-128,game.config.height-96,'spr_continue').setInteractive({ pixelPerfect: true });


    // define keys
    keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    this.continue.on('pointerdown', ()=>{
      this.scene.start('playScene'); 
    })

    this.continue.on('pointermove', (pointer, x, y, event) =>
    {
      this.continue.setAlpha(0.5)
    });

    this.continue.on('pointerout', (pointer, x, y, event) =>
    {
      this.continue.setAlpha(1)
    });

  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
      this.scene.start('playScene');    
    }
  }
}