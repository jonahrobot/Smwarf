class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    preload(){
        this.load.setPath("./assets/");

        // Load Hammer assets
        this.load.image('spr_hammer','Hammer.png');
        this.load.image('spr_hitbox_large','spr_hitbox_large.png');
        this.load.image('spr_hitbox_small','spr_hitbox_small.png')

        // Load Environment assets
        this.load.image('spr_ground','spr_ground.png');

        // Load Sword Assets
        this.load.image('sword', 'sword2.png')
        this.load.image('star', 'star2.png')

        this.input.enabled = true;

        this.hammerFreezeRotation = false;

        this.hammerCurrentRotation = false;
    }

    create(){
        this.createHammer(420,0);
        this.setupCollision();
    }
 
    update(){
        this.updateHammer();

        if(this.starDespawned){
            this.starDespawned = false;
            this.spawnStar = true;
        }

        if(this.spawnStar){
            this.star1.x = this.sword1.x - 13 + (Math.random()*30)
            this.star1.y = this.sword1.y + 40 - (Math.random()*140)
            this.star1.angle = Math.random() * 90
            this.spawnStar = false
        }

        if(Phaser.Input.Keyboard.JustDown(keyR)){
            this.despawnStar()
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
                            this.despawnStar()
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

        this.ground = this.matter.add.image(640/2, 480, 'spr_ground', null, { 
            shape: 'rectangle',  isStatic:true
         });

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

        // Create sword
        this.sword1 = this.add.image(game.config.width/4, game.config.height/2, 'sword').setScale(0.5)

        this.star1 = this.matter.add.image(-50, -50, 'star', null, {
            shape: 'rectangle', isStatic: true, isSensor: true,
        }).setScale(0.1)

        this.spawnStar = false;
        this.starDespawned = true;

        //keboard input
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
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
        this.starDespawned = true;
    }
}


