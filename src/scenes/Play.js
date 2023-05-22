class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
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

        this.input.enabled = true;

        this.hammerFreezeRotation = false;

        this.hammerCurrentRotation = false;

        // Set up combo font
        this.totalSwordsBuilt = 0;
        this.currentCombo = 0;
        this.largestCombo = 0;

        // Set up hammer miss tracker
        this.hammerMissFlint = false // Flips to true when hammer sticking up, about to swing down
        // Once hammer goes down, if above variable is still true then combo resets. set back to false when star hit

        this.hammerflipProtection = false;
        // This enables once you hit a star, the hammer must point bottom to disable.

        // display score
        this.mainText = {
            fontFamily: 'font1',
            fontSize: '48px',
            color: '#313638',
            align: 1
        }


    }

    create(){
        this.createHammer(800,0);

        // Connect large and small hitbox
        this.matter.add.joint(this.hitbox_large, this.hitbox_small, 150, 0.2);

        // Setup mouse interaction with Physics objects
        this.matter.add.mouseSpring({
            length: 0.01,
            stiffness: 1,
            angularStiffness: 1,
        });

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
        this.updateHammer();
        
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

        // Check if hammer missed
        if(Math.abs(this.hammer.angle) < 25){
            if(this.hammerflipProtection == false){
                this.hammerMissFlint = true;
            }
        }
        
        if(Math.abs(this.hammer.angle) > 165){
            if(this.hammerMissFlint == true && this.hammerflipProtection == false){
                if(this.currentCombo > this.largestCombo){
                    this.largestCombo = this.currentCombo;
                }

                if(this.currentCombo != 0){
                    this.combo.text = "Combo Lost";
                    this.time.delayedCall(600, () => { this.combo.text = "Max: " + this.largestCombo; }, null, this)
                }

                this.hammerMissFlint = false;
                this.currentCombo = 0;
            }

            if(this.hammerflipProtection == true){
                this.hammerMissFlint = false;
                this.hammerflipProtection = false;
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
                                this.hammerMissFlint = false;
                                this.hammerflipProtection = true;
                                
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


    createHammer(x,y){

        this.matter.world.setBounds();

        this.hitbox_large = this.matter.add.image(x-20, 0, 'spr_hitbox_large', null, { 
            shape: 'rectangle', friction: 0.005, restitution: 0.6, density: 0.01
         }).setVisible(false);

        this.hitbox_small = this.matter.add.image(x-200, y+400, 'spr_hitbox_small', null, { 
            shape: 'circle', friction: 0.005, restitution: 0.6, density: 0.05, label: 'hammerHead'
         }).setVisible(false);

        this.ground = this.matter.add.image(896/2, 656, 'spr_ground', null, { 
            shape: 'rectangle',  isStatic:true
         }).setScale(2);

        // Create actual hammer
        this.hammer = new Hammer(this,x,y,'spr_hammer').setScale(0.25).setOrigin(0.5,0.1).setDepth(10);

        this.hammer.setInteractive();

        this.input.on('pointerup', ()=>{
            this.hammerFreezeRotation = false;
            if(this.hammer.angle < 0){
                this.hammerCurrentRotation = true;
            }else{
                this.hammerCurrentRotation = false;
            }
        })

        this.hammer.on('pointerdown', ()=>{
            this.hammerFreezeRotation = true;
            if(this.hammer.angle < 0){
                this.hammerCurrentRotation = true;
            }else{
                this.hammerCurrentRotation = false;
            }
        })  

        // Connect large and small hitbox
        this.matter.add.joint(this.hitbox_large, this.hitbox_small, 150, 0.2);

        // Setup mouse interaction with Physics objects
        this.matter.add.mouseSpring({
            length: 0.01,
            stiffness: 1,
            angularStiffness: 1,
        });

    }

    updateHammer(){
        // Prevent hitboxes from rotating, help makes cursor movement smooth and rigid to mouse pos
        if(this.hammerFreezeRotation == true){
            if(this.hammerCurrentRotation == true){
                this.hitbox_large.angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(game.input.mousePointer.x,game.input.mousePointer.y,this.hitbox_small.x,this.hitbox_small.y)) + 180;
            }else{
                this.hitbox_large.angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(game.input.mousePointer.x,game.input.mousePointer.y,this.hitbox_small.x,this.hitbox_small.y));
            }
        }else{
            this.hitbox_large.angle = 0;
        }

        this.hitbox_small.angle = 0;

        // Move Hammer to correct spot
        this.hammer.x = this.hitbox_small.x;
        this.hammer.y = this.hitbox_small.y;

        // Rotate to face away from center point
        let RadAngle = Phaser.Math.Angle.Between(this.hitbox_small.x,this.hitbox_small.y,this.hitbox_large.x,this.hitbox_large.y);
        this.hammer.angle = Phaser.Math.RadToDeg(RadAngle) - 90;
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


