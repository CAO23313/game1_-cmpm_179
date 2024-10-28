const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1300,
    height: 600,
    pixelArt: true,
    transparent: true,
    scale: {
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Thirdgame, MainMenu, Maingame, Secondgame, selectMenu, badEnd, goodEnd],
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      }
    },
  };
  
  const game = new Phaser.Game(config);
  
  let nut_count = 0;
  let health = 5;
  let level1_count = 0;
  let level2_count = 0;
  let level3_count = 0;