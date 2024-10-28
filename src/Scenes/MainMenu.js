class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu");
  }

  preload() {
    this.load.image('button', 'assets/images/start button.png');
    this.load.image('title', 'assets/images/title.png');
    this.load.image('main_image', 'assets/images/main_image.png');
    this.load.audio("click", "assets/click_001.ogg");
  }

  create() {
    // Add the background image
    this.main_menu = this.add.image(0, 0, 'main_image').setOrigin(0, 0);
    
    // Resize the background initially
    this.resizeBackground();

    // Title and button setup
    this.add.image(660, 140, 'title');
    const startButton = this.add.image(650, 400, 'button').setInteractive();
    startButton.on('pointerdown', () => {
      this.sound.play("click");
      this.scene.start('selectMenu');
    });

    // Add event listener for window resize
    window.addEventListener('resize', () => {
      this.resizeBackground();
    });
  }

  resizeBackground() {
    // Get the current width and height of the canvas
    const canvasWidth = this.scale.width;
    const canvasHeight = this.scale.height;

    // Set the image size to match the canvas
    this.main_menu.setDisplaySize(canvasWidth, canvasHeight);
  }
}
