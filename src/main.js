/*

Authors: Dylan Louie, Abel Goy, Jonah Ryan

*/

'use strict';
let config = {
    type: Phaser.CANVAS,
    width: 896,
    height: 640,
    autoCenter: true,
    backgroundColor: '#D5DCF9',
    physics: {
      default: 'matter',
      matter: {
        debug: false //true
      }
    },
    scene: [ Menu, Tutorial, Play, Leaderboard ]
  }

let game = new Phaser.Game(config);

let keyR, keyRIGHT, keyLEFT

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

let highestScore = 0
let highestCombo = 0
