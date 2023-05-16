/*

Authors: Dylan Louie, Abel Goy, Jonah Ryan

*/

'use strict';
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    autoCenter: true,
    backgroundColor: '#FCD581',
    scene: [ Menu, Play ]
  }

let game = new Phaser.Game(config);