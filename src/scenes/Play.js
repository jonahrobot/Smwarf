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

    addScore(name, value){

        let i = 0;
        while(i < this.highScoreValues.length && value <= this.highScoreValues[i]){
            i++;
        }

        this.highScoreValues.splice(i,0,value);
        this.highScoreNames.splice(i,0,name);
        this.lastScoreAdded = name;

        localStorage.setItem('values', JSON.stringify(this.highScoreValues));
        localStorage.setItem('names', JSON.stringify(this.highScoreNames));
        localStorage.setItem('last', this.lastScoreAdded);

        console.log(this.highScoreNames);
        console.log(this.highScoreValues);
    }

    findRank(value){
        
        let i = 0;
        while(i < this.highScoreValues.length && value <= this.highScoreValues[i]){
            i++;
        }

        return i + 1;
    }

    create(){

        this.nameInput = "";

        // this.highSCoreNames[4] score is this.highScoreValues[4]
        this.highScoreNames = JSON.parse(localStorage.getItem('names'));
        if(this.highScoreNames == null){ this.highScoreNames = []; }
        this.highScoreValues = JSON.parse(localStorage.getItem('values'));
        if(this.highScoreValues == null){ this.highScoreValues = []; }
        this.lastScoreAdded = localStorage.getItem('last');

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
            shape: 'circle', isStatic: true, isSensor: true,
        }).setScale(0.1).setDepth(10)

        this.star2 = this.matter.add.image(-50, -50, 'star', null, {
            shape: 'circle', isStatic: true,
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
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

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

        //respawn hammer 
        this.mainText.fontSize = 15
        this.mainText.color = '#D5DCF9'
        this.respawnText = this.add.text(150, game.config.height-12, "Click R to Respawn the Hammer", this.mainText).setOrigin(0.5,0.5)

        //clock

        this.mainText.fontSize = 40
        this.mainText.color = '#4D5558'
        this.clockTime = 30 //amt of seconds on the clock
        this.clockRightCounter = Math.floor(this.clockTime);
        this.addedTime = 0;
        this.scoreRight = this.add.text(896 - 150, 64 + 12, this.clockRightCounter + ' seconds', this.mainText).setOrigin(0.5,0.5);
        //this.scoreRight.fixedWidth = 0;
        //this.scoreRight.align = 'right';

        this.initTime = this.time.now;

        var boxConfig = { 
            fontFamily: 'font1',
            fontSize: '28px',
            backgroundColor: '#ff0000',
            color: '#000000',
            align: 'center',
            padding: {
                top: 85,
                bottom: 85,
            },
            fixedWidth: 310
        }

        this.blockBox = this.add.text(0, 0, "Invalid Zone", boxConfig).setOrigin(0);
        this.blockBox.alpha = 0;

        //game over variable
        this.gameOver = false;
        this.gameOverScreen = false;

        //tutorial variable
        this.tutorial = true

        this.hand = this.add.sprite(game.config.width/5 * 4 + 40, game.config.height/5*4, 'hand')
        this.hand.angle = 140
        this.hand.alpha = 1

        // Add end buttons
        this.type_1 = this.add.image(5*game.config.width/8+15, 4*game.config.height/8 ,'spr_end_name_off').setDepth(12).setAlpha(0);
        this.type_2 = this.add.image(6*game.config.width/8+15, 4*game.config.height/8 ,'spr_end_name_off').setDepth(12).setAlpha(0);
        this.type_3 = this.add.image(7*game.config.width/8+15, 4*game.config.height/8 ,'spr_end_name_off').setDepth(12).setAlpha(0);

        this.type_1_text = this.add.text(5*game.config.width/8+15, 4*game.config.height/8 ,"",this.mainText).setDepth(13).setAlpha(0).setOrigin(0.5);
        this.type_2_text = this.add.text(6*game.config.width/8+15, 4*game.config.height/8 ,"",this.mainText).setDepth(13).setAlpha(0).setOrigin(0.5);
        this.type_3_text = this.add.text(7*game.config.width/8+15, 4*game.config.height/8 ,"",this.mainText).setDepth(13).setAlpha(0).setOrigin(0.5);

        this.input.keyboard.on('keyup', this.anyKey, this);
    }

    anyKey (event)
    {
        //  Only allow A-Z . and -
        if(this.gameOver && this.gameOverScreen){
            let code = event.keyCode;

            console.log(String.fromCharCode(code));

            if(code === Phaser.Input.Keyboard.KeyCodes.ENTER && this.nameInput.length == 3){
                // GO NEXT
                this.addScore(this.nameInput,this.totalSwordsBuilt);
                this.scene.start('leaderboardScene')
            }

            if(code === Phaser.Input.Keyboard.KeyCodes.BACKSPACE || code === Phaser.Input.Keyboard.KeyCodes.DELETE){
                
                if(this.nameInput.length == 3){
                    this.type_3_text.text = "";
                }
                if(this.nameInput.length == 2){
                    this.type_2_text.text = "";
                }
                if(this.nameInput.length == 1){
                    this.type_1_text.text = "";
                }

                this.nameInput = this.nameInput.slice(0, -1);

                this.continueText.setAlpha(0.25)
                
                return;
            }

            if((code >= Phaser.Input.Keyboard.KeyCodes.A && code <= Phaser.Input.Keyboard.KeyCodes.Z) && this.nameInput.length != 3){
                this.nameInput += String.fromCharCode(code);

                if(this.nameInput == "CUM" || this.nameInput == "TIT" || this.nameInput == "POO" || this.nameInput == "PEE"){
                    this.nameInput = "";
                    this.type_1_text.text = "";
                    this.type_2_text.text = "";
                    this.type_3_text.text = "";
                }

                if(this.nameInput.length == 3){
                    this.continueText.setAlpha(1)
                }
            }
            
            this.type_1_text.text = this.nameInput.charAt(0)
            this.type_2_text.text = this.nameInput.charAt(1)
            this.type_3_text.text = this.nameInput.charAt(2)
        }
    }

    update(){

        console.log(game.loop.actualFps);
        
        // Dead zone to prevent dangling exploit
        if (this.hammer.hitbox_large.x >= 310 || this.hammer.hitbox_large.y >= 200) {
            this.hammer.update();
            this.blockBox.alpha = 0;
        } else {
            this.hammer.hitbox_large.x = 311
            this.hammer.hitbox_small.x = 311
            this.blockBox.alpha = 0.5;
        }
        
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
            if (this.currentCombo == 1) {    // hammer sound
                this.sound.play('ding1');
            } else if (this.currentCombo == 2) {
                this.sound.play('ding2');
            } else if (this.currentCombo == 3) {
                this.sound.play('ding3');
            } else if (this.currentCombo == 4) {
                this.sound.play('ding4');
            } else if (this.currentCombo == 5) {
                this.sound.play('ding5');
            } else if (this.currentCombo == 6) {
                this.sound.play('ding6');
            } else if (this.currentCombo == 7) {
                this.sound.play('ding7');
            } else if (this.currentCombo == 8) {
                this.sound.play('ding8');
            } else if (this.currentCombo == 9) {
                this.sound.play('ding9');
            } else if (this.currentCombo == 10) {
                this.sound.play('ding10');
            } else if (this.currentCombo == 11) {
                this.sound.play('ding11');
            } else if (this.currentCombo == 12) {
                this.sound.play('ding12');
            } else if (this.currentCombo >= 13) {
                this.sound.play('ding13');
            }
            if (this.prog == 0) {   // progress bar
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

        //tutorial
        if(this.tutorial == true){
            this.hammer.on('pointerdown',()=>{
                if(this.tutorial){
                    this.hand.alpha = 0
                    this.tutorial = false
                    this.initTime = this.time.now
                }
            })
        }


        //clock
        if(!this.gameOver && !this.tutorial){
            this.clockRightCounter = Math.floor(this.clockTime) - Math.floor((this.time.now-this.initTime)/1000) + Math.floor(this.addedTime);
            this.scoreRight.text = this.clockRightCounter + ' seconds';
        }
        if(this.clockRightCounter <= 0){
            this.clockRightCounter = 0
            this.gameOver = true
        }

      
        //game Over screen
        if(this.gameOver && !this.gameOverScreen){
            highestScore = this.totalSwordsBuilt
            highestCombo = this.largestCombo

            console.log("Created")

            this.mainText.color = '#000000'

            this.swordBackground = this.add.image(game.config.width*2, 3*game.config.height/8 + borderUISize + borderPadding,'spr_end_background').setDepth(10)
            
            this.mainText.fontSize = 27
            this.highScoreText = this.add.text((game.config.width)*2, 3*game.config.height/8, 'High Score: ' + highestScore, this.mainText).setDepth(11)
            this.highComboText = this.add.text((game.config.width)*2, 3.5*game.config.height/8, 'Highest Combo: ' + this.largestCombo, this.mainText).setDepth(11)
            this.totalText = this.add.text((game.config.width)*2, 4.25*game.config.height/8, 'You rank ' + this.findRank(highestScore) + " of " + (this.highScoreNames.length + 1), this.mainText).setDepth(11)
            this.continueText = this.add.text(game.config.width*0.75,5*game.config.height/8 + borderUISize + borderPadding, 'Press enter to continue', this.mainText).setOrigin(0.5).setAlpha(0.25).setDepth(20)

            this.tween = this.tweens.add({
                targets: [this.swordBackground],
                x: game.config.width/2 + 32,
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0,            // -1: infinity
                yoyo: false
            });

            this.tween = this.tweens.add({
                targets: [this.highComboText,this.highScoreText,this.totalText],
                x: game.config.width/5,
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                repeat: 0,            // -1: infinity
                yoyo: false
            });

            this.mainText.fontSize = 20
           
           
            this.tween = this.tweens.add({
                targets: [this.type_1,this.type_2,this.type_3,this.type_1_text,this.type_2_text,this.type_3_text],
                alpha: 1,
                ease: 'Cubic',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 500,
                delay: 500,
                repeat: 0,            // -1: infinity
                yoyo: false
            });
           
            this.gameOverScreen = true;
        }

        //game Over restart
        if(Phaser.Input.Keyboard.JustDown(keyR) && !this.gameOver){
            this.hammer.hitbox_large.x = 800 - 20
            this.hammer.hitbox_large.y = 0
            this.hammer.hitbox_small.x = 800 - 200
            this.hammer.hitbox_small.y = 0 + 400
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
                                 if(!this.gameOver){   
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


