class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    preload(){
        this.load.setPath("./assets/");
        this.load.image('spr_hammer','hammer.png');
        this.load.image('ball','spr_ball.png');
        this.load.image('ground','ground.png');
        this.load.image('hit_1','hitboxBig.png');
        this.load.image('hit_2','hitboxSmall.png')

        this.input.enabled = true;
    }

    create(){
        
        this.matter.world.setBounds();

        const group1 = this.matter.world.nextCategory();

        const group2 = this.matter.world.nextCategory();
        const group3 = this.matter.world.nextCategory();

        //  Our two bodies which will be connected by a constraint (aka a Joint or a Spring)
        this.ballA = this.matter.add.image(400, 0, 'hit_1', null, { 
            shape: 'rectangle', friction: 0.005, restitution: 0.6
         }).setVisible(false);

        this.ballB = this.matter.add.image(400, 400, 'hit_2', null, { 
            shape: 'rectangle', friction: 0.005, restitution: 0.6
         }).setVisible(false);

        this.ground = this.matter.add.image(640/2, 480, 'ground', null, { 
            shape: 'rectangle',  isStatic:true
         });


        this.hammer = new Hammer(this,420,0,'spr_hammer');

        this.matter.add.joint(this.ballA, this.ballB, 64, 0.2);

        //  Or you can create a native Matter constraint:
        this.matter.add.mouseSpring({
            length: 0.01,
            stiffness: 1,
            angularStiffness: 1,
        });

        }

    update(){
        this.hammer.x = this.ballA.x;
        this.hammer.y = this.ballA.y;
        this.hammer.angle = Phaser.Math.RadToDeg( Phaser.Math.Angle.Between(this.ballA.x,this.ballA.y,this.ballB.x,this.ballB.y)) - 90
    }
}


