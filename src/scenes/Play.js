class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    preload(){
        this.load.setPath("./assets/");
        this.load.image('spr_hammer','hammer.png');
        this.load.image('ball','spr_ball.png');
        
        this.input.enabled = true;
    }

    create(){
        
                this.matter.world.setBounds();
        
                //  Our two bodies which will be connected by a constraint (aka a Joint or a Spring)
        
                const ballA = this.matter.add.image(420, 0, 'spr_hammer', null, { shape: 'rectangle', friction: 0.005, restitution: 0.6});
                const ballB = this.matter.add.image(400, 400, 'ball', null, { shape: 'rectangle', friction: 0.005, restitution: 0.6 });
        
                //  You can create a constraint between the two bodies using a Factory function.
                //  The value 100 is the resting length and 0.2 is the stiffness of the constraint.
        
                //this.matter.add.constraint(ballA, ballB, 100, 0.2);
        
                //  To help those of you more used to the Box2D syntax you can use
                //  add.joint or add.spring instead (with the exact same parameters)
        
                this.matter.add.joint(ballA, ballB, 100, 0.2);
                this.matter.add.joint(ballA, ballB, 100, 0.2);
        
                //  Or you can create a native Matter constraint:
        
                // var constraint = Phaser.Physics.Matter.Matter.Constraint.create({
                //     bodyA: ballA.body,
                //     bodyB: ballB.body,
                //     length: 100,
                //     stiffness: 0.2
                // });
        
                //  Which you then have to add to the world yourself:
        
                // this.matter.world.add(constraint);
        
                this.matter.add.mouseSpring();
            }
}

