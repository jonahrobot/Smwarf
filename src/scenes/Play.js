class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    preload(){

        this.input.enabled = true;

        // Set up combo font
        this.totalSwordsBuilt = 0;
        this.currentCombo = 0;
        this.largestCombo = 0;

        // display score
        this.mainText = {
            fontFamily: 'font1',
            fontSize: '48px',
            color: '#313638',
            align: 1
        }
    }

    create(){

        // Create Hammer
        this.hammer = new Hammer(this,800,0,'spr_hammer',0);

        // Create Ground
        this.ground = this.matter.add.image(896/2, 656, 'spr_ground', null, { 
            shape: 'rectangle',  isStatic:true
        }).setScale(2);

        // Create sword

        this.add.image(220, game.config.height/2, 'spr_anvil').setScale(0.5)

        this.sword1 = this.add.image(-100, game.config.height/2, 'sword1').setScale(0.5)

        this.sword2 = this.add.image(-100, game.config.height/2, 'sword2').setScale(0.5)

        this.star1 = this.matter.add.image(-50, -50, 'star', null, {
            shape: 'rectangle', isStatic: true, isSensor: true,
        }).setScale(0.1).setDepth(10)

        this.star2 = this.matter.add.image(-50, -50, 'star', null, {
            shape: 'rectangle', isStatic: true,
        }).setScale(0.1)

        this.star2.alpha = 0

        this.spawnStar = false;
        this.starDespawned = true;

        this.spawnSword1 = false;
        this.spawnSword2 = false;
        this.sword1Despawned = true;
        this.sword2Despawned = true;

        //keboard input
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.prog = 0;
        var textConfig = { 
            fontFamily: 'font1',
            fontSize: '28px',
            backgroundColor: '#24DB00',
            color: '#000000',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 25
        }
        this.progUI1 = this.add.text(game.config.width/4 - 25, game.config.height/8, "", textConfig).setOrigin(0.5);
        this.progUI2 = this.add.text(game.config.width/4, game.config.height/8, "", textConfig).setOrigin(0.5);
        this.progUI3 = this.add.text(game.config.width/4 + 25, game.config.height/8, "", textConfig).setOrigin(0.5);
        this.progUI4 = this.add.text(game.config.width/4 + 50, game.config.height/8, "", textConfig).setOrigin(0.5);
        this.progUI1.setVisible(false);
        this.progUI2.setVisible(false);
        this.progUI3.setVisible(false);
        this.progUI4.setVisible(false);
        this.prog = -1;
        //this.createHammer(500,0);
        this.setupCollision();

        // Set up combo meter
        this.scoreLeft = this.add.text(896 - 150, 32,this.totalSwordsBuilt + " sword", this.mainText).setOrigin(0.5,0.5)
        this.mainText.fontSize = 40;
        this.mainText.color = '#4D5558'
        this.combo = this.add.text(896 - 150, 64 + 12 + 46,"", this.mainText).setOrigin(0.5,0.5);

        //clock
        this.clockTime = 60;
        this.clockRightCounter = Math.floor(this.clockTime);
        this.addedTime = 0;
        this.scoreRight = this.add.text(896 - 150, 64 + 12, this.clockRightCounter + ' seconds', this.mainText).setOrigin(0.5,0.5);
        //this.scoreRight.fixedWidth = 0;
        //this.scoreRight.align = 'right';

        this.initTime = this.time.now;
        

        //game over variable
        this.gameOver = false;
    }
 
    update(){
        this.hammer.update();
        
        //randomize spawning sword
        if(this.sword1Despawned && this.sword2Despawned){   
            
            if(Math.floor(Math.random()*2) == 1){
                this.spawnSword1 = true;
            } else{
                this.spawnSword2 = true;
            }

            if(this.spawnSword1){
                this.sword1.x = game.config.width/4
                this.sword1.y = game.config.height/2
                this.sword1Despawned = false;
                this.spawnSword1 = false
            }

            if(this.spawnSword2){
                this.sword2.x = game.config.width/4
                this.sword2.y = game.config.height/2
                this.sword2Despawned = false;
                this.spawnSword2 = false
            }
        }

   
        

        //condition to spawn star
        if(this.starDespawned){
            this.starDespawned = false;
            this.spawnStar = true;
            this.prog++;
            console.log(this.prog);
            if (this.prog == 0) {
                this.progUI1.setVisible(false);
                this.progUI2.setVisible(false);
                this.progUI3.setVisible(false);
                this.progUI4.setVisible(false);
            } else if (this.prog == 1) {
                this.progUI1.setVisible(true);
                this.progUI2.setVisible(false);
                this.progUI3.setVisible(false);
                this.progUI4.setVisible(false);
            } else if (this.prog == 2) {
                this.progUI2.setVisible(true);
                this.progUI3.setVisible(false);
                this.progUI4.setVisible(false);
            } else if (this.prog == 3) {
                this.progUI3.setVisible(true);
                this.progUI4.setVisible(false);
            } else if (this.prog == 4) {
                this.progUI4.setVisible(true);
            }
        }

        if(this.spawnStar){
            if(!this.sword1Despawned){
                this.star1.x = this.sword1.x - 13 + (Math.random()*30)
                this.star1.y = this.sword1.y + 40 - (Math.random()*140)
            }   
            if(!this.sword2Despawned){
                this.star1.x = this.sword2.x - 30 + (Math.random()*80)
                this.star1.y = this.sword2.y + 75 - (Math.random()*220)
            }   

            this.star1.angle = Math.random() * 90
            this.star2.x = this.star1.x
            this.star2.y = this.star1.y
            this.star2.angle = this.star1.angle

            this.spawnStar = false
        }

        if(Phaser.Input.Keyboard.JustDown(keyR)){
            this.despawnStar()
        }    

        //clock
        if(!this.gameOver){
            this.clockRightCounter = Math.floor(this.clockTime) - Math.floor((this.time.now-this.initTime)/1000) + Math.floor(this.addedTime);
            this.scoreRight.text = this.clockRightCounter + ' seconds';
        }
        if(this.clockRightCounter <= 0){
            this.clockRightCounter = 0
            this.gameOver = true
        }
    }

    setupCollision(){

        this.matter.world.on('collisionstart', event =>
        {

            //  Loop through all of the collision pairs
            const pairs = event.pairs;

            for (let i = 0; i < pairs.length; i++)
            {
                const bodyA = pairs[i].bodyA;
                const bodyB = pairs[i].bodyB;

                //  We only want sensor collisions
                if (pairs[i].isSensor)
                {
                    let blockBody;
                    let sensorBody;

                    if (bodyA.isSensor)
                    {
                        blockBody = bodyB;
                        sensorBody = bodyA;
                    }
                    else if (bodyB.isSensor)
                    {
                        blockBody = bodyA;
                        sensorBody = bodyB;
                    }

                    //  You can get to the Sprite via `gameObject` property
                    const sensorSprite = sensorBody.gameObject;
                    const blockSprite = blockBody.gameObject;

                    if(blockBody.label === 'hammerHead'){
                        if(blockBody.velocity.x > 2 || blockBody.velocity.y > 2 ){

                            this.clock = this.time.delayedCall(100, () => {
                                
                                this.currentCombo += 1;
                                this.combo.text = this.currentCombo + "x";

                                this.hammer.onHit();
                                
                                this.despawnStar()
                                if(this.prog == 4){
                                    this.despawnSword(this.sword1)
                                    this.despawnSword(this.sword2)
                                    this.prog=-1

                                    this.totalSwordsBuilt += 1;
                                    this.scoreLeft.text = this.totalSwordsBuilt + " sword";
                                }
                            }, null, this)
                         }
                    }
                }
            }

        });
    }


  


    despawnStar(){
        this.star1.x = -50
        this.star1.y = -50
        this.star2.x = -50
        this.star2.y = -50
        this.starDespawned = true;
    }

    despawnSword(sword){
        sword.x = -100
        if(sword = this.sword1){    
            this.sword1Despawned = true
        }
        if(sword = this.sword2){    
            this.sword2Despawned = true
        }
    }

}


