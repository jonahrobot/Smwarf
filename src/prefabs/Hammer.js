class Hammer extends Phaser.GameObjects.Sprite {
    
    constructor(scene, x, y, texture, frame,comboText) {
        super(scene, x, y, texture, frame);

        // Set up Dependencies
        this.scene = scene;

        // Initialize in the scene
        scene.add.existing(this);
        this.setInteractive();

        // Set up Trackers
        this.hammerFreezeRotation = false;
        this.hammerCurrentRotation = false;
        this.hammerMissFlint = false 
        this.hammerflipProtection = false;

        // Create Hitboxes
        this.hitbox_large = scene.matter.add.image(x-20, 0, 'spr_hitbox_large', null, { 
            shape: 'rectangle', friction: 0.005, restitution: 0.6, density: 0.01
        }).setVisible(false);

        this.hitbox_small = scene.matter.add.image(x-200, y+400, 'spr_hitbox_small', null, { 
            shape: 'circle', friction: 0.005, restitution: 0.6, density: 0.05, label: 'hammerHead', ignorePointer: true
        }).setVisible(false);

        // Connect large and small hitbox
        scene.matter.add.joint(this.hitbox_large, this.hitbox_small, 200, 0.2);

        // Set small properties

        this.setOrigin(0.5,0.1).setDepth(10);

        // Set up interactions
        scene.input.on('pointerup', ()=>{
            this.hammerFreezeRotation = false;
            if(this.angle < 0){
                this.hammerCurrentRotation = true;
            }else{
                this.hammerCurrentRotation = false;
            }
        })

        this.hitbox_large.on('pointerdown', ()=>{
            this.hammerFreezeRotation = true;
            if(this.angle < 0){
                this.hammerCurrentRotation = true;
            }else{
                this.hammerCurrentRotation = false;
            }
        })  

        // Add mouse spring
        scene.matter.add.mouseSpring({
            length: 0.01,
            stiffness: 1,
            angularStiffness: 1,
        });
    }  

    update(){
        
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
        this.x = this.hitbox_small.x;
        this.y = this.hitbox_small.y;

        // Rotate to face away from center point
        let RadAngle = Phaser.Math.Angle.Between(this.hitbox_small.x,this.hitbox_small.y,this.hitbox_large.x,this.hitbox_large.y);
        this.angle = Phaser.Math.RadToDeg(RadAngle) - 90;

        // Check if hammer missed
        if(Math.abs(this.angle) < 25){
            if(this.hammerflipProtection == false){
                this.hammerMissFlint = true;
            }
        }
    
        if(Math.abs(this.angle) > 165){
            if(this.hammerMissFlint == true && this.hammerflipProtection == false){
                if(this.scene.currentCombo > this.scene.largestCombo){
                    this.scene.largestCombo = this.scene.currentCombo;
                }
                
                if(this.scene.currentCombo != 0){
                    this.scene.combo.text = "Combo Lost";
                    this.scene.time.delayedCall(600, () => { this.scene.combo.text = "Max: " + this.scene.largestCombo; }, null, this)
                }

                this.hammerMissFlint = false;
                this.scene.currentCombo = 0;
            }

            if(this.hammerflipProtection == true){
                this.hammerMissFlint = false;
                this.hammerflipProtection = false;
            }
        }       
    }

    onHit(){
        this.hammerMissFlint = false;
        this.hammerflipProtection = true;
    }
}
