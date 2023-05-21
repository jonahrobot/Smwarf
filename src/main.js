/*

Authors: Dylan Louie, Abel Goy, Jonah Ryan

*/

'use strict';
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    autoCenter: true,
    backgroundColor: '#FF007F',
    physics: {
      default: 'matter',
      matter: {
        debug: true
      }
    },
    scene: [ Play ]
  }

let game = new Phaser.Game(config);

let keyR