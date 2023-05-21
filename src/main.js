/*

Authors: Dylan Louie, Abel Goy, Jonah Ryan

*/

'use strict';
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    autoCenter: true,
    backgroundColor: '#D5DCF9',
    physics: {
      default: 'matter',
      matter: {
        debug: false
      }
    },
    scene: [ Menu, Play ]
  }

let game = new Phaser.Game(config);

let keyR, keyRIGHT, keyLEFT

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3
