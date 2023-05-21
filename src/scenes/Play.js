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

        this.input.enabled = true;

        this.apple = false;

        this.currentRotation = false;
    }

    create(){
        this.createHammer(420,0);
    }
 
    update(){
        this.updateHammer();
    }

    createHammer(x,y){

        this.matter.world.setBounds();

        this.hitbox_large = this.matter.add.image(x-20, 0, 'spr_hitbox_large', null, { 
            shape: 'rectangle', friction: 0.005, restitution: 0.6
         }).setVisible(false);

        this.hitbox_small = this.matter.add.image(x-20, y+400, 'spr_hitbox_small', null, { 
            shape: 'circle', friction: 0.005, restitution: 0.6,
         }).setVisible(false);

        this.ground = this.matter.add.image(640/2, 480, 'spr_ground', null, { 
            shape: 'rectangle',  isStatic:true
         });

        // Create actual hammer
        this.hammer = new Hammer(this,x,y,'spr_hammer').setScale(0.25);

        this.hammer.setInteractive();

        this.hammer.on('pointerup', ()=>{this.apple = false})

        this.hammer.on('pointerdown', ()=>{this.apple = true})  

        // Connect large and small hitbox
        this.matter.add.joint(this.hitbox_large, this.hitbox_small, 100, 0.2);

        // Setup mouse interaction with Physics objects
        this.matter.add.mouseSpring({
            length: 0.01,
            stiffness: 1,
            angularStiffness: 1,
        });
    }

    updateHammer(){
        // Prevent hitboxes from rotating, help makes cursor movement smooth and rigid to mouse pos
        if(this.apple == true){
            if(this.hammer.angle > 0){
                this.currentRotation = true;
                this.hitbox_large.angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(game.input.mousePointer.x,game.input.mousePointer.y,this.hitbox_small.x,this.hitbox_small.y)) + 180;
            }else{
                this.hitbox_large.angle = Phaser.Math.RadToDeg(Phaser.Math.Angle.Between(game.input.mousePointer.x,game.input.mousePointer.y,this.hitbox_small.x,this.hitbox_small.y));
            }
        }else{
            this.hitbox_large.angle = 0;
        }
        this.hitbox_small.angle = 0;

        // Move Hammer to correct spot
        this.hammer.x = this.hitbox_large.x;
        this.hammer.y = this.hitbox_large.y;

        // Rotate to face away from center point
        let RadAngle = Phaser.Math.Angle.Between(this.hitbox_large.x,this.hitbox_large.y,this.hitbox_small.x,this.hitbox_small.y);
        this.hammer.angle = Phaser.Math.RadToDeg(RadAngle) - 90;
    }
}


